import { test, expect } from '@playwright/test';

test.describe('Publications Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ja/publications');
  });

  test('should load and display publications list', async ({ page }) => {
    // Check page heading
    await expect(page.getByRole('heading', { name: '論文', exact: true })).toBeVisible();

    // Check that filter controls are displayed
    await expect(page.getByRole('button', { name: '主著' })).toBeVisible();
    await expect(page.getByRole('button', { name: '共著' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'あり' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'なし' })).toBeVisible();

    // Check that results count is displayed
    await expect(page.getByText(/\d+ \/ \d+件/)).toBeVisible();

    // Check that publications are displayed
    const publications = page.getByRole('button', { name: /の詳細を表示/ });
    await expect(publications.first()).toBeVisible();
  });

  test('should have working publication filters', async ({ page }) => {
    // Test first author filter
    await page.getByRole('button', { name: '主著' }).click();

    // Check that filter is active (button should have blue background)
    const firstAuthorButton = page.getByRole('button', { name: '主著' });
    await expect(firstAuthorButton).toHaveAttribute('aria-pressed', 'true');

    // Clear the filter by pressing the active option again without showing a separate button.
    await expect(page.getByRole('button', { name: 'クリア' })).toHaveCount(0);
    await firstAuthorButton.click();
    await expect(firstAuthorButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should place filters to the right of the heading on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    const heading = page.getByRole('heading', { name: '論文', exact: true });
    const filters = page.getByRole('region', { name: '論文フィルタ' });
    const headingBox = await heading.boundingBox();
    const filterBox = await filters.boundingBox();

    expect(headingBox).not.toBeNull();
    expect(filterBox).not.toBeNull();
    expect(filterBox!.x).toBeGreaterThan(headingBox!.x + headingBox!.width);
    expect(
      Math.abs(
        filterBox!.y + filterBox!.height / 2 -
        (headingBox!.y + headingBox!.height / 2)
      )
    ).toBeLessThanOrEqual(2);

    await expect(filters).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(filters).toHaveCSS('border-top-width', '0px');
    await expect(filters).toHaveCSS('box-shadow', 'none');

    const firstAuthorButton = page.getByRole('button', { name: '主著' });
    await expect(firstAuthorButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(firstAuthorButton).toHaveCSS('border-top-width', '0px');
  });

  test('should not display metadata badges in publication entries', async ({ page }) => {
    // Wait for publications to load
    await page.waitForLoadState('networkidle');

    // Check that publication articles are displayed
    const publications = page.getByRole('button', { name: /の詳細を表示/ });
    await expect(publications.first()).toBeVisible();

    await expect(publications.first().locator('span')).toHaveCount(0);
  });

  test('should open publication detail modal', async ({ page }) => {
    // Wait for publications to load
    await page.waitForLoadState('networkidle');

    // Click first publication
    const firstPublication = page.getByRole('button', { name: /の詳細を表示/ }).first();
    await expect(firstPublication).toBeVisible();
    await firstPublication.click();

    // Check that modal opens
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(page.getByText('論文詳細')).toBeVisible();

    // Close modal
    const closeButton = page.getByRole('button', { name: 'モーダルを閉じる' });
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
    const publications = page.getByRole('button', { name: /の詳細を表示/ });
    await expect(publications.first()).toBeVisible();
  });

  test('should show results count', async ({ page }) => {
    // Check results count is displayed
    await expect(page.getByText(/\d+ \/ \d+件/)).toBeVisible();
  });

  test('should handle keyboard navigation for filters', async ({ page }) => {
    // Tab to first filter button
    const firstAuthorButton = page.getByRole('button', { name: '主著' });
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
    await expect(page.getByRole('heading', { name: '論文', exact: true })).toBeVisible();

    // Check that filter buttons are visible
    await expect(page.getByRole('button', { name: '主著' })).toBeVisible();
    await expect(page.getByRole('button', { name: '主著' })).toHaveCSS('min-height', '44px');
    await expect(page.getByRole('button', { name: '主著' })).toHaveCSS('min-width', '44px');

    // Check that publications are displayed
    const publications = page.getByRole('button', { name: /の詳細を表示/ });
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
    await expect(page.getByRole('heading', { name: '論文', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '主著' })).toBeVisible();

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
    await expect(page.getByRole('heading', { name: '論文', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '主著' })).toBeVisible();

    // Check that publications are displayed
    const publications = page.getByRole('button', { name: /の詳細を表示/ });
    await expect(publications.first()).toBeVisible();
  });

  test('should display publication detail modal with readable gutters on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');

    // Click first publication
    const firstPublication = page.getByRole('button', { name: /の詳細を表示/ }).first();
    await expect(firstPublication).toBeVisible();
    await firstPublication.click();

    // Check that modal is displayed
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(page.getByText('論文詳細')).toBeVisible();

    await expect.poll(async () => {
      const box = await modal.boundingBox();
      return Math.abs((box?.x ?? 0) - 16);
    }).toBeLessThanOrEqual(1);
    await expect.poll(async () => {
      const box = await modal.boundingBox();
      return Math.abs((box?.width ?? 0) - 343);
    }).toBeLessThanOrEqual(1);
    expect(await modal.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);

    // Close modal
    const closeButton = page.getByRole('button', { name: 'モーダルを閉じる' });
    await closeButton.click();

    // Check modal is closed
    await expect(modal).not.toBeVisible();
  });
});
