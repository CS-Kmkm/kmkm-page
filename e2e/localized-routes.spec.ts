import { expect, test } from '@playwright/test';

test.describe('Localized routes', () => {
  test('serves every canonical Japanese page', async ({ page }) => {
    const pages = [
      ['/ja', '茂木光志'],
      ['/ja/career', '経歴'],
      ['/ja/publications', '論文'],
      ['/ja/dev-experience', '開発経験'],
      ['/ja/privacy', 'プライバシーポリシー'],
      ['/ja/terms', '利用条件'],
    ] as const;

    for (const [url, heading] of pages) {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { name: heading, exact: true }).first()).toBeVisible();
    }
  });

  test('permanently redirects legacy Japanese routes and preserves query strings', async ({ request }) => {
    const redirects = [
      ['/', '/ja'],
      ['/career?view=list', '/ja/career?view=list'],
      ['/publications', '/ja/publications'],
      ['/dev-experience', '/ja/dev-experience'],
      ['/privacy', '/ja/privacy'],
      ['/terms', '/ja/terms'],
      ['/events', '/ja/career'],
      ['/ja/events?view=list', '/ja/career?view=list'],
    ] as const;

    for (const [source, target] of redirects) {
      const response = await request.get(source, { maxRedirects: 0 });
      expect(response.status(), source).toBe(308);
      expect(response.headers().location, source).toBe(target);
    }
  });

  test('switches directly between matching Japanese and English routes', async ({ page }) => {
    await page.goto('/ja/career');
    await page.getByRole('link', { name: 'Switch to English' }).first().click();
    await expect(page).toHaveURL('/en/career');

    await page.getByRole('link', { name: 'Switch to Japanese' }).first().click();
    await expect(page).toHaveURL('/ja/career');
  });
});
