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
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Publications</h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            A comprehensive list of my academic publications, including journal articles,
            conference proceedings, workshop papers, and preprints. Publications are organized
            chronologically with the most recent work first.
          </p>
        </div>

        {/* Publications Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {publications.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total Publications</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {publications.filter(pub => pub.isFirstAuthor).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">First Author</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {publications.filter(pub => pub.isPeerReviewed).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Peer Reviewed</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {publications.filter(pub => pub.publicationType === 'journal').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Journal Articles</div>
          </div>
        </div>

        {/* Publications List with Filters */}
        <div className="bg-white">
          {publications.length > 0 ? (
            <PublicationList
              publications={publications}
              showFilters={true}
            />
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

        {/* Additional Information */}
        {publications.length > 0 && (
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              About These Publications
            </h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>First Author:</strong> Publications where I am the primary author and main contributor.
              </p>
              <p>
                <strong>Peer Reviewed:</strong> Publications that have undergone formal peer review process.
              </p>
              <p>
                <strong>DOI Links:</strong> Digital Object Identifiers provide permanent links to published papers.
              </p>
              <p>
                Publications are listed in reverse chronological order. Click on DOI links to access the full papers where available.
              </p>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}