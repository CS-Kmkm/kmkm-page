import type { NextConfig } from "next";

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
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Static export configuration (if needed)
  // output: 'standalone', // Commented out for Vercel deployment
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
};

export default nextConfig;
