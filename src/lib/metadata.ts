import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
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
}: GenerateMetadataProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.personName}` : siteConfig.defaultTitle;
  const siteUrl = siteConfig.siteUrl;
  const fullUrl = siteUrl ? new URL(path || '/', siteUrl).toString() : undefined;

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: siteConfig.personName }],
    creator: siteConfig.personName,
    publisher: siteConfig.personName,
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
      locale: siteConfig.locale,
      title: fullTitle,
      description,
      siteName: siteConfig.siteName,
      ...(fullUrl ? { url: fullUrl } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    alternates: fullUrl
      ? {
          canonical: fullUrl,
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
