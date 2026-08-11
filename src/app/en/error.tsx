'use client';

import { useEffect } from 'react';
import PageError from '@/components/common/PageError';
import { LocaleProvider } from '@/lib/i18n';

export default function EnglishError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('English page error:', error);
  }, [error]);

  return (
    <LocaleProvider locale="en">
      <div lang="en">
        <PageError
          title="This page could not be loaded"
          description="A temporary problem prevented this content from loading. Please try again later."
          reset={reset}
          containerWidth="6xl"
        />
      </div>
    </LocaleProvider>
  );
}
