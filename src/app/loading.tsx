'use client';

import { getMessages } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

// Shared by the Japanese default below and by the English boundary (src/app/en/loading.tsx).
// The message catalogue is a client module, so this UI has to be a client component to read it.
export function LoadingIndicator({ locale }: { locale: Locale }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">{getMessages(locale).loading}</p>
      </div>
    </div>
  );
}

export default function Loading() {
  return <LoadingIndicator locale="ja" />;
}
