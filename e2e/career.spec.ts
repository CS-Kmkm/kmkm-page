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

    // Check timeline/list tabs and the separate order control are visible
    await expect(page.getByRole('tablist', { name: '経歴の表示' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'タイムライン表示' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: 'リスト表示' })).toHaveAttribute('aria-selected', 'false');
    await expect(page.getByRole('button', { name: '経歴の表示順を反転' })).toBeVisible();
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
    await expect(page.getByRole('button', { name: '経歴の表示順を反転' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'タイムライン表示' })).toHaveCSS('min-height', '44px');

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
    await expect(page.getByRole('button', { name: '経歴の表示順を反転' })).toBeVisible();

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
    await expect(page.getByRole('tablist', { name: '経歴の表示' })).toBeVisible();

    // Check SVG timeline is rendered
    const timelineSection = page.locator('section[aria-labelledby="timeline-heading"]');
    const svg = timelineSection.locator('svg').first();
    await expect(svg).toBeVisible();

    // Check reverse button is visible
    const reverseButton = page.getByRole('button', { name: '経歴の表示順を反転' });
    await expect(reverseButton).toBeVisible();
  });

  test('should toggle timeline order', async ({ page }) => {
    // Click reverse button
    const reverseButton = page.getByRole('button', { name: '経歴の表示順を反転' });
    await expect(reverseButton).toBeVisible();

    // Check initial button text (default is reversed, so should show ↓)
    await expect(reverseButton).toContainText('↓');

    // Click to reverse
    await reverseButton.click();

    // Check button text changed
    await expect(reverseButton).toContainText('↑');

    // Timeline should still be visible
    const timelineSection = page.locator('section[aria-labelledby="timeline-heading"]');
    const svg = timelineSection.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should switch career views with accessible tabs and arrow keys', async ({ page }) => {
    const timelineTab = page.getByRole('tab', { name: 'タイムライン表示' });
    const listTab = page.getByRole('tab', { name: 'リスト表示' });

    await listTab.click();
    await expect(listTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('section[aria-labelledby="list-heading"]')).toBeVisible();
    await expect(page.getByRole('button', { name: '経歴の表示順を反転' })).toBeVisible();

    await listTab.press('Home');
    await expect(timelineTab).toBeFocused();
    await expect(timelineTab).toHaveAttribute('aria-selected', 'true');

    await timelineTab.press('End');
    await expect(listTab).toBeFocused();
    await expect(listTab).toHaveAttribute('aria-selected', 'true');

    await listTab.press('ArrowLeft');
    await expect(timelineTab).toHaveAttribute('aria-selected', 'true');

    await timelineTab.press('ArrowRight');
    await expect(listTab).toHaveAttribute('aria-selected', 'true');
    await listTab.press('ArrowLeft');
    await expect(page.locator('section[aria-labelledby="timeline-heading"]')).toBeVisible();
  });

  test('should align list year presentation with publications and hide tags', async ({ page }) => {
    await page.goto('/career?view=list');

    const firstEvent = page.getByRole('button', { name: /View details for/ }).first();
    await expect(firstEvent).toBeVisible();
    await expect(page.getByText(/^\d{4}$/).first()).toBeVisible();
    await expect(firstEvent.locator('time')).toHaveText(/^\d{1,2}月\d{1,2}日$/);
    await expect(
      page.locator('[role="button"][aria-label^="View details for"] span').filter({ hasText: /^#/ })
    ).toHaveCount(0);

    const affiliationFilter = page.getByRole('button', { name: '所属' });
    await expect(affiliationFilter).toHaveAttribute('aria-pressed', 'false');
    await expect(affiliationFilter).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(affiliationFilter).toHaveCSS('border-top-width', '0px');
    await affiliationFilter.click();
    await expect(affiliationFilter).toHaveAttribute('aria-pressed', 'true');
  });

  test('should toggle list order between newest and oldest first', async ({ page }) => {
    await page.goto('/career?view=list');

    const reverseButton = page.getByRole('button', { name: '経歴の表示順を反転' });
    const eventButtons = page.getByRole('button', { name: /View details for/ });
    const initialFirstEvent = await eventButtons.first().getAttribute('aria-label');
    const initialLastEvent = await eventButtons.last().getAttribute('aria-label');

    expect(initialFirstEvent).not.toBe(initialLastEvent);
    await expect(reverseButton).toContainText('↓ 古い順');

    await reverseButton.click();

    await expect(reverseButton).toContainText('↑ 新しい順');
    await expect(eventButtons.first()).toHaveAttribute('aria-label', initialLastEvent!);
    await expect(eventButtons.last()).toHaveAttribute('aria-label', initialFirstEvent!);
  });
});
