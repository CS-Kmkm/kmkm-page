import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import WebVitals from '../WebVitals';
import { analyticsUrl } from '@/lib/analytics';

const state = vi.hoisted(() => ({ pathname: '/ja', report: undefined as undefined | ((metric: Record<string, unknown>) => void) }));
vi.mock('next/navigation', () => ({ usePathname: () => state.pathname }));
vi.mock('next/web-vitals', () => ({ useReportWebVitals: (report: typeof state.report) => {
  // Model Next.js replaying buffered metrics when a new callback is registered.
  if (state.report !== report) {
    state.report = report;
    report?.({ name: 'FCP', value: 123, id: 'buffered-metric', delta: 123 });
  }
} }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  state.pathname = '/ja';
  state.report = undefined;
  delete (window as Window & { gtag?: unknown }).gtag;
});

describe('analytics URL privacy', () => {
  it('keeps the Web Vitals callback stable and avoids buffered metric replay on navigation', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_GA_ID', 'G-TEST123');
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENDPOINT', 'https://metrics.example.test/vitals');
    const gtag = vi.fn();
    window.gtag = gtag;
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchSpy);
    window.history.replaceState({}, '', '/ja?token=first#fragment');
    const { rerender } = render(<WebVitals />);
    const initialReport = state.report;
    state.pathname = '/en';
    window.history.replaceState({}, '', '/en?token=next#fragment');
    rerender(<WebVitals />);
    expect(state.report).toBe(initialReport);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(gtag.mock.calls.filter(([command, name]) => command === 'event' && name === 'FCP')).toHaveLength(1);
    // A later real metric reads the updated ref instead of capturing the first page.
    state.report!({ name: 'LCP', value: 456, id: 'later-metric', delta: 456 });
    expect(gtag).toHaveBeenLastCalledWith('event', 'LCP', expect.objectContaining({
      page_location: `${window.location.origin}/en`, page_referrer: `${window.location.origin}/ja`,
    }));
  });

  it.each([
    ['https://site.example/ja?token=secret#fragment', 'https://site.example/ja'],
    ['', ''], ['invalid', ''], ['javascript:alert(1)', ''],
  ])('sanitizes %s', (input, expected) => {
    expect(analyticsUrl(input)).toBe(expected);
  });

  it('omits query tokens from manually sent GA locations/referrers across navigation', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_GA_ID', 'G-TEST123');
    const gtag = vi.fn();
    window.gtag = gtag;
    window.history.replaceState({}, '', '/ja?token=current#fragment');
    const referrerSpy = vi.spyOn(document, 'referrer', 'get').mockReturnValue('https://site.example/en?token=previous#fragment');
    const { rerender } = render(<WebVitals />);
    expect(gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
      page_location: analyticsUrl(window.location.href), page_referrer: 'https://site.example/en',
    }));
    state.pathname = '/en';
    window.history.replaceState({}, '', '/en?token=next#fragment');
    rerender(<WebVitals />);
    expect(gtag).toHaveBeenLastCalledWith('event', 'page_view', expect.objectContaining({
      page_location: analyticsUrl(window.location.href), page_referrer: `${window.location.origin}/ja`,
    }));
    expect(JSON.stringify(gtag.mock.calls)).not.toContain('token=');
    expect(JSON.stringify(gtag.mock.calls)).not.toContain('#fragment');
    referrerSpy.mockRestore();
  });

  it('does not send a Referer header with custom analytics POSTs', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_GA_ID', '');
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENDPOINT', 'https://site.example/vitals');
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchSpy);
    window.history.replaceState({}, '', '/ja?token=secret#fragment');
    render(<WebVitals />);
    expect(fetchSpy).toHaveBeenCalledWith('https://site.example/vitals', expect.objectContaining({ referrerPolicy: 'no-referrer' }));
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body).url).toBe(`${window.location.origin}/ja`);
  });
});
