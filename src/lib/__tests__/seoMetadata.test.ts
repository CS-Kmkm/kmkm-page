import { afterEach, describe, expect, it, vi } from 'vitest';

const SITE_URL = 'https://portfolio.example';

async function loadMetadata(siteUrl?: string) {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', siteUrl ?? '');
  return import('../metadata');
}

describe('social preview metadata', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('points Open Graph and Twitter at the generated card with Japanese alt text', async () => {
    const { generatePageMetadata } = await loadMetadata(SITE_URL);

    const metadata = generatePageMetadata({ path: '/ja/career' });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: '茂木光志の個人ポートフォリオ',
      },
    ]);
    expect(metadata.twitter?.images).toEqual(metadata.openGraph?.images);
  });

  it('describes the same card in English on the English tree', async () => {
    const { generatePageMetadata } = await loadMetadata(SITE_URL);

    const metadata = generatePageMetadata({ locale: 'en', path: '/en/career' });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Koshi Motegi's Portfolio",
      },
    ]);
    expect((metadata.twitter as { card?: string } | undefined)?.card).toBe('summary_large_image');
    expect(metadata.twitter?.images).toEqual(metadata.openGraph?.images);
  });

  it('degrades to no card, rather than a localhost URL, without a configured site URL', async () => {
    const { generatePageMetadata } = await loadMetadata();

    const metadata = generatePageMetadata({ path: '/ja/career' });

    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.twitter?.images).toBeUndefined();
    // The key still has to exist: Next only falls back to the `opengraph-image` file convention
    // (and its localhost placeholder) when the metadata object does not declare `images` at all.
    expect(metadata.openGraph && 'images' in metadata.openGraph).toBe(true);
    expect(metadata.twitter && 'images' in metadata.twitter).toBe(true);
    expect(metadata.title).toBe('茂木光志 | 個人ポートフォリオ');
    expect(metadata.alternates).toBeUndefined();
  });
});

describe('icon metadata', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('leaves the icon links to the file conventions', async () => {
    const { generatePageMetadata } = await loadMetadata(SITE_URL);

    // A hardcoded `icons` field wins over the generated icon.tsx / apple-icon.tsx routes and
    // would silently drop them from the document head, so the field must stay unset.
    expect(generatePageMetadata({ path: '/ja' }).icons).toBeUndefined();
  });

  it('declares installable icon sizes in the web manifest', async () => {
    vi.resetModules();
    const { default: manifest } = await import('@/app/manifest');

    const icons = manifest().icons ?? [];

    expect(icons).toEqual([
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { src: '/icon/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ]);
  });
});
