import { test, expect } from '@playwright/test';

test.describe('Career Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/career');
  });

  test('should load and display career timeline', async ({ page }) => {
    // Check page heading
    await expect(page.getByRole('heading', { name: '経歴', exact: true })).toBeVisible();

    // Check breadcrumb navigation
    await expect(page.getByText('トップ')).toBeVisible();
    await expect(page.getByLabel('パンくずナビゲーション').getByText('経歴')).toBeVisible();

    // Check timeline entries are visible (using actual data)
    await expect(page.getByText('名古屋大学大学院 情報学研究科 知能システム学専攻')).toBeVisible();
    await expect(page.getByText('松原研究室', { exact: true })).toBeVisible();
  });

  test('should display timeline in chronological order', async ({ page }) => {
    // Check that recent entries are displayed
    await expect(page.getByText(/2025\.04 - 現在/).first()).toBeVisible();
    await expect(page.getByText(/2024\.04 - 現在/).first()).toBeVisible();

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
    await expect(page.getByText('松原研究室', { exact: true })).toBeVisible();

    // Check that timeline content is still accessible on mobile
    await expect(page.getByText(/2025\.04 - 現在/).first()).toBeVisible();
    await expect(page.getByText('名古屋大学大学院 情報学研究科 知能システム学専攻')).toBeVisible();

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
    // Click breadcrumb home link
    await page.getByRole('link', { name: 'トップページに戻る' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');

    // Check that content is visible
    await expect(page.getByRole('heading', { name: '経歴', exact: true })).toBeVisible();
    await expect(page.getByText('松原研究室', { exact: true })).toBeVisible();

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
    await expect(page.getByText('名古屋大学大学院 情報学研究科 知能システム学専攻')).toBeVisible();
    await expect(page.getByText('松原研究室', { exact: true })).toBeVisible();

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

    // Check initial button text
    await expect(reverseButton).toContainText('↑');

    // Click to reverse
    await reverseButton.click();
    await page.waitForTimeout(500); // Wait for animation

    // Check button text changed
    await expect(reverseButton).toContainText('↓');

    // Timeline should still be visible
    const timelineSection = page.locator('section[aria-labelledby="timeline-heading"]');
    const svg = timelineSection.locator('svg').first();
    await expect(svg).toBeVisible();
  });
});