import { test, expect } from '@playwright/test';

for (const locale of ['ja', 'en']) {
  for (const path of ['', '/career', '/publications', '/dev-experience']) {
    test(`${locale}${path} negotiates separate representations`, async ({ request }) => {
      const url = `/${locale}${path}`;
      for (const accept of ['text/markdown', 'text/html', 'text/markdown', 'text/html']) {
        const response = await request.get(url, { headers: { Accept: accept } });
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain(accept);
        expect(response.headers().vary.toLowerCase().split(',').map(value => value.trim())).toContain('accept');
        expect(response.headers().link).toContain('type="text/markdown"');
        const body = await response.text();
        if (accept === 'text/markdown') {
          expect(body).toMatch(/^# /);
          expect(body).not.toMatch(/<\/?(?:html|script|nav)\b/i);
          if (path === '/publications') expect(body).toContain('https://doi.org/');
        } else {
          expect(body).toContain('<html');
          expect(response.headers().vary.toLowerCase().split(',').map(value => value.trim())).toContain('rsc');
        }
      }
      const explicit = await request.get(path ? `${url}.md` : `${url}/.md`);
      expect(explicit.headers()['content-type']).toContain('text/markdown');
      expect(explicit.status()).toBe(200);
      const head = await request.head(url, { headers: { Accept: 'text/markdown' } });
      expect(head.status()).toBe(200);
      expect(head.headers()['content-type']).toContain('text/markdown');
      expect(await head.body()).toHaveLength(0);
      const flight = await request.get(`${url}?_rsc=test`, { headers: { RSC: '1', Accept: 'text/markdown' } });
      expect(flight.headers()['content-type']).not.toContain('text/markdown');
    });
    test(`${locale}${path} exposes primary content without JavaScript`, async ({ browser, request }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(`/${locale}${path}`);
      await expect(page.locator('main:visible').first()).toContainText(path === '/dev-experience' ? 'Python' : locale === 'en' ? /Koshi|Career|Publications/ : /茂木|経歴|論文/);
      await expect(page.locator(`a[href="/${locale}/publications"]:visible`).first()).toBeVisible();
      const raw = await request.get(`/${locale}${path}`, { headers: { Accept: 'text/html' } });
      expect(await raw.text()).toContain(path === '/dev-experience' ? 'Python' : locale === 'en' ? 'Koshi' : '茂木');
      await context.close();
    });
  }
  test(`${locale} Markdown and HTML 404`, async ({ request }) => {
    const response = await request.get(`/${locale}/missing-page`, { headers: { Accept: 'text/markdown' } });
    expect(response.status()).toBe(404);
    expect(response.headers()['content-type']).toContain('text/markdown');
    expect(response.headers().vary).toContain('Accept');
    expect(await response.text()).toContain(locale === 'en' ? 'Page not found' : 'ページが見つかりません');
    expect(await response.text()).toContain(`](/${locale}/career)`);
    const html = await request.get(`/${locale}/missing-page`, { headers: { Accept: 'text/html' } });
    expect(html.status()).toBe(404);
    expect(html.headers()['content-type']).toContain('text/html');
  });
}

test('legacy redirects and HTML-only policy remain intact', async ({ request }) => {
  for (const path of ['/publications', '/ja/events']) {
    const response = await request.get(path, { headers: { Accept: 'text/markdown' }, maxRedirects: 0 });
    expect(response.status()).toBe(308);
  }
  const privacy = await request.get('/en/privacy', { headers: { Accept: 'text/markdown' } });
  expect(privacy.headers()['content-type']).toContain('text/html');
});
