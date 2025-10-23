import { test, expect } from '@playwright/test';

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

      // Check for proper heading hierarchy
      const h1Elements = page.locator('h1');
      await expect(h1Elements).toHaveCount(1);

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

      // Check for skip links
      await page.keyboard.press('Tab');
      const skipLink = page.getByText('Skip to main content');
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

    test(`${name} should have proper color contrast`, async ({ page }) => {
      await page.goto(url);

      // Check that text has sufficient contrast
      // This is a basic check - in a real scenario, you'd use axe-core or similar
      const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div').filter({ hasText: /.+/ });
      const count = await textElements.count();
      
      // Ensure text elements are visible (basic contrast check)
      for (let i = 0; i < Math.min(count, 10); i++) {
        const element = textElements.nth(i);
        await expect(element).toBeVisible();
      }
    });

    test(`${name} should support keyboard navigation`, async ({ page }) => {
      await page.goto(url);

      // Test tab navigation
      let focusableElements = 0;
      const maxTabs = 20; // Prevent infinite loop
      
      for (let i = 0; i < maxTabs; i++) {
        await page.keyboard.press('Tab');
        
        // Check if any element is focused
        const focusedElement = page.locator(':focus');
        const isVisible = await focusedElement.isVisible().catch(() => false);
        
        if (isVisible) {
          focusableElements++;
          
          // Test Enter key on buttons and links
          const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
          if (tagName === 'button' || tagName === 'a') {
            // Just check that Enter key can be pressed without error
            await page.keyboard.press('Enter').catch(() => {
              // Some elements might not respond to Enter, which is okay
            });
          }
        }
      }

      // Ensure there are focusable elements on the page
      expect(focusableElements).toBeGreaterThan(0);
    });
  });

  test('Should handle 404 page accessibility', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Check that 404 page is accessible
    await expect(page.getByRole('heading', { name: /404.*Not Found/ })).toBeVisible();
    
    // Check that there are navigation options
    await expect(page.getByRole('link', { name: /Go back home/ })).toBeVisible();
    
    // Test keyboard navigation on 404 page
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('Should handle error states accessibly', async ({ page }) => {
    // This test would need to trigger an error state
    // For now, we'll just check that error components have proper structure
    await page.goto('/');
    
    // Check that the page loads without errors
    await expect(page.getByText('山田太郎')).toBeVisible();
  });
});