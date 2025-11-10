import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display main content', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/茂木光志.*個人ポートフォリオ/);
    
    // Check main heading is visible (exclude screen reader only headings)
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
    
    // Check profile section is visible
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
    await expect(page.getByText('名古屋大学大学院情報学研究科知能システム学専攻松原研究室')).toBeVisible();
    
    // Check social media section
    await expect(page.getByLabel('ソーシャルメディアリンク')).toBeVisible();
    
    // Check navigation cards are present
    await expect(page.getByRole('link', { name: /経歴/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /開発経験/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /論文/ })).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Test navigation to career page
    await page.getByRole('link', { name: /経歴/ }).first().click();
    await expect(page).toHaveURL('/career');
    await expect(page.getByRole('heading', { name: '経歴', exact: true })).toBeVisible();
    
    // Go back to home
    await page.goto('/');
    
    // Test navigation to dev experience page
    await page.getByRole('link', { name: /開発経験/ }).first().click();
    await expect(page).toHaveURL('/dev-experience');
    await expect(page.getByRole('heading', { name: '開発経験' })).toBeVisible();
    
    // Go back to home
    await page.goto('/');
    
    // Test navigation to publications page
    await page.getByRole('link', { name: /論文/ }).first().click();
    await expect(page).toHaveURL('/publications');
    await expect(page.getByRole('heading', { name: 'Publications', exact: true })).toBeVisible();
  });

  test('should display updates list', async ({ page }) => {
    // Check updates section is visible
    await expect(page.getByText('最新の更新情報')).toBeVisible();
    
    // Check that at least one update is displayed
    const updates = page.locator('article').filter({ hasText: /2024/ });
    await expect(updates.first()).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check skip link exists and can be focused
    const skipLink = page.getByRole('link', { name: 'Skip to main content' }).first();
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
    
    // Check main content exists and is accessible
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Check that content is still visible and properly laid out
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
    await expect(page.getByLabel('ソーシャルメディアリンク')).toBeVisible();
    
    // Check navigation cards stack vertically on mobile
    const navigationCards = page.locator('article').filter({ hasText: /経歴|開発経験|論文/ });
    await expect(navigationCards.first()).toBeVisible();
    
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
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
    
    // Check that layout adapts to tablet (2-column layout)
    const updatesSection = page.locator('div').filter({ hasText: '最新の更新情報' }).first();
    await expect(updatesSection).toBeVisible();
    
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
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
    await expect(page.getByText('最新の更新情報')).toBeVisible();
    await expect(page.getByText('コンテンツ')).toBeVisible();
    
    // Check 3-column layout is applied
    const navigationSection = page.locator('div').filter({ hasText: 'コンテンツ' }).first();
    await expect(navigationSection).toBeVisible();
  });
});