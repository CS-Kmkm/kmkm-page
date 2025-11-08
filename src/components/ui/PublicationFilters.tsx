'use client';

import React from 'react';

interface PublicationFiltersProps {
  showFirstAuthor: boolean;
  showCoAuthor: boolean;
  showPeerReviewed: boolean;
  showNonPeerReviewed: boolean;
  onToggleFirstAuthor: () => void;
  onToggleCoAuthor: () => void;
  onTogglePeerReviewed: () => void;
  onToggleNonPeerReviewed: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
  totalCount: number;
}

const PublicationFilters: React.FC<PublicationFiltersProps> = ({
  showFirstAuthor,
  showCoAuthor,
  showPeerReviewed,
  showNonPeerReviewed,
  onToggleFirstAuthor,
  onToggleCoAuthor,
  onTogglePeerReviewed,
  onToggleNonPeerReviewed,
  onClearFilters,
  hasActiveFilters,
  resultCount,
  totalCount
}) => {
  const filterButtonClass = (isActive: boolean) =>
    `px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 min-h-[44px] ${
      isActive
        ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
    }`;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Authorship Filters */}
        <button
          onClick={onToggleFirstAuthor}
          className={filterButtonClass(showFirstAuthor)}
          aria-pressed={showFirstAuthor}
        >
          第一著者
        </button>
        <button
          onClick={onToggleCoAuthor}
          className={filterButtonClass(showCoAuthor)}
          aria-pressed={showCoAuthor}
        >
          共著者
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" aria-hidden="true"></div>

        {/* Peer Reviewed Filters */}
        <button
          onClick={onTogglePeerReviewed}
          className={filterButtonClass(showPeerReviewed)}
          aria-pressed={showPeerReviewed}
        >
          査読あり
        </button>
        <button
          onClick={onToggleNonPeerReviewed}
          className={filterButtonClass(showNonPeerReviewed)}
          aria-pressed={showNonPeerReviewed}
        >
          査読なし
        </button>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <>
            <div className="hidden sm:block h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" aria-hidden="true"></div>
            <button
              onClick={onClearFilters}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 min-h-[44px]"
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
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {resultCount}件 / {totalCount}件の論文を表示
      </div>
    </div>
  );
};

export default PublicationFilters;
