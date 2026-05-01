import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display main content', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/茂木光志/);
    
    // Check main heading is visible (exclude screen reader only headings)
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
    
    // Check profile section is visible
    await expect(page.getByRole('heading', { name: '茂木光志' })).toBeVisible();
    await expect(page.getByText('名古屋大学大学院 情報学研究科 知能システム学専攻 松原研究室', { exact: true })).toBeVisible();
    
    // Check social media section
    await expect(page.getByLabel('ソーシャルメディアリンク')).toBeVisible();
    
    // Check navigation cards are present
    await expect(page.getByRole('link', { name: '経歴', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: '開発経験', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: '論文・発表', exact: true })).toBeVisible();
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
    await expect(page.getByRole('heading', { name: '論文・発表', exact: true })).toBeVisible();
  });

  test('should display updates list', async ({ page }) => {
    // Check updates section is visible
    await expect(page.getByText('最新の更新情報')).toBeVisible();

    // Check that at least one update item is displayed
    const updatesSection = page.locator('section[aria-labelledby="updates-heading"]');
    const updates = updatesSection.getByRole('button');
    await expect(updates.first()).toBeVisible();
  });

  test('should fit updates count to available viewport height', async ({ page }) => {
    const updatesSection = page.locator('section[aria-labelledby="updates-heading"]');

    await page.setViewportSize({ width: 1280, height: 360 });
    await page.waitForFunction(() => {
      const section = document.querySelector('section[aria-labelledby="updates-heading"]');
      return section ? section.querySelectorAll('[data-visible-update-item]').length > 0 : false;
    });

    const compactVisibleCount = await updatesSection.locator('[data-visible-update-item]').count();
    const compactTotalCount = await updatesSection.locator('[data-update-measure-item]').count();
    expect(compactVisibleCount).toBeGreaterThanOrEqual(1);
    expect(compactVisibleCount).toBeLessThan(3);

    const compactMoreText = await updatesSection.locator('[data-visible-update-more]').textContent();
    const compactHiddenCount = Number(compactMoreText?.match(/\d+/)?.[0]);
    expect(compactHiddenCount).toBe(compactTotalCount - compactVisibleCount);

    await page.setViewportSize({ width: 1280, height: 1400 });
    await page.waitForFunction(() => {
      const section = document.querySelector('section[aria-labelledby="updates-heading"]');
      return section ? section.querySelectorAll('[data-visible-update-item]').length > 3 : false;
    });

    const roomyVisibleCount = await updatesSection.locator('[data-visible-update-item]').count();
    expect(roomyVisibleCount).toBeGreaterThan(3);

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);

    const footerGap = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      const scrollingElement = document.scrollingElement;
      if (!footer || !scrollingElement) return null;

      const footerBottom = footer.getBoundingClientRect().bottom + window.scrollY;

      return {
        bodyOverflow: document.body.scrollHeight - scrollingElement.scrollHeight,
        gapAfterFooter: scrollingElement.scrollHeight - footerBottom,
      };
    });

    expect(footerGap).not.toBeNull();
    expect(footerGap?.bodyOverflow).toBeLessThanOrEqual(1);
    expect(footerGap?.gapAfterFooter).toBeLessThanOrEqual(1);
  });

  test('should navigate from hidden updates count to career list view', async ({ page }) => {
    const updatesSection = page.locator('section[aria-labelledby="updates-heading"]');

    await page.setViewportSize({ width: 1280, height: 360 });
    await page.waitForFunction(() => {
      const section = document.querySelector('section[aria-labelledby="updates-heading"]');
      return section ? Boolean(section.querySelector('[data-visible-update-more] a')) : false;
    });

    await updatesSection.locator('[data-visible-update-more] a').click();

    await expect(page).toHaveURL(/\/career\?view=list#list-heading$/);
    await expect(page.getByRole('heading', { name: 'イベントリスト' })).toBeAttached();
    await expect(page.getByRole('button', { name: '所属' })).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check skip link exists and can be focused
    const skipLink = page.getByRole('link', { name: 'メインコンテンツへスキップ' }).first();
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
    await expect(page.getByRole('heading', { name: 'コンテンツ' })).toBeVisible();
    
    // Check 3-column layout is applied
    const navigationSection = page.locator('div').filter({ hasText: 'コンテンツ' }).first();
    await expect(navigationSection).toBeVisible();
  });
});
