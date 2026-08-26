import { afterEach, describe, expect, it, vi } from 'vitest';
import manifest from '@/app/manifest';

describe('localized metadata routes', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('uses /ja as the manifest start URL', () => {
    expect(manifest().start_url).toBe('/ja');
  });

  it.each([
    ['ja', '/ja/career', '/ja/career', '/en/career'],
    ['en', '/en/career', '/ja/career', '/en/career'],
  ] as const)('generates reciprocal alternates for %s', async (locale, path, japanesePath, englishPath) => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://portfolio.example');
    const { generatePageMetadata } = await import('../metadata');

    const metadata = generatePageMetadata({ locale, path });

    expect(metadata.alternates).toEqual({
      canonical: `https://portfolio.example${path}`,
      languages: {
        ja: `https://portfolio.example${japanesePath}`,
        en: `https://portfolio.example${englishPath}`,
      },
    });
  });

  it('lists only locale-prefixed primary routes in the sitemap', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://portfolio.example');
    const { default: sitemap } = await import('@/app/sitemap');

    const urls = sitemap().map(entry => entry.url);

    expect(urls).toEqual([
      'https://portfolio.example/ja',
      'https://portfolio.example/en',
      'https://portfolio.example/ja/career',
      'https://portfolio.example/en/career',
      'https://portfolio.example/ja/dev-experience',
      'https://portfolio.example/en/dev-experience',
      'https://portfolio.example/ja/publications',
      'https://portfolio.example/en/publications',
    ]);
  });
});
