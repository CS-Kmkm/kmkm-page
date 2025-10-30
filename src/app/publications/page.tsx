import { Metadata } from 'next';
import { PageLayout, PublicationList } from '@/components/common';
import { getPublications } from '@/data';

export const metadata: Metadata = {
  title: 'Publications | Personal Portfolio',
  description: 'Academic publications and research papers including journal articles, conference proceedings, and workshop papers.',
  keywords: ['publications', 'research', 'academic papers', 'journal articles', 'conference proceedings'],
};

export default function PublicationsPage() {
  const publications = getPublications();

  return (
    <PageLayout title="Publications">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Publications</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            Academic publications and research papers, organized chronologically with the most recent work first.
          </p>
        </div>

        {/* Publications List */}
        <div className="bg-white">
          {publications.length > 0 ? (
            <PublicationList publications={publications} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Publications Available
              </h3>
              <p className="text-gray-500">
                Publications will be displayed here once they are added to the system.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}