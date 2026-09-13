import { afterEach, describe, expect, it, vi } from 'vitest';

const baseUrl = 'https://portfolio.example';

const loadSitemap = async () => {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', baseUrl);
  const { default: sitemap } = await import('@/app/sitemap');
  return sitemap();
};

describe('sitemap policy routes', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it.each([
    ['/privacy'],
    ['/terms'],
  ])('lists %s in both locale trees', async (path) => {
    const entries = await loadSitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(`${baseUrl}/ja${path}`);
    expect(urls).toContain(`${baseUrl}/en${path}`);
  });

  it.each([
    ['/ja/privacy', '/en/privacy'],
    ['/en/privacy', '/ja/privacy'],
    ['/ja/terms', '/en/terms'],
    ['/en/terms', '/ja/terms'],
  ])('crosslinks %s with %s', async (path, counterpart) => {
    const entries = await loadSitemap();
    const entry = entries.find((candidate) => candidate.url === `${baseUrl}${path}`);
    const japanese = path.startsWith('/ja') ? path : counterpart;
    const english = path.startsWith('/en') ? path : counterpart;

    expect(entry?.alternates).toEqual({
      languages: {
        ja: `${baseUrl}${japanese}`,
        en: `${baseUrl}${english}`,
      },
    });
  });

  it('crawls the policy documents less often and ranks them below the content pages', async () => {
    const entries = await loadSitemap();
    const policyEntries = entries.filter((entry) => /\/(privacy|terms)$/.test(entry.url));
    const contentEntries = entries.filter((entry) => !/\/(privacy|terms)$/.test(entry.url));

    expect(policyEntries).toHaveLength(4);
    for (const entry of policyEntries) {
      expect(entry.changeFrequency, entry.url).toBe('yearly');
      expect(entry.priority, entry.url).toBe(0.3);
    }
    const lowestContentPriority = Math.min(...contentEntries.map((entry) => entry.priority ?? 0));
    expect(Math.max(...policyEntries.map((entry) => entry.priority ?? 0))).toBeLessThan(lowestContentPriority);
  });

  it('reports the date printed on the policy documents instead of the crawl date', async () => {
    const entries = await loadSitemap();
    const policyEntries = entries.filter((entry) => /\/(privacy|terms)$/.test(entry.url));

    for (const entry of policyEntries) {
      expect(new Date(entry.lastModified as Date).toISOString(), entry.url).toBe('2026-04-13T00:00:00.000Z');
    }
  });

  it('stays empty when the site URL is not configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    const { default: sitemap } = await import('@/app/sitemap');

    expect(sitemap()).toEqual([]);
  });
});
