import { test, expect } from '@playwright/test';

test.describe('Development Experience Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev-experience');
  });

  test('should load and display technology grid', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/Development Experience.*Portfolio/);
    await expect(page.getByRole('heading', { name: 'Development Experience', exact: true })).toBeVisible();
    
    // Check statistics section
    await expect(page.locator('div').filter({ hasText: /^Technologies$/ })).toBeVisible();
    await expect(page.getByTestId('projects-count')).toBeVisible();
    await expect(page.getByText('Advanced+')).toBeVisible();
    
    // Check technology items are displayed
    await expect(page.getByRole('button', { name: /View projects using TypeScript/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /View projects using React/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /View projects using Python/ })).toBeVisible();
  });

  test('should have working filters', async ({ page }) => {
    // Test category filter
    await page.selectOption('#category-filter', 'language');
    await expect(page.getByRole('button', { name: /View projects using TypeScript/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /View projects using Python/ })).toBeVisible();
    
    // Test proficiency filter
    await page.selectOption('#proficiency-filter', 'expert');
    await expect(page.getByRole('button', { name: /View projects using Python/ })).toBeVisible();
    
    // Reset filters by selecting 'all' option
    await page.selectOption('#category-filter', '');
    await page.selectOption('#proficiency-filter', '');
    await expect(page.getByRole('button', { name: /View projects using TypeScript/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /View projects using React/ })).toBeVisible();
  });

  test('should display proficiency legend', async ({ page }) => {
    // Check legend is visible
    await expect(page.getByText('Proficiency Legend:')).toBeVisible();
    await expect(page.getByLabel('Proficiency level indicators').getByText('Expert')).toBeVisible();
    await expect(page.getByLabel('Proficiency level indicators').getByText('Advanced')).toBeVisible();
    await expect(page.getByLabel('Proficiency level indicators').getByText('Intermediate')).toBeVisible();
    await expect(page.getByLabel('Proficiency level indicators').getByText('Beginner')).toBeVisible();
  });

  test('should open project modal when clicking technology with projects', async ({ page }) => {
    // Click on a technology that has projects (TypeScript)
    await page.getByRole('button', { name: /View projects using TypeScript/ }).first().click();
    
    // Check that modal opens
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: '個人ポートフォリオサイト' })).toBeVisible();
    
    // Close modal
    await page.getByRole('button', { name: 'Close modal' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Find first clickable tech badge with projects
    const techBadges = page.getByRole('button', { name: /View projects using/ });
    await expect(techBadges.first()).toBeVisible();
    await techBadges.first().click();
    
    // Check modal opens
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Press Escape to close modal
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still accessible
    await expect(page.getByRole('heading', { name: 'Development Experience', exact: true })).toBeVisible();
    
    // Check that technology grid adapts to mobile
    await expect(page.getByText('TypeScript')).toBeVisible();
    
    // Check that filters are still usable on mobile
    await page.selectOption('#category-filter', 'language');
    await expect(page.getByRole('button', { name: /View projects using Python/ })).toBeVisible();
  });
});