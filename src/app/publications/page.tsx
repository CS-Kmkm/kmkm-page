import { PageLayout, PublicationList } from '@/components/common';
import { getPublications } from '@/data';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: '論文・発表',
  path: '/publications',
  description: '投稿した論文・発表一覧です。著者区分や査読の有無で絞り込みながら閲覧できます。',
  keywords: ['論文', '発表', '研究', '国際会議', 'ジャーナル'],
});

export default function PublicationsPage() {
  const publications = getPublications();

  return (
    <PageLayout title="論文・発表">
      <div className="w-[90%] max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4">
            論文・発表
          </h1>
        </div>

        {/* Publications List */}
        <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
          {publications.length > 0 ? (
            <PublicationList publications={publications} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                公開中の論文はありません
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                追加した論文・発表はここに表示されます。
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
