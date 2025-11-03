'use client';

import React from 'react';

interface ProficiencyFilterProps {
  showHigh: boolean;
  showMedium: boolean;
  showLow: boolean;
  onToggleHigh: () => void;
  onToggleMedium: () => void;
  onToggleLow: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
  totalCount: number;
}

/**
 * ProficiencyFilter component for filtering technologies by proficiency level
 */
const ProficiencyFilter: React.FC<ProficiencyFilterProps> = ({
  showHigh,
  showMedium,
  showLow,
  onToggleHigh,
  onToggleMedium,
  onToggleLow,
  onClearFilters,
  hasActiveFilters,
  resultCount,
  totalCount
}) => {
  const filterButtonClass = (isActive: boolean) =>
    `px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] ${
      isActive
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
    }`;

  return (
    <div className="px-4">
      {/* Filter Buttons - Right aligned */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-end mb-2">
        {/* Proficiency Level Filters */}
        <button
          onClick={onToggleHigh}
          className={filterButtonClass(showHigh)}
          aria-pressed={showHigh}
        >
          高
        </button>
        <button
          onClick={onToggleMedium}
          className={filterButtonClass(showMedium)}
          aria-pressed={showMedium}
        >
          中
        </button>
        <button
          onClick={onToggleLow}
          className={filterButtonClass(showLow)}
          aria-pressed={showLow}
        >
          低
        </button>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <>
            <div className="hidden sm:block h-6 w-px bg-gray-300 mx-1" aria-hidden="true"></div>
            <button
              onClick={onClearFilters}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px]"
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

      {/* Results Count - Right aligned */}
      <div className="text-sm text-gray-600 text-right">
        {resultCount}件 / {totalCount}件の技術を表示
      </div>
    </div>
  );
};

export default ProficiencyFilter;