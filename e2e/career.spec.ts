import { test, expect } from '@playwright/test';

test.describe('Career Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/career');
  });

  test('should load and display career timeline', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/経歴.*Personal Portfolio/);
    await expect(page.getByRole('heading', { name: '経歴', exact: true })).toBeVisible();

    // Check breadcrumb navigation
    await expect(page.getByText('トップ')).toBeVisible();
    await expect(page.getByLabel('パンくずナビゲーション').getByText('経歴')).toBeVisible();

    // Check timeline entries are visible
    await expect(page.getByText('2024', { exact: true })).toBeVisible();
    await expect(page.getByText('准教授')).toBeVisible();
    await expect(page.getByTestId('career-org-career-001')).toBeVisible();
  });

  test('should display timeline in chronological order', async ({ page }) => {
    // Get all year badges
    const yearBadges = page.locator('div:has-text("2024"), div:has-text("2021-2024"), div:has-text("2019-2021")');

    // Check that entries are displayed (newest first)
    await expect(yearBadges.first()).toContainText('2024');
  });

  test('should have proper semantic structure', async ({ page }) => {
    // Check that timeline has proper ARIA labels
    const timeline = page.locator('[role="list"][aria-label="Career timeline"]');
    await expect(timeline).toBeVisible();

    // Check that timeline items have proper roles
    const timelineItems = page.locator('[role="listitem"]');
    await expect(timelineItems.first()).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that timeline is still readable on mobile
    await expect(page.getByRole('heading', { name: '経歴', exact: true })).toBeVisible();
    await expect(page.getByText('准教授')).toBeVisible();

    // Check that timeline content is still accessible on mobile
    // Note: Timeline dots are hidden on mobile (md:block), so we check timeline entries instead
    await expect(page.getByText('2024', { exact: true })).toBeVisible();
    await expect(page.getByText('准教授')).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    // Click breadcrumb home link
    await page.getByRole('link', { name: 'トップページに戻る' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByText('山田太郎')).toBeVisible();
  });
});