import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  locale?: 'ja' | 'en';
}

/**
 * Generate metadata for pages in the App Router
 * This provides SEO meta tags support that was previously handled in PageLayout
 */
export function generatePageMetadata({
  title,
  description = siteConfig.description,
  path = '',
  keywords = [],
  locale = 'ja',
}: GenerateMetadataProps = {}): Metadata {
  const localizedSite = locale === 'en'
    ? {
        ...siteConfig,
        personName: siteConfig.personNameEn,
        siteName: `${siteConfig.personNameEn}'s Portfolio`,
        defaultTitle: `${siteConfig.personNameEn} | Portfolio`,
        description: "Koshi Motegi's portfolio featuring research, development experience, and publications.",
        locale: 'en_US',
      }
    : siteConfig;
  const resolvedDescription = description === siteConfig.description && locale === 'en'
    ? localizedSite.description
    : description;
  const fullTitle = title ? `${title} | ${localizedSite.personName}` : localizedSite.defaultTitle;
  const siteUrl = localizedSite.siteUrl;
  const fullUrl = siteUrl ? new URL(path || '/', siteUrl).toString() : undefined;
  const counterpartPath = locale === 'en'
    ? (path.replace(/^\/en(?=\/|$)/, '') || '/')
    : (path === '/' || path === '' ? '/en' : `/en${path}`);
  const counterpartUrl = siteUrl ? new URL(counterpartPath, siteUrl).toString() : undefined;
  const localizedPrimaryPaths = new Set([
    '', '/', '/career', '/publications', '/dev-experience',
    '/en', '/en/career', '/en/publications', '/en/dev-experience',
  ]);
  const hasLanguageAlternate = localizedPrimaryPaths.has(path);

  return {
    title: fullTitle,
    description: resolvedDescription,
    keywords,
    authors: [{ name: localizedSite.personName }],
    creator: localizedSite.personName,
    publisher: localizedSite.personName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: localizedSite.locale,
      title: fullTitle,
      description: resolvedDescription,
      siteName: localizedSite.siteName,
      ...(fullUrl ? { url: fullUrl } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: resolvedDescription,
    },
    alternates: fullUrl
      ? {
          canonical: fullUrl,
          ...(hasLanguageAlternate ? {
            languages: {
              ja: locale === 'ja' ? fullUrl : counterpartUrl!,
              en: locale === 'en' ? fullUrl : counterpartUrl!,
            },
          } : {}),
        }
      : undefined,
    icons: {
      icon: '/favicon.ico',
    },
    manifest: '/manifest.webmanifest',
    other: {
      'theme-color': '#ffffff',
      'color-scheme': 'light dark',
    },
  };
}

/**
 * Default metadata for the site
 */
export const defaultMetadata: Metadata = generatePageMetadata({
  keywords: ['茂木光志', 'Koshi Motegi', '自然言語処理', 'NLP', '名古屋大学', '開発経験', '論文'],
});
