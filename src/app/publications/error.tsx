'use client';

import { useEffect } from 'react';
import PageError from '@/components/common/PageError';

export default function PublicationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Publications page error:', error);
  }, [error]);

  return <PageError title="論文一覧を読み込めませんでした" description="一時的な問題により、論文一覧を表示できませんでした。時間をおいて再度お試しください。" reset={reset} containerWidth="4xl" />;
}
