/** Build-time analytics validation also prevents injection into scripts and CSP headers. */
export function validateAnalyticsConfig(gaId?: string, endpoint?: string) {
  if (gaId && (!/^G-[A-Z0-9]+$/.test(gaId) || gaId.trim() !== gaId)) {
    throw new Error('NEXT_PUBLIC_GA_ID must be a GA4 measurement ID (G-...).');
  }

  let analyticsOrigin: string | undefined;
  if (endpoint) {
    let url: URL;
    try {
      url = new URL(endpoint);
    } catch {
      throw new Error('NEXT_PUBLIC_ANALYTICS_ENDPOINT must be an absolute HTTPS URL.');
    }
    if (url.protocol !== 'https:' || url.username || url.password || !/^https:\/\/(?:[a-z0-9.-]+|\[[a-f0-9:]+\])(?::\d+)?$/i.test(url.origin) || /[\s<>"']/.test(endpoint)) {
      throw new Error('NEXT_PUBLIC_ANALYTICS_ENDPOINT must be an HTTPS URL without credentials or unsafe characters.');
    }
    analyticsOrigin = url.origin;
  }
  return { gaId, analyticsOrigin };
}

export function buildSecurityHeaders(options: {
  development: boolean;
  preview: boolean;
  gaId?: string;
  analyticsEndpoint?: string;
}) {
  const { gaId, analyticsOrigin } = validateAnalyticsConfig(options.gaId, options.analyticsEndpoint);
  // Next.js static hydration needs inline scripts. This baseline restricts origins,
  // framing and plugins; it does not provide nonce-based inline XSS protection.
  const scripts = ["'self'", "'unsafe-inline'"];
  const styles = ["'self'", "'unsafe-inline'"];
  const connections = ["'self'"];
  const images = ["'self'", 'data:', 'blob:'];
  const fonts = ["'self'"];
  const frames: string[] = [];
  if (options.development) {
    scripts.push("'unsafe-eval'");
    connections.push('ws:', 'wss:');
  }
  if (gaId) {
    scripts.push('https://www.googletagmanager.com');
    connections.push('https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com');
    images.push('https://*.google-analytics.com', 'https://*.googletagmanager.com');
  }
  if (analyticsOrigin) connections.push(analyticsOrigin);
  // These are the documented Vercel Toolbar origins, allowed only on Preview.
  if (options.preview) {
    scripts.push('https://vercel.live');
    styles.push('https://vercel.live');
    connections.push('https://vercel.live', 'wss://ws-us3.pusher.com');
    images.push('https://vercel.live', 'https://vercel.com');
    fonts.push('https://vercel.live', 'https://assets.vercel.com');
    frames.push('https://vercel.live');
  }
  const policy = [
    "default-src 'self'",
    `script-src ${scripts.join(' ')}`,
    "script-src-attr 'none'",
    `style-src ${styles.join(' ')}`,
    `img-src ${images.join(' ')}`,
    `font-src ${fonts.join(' ')}`,
    `connect-src ${connections.join(' ')}`,
    `frame-src ${frames.length ? frames.join(' ') : "'none'"}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(!options.development ? ['upgrade-insecure-requests'] : []),
  ].join('; ');
  return [
    { key: 'Content-Security-Policy', value: policy },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ...(!options.development ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }] : []),
  ];
}
