'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/common';
import GitBranchTimeline from '@/components/ui/GitBranchTimeline';
import { getCareerEntries } from '@/data';
import { ExtendedCareerEntry } from '@/types';

export default function CareerPage() {
  const careerEntries = getCareerEntries() as ExtendedCareerEntry[];
  const [isReversed, setIsReversed] = useState(false);

  return (
    <PageLayout
      title="経歴"
      className="max-w-6xl mx-auto"
    >
      {/* Breadcrumb navigation */}
      <nav aria-label="パンくずナビゲーション" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link
              href="/"
              className="hover:text-gray-900 transition-colors"
              aria-label="トップページに戻る"
            >
              トップ
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium" aria-current="page">
            経歴
          </li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-0">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            経歴
          </h1>
          <button
            onClick={() => setIsReversed(!isReversed)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            aria-label="ブランチの順序を反転"
          >
            {isReversed ? "↓" : "↑"} 順序反転
          </button>
        </div>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Gitブランチスタイルで、これまでの所属組織での経験と役職の変遷を視覚的に紹介します。
        </p>
      </div>

      {/* Git Branch Timeline section */}
      <section aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="sr-only">
          経歴タイムライン
        </h2>

        {careerEntries.length > 0 ? (
          <GitBranchTimeline
            entries={careerEntries}
            className="px-2 sm:px-4"
            isReversed={isReversed}
          />
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-base sm:text-lg">
              経歴情報が見つかりませんでした。
            </p>
          </div>
        )}
      </section>
    </PageLayout>
  );
}