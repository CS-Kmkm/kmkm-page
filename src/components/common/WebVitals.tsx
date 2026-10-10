'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import { analyticsUrl } from '@/lib/analytics';

type AnalyticsWindow = Window & { gtag?: (...args: unknown[]) => void };

export default function WebVitals() {
  const pathname = usePathname();
  const previousPage = useRef<{ location: string; referrer: string } | null>(null);

  // Automatic enhanced measurement must also be disabled in the GA property.
  // Otherwise Google's own history/event tracking can send unsanitized URLs.
  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    const gtag = (window as AnalyticsWindow).gtag;
    if (process.env.NODE_ENV !== 'production' || !gaId || !gtag) return;
    const location = analyticsUrl(window.location.href);
    if (previousPage.current?.location === location) return;
    const referrer = previousPage.current?.location ?? analyticsUrl(document.referrer);
    previousPage.current = { location, referrer };
    const context = { page_location: location, page_referrer: referrer, page_title: document.title };
    gtag('config', gaId, { ...context, send_page_view: false, update: true });
    gtag('event', 'page_view', { ...context, send_to: gaId });
  }, [pathname]);

  const reportWebVitals = useCallback<Parameters<typeof useReportWebVitals>[0]>((metric) => {
    if (process.env.NODE_ENV === 'development') console.log('Web Vital:', metric);
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') return;

    const location = analyticsUrl(window.location.href);
    const referrer = previousPage.current?.referrer ?? analyticsUrl(document.referrer);
    const gtag = (window as AnalyticsWindow).gtag;
    if (process.env.NEXT_PUBLIC_GA_ID && gtag) {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
        page_location: location,
        page_referrer: referrer,
        send_to: process.env.NEXT_PUBLIC_GA_ID,
      });
    }

    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        // Same-origin requests would otherwise include query tokens in Referer.
        referrerPolicy: 'no-referrer',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          id: metric.id,
          label: metric.label,
          delta: metric.delta,
          url: location,
          timestamp: Date.now(),
        }),
      }).catch(console.error);
    }
  }, []);
  useReportWebVitals(reportWebVitals);

  return null;
}
