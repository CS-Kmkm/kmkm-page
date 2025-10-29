'use client';

import React from 'react';

interface PublicationEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const PublicationEmptyState: React.FC<PublicationEmptyStateProps> = ({
  hasActiveFilters,
  onClearFilters
}) => {
  return (
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
          onClick={onClearFilters}
          className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
        >
          すべてのフィルタをクリア
        </button>
      )}
    </div>
  );
};

export default PublicationEmptyState;
