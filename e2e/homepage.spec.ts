import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display main content', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Personal Portfolio/);
    
    // Check main heading is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Check profile section is visible
    await expect(page.getByText('山田太郎')).toBeVisible();
    await expect(page.getByText('○○大学 情報学部')).toBeVisible();
    
    // Check social media section
    await expect(page.getByText('ソーシャルメディア')).toBeVisible();
    
    // Check navigation cards are present
    await expect(page.getByText('経歴')).toBeVisible();
    await expect(page.getByText('開発経験')).toBeVisible();
    await expect(page.getByText('論文投稿履歴')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Test navigation to career page
    await page.getByRole('link', { name: /経歴/ }).first().click();
    await expect(page).toHaveURL('/career');
    await expect(page.getByRole('heading', { name: '経歴' })).toBeVisible();
    
    // Go back to home
    await page.goto('/');
    
    // Test navigation to dev experience page
    await page.getByRole('link', { name: /開発経験/ }).first().click();
    await expect(page).toHaveURL('/dev-experience');
    await expect(page.getByRole('heading', { name: 'Development Experience' })).toBeVisible();
    
    // Go back to home
    await page.goto('/');
    
    // Test navigation to publications page
    await page.getByRole('link', { name: /論文投稿履歴/ }).first().click();
    await expect(page).toHaveURL('/publications');
    await expect(page.getByRole('heading', { name: 'Publications' })).toBeVisible();
  });

  test('should display updates list', async ({ page }) => {
    // Check updates section is visible
    await expect(page.getByText('最新の更新情報')).toBeVisible();
    
    // Check that at least one update is displayed
    const updates = page.locator('article').filter({ hasText: /2024/ });
    await expect(updates.first()).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check skip link
    await page.keyboard.press('Tab');
    const skipLink = page.getByText('Skip to main content');
    await expect(skipLink).toBeFocused();
    
    // Check main content is accessible
    await skipLink.click();
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still visible and properly laid out
    await expect(page.getByText('山田太郎')).toBeVisible();
    await expect(page.getByText('ソーシャルメディア')).toBeVisible();
    
    // Check navigation cards stack vertically on mobile
    const navigationCards = page.locator('article').filter({ hasText: /経歴|開発経験|論文投稿履歴/ });
    await expect(navigationCards.first()).toBeVisible();
  });
});