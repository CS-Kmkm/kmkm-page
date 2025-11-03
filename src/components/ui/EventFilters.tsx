'use client';

import React from 'react';
import { EventFiltersProps } from '@/types';

const EventFilters: React.FC<EventFiltersProps> = ({
  showAffiliation,
  showPublication,
  showEvent,
  showInternship,
  showAward,
  showOther,
  onToggleAffiliation,
  onTogglePublication,
  onToggleEvent,
  onToggleInternship,
  onToggleAward,
  onToggleOther,
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
    <div className="space-y-3 sm:space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Category Filters */}
        <button
          onClick={onToggleAffiliation}
          className={filterButtonClass(showAffiliation)}
          aria-pressed={showAffiliation}
        >
          所属
        </button>
        <button
          onClick={onTogglePublication}
          className={filterButtonClass(showPublication)}
          aria-pressed={showPublication}
        >
          論文
        </button>
        <button
          onClick={onToggleEvent}
          className={filterButtonClass(showEvent)}
          aria-pressed={showEvent}
        >
          イベント
        </button>
        <button
          onClick={onToggleInternship}
          className={filterButtonClass(showInternship)}
          aria-pressed={showInternship}
        >
          インターン
        </button>
        <button
          onClick={onToggleAward}
          className={filterButtonClass(showAward)}
          aria-pressed={showAward}
        >
          受賞
        </button>
        <button
          onClick={onToggleOther}
          className={filterButtonClass(showOther)}
          aria-pressed={showOther}
        >
          その他
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

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {resultCount}件 / {totalCount}件のイベントを表示
      </div>
    </div>
  );
};

export default EventFilters;