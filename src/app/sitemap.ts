import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

type SitemapEntry = MetadataRoute.Sitemap[number];

type LocalizedPath = {
  path: string;
  changeFrequency: SitemapEntry['changeFrequency'];
  priority: number;
  lastModified?: Date;
};

// The policy documents state their own last update, so the sitemap reports that date instead of
// the crawl date and asks for a yearly re-crawl.
const policyLastModified = new Date('2026-04-13T00:00:00.000Z');

const localizedPaths: LocalizedPath[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/career', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/dev-experience', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/publications', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3, lastModified: policyLastModified },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3, lastModified: policyLastModified },
];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.siteUrl) {
    return [];
  }

  const baseUrl = siteConfig.siteUrl;

  return localizedPaths.flatMap(({ path, changeFrequency, priority, lastModified }) => {
    const japaneseUrl = `${baseUrl}/ja${path}`;
    const englishUrl = `${baseUrl}/en${path}`;
    const alternates = {
      languages: {
        ja: japaneseUrl,
        en: englishUrl,
      },
    };
    const entry = {
      lastModified: lastModified ?? new Date(),
      changeFrequency,
      priority,
      alternates,
    };

    return [
      { url: japaneseUrl, ...entry },
      { url: englishUrl, ...entry },
    ];
  });
}
