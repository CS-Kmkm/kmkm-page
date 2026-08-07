'use client';

import type { EventEmptyStateProps } from '@/types';
import FilteredEmptyState from './FilteredEmptyState';

const EventEmptyState = ({
  hasActiveFilters,
  onClearFilters
}: EventEmptyStateProps) => (
  <FilteredEmptyState
    icon={
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
    }
    title={hasActiveFilters ? 'イベントが見つかりません' : 'イベントがありません'}
    description={
      hasActiveFilters
        ? '選択したフィルタに一致するイベントがありません。'
        : 'イベントが登録されていません。'
    }
    hasActiveFilters={hasActiveFilters}
    onClearFilters={onClearFilters}
  />
);

export default EventEmptyState;
