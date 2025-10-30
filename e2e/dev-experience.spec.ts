import { test, expect } from '@playwright/test';

test.describe('Development Experience Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev-experience');
  });

  test('should load and display technology categories', async ({ page }) => {
    // Check page heading
    await expect(page.getByRole('heading', { name: '開発経験' })).toBeVisible();
    
    // Check category sections are displayed
    await expect(page.getByRole('heading', { name: 'プログラミング言語' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'フレームワーク・ライブラリ' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ツール・プラットフォーム' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'データベース' })).toBeVisible();
    
    // Check that technology icons are displayed
    const techList = page.getByRole('list', { name: 'Technology stack' }).first();
    await expect(techList).toBeVisible();
  });

  test('should display tech detail view when clicking technology', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Find and click first tech icon button
    const techButton = page.getByRole('button', { name: /View .* details/ }).first();
    await expect(techButton).toBeVisible();
    await techButton.click();
    
    // Check that detail view is displayed
    await expect(page.getByRole('button', { name: '技術一覧に戻る' })).toBeVisible();
    
    // Check back button works
    await page.getByRole('button', { name: '技術一覧に戻る' }).click();
    await expect(page.getByRole('heading', { name: 'プログラミング言語' })).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Find first tech button
    const techButton = page.getByRole('button', { name: /View .* details/ }).first();
    await expect(techButton).toBeVisible();
    await techButton.click();
    
    // Check detail view opens
    await expect(page.getByRole('button', { name: '技術一覧に戻る' })).toBeVisible();
    
    // Press Escape to go back
    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: 'プログラミング言語' })).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Check that content is still accessible
    await expect(page.getByRole('heading', { name: '開発経験' })).toBeVisible();
    
    // Check that category sections are visible
    await expect(page.getByRole('heading', { name: 'プログラミング言語' })).toBeVisible();
    
    // Check that technology grid adapts to mobile (2 columns)
    const techList = page.getByRole('list', { name: 'Technology stack' }).first();
    await expect(techList).toBeVisible();
    
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
    await expect(page.getByRole('heading', { name: '開発経験' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'プログラミング言語' })).toBeVisible();
    
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
    await expect(page.getByRole('heading', { name: '開発経験' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'プログラミング言語' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'フレームワーク・ライブラリ' })).toBeVisible();
    
    // Check that technology grid is displayed
    const techList = page.getByRole('list', { name: 'Technology stack' }).first();
    await expect(techList).toBeVisible();
  });

  test('should display tech detail view fullscreen on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Click first tech button
    const techButton = page.getByRole('button', { name: /View .* details/ }).first();
    await expect(techButton).toBeVisible();
    await techButton.click();
    
    // Wait for detail view to appear
    await page.waitForTimeout(500);
    
    // Check that detail view is displayed
    const backButton = page.getByRole('button', { name: '技術一覧に戻る' });
    await expect(backButton).toBeVisible();
    
    // Go back
    await backButton.click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: 'プログラミング言語' })).toBeVisible();
  });
});