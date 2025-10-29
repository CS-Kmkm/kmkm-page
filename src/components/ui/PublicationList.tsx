'use client';

import React, { useState, useMemo } from 'react';
import { PublicationListProps, PublicationEntry } from '@/types';
import PublicationItem from './PublicationItem';
import PublicationDetailModal from './PublicationDetailModal';

const PublicationList: React.FC<PublicationListProps> = ({ publications }) => {
  const [showFirstAuthor, setShowFirstAuthor] = useState(false);
  const [showCoAuthor, setShowCoAuthor] = useState(false);
  const [showPeerReviewed, setShowPeerReviewed] = useState(false);
  const [showNonPeerReviewed, setShowNonPeerReviewed] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<PublicationEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Check if any filter is active in each category
  const hasAuthorshipFilter = showFirstAuthor || showCoAuthor;
  const hasPeerReviewedFilter = showPeerReviewed || showNonPeerReviewed;
  const hasAnyFilter = hasAuthorshipFilter || hasPeerReviewedFilter;

  // Filter and sort publications
  const filteredPublications = useMemo(() => {
    let result = [...publications];
    
    // Apply authorship filter
    // If no authorship filter is selected, show all
    if (hasAuthorshipFilter) {
      result = result.filter(pub => {
        if (showFirstAuthor && pub.isFirstAuthor) return true;
        if (showCoAuthor && !pub.isFirstAuthor) return true;
        return false;
      });
    }
    
    // Apply peer reviewed filter
    // If no peer reviewed filter is selected, show all
    if (hasPeerReviewedFilter) {
      result = result.filter(pub => {
        if (showPeerReviewed && pub.isPeerReviewed) return true;
        if (showNonPeerReviewed && !pub.isPeerReviewed) return true;
        return false;
      });
    }
    
    // Sort by date (descending), then by year, then by ID for stability
    return result.sort((a, b) => {
      // If both have dates, sort by date
      if (a.date && b.date) {
        return b.date.localeCompare(a.date);
      }
      // If only one has a date, prioritize the one with date
      if (a.date) return -1;
      if (b.date) return 1;
      // If neither has a date, sort by year
      if (b.year !== a.year) {
        return b.year - a.year;
      }
      // Finally, sort by ID for stability
      return a.id.localeCompare(b.id);
    });
  }, [publications, showFirstAuthor, showCoAuthor, showPeerReviewed, showNonPeerReviewed, hasAuthorshipFilter, hasPeerReviewedFilter]);

  const handleClearFilters = () => {
    setShowFirstAuthor(false);
    setShowCoAuthor(false);
    setShowPeerReviewed(false);
    setShowNonPeerReviewed(false);
  };

  const handlePublicationClick = (publication: PublicationEntry) => {
    setSelectedPublication(publication);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPublication(null);
  };

  const hasActiveFilters = hasAnyFilter;

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="space-y-3">
        {/* Filter Buttons - Horizontal Layout */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Authorship Filters */}
          <button
            onClick={() => setShowFirstAuthor(!showFirstAuthor)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              showFirstAuthor
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            第一著者
          </button>
          <button
            onClick={() => setShowCoAuthor(!showCoAuthor)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              showCoAuthor
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            共著者
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 mx-1"></div>

          {/* Peer Reviewed Filters */}
          <button
            onClick={() => setShowPeerReviewed(!showPeerReviewed)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              showPeerReviewed
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            査読あり
          </button>
          <button
            onClick={() => setShowNonPeerReviewed(!showNonPeerReviewed)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              showNonPeerReviewed
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            査読なし
          </button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <>
              <div className="h-6 w-px bg-gray-300 mx-1"></div>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                クリア
              </button>
            </>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {filteredPublications.length}件 / {publications.length}件の論文を表示
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-4 sm:space-y-6">
        {filteredPublications.length === 0 ? (
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
              論文が見つかりません
            </h3>
            <p className="text-gray-500 mb-4">
              選択したフィルタに一致する論文がありません。
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                すべてのフィルタをクリア
              </button>
            )}
          </div>
        ) : (
          filteredPublications.map((publication) => (
            <PublicationItem
              key={publication.id}
              publication={publication}
              onClick={() => handlePublicationClick(publication)}
            />
          ))
        )}
      </div>

      {/* Detail Modal */}
      <PublicationDetailModal
        publication={selectedPublication}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default PublicationList;
