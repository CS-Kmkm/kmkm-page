import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.siteUrl) {
    return [];
  }

  const baseUrl = siteConfig.siteUrl;

  const primaryPaths = ['', '/career', '/dev-experience', '/publications'];

  return primaryPaths.flatMap((path, index) => {
    const japaneseUrl = `${baseUrl}${path}`;
    const englishUrl = `${baseUrl}/en${path}`;
    const alternates = {
      languages: {
        ja: japaneseUrl,
        en: englishUrl,
      },
    };

    return [
    {
      url: japaneseUrl,
      lastModified: new Date(),
      changeFrequency: index === 0 ? 'weekly' as const : 'monthly' as const,
      priority: index === 0 ? 1 : 0.8,
      alternates,
    },
    {
      url: englishUrl,
      lastModified: new Date(),
      changeFrequency: index === 0 ? 'weekly' as const : 'monthly' as const,
      priority: index === 0 ? 1 : 0.8,
      alternates,
    },
    ];
  });
}
