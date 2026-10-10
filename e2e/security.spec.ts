import { test, expect } from '@playwright/test';

test('localized pages and redirects emit the security policy without legacy XSS filtering', async ({ request }) => {
  const redirect = await request.get('/', { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers()['location']).toBe('/ja');
  expect(redirect.headers()['x-xss-protection']).toBeUndefined();
  // CSP is enforced on the destination document, not inherited from a redirect.
  for (const path of ['/ja', '/en', '/ja/career']) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
    const headers = response.headers();
    expect(headers['content-security-policy'], path).toContain("script-src-attr 'none'");
    expect(headers['content-security-policy'], path).toContain("frame-ancestors 'none'");
    expect(headers['permissions-policy'], path).toBe('camera=(), microphone=(), geolocation=()');
    expect(headers['strict-transport-security'], path).toContain('max-age=63072000');
    expect(headers['x-xss-protection'], path).toBeUndefined();
  }
});

test('production CSP preserves hydration, theme and navigation and blocks untrusted scripts', async ({ page }) => {
  const violations: string[] = [];
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', event => {
      const state = window as Window & { cspViolations?: string[] };
      (state.cspViolations ??= []).push(event.blockedURI);
    });
  });
  page.on('console', message => {
    if (message.type() === 'error' && /content security policy/i.test(message.text())) violations.push(message.text());
  });
  const response = await page.goto('/ja/dev-experience');
  expect(response?.status()).toBe(200);
  const headers = response!.headers();
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['x-xss-protection']).toBeUndefined();
  await page.getByRole('tab', { name: 'プロジェクト' }).click();
  await expect(page.getByRole('tabpanel', { name: 'プロジェクト' })).toBeVisible();
  const themeToggle = page.getByRole('button', { name: /モードから.*モードへ切り替え/ }).first();
  const initialTheme = await themeToggle.getAttribute('aria-label');
  await themeToggle.click();
  await expect(themeToggle).not.toHaveAttribute('aria-label', initialTheme!);
  await page.locator('header a[href="/ja/publications"]').first().click();
  await expect(page).toHaveURL(/\/ja\/publications$/);
  expect(violations).toEqual([]);

  let externalRequestSent = false;
  await page.route('https://untrusted.example/**', route => {
    externalRequestSent = true;
    return route.fulfill({ contentType: 'application/javascript', body: 'window.untrustedScriptRan = true;' });
  });
  await page.evaluate(() => {
    const script = document.createElement('script');
    script.src = 'https://untrusted.example/injected.js';
    document.head.append(script);
  });
  await expect.poll(() => page.evaluate(() => (window as Window & { cspViolations?: string[] }).cspViolations ?? [])).toContain('https://untrusted.example/injected.js');
  expect(externalRequestSent).toBe(false);
});

test('sitemap and generated image routes remain reachable', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()['content-type']).toContain('xml');
  for (const url of ['/opengraph-image', '/apple-icon']) {
    const image = await request.get(url);
    expect(image.status()).toBe(200);
    expect(image.headers()['content-type']).toContain('image/png');
  }
});

test('optional analytics work under CSP and omit URL query and fragment', async ({ page }) => {
  test.skip(!process.env.NEXT_PUBLIC_GA_ID || !process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, 'Requires an analytics-enabled production build.');
  const metrics: { url: string }[] = [];
  const metricReferrers: (string | undefined)[] = [];
  let gaLoaded = false;
  await page.route('https://www.googletagmanager.com/gtag/js?**', route => {
    gaLoaded = true;
    return route.fulfill({ contentType: 'application/javascript', body: '/* synthetic GA loader; real network disabled */' });
  });
  await page.route(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT!, route => {
    const corsHeaders = {
      'Access-Control-Allow-Origin': new URL(test.info().project.use.baseURL!).origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (route.request().method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: corsHeaders });
    }
    expect(route.request().method()).toBe('POST');
    metrics.push(route.request().postDataJSON() as { url: string });
    metricReferrers.push(route.request().headers()['referer']);
    return route.fulfill({ status: 200, headers: corsHeaders, contentType: 'application/json', body: '{}' });
  });
  await page.goto('/ja?token=synthetic-private-value#fragment', { referer: 'http://localhost:3000/en?token=old-value' });
  await expect.poll(() => gaLoaded).toBe(true);
  const gaConfig = await page.evaluate(() => {
    const entries = (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [];
    return entries.find(entry => entry[0] === 'config')?.[2] as { page_location: string; page_referrer: string; send_page_view: boolean };
  });
  expect(gaConfig.page_location).toMatch(/\/ja$/);
  expect(gaConfig.page_referrer).not.toContain('token=');
  expect(gaConfig.send_page_view).toBe(false);
  await expect.poll(() => metrics.length).toBeGreaterThan(0);
  for (const metric of metrics) expect(metric.url).toMatch(/\/ja$/);
  expect(metricReferrers.every(referrer => referrer === undefined)).toBe(true);
  await page.getByRole('link', { name: '論文ページへ移動', exact: true }).first().click();
  await expect.poll(() => page.evaluate(() => {
    const events = (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [];
    return events.filter(entry => entry[0] === 'event' && entry[1] === 'page_view').length;
  })).toBe(2);
  const events = await page.evaluate(() => {
    const entries = (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? [];
    return entries.filter(entry => entry[0] === 'event' && entry[1] === 'page_view').map(entry => entry[2]);
  });
  expect(JSON.stringify(events)).not.toContain('token=');
  expect(JSON.stringify(events)).not.toContain('#fragment');
});
