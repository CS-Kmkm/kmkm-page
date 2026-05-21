import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  const pages = [
    { url: '/', name: 'Homepage' },
    { url: '/career', name: 'Career Page' },
    { url: '/dev-experience', name: 'Dev Experience Page' },
    { url: '/publications', name: 'Publications Page' },
  ];

  pages.forEach(({ url, name }) => {
    test(`${name} should be accessible`, async ({ page }) => {
      await page.goto(url);
      await page.waitForFunction(() => {
        return document.getAnimations({ subtree: true })
          .every((animation) => animation.playState === 'finished');
      });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);

      // Check for proper heading hierarchy (allow screen reader h1 + visible h1)
      const visibleH1Elements = page.locator('h1:not(.sr-only)');
      await expect(visibleH1Elements).toHaveCount(1);

      // Check for alt text on images
      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        await expect(img).toHaveAttribute('alt');
      }

      // Check for proper form labels (if any)
      const inputs = page.locator('input, select, textarea');
      const inputCount = await inputs.count();

      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          await expect(label).toBeVisible();
        }
      }

      // Check for skip links (becomes visible when focused)
      const skipLink = page.getByRole('link', { name: 'メインコンテンツへスキップ' }).first();
      await skipLink.focus();
      await expect(skipLink).toBeFocused();

      // Check that main content is properly labeled
      const mainContent = page.locator('main');
      await expect(mainContent).toHaveAttribute('role', 'main');
      await expect(mainContent).toHaveAttribute('id', 'main-content');

      // Check for proper button accessibility
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const textContent = await button.textContent();

        // Button should have either text content or aria-label
        expect(ariaLabel || textContent?.trim()).toBeTruthy();
      }

      // Check for proper link accessibility
      const links = page.locator('a');
      const linkCount = await links.count();

      for (let i = 0; i < linkCount; i++) {
        const link = links.nth(i);
        const ariaLabel = await link.getAttribute('aria-label');
        const textContent = await link.textContent();

        // Link should have either text content or aria-label
        expect(ariaLabel || textContent?.trim()).toBeTruthy();
      }
    });

    test(`${name} should support keyboard navigation`, async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      // Test that we can focus on interactive elements
      const interactiveElements = page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const count = await interactiveElements.count();
      
      // Ensure we have interactive elements on the page
      expect(count).toBeGreaterThan(0);
      
      // Test basic tab navigation by focusing on the first interactive element
      const firstInteractiveElement = interactiveElements.first();
      await firstInteractiveElement.focus();
      await expect(firstInteractiveElement).toBeFocused();
    });
  });

  test('Should handle 404 page accessibility', async ({ page }) => {
    await page.goto('/non-existent-page');

    // Check that 404 page is accessible
    await expect(page.getByRole('heading', { name: /404.*ページが見つかりません/ })).toBeVisible();

    // Check that there are navigation options
    await expect(page.getByRole('link', { name: /トップへ戻る/ })).toBeVisible();

    // Test keyboard navigation on 404 page
    const homeLink = page.getByRole('link', { name: /トップへ戻る/ });
    await homeLink.focus();
    await expect(homeLink).toBeFocused();
  });

  test('Should handle error states accessibly', async ({ page }) => {
    // This test would need to trigger an error state
    // For now, we'll just check that error components have proper structure
    await page.goto('/');

    // Check that the page loads without errors
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
  });
});
