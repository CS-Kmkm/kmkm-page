'use client';

import { useEffect } from 'react';
import PageError from '@/components/common/PageError';

export default function DevExperienceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dev experience page error:', error);
  }, [error]);

  return <PageError title="開発経験を読み込めませんでした" description="一時的な問題により、技術スタックやプロジェクト情報を表示できませんでした。時間をおいて再度お試しください。" reset={reset} containerWidth="6xl" />;
}
