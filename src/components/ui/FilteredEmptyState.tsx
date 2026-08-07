'use client';

import type { ReactNode } from 'react';

interface FilteredEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function FilteredEmptyState({
  icon,
  title,
  description,
  hasActiveFilters,
  onClearFilters
}: FilteredEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
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
}
