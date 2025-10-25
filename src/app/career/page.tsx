import Link from 'next/link';
import { PageLayout, Timeline } from '@/components/common';
import { getCareerEntries } from '@/data';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: '経歴',
  description: '所属の変化や経歴を時系列で表示します。',
  path: '/career'
});

export default function CareerPage() {
  const careerEntries = getCareerEntries();

  return (
    <PageLayout
      title="経歴"
      className="max-w-4xl mx-auto"
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
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          経歴
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          これまでの所属組織での経験と役職の変遷を時系列で紹介します。
        </p>
      </div>

      {/* Timeline section */}
      <section aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="sr-only">
          経歴タイムライン
        </h2>
        
        {careerEntries.length > 0 ? (
          <Timeline 
            entries={careerEntries}
            className="px-2 sm:px-4 md:px-8"
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