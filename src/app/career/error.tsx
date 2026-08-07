'use client';

import { useEffect } from 'react';
import PageError from '@/components/common/PageError';

export default function CareerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Career page error:', error);
  }, [error]);

  return <PageError title="経歴情報を読み込めませんでした" description="一時的な問題により、経歴タイムラインを表示できませんでした。時間をおいて再度お試しください。" reset={reset} containerWidth="4xl" />;
}
