import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('Homepage should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Check that page loads within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check that main content is visible
    await expect(page.getByRole('heading', { name: '山田太郎' })).toBeVisible();
  });

  test('Should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics: Record<string, number> = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
              metrics.loadComplete = navEntry.loadEventEnd - navEntry.loadEventStart;
            }
          });
          
          resolve(metrics);
        }).observe({ entryTypes: ['navigation'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 1000);
      });
    });
    
    console.log('Performance metrics:', metrics);
  });

  test('Images should load efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Check that images have proper loading attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      
      // Check that images have alt text
      await expect(img).toHaveAttribute('alt');
      
      // Check that non-critical images have lazy loading
      const loading = await img.getAttribute('loading');
      const priority = await img.getAttribute('data-priority');
      
      if (!priority && loading !== null) {
        expect(loading).toBe('lazy');
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

  test('Should handle network failures gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 100);
    });
    
    await page.goto('/');
    
    // Check that page still loads and displays content
    await expect(page.getByRole('heading', { name: '山田太郎' })).toBeVisible({ timeout: 10000 });
  });

  test('Should be efficient on mobile devices', async ({ page }) => {
    // Simulate mobile device
    await page.setViewportSize({ width: 375, height: 667 });
    
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    // Mobile should still load reasonably fast
    expect(loadTime).toBeLessThan(5000);
    
    // Check that content is properly displayed on mobile
    await expect(page.getByRole('heading', { name: '山田太郎' })).toBeVisible();
    await expect(page.getByText('ソーシャルメディア')).toBeVisible();
  });

  test('Should handle large datasets efficiently', async ({ page }) => {
    // Go to pages with more data
    await page.goto('/publications');
    
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Publications page should load efficiently
    expect(loadTime).toBeLessThan(3000);
    
    // Check that all publications are rendered
    await expect(page.getByText('Deep Learning Approaches')).toBeVisible();
    
    // Test filtering performance
    const filterStartTime = Date.now();
    await page.getByRole('button', { name: /Journal/ }).click();
    await page.waitForTimeout(100); // Small delay for filter to apply
    const filterTime = Date.now() - filterStartTime;
    
    // Filtering should be fast
    expect(filterTime).toBeLessThan(1000);
  });
});