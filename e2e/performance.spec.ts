import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('Homepage should pass a basic load-time smoke check', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    // Check that page loads within 7 seconds
    expect(loadTime).toBeLessThan(7000);

    // Check that main content is visible
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
  });

  test('Should expose navigation timing metrics', async ({ page }) => {
    await page.goto('/');

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
    await page.goto('/');

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

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that there are no JavaScript console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('Should remain usable with delayed network responses', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 100);
    });

    await page.goto('/');

    // Check that page still loads and displays content
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible({ timeout: 10000 });
  });

  test('Mobile homepage should pass a basic load-time smoke check', async ({ page }) => {
    // Simulate mobile device
    await page.setViewportSize({ width: 375, height: 667 });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    // Mobile should still load reasonably fast
    expect(loadTime).toBeLessThan(5000);

    // Check that content is properly displayed on mobile
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
    await expect(page.getByLabel('ソーシャルメディアリンク')).toBeVisible();
  });

  test('Publications filtering should remain responsive', async ({ page }) => {
    // Go to pages with more data
    await page.goto('/publications');

    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Publications page should load efficiently
    expect(loadTime).toBeLessThan(3000);

    // Check that publications page loads
    await expect(page.getByRole('heading', { name: '論文', exact: true })).toBeVisible();

    // Test filtering performance
    const filterStartTime = Date.now();
    await page.getByRole('button', { name: '第一著者' }).click();
    await expect(page.getByRole('button', { name: '第一著者' })).toHaveAttribute('aria-pressed', 'true');
    const filterTime = Date.now() - filterStartTime;

    // Filtering should be reasonably fast (increased threshold for slower browsers)
    expect(filterTime).toBeLessThan(2000);
  });
});
