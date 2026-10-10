import { describe, expect, it } from 'vitest';
import { buildSecurityHeaders, validateAnalyticsConfig } from '../securityHeaders';

const production = { development: false, preview: false };
const policy = (options = production) => buildSecurityHeaders(options).find(header => header.key === 'Content-Security-Policy')!.value;

// Check security boundaries rather than a snapshot of every directive.
describe('deployment response policy', () => {
  it('restricts production scripts, framing and active content without eval or broad HTTPS allowances', () => {
    const csp = policy();
    expect(csp).toContain("script-src 'self' 'unsafe-inline';");
    expect(csp).toContain("script-src-attr 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("frame-src 'none'");
    expect(csp).toContain('upgrade-insecure-requests');
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toContain('https:;');
    expect(csp).not.toContain('vercel.live');
  });

  it('allows GA and only the configured custom analytics origin', () => {
    const csp = buildSecurityHeaders({ ...production, gaId: 'G-ABC123', analyticsEndpoint: 'https://metrics.example.com:8443/vitals?site=portfolio' })[0].value;
    expect(csp).toContain('https://www.googletagmanager.com');
    expect(csp).toContain('https://*.google-analytics.com');
    expect(csp).toContain('https://metrics.example.com:8443');
    expect(csp).not.toContain('/vitals');
    expect(csp).not.toContain('?site');
  });

  it('limits toolbar access to preview and eval/websocket development allowances to development', () => {
    const preview = policy({ development: false, preview: true });
    expect(preview).toContain('https://vercel.live');
    expect(preview).toContain('wss://ws-us3.pusher.com');
    expect(preview).not.toContain("'unsafe-eval'");
    const devHeaders = buildSecurityHeaders({ development: true, preview: false });
    expect(devHeaders[0].value).toContain("'unsafe-eval'");
    expect(devHeaders[0].value).toContain('ws: wss:');
    expect(devHeaders[0].value).not.toContain('upgrade-insecure-requests');
    expect(devHeaders.some(header => header.key === 'Strict-Transport-Security')).toBe(false);
  });
});

describe('analytics configuration validation', () => {
  it.each(["G-ABC';alert(1)//", '</script>', 'UA-123', 'G-ABC\n'])('rejects an unsafe GA ID: %s', gaId => {
    expect(() => validateAnalyticsConfig(gaId)).toThrow('NEXT_PUBLIC_GA_ID');
  });

  it.each([
    'http://metrics.example/vitals',
    'javascript:alert(1)',
    '/api/vitals',
    'https://user:password@metrics.example/vitals',
    'https://metrics.example;script-src/vitals',
    'https://metrics.example/vitals\r\nscript-src *',
  ])('rejects an unsafe analytics endpoint: %s', endpoint => {
    expect(() => validateAnalyticsConfig(undefined, endpoint)).toThrow('NEXT_PUBLIC_ANALYTICS_ENDPOINT');
  });

  it('does not copy path/query text into CSP', () => {
    expect(validateAnalyticsConfig(undefined, 'https://metrics.example/vitals;script-src=*?query=anything').analyticsOrigin).toBe('https://metrics.example');
    expect(validateAnalyticsConfig()).toEqual({ gaId: undefined, analyticsOrigin: undefined });
  });
});
