import { test, expect } from '@playwright/test';

test.describe('Publications Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/publications');
  });

  test('should load and display publications list', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/Publications.*Personal Portfolio/);
    await expect(page.getByRole('heading', { name: 'Publications' })).toBeVisible();
    
    // Check statistics section
    await expect(page.getByText('Total Publications')).toBeVisible();
    await expect(page.getByText('First Author')).toBeVisible();
    await expect(page.getByText('Peer Reviewed')).toBeVisible();
    await expect(page.getByText('Journal Articles')).toBeVisible();
    
    // Check that publications are displayed
    await expect(page.getByText('Deep Learning Approaches for Japanese Sentiment Analysis')).toBeVisible();
    await expect(page.getByText('Multimodal Learning for Image Caption Generation')).toBeVisible();
  });

  test('should have working publication filters', async ({ page }) => {
    // Check filter buttons are present
    await expect(page.getByRole('button', { name: /All \(\d+\)/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Journal \(\d+\)/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Conference \(\d+\)/ })).toBeVisible();
    
    // Test journal filter
    await page.getByRole('button', { name: /Journal/ }).click();
    await expect(page.getByText('Multimodal Learning for Image Caption Generation')).toBeVisible();
    
    // Test conference filter
    await page.getByRole('button', { name: /Conference/ }).click();
    await expect(page.getByText('Deep Learning Approaches for Japanese Sentiment Analysis')).toBeVisible();
    
    // Reset to all
    await page.getByRole('button', { name: /All/ }).click();
  });

  test('should display publication badges correctly', async ({ page }) => {
    // Check for first author badges
    const firstAuthorBadges = page.getByText('First Author');
    await expect(firstAuthorBadges.first()).toBeVisible();
    
    // Check for peer reviewed badges
    const peerReviewedBadges = page.getByText('Peer Reviewed');
    await expect(peerReviewedBadges.first()).toBeVisible();
    
    // Check for publication type badges
    await expect(page.getByText('Journal')).toBeVisible();
    await expect(page.getByText('Conference')).toBeVisible();
  });

  test('should have working DOI links', async ({ page }) => {
    // Find DOI links
    const doiLinks = page.getByRole('link', { name: /View publication DOI/ });
    await expect(doiLinks.first()).toBeVisible();
    
    // Check that DOI links have correct attributes
    const firstDoiLink = doiLinks.first();
    await expect(firstDoiLink).toHaveAttribute('target', '_blank');
    await expect(firstDoiLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should display publications in chronological order', async ({ page }) => {
    // Check that 2024 publications appear before 2023 publications
    const publications = page.locator('article');
    const firstPublication = publications.first();
    await expect(firstPublication).toContainText('2024');
  });

  test('should show results count when filtering', async ({ page }) => {
    // Apply a filter
    await page.getByRole('button', { name: /Journal/ }).click();
    
    // Check results count is displayed
    await expect(page.getByText(/Showing \d+ of \d+ publications/)).toBeVisible();
  });

  test('should handle keyboard navigation for filters', async ({ page }) => {
    // Tab to first filter button
    const allButton = page.getByRole('button', { name: /All/ });
    await allButton.focus();
    
    // Check focus is visible
    await expect(allButton).toBeFocused();
    
    // Press Enter to activate
    await page.keyboard.press('Enter');
    await expect(allButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still accessible
    await expect(page.getByRole('heading', { name: 'Publications' })).toBeVisible();
    
    // Check that publications are still readable
    await expect(page.getByText('Deep Learning Approaches')).toBeVisible();
    
    // Check that filter buttons adapt to mobile
    const filterButtons = page.getByRole('button', { name: /All|Journal|Conference/ });
    await expect(filterButtons.first()).toBeVisible();
  });

  test('should display additional information section', async ({ page }) => {
    // Scroll to bottom to see additional info
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check additional information section
    await expect(page.getByText('About These Publications')).toBeVisible();
    await expect(page.getByText('First Author:')).toBeVisible();
    await expect(page.getByText('Peer Reviewed:')).toBeVisible();
    await expect(page.getByText('DOI Links:')).toBeVisible();
  });
});