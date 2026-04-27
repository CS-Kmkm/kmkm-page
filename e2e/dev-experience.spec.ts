import { test, expect } from '@playwright/test';

test.describe('Development Experience Page', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(60_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/dev-experience', { waitUntil: 'commit' });
    await expect(page.getByRole('heading', { name: '開発経験' })).toBeVisible();
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
    const techList = page.getByRole('list', { name: '技術スタック一覧' }).first();
    await expect(techList).toBeVisible();
  });

  test('should display tech detail view when clicking technology', async ({ page }) => {
    // Wait for page to load
    await expect(page.getByRole('button', { name: 'Pythonの詳細を表示' })).toBeVisible();
    
    // Find and click first tech icon button
    const techButton = page.getByRole('button', { name: 'Pythonの詳細を表示' });
    await expect(techButton).toBeVisible();
    await techButton.click();
    
    // Check that detail view is displayed
    const backButton = page.getByRole('button', { name: '技術一覧に戻る' });
    await expect(backButton).toBeVisible();
    
    // Scroll to top of page to ensure back button is not covered by header
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    
    // Check back button works
    await backButton.click();
    await expect(page.getByRole('heading', { name: 'プログラミング言語' })).toBeVisible({ timeout: 10000 });
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Wait for page to load completely
    await expect(page.getByRole('button', { name: 'Pythonの詳細を表示' })).toBeVisible();
    
    // Find first tech button
    const techButton = page.getByRole('button', { name: 'Pythonの詳細を表示' });
    await expect(techButton).toBeVisible();
    await techButton.click();
    
    // Check detail view opens
    await expect(page.getByRole('button', { name: '技術一覧に戻る' })).toBeVisible();
    
    // Press Escape to go back
    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: 'プログラミング言語' })).toBeVisible();
  });

  test('should collapse and expand technology categories', async ({ page }) => {
    const languageToggle = page.getByRole('button', { name: /プログラミング言語/ });
    const pythonButton = page.getByRole('button', { name: 'Pythonの詳細を表示' });

    await expect(languageToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(pythonButton).toBeVisible();

    await languageToggle.click();
    await expect(languageToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(pythonButton).toBeHidden();

    await languageToggle.click();
    await expect(languageToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(pythonButton).toBeVisible();
  });

  test('should collapse and expand all projects', async ({ page }) => {
    const projectsToggle = page.getByRole('button', { name: /全プロジェクト/ });
    const projectList = page.getByRole('list', { name: '全プロジェクト一覧' });

    await expect(projectsToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(projectList).toBeVisible();

    await projectsToggle.click();
    await expect(projectsToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(projectList).toBeHidden();

    await projectsToggle.click();
    await expect(projectsToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(projectList).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: '開発経験' })).toBeVisible();
    
    // Check that content is still accessible
    await expect(page.getByRole('heading', { name: '開発経験' })).toBeVisible();
    
    // Check that category sections are visible
    await expect(page.getByRole('heading', { name: 'プログラミング言語' })).toBeVisible();
    
    // Check that technology grid adapts to mobile
    const techList = page.getByRole('list', { name: '技術スタック一覧' }).first();
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
    await expect(page.getByRole('heading', { name: '開発経験' })).toBeVisible();
    
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
    await expect(page.getByRole('heading', { name: '開発経験' })).toBeVisible();
    
    // Check that all content is visible
    await expect(page.getByRole('heading', { name: '開発経験' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'プログラミング言語' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'フレームワーク・ライブラリ' })).toBeVisible();
    
    // Check that technology grid is displayed
    const techList = page.getByRole('list', { name: '技術スタック一覧' }).first();
    await expect(techList).toBeVisible();

    const leftPanelHeight = await page.getByRole('region', { name: '技術カテゴリ一覧' }).evaluate((element) => element.getBoundingClientRect().height);
    const rightPanelHeight = await page.getByRole('region', { name: '全プロジェクト' }).evaluate((element) => element.getBoundingClientRect().height);
    expect(Math.abs(leftPanelHeight - rightPanelHeight)).toBeLessThanOrEqual(1);
  });

  test('should display tech detail view on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('button', { name: 'Pythonの詳細を表示' })).toBeVisible();
    
    // Click first tech button
    const techButton = page.getByRole('button', { name: 'Pythonの詳細を表示' });
    await expect(techButton).toBeVisible();
    await techButton.click();
    
    // Wait for detail view to appear
    await page.waitForTimeout(500);
    
    // Check that detail view is displayed
    const backButton = page.getByRole('button', { name: '技術一覧に戻る' });
    await expect(backButton).toBeVisible();
    
    // Scroll to top of page to ensure back button is not covered by header
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    
    // Go back
    await backButton.click();
    await expect(page.getByRole('heading', { name: 'プログラミング言語' })).toBeVisible({ timeout: 10000 });
  });
});
