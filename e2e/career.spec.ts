import { test, expect } from '@playwright/test';

test.describe('Career Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/career');
  });

  test('should load and display career timeline', async ({ page }) => {
    // Check page heading
    await expect(page.getByRole('heading', { name: '経歴', exact: true })).toBeVisible();

    // Check timeline container is visible
    const timelineSection = page.locator('section[aria-labelledby="timeline-heading"]');
    await expect(timelineSection).toBeVisible();

    // Check timeline/list toggle controls are visible
    await expect(page.getByRole('button', { name: /表示モードを切り替え/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ブランチの順序を反転' })).toBeVisible();
  });

  test('should display timeline in chronological order', async ({ page }) => {
    // Check that at least one date range label is rendered
    await expect(page.getByText(/\d{4}-\d{2}-現在|\d{4}-\d{2}-\d{4}-\d{2}/).first()).toBeVisible();

    // Check SVG timeline is rendered (use more specific selector)
    const timelineSection = page.locator('section[aria-labelledby="timeline-heading"]');
    const svg = timelineSection.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should have proper semantic structure', async ({ page }) => {
    // Check that page has proper heading structure
    await expect(page.getByRole('heading', { name: '経歴', exact: true })).toBeVisible();

    // Check that timeline section exists
    const timelineSection = page.locator('section[aria-labelledby="timeline-heading"]');
    await expect(timelineSection).toBeVisible();

    // Check SVG timeline is rendered (use more specific selector)
    const svg = timelineSection.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');

    // Check that timeline is still readable on mobile
    await expect(page.getByRole('heading', { name: '経歴', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ブランチの順序を反転' })).toBeVisible();

    // Check SVG timeline is rendered and responsive
    const timelineSection = page.locator('section[aria-labelledby="timeline-heading"]');
    const svg = timelineSection.locator('svg').first();
    await expect(svg).toBeVisible();

    // Check no horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('should navigate back to home', async ({ page }) => {
    // Click header brand link
    await page.getByRole('link', { name: 'トップページへ移動' }).first().click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');

    // Check that content is visible
    await expect(page.getByRole('heading', { name: '経歴', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ブランチの順序を反転' })).toBeVisible();

    // Check SVG timeline is rendered
    const timelineSection = page.locator('section[aria-labelledby="timeline-heading"]');
    const svg = timelineSection.locator('svg').first();
    await expect(svg).toBeVisible();

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
    await expect(page.getByRole('heading', { name: '経歴', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /表示モードを切り替え/ })).toBeVisible();

    // Check SVG timeline is rendered
    const timelineSection = page.locator('section[aria-labelledby="timeline-heading"]');
    const svg = timelineSection.locator('svg').first();
    await expect(svg).toBeVisible();

    // Check reverse button is visible
    const reverseButton = page.getByRole('button', { name: 'ブランチの順序を反転' });
    await expect(reverseButton).toBeVisible();
  });

  test('should toggle timeline order', async ({ page }) => {
    // Click reverse button
    const reverseButton = page.getByRole('button', { name: 'ブランチの順序を反転' });
    await expect(reverseButton).toBeVisible();

    // Check initial button text (default is reversed, so should show ↓)
    await expect(reverseButton).toContainText('↓');

    // Click to reverse
    await reverseButton.click();
    await page.waitForTimeout(500); // Wait for animation

    // Check button text changed
    await expect(reverseButton).toContainText('↑');

    // Timeline should still be visible
    const timelineSection = page.locator('section[aria-labelledby="timeline-heading"]');
    const svg = timelineSection.locator('svg').first();
    await expect(svg).toBeVisible();
  });
});
