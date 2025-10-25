'use client';

import { useReportWebVitals } from 'next/web-vitals';

export default function WebVitals() {
  useReportWebVitals((metric) => {
    // Log web vitals in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', metric);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Google Analytics 4
      if (process.env.NEXT_PUBLIC_GA_ID && 'gtag' in window) {
        (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }

      // Custom analytics endpoint (optional)
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            id: metric.id,
            label: metric.label,
            delta: metric.delta,
            url: window.location.href,
            timestamp: Date.now(),
          }),
        }).catch(console.error);
      }
    }
  });

  return null;
}