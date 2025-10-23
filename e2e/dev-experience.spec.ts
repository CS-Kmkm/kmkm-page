import { test, expect } from '@playwright/test';

test.describe('Development Experience Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev-experience');
  });

  test('should load and display technology grid', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/Development Experience.*Personal Portfolio/);
    await expect(page.getByRole('heading', { name: 'Development Experience' })).toBeVisible();
    
    // Check statistics section
    await expect(page.getByText('Technologies')).toBeVisible();
    await expect(page.getByText('Projects')).toBeVisible();
    await expect(page.getByText('Advanced+')).toBeVisible();
    
    // Check technology items are displayed
    await expect(page.getByText('TypeScript')).toBeVisible();
    await expect(page.getByText('React')).toBeVisible();
    await expect(page.getByText('Python')).toBeVisible();
  });

  test('should have working filters', async ({ page }) => {
    // Test category filter
    await page.selectOption('#category-filter', 'language');
    await expect(page.getByText('TypeScript')).toBeVisible();
    await expect(page.getByText('Python')).toBeVisible();
    
    // Test proficiency filter
    await page.selectOption('#proficiency-filter', 'expert');
    await expect(page.getByText('Python')).toBeVisible();
    
    // Clear filters
    await page.getByRole('button', { name: 'Clear Filters' }).click();
    await expect(page.getByText('TypeScript')).toBeVisible();
    await expect(page.getByText('React')).toBeVisible();
  });

  test('should display proficiency legend', async ({ page }) => {
    // Check legend is visible
    await expect(page.getByText('Proficiency Legend:')).toBeVisible();
    await expect(page.getByText('Expert')).toBeVisible();
    await expect(page.getByText('Advanced')).toBeVisible();
    await expect(page.getByText('Intermediate')).toBeVisible();
    await expect(page.getByText('Beginner')).toBeVisible();
  });

  test('should open project modal when clicking technology with projects', async ({ page }) => {
    // Click on a technology that has projects (TypeScript)
    await page.getByRole('button', { name: /View projects using TypeScript/ }).first().click();
    
    // Check that modal opens
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('個人ポートフォリオサイト')).toBeVisible();
    
    // Close modal
    await page.getByRole('button', { name: 'Close modal' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab to first technology badge
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Skip category filter
    await page.keyboard.press('Tab'); // Skip proficiency filter
    await page.keyboard.press('Tab'); // Skip sort filter
    
    // Find first clickable tech badge
    const firstTechBadge = page.getByRole('button').filter({ hasText: /View projects using/ }).first();
    await firstTechBadge.focus();
    
    // Press Enter to open modal
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Press Escape to close modal
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still accessible
    await expect(page.getByRole('heading', { name: 'Development Experience' })).toBeVisible();
    
    // Check that technology grid adapts to mobile
    await expect(page.getByText('TypeScript')).toBeVisible();
    
    // Check that filters are still usable on mobile
    await page.selectOption('#category-filter', 'language');
    await expect(page.getByText('Python')).toBeVisible();
  });
});