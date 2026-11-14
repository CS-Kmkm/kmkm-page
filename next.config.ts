import type { NextConfig } from "next";
import { buildSecurityHeaders } from './src/lib/securityHeaders';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  async redirects() {
    return [
      { source: '/', destination: '/ja', permanent: true },
      { source: '/career', destination: '/ja/career', permanent: true },
      { source: '/publications', destination: '/ja/publications', permanent: true },
      { source: '/dev-experience', destination: '/ja/dev-experience', permanent: true },
      { source: '/privacy', destination: '/ja/privacy', permanent: true },
      { source: '/terms', destination: '/ja/terms', permanent: true },
      { source: '/events', destination: '/ja/career', permanent: true },
      { source: '/ja/events', destination: '/ja/career', permanent: true },
    ];
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Static export configuration (if needed)
  // output: 'standalone', // Commented out for Vercel deployment
  
  // One source for local production and Vercel response headers.
  async headers() {
    return [{
      source: '/(.*)',
      headers: buildSecurityHeaders({
        development: process.env.NODE_ENV === 'development',
        preview: process.env.VERCEL_ENV === 'preview',
        gaId: process.env.NEXT_PUBLIC_GA_ID,
        analyticsEndpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
      }),
    }];
  },
};

export default nextConfig;
