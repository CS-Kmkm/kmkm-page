import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  for (const locale of ['ja', 'en']) for (const route of ['', '/career', '/dev-experience', '/publications']) {
    test(`${locale}${route} keeps initial layout shifts within the CLS budget`, async ({ page }) => {
      await page.addInitScript(() => {
        const state = window as typeof window & { labCls: number };
        state.labCls = 0;
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
            if (!shift.hadRecentInput) state.labCls += shift.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
      });
      const response = await page.goto(`/${locale}${route}`, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('main h1').first()).toBeVisible();
      const cls = await page.evaluate(() => (window as typeof window & { labCls: number }).labCls);
      expect(cls).toBeLessThanOrEqual(0.1);
    });
  }
  test('Homepage should load successfully with visible content', async ({ page }) => {

    await page.goto('/ja', { waitUntil: 'networkidle' });

    // Check that main content is visible
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
  });

  test('Should expose navigation timing metrics', async ({ page }) => {
    await page.goto('/ja');

    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();

    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      return navigation
        ? {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
            loadComplete: navigation.loadEventEnd - navigation.startTime,
          }
        : null;
    });

    expect(metrics).not.toBeNull();
    expect(metrics?.domContentLoaded).toBeGreaterThan(0);
    expect(metrics?.loadComplete).toBeGreaterThan(0);
  });

  test('Images should load efficiently', async ({ page }) => {
    await page.goto('/ja');

    await expect(page.locator('img').first()).toBeVisible();

    const imageAttributes = await page.locator('img').evaluateAll((images) =>
      images.map((image) => ({
        alt: image.getAttribute('alt'),
        loading: image.getAttribute('loading'),
        priority: image.getAttribute('data-priority'),
      }))
    );

    for (const image of imageAttributes) {
      expect(image.alt).not.toBeNull();
      if (!image.priority && image.loading !== null) {
        expect(image.loading).toBe('lazy');
      }
    }
  });

  test('Should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore resource loading errors (404, 400) as they might be expected
        if (!text.includes('Failed to load resource') && !text.includes('404') && !text.includes('400')) {
          consoleErrors.push(text);
        }
      }
    });

    await page.goto('/ja');
    await page.waitForLoadState('networkidle');

    // Check that there are no JavaScript console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('Should remain usable with delayed network responses', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 100);
    });

    await page.goto('/ja');

    // Check that page still loads and displays content
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible({ timeout: 10000 });
  });

  test('Mobile homepage should load successfully with visible content', async ({ page }) => {
    // Simulate mobile device
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/ja', { waitUntil: 'networkidle' });

    // Check that content is properly displayed on mobile
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
    await expect(page.getByLabel('ソーシャルメディアリンク')).toBeVisible();
  });

  test('Publications filtering should expose its selected state', async ({ page }) => {
    await page.goto('/ja/publications');
    await expect(page.getByRole('heading', { name: '論文', exact: true })).toBeVisible();

    await page.getByRole('button', { name: '主著' }).click();
    await expect(page.getByRole('button', { name: '主著' })).toHaveAttribute('aria-pressed', 'true');

  });
});
