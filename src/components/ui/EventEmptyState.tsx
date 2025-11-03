'use client';

import React from 'react';
import { EventEmptyStateProps } from '@/types';

const EventEmptyState: React.FC<EventEmptyStateProps> = ({
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
            d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M3 7h18M5 7h14l-1 14H6L5 7z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasActiveFilters ? 'イベントが見つかりません' : 'イベントがありません'}
      </h3>
      <p className="text-gray-500 mb-4">
        {hasActiveFilters 
          ? '選択したフィルタに一致するイベントがありません。'
          : 'イベントが登録されていません。'
        }
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

export default EventEmptyState;