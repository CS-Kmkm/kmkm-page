import { test, expect } from '@playwright/test';

test.describe('Publications Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/publications');
  });

  test('should load and display publications list', async ({ page }) => {
    // Check page heading
    await expect(page.getByRole('heading', { name: 'Publications', exact: true })).toBeVisible();
    
    // Check that filter controls are displayed
    await expect(page.getByRole('button', { name: '第一著者' })).toBeVisible();
    await expect(page.getByRole('button', { name: '共著者' })).toBeVisible();
    await expect(page.getByRole('button', { name: '査読あり' })).toBeVisible();
    await expect(page.getByRole('button', { name: '査読なし' })).toBeVisible();
    
    // Check that results count is displayed
    await expect(page.getByText(/\d+件 \/ \d+件の論文を表示/)).toBeVisible();
    
    // Check that publications are displayed
    const publications = page.locator('article[role="button"]');
    await expect(publications.first()).toBeVisible();
  });

  test('should have working publication filters', async ({ page }) => {
    // Get initial count
    const initialCount = await page.getByText(/\d+件 \/ \d+件の論文を表示/).textContent();
    
    // Test first author filter
    await page.getByRole('button', { name: '第一著者' }).click();
    await page.waitForTimeout(300);
    
    // Check that filter is active (button should have blue background)
    const firstAuthorButton = page.getByRole('button', { name: '第一著者' });
    await expect(firstAuthorButton).toHaveAttribute('aria-pressed', 'true');
    
    // Clear filters
    const clearButton = page.getByRole('button', { name: 'クリア' });
    if (await clearButton.isVisible()) {
      await clearButton.click();
    }
  });

  test('should display publication badges correctly', async ({ page }) => {
    // Wait for publications to load
    await page.waitForLoadState('networkidle');
    
    // Check that publication articles are displayed
    const publications = page.locator('article[role="button"]');
    await expect(publications.first()).toBeVisible();
    
    // Check for badges within publications (they may vary by data)
    const badges = page.locator('span.inline-flex.items-center');
    await expect(badges.first()).toBeVisible();
  });

  test('should open publication detail modal', async ({ page }) => {
    // Wait for publications to load
    await page.waitForLoadState('networkidle');
    
    // Click first publication
    const firstPublication = page.locator('article[role="button"]').first();
    await expect(firstPublication).toBeVisible();
    await firstPublication.click();
    
    // Check that modal opens
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(page.getByText('Publication Details')).toBeVisible();
    
    // Close modal
    const closeButton = page.getByRole('button', { name: 'Close modal' });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    
    // Check modal is closed
    await expect(modal).not.toBeVisible();
  });

  test('should display publications with year labels', async ({ page }) => {
    // Wait for publications to load
    await page.waitForLoadState('networkidle');
    
    // Check that year labels are displayed
    const yearLabels = page.locator('div.text-xl, div.text-2xl').filter({ hasText: /^\d{4}$/ });
    await expect(yearLabels.first()).toBeVisible();
    
    // Check that publications are displayed
    const publications = page.locator('article[role="button"]');
    await expect(publications.first()).toBeVisible();
  });

  test('should show results count', async ({ page }) => {
    // Check results count is displayed
    await expect(page.getByText(/\d+件 \/ \d+件の論文を表示/)).toBeVisible();
  });

  test('should handle keyboard navigation for filters', async ({ page }) => {
    // Tab to first filter button
    const firstAuthorButton = page.getByRole('button', { name: '第一著者' });
    await firstAuthorButton.focus();
    
    // Check focus is visible
    await expect(firstAuthorButton).toBeFocused();
    
    // Press Enter to activate
    await page.keyboard.press('Enter');
    await expect(firstAuthorButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Check that content is still accessible
    await expect(page.getByRole('heading', { name: 'Publications', exact: true })).toBeVisible();
    
    // Check that filter buttons are visible
    await expect(page.getByRole('button', { name: '第一著者' })).toBeVisible();
    
    // Check that publications are displayed
    const publications = page.locator('article[role="button"]');
    await expect(publications.first()).toBeVisible();
    
    // Check no horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    
    // Check that content is visible
    await expect(page.getByRole('heading', { name: 'Publications', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '第一著者' })).toBeVisible();
    
    // Check no horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('should be responsive on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForLoadState('networkidle');
    
    // Check that all content is visible
    await expect(page.getByRole('heading', { name: 'Publications', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '第一著者' })).toBeVisible();
    
    // Check that publications are displayed
    const publications = page.locator('article[role="button"]');
    await expect(publications.first()).toBeVisible();
  });

  test('should display publication detail modal fullscreen on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Click first publication
    const firstPublication = page.locator('article[role="button"]').first();
    await expect(firstPublication).toBeVisible();
    await firstPublication.click();
    
    // Check that modal is displayed
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(page.getByText('Publication Details')).toBeVisible();
    
    // Close modal
    const closeButton = page.getByRole('button', { name: 'Close modal' });
    await closeButton.click();
    await page.waitForTimeout(300);
    
    // Check modal is closed
    await expect(modal).not.toBeVisible();
  });
});