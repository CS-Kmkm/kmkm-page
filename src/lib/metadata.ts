import type { Metadata } from 'next';

interface GenerateMetadataProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}

/**
 * Generate metadata for pages in the App Router
 * This provides SEO meta tags support that was previously handled in PageLayout
 */
export function generatePageMetadata({
  title,
  description = 'Personal portfolio showcasing career, development experience, and publications.',
  path = '',
  image = '/og-image.png',
}: GenerateMetadataProps): Metadata {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Personal Portfolio';
  const fullTitle = title === 'Home' ? siteName : `${title} | ${siteName}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.vercel.app';
  const fullUrl = `${siteUrl}${path}`;

  return {
    title: fullTitle,
    description,
    authors: [{ name: 'Personal Portfolio' }],
    creator: 'Personal Portfolio',
    publisher: 'Personal Portfolio',
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
      locale: 'en_US',
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: fullUrl,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    other: {
      'theme-color': '#ffffff',
      'color-scheme': 'light',
    },
  };
}

/**
 * Default metadata for the site
 */
export const defaultMetadata: Metadata = generatePageMetadata({
  title: 'Home',
  description: 'Personal portfolio showcasing career, development experience, and publications.',
});