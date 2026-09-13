import { test, expect } from '@playwright/test';

// The head is where the social card, the structured data and the icons can break without any
// unit test noticing: a leaf page exporting its own `openGraph` object replaces the resolved one,
// and a resolved `icons` field suppresses Next's generated icon routes entirely.
test.describe('document head', () => {
  const content = (page: import('@playwright/test').Page, selector: string) =>
    page.locator(selector).first().getAttribute('content');

  for (const [url, locale] of [['/ja', 'ja'], ['/en', 'en']] as const) {
    test(`serves a social card, structured data and installable icons on ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page.locator('html')).toHaveAttribute('lang', locale);

      const ogImage = await content(page, 'meta[property="og:image"]');
      const twitterImage = await content(page, 'meta[name="twitter:image"]');
      expect(ogImage, 'og:image is required for the summary_large_image card').toBeTruthy();
      expect(twitterImage).toBe(ogImage);
      expect(await content(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');

      // The card has to be a real image, not just a URL in a meta tag. The tag carries the
      // configured production origin, so only its path is meaningful against the test server.
      const image = await page.request.get(new URL(ogImage!).pathname);
      expect(image.status()).toBe(200);
      expect(image.headers()['content-type']).toContain('image/png');
      expect((await image.body()).byteLength).toBeGreaterThan(10_000);

      for (const sizes of ['192x192', '512x512']) {
        await expect(page.locator(`link[rel="icon"][sizes="${sizes}"]`)).toHaveCount(1);
      }
      await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
      await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);

      const person = await page
        .locator('script[type="application/ld+json"]')
        .first()
        .textContent();
      expect(JSON.parse(person!)['@type']).toBe('Person');
    });
  }

  test('describes the publications it actually shows', async ({ page }) => {
    await page.goto('/en/publications');

    await page.waitForLoadState('networkidle');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const articles = blocks
      .map(block => JSON.parse(block))
      .flatMap(node => node['@graph'] ?? [node])
      .filter(node => node['@type'] === 'ScholarlyArticle');

    const rendered = await page.getByRole('button', { name: /Show details for/ }).count();
    expect(articles).toHaveLength(rendered);
    // One node per paper: a duplicated graph would make the same work look like several.
    expect(new Set(articles.map(article => article['@id'])).size).toBe(articles.length);
    articles.forEach(article => expect(article.headline).toBeTruthy());
  });
});
