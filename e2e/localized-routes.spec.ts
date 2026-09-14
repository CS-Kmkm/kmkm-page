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

  test('marks the document language of every locale tree', async ({ page }) => {
    const documents = [
      ['/ja', 'ja'],
      ['/ja/career', 'ja'],
      ['/en', 'en'],
      ['/en/career', 'en'],
    ] as const;

    for (const [url, lang] of documents) {
      await page.goto(url);
      await expect(page.locator('html'), url).toHaveAttribute('lang', lang);
    }
  });

  test('answers unknown URLs with a 404 in the locale of the requested tree', async ({ page }) => {
    const japaneseResponse = await page.goto('/ja/does-not-exist');
    expect(japaneseResponse?.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await expect(page.getByRole('heading', { name: '404 - ページが見つかりません' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'トップへ戻る' })).toHaveAttribute('href', '/ja');

    const englishResponse = await page.goto('/en/does-not-exist');
    expect(englishResponse?.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: '404 - Page not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '/en');
    await expect(page.getByRole('link', { name: 'Career' })).toHaveAttribute('href', '/en/career');
    expect(await page.locator('body').innerText()).not.toMatch(/[ぁ-んァ-ヶ一-龠々ー]/);
  });

  test('switches directly between matching Japanese and English routes', async ({ page }) => {
    await page.goto('/ja/career');
    await page.getByRole('link', { name: 'Switch to English' }).first().click();
    await expect(page).toHaveURL('/en/career');

    await page.getByRole('link', { name: 'Switch to Japanese' }).first().click();
    await expect(page).toHaveURL('/ja/career');
  });

  test('serves the English policy documents', async ({ page }) => {
    const pages = [
      ['/en/privacy', 'Privacy Policy'],
      ['/en/terms', 'Terms of Use'],
    ] as const;

    for (const [url, heading] of pages) {
      const response = await page.goto(url);
      expect(response?.status(), url).toBe(200);
      await expect(page.getByRole('heading', { name: heading, exact: true }).first()).toBeVisible();
      await expect(page.locator('html'), url).toHaveAttribute('lang', 'en');
      expect(await page.locator('main').innerText(), url).not.toMatch(/[ぁ-んァ-ヶ一-龠々ー]/);
    }
  });

  test('offers the policy documents in the footer of both locale trees', async ({ page }) => {
    const footers = [
      ['/ja', 'サイトポリシー', 'プライバシーポリシー', '/ja/privacy', '利用条件', '/ja/terms'],
      ['/en', 'Site policies', 'Privacy Policy', '/en/privacy', 'Terms of Use', '/en/terms'],
    ] as const;

    for (const [url, navigation, privacyName, privacyHref, termsName, termsHref] of footers) {
      await page.goto(url);
      const policies = page.getByRole('navigation', { name: navigation });
      await expect(policies, url).toBeVisible();
      await expect(policies.getByRole('link', { name: privacyName }), url).toHaveAttribute('href', privacyHref);
      await expect(policies.getByRole('link', { name: termsName }), url).toHaveAttribute('href', termsHref);
    }
  });

  test('keeps the footer on a single row at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto('/ja');

    const footer = page.locator('footer');
    const policies = footer.getByRole('navigation', { name: 'サイトポリシー' });
    await expect(policies).toBeVisible();

    const footerBox = await footer.boundingBox();
    const policyBox = await policies.boundingBox();
    const socialBox = await footer.getByRole('list').last().boundingBox();

    expect(footerBox!.height).toBeLessThanOrEqual(48);
    expect(Math.abs(policyBox!.y - socialBox!.y)).toBeLessThan(policyBox!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
