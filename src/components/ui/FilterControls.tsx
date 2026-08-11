'use client';

import { Fragment } from 'react';
import { useI18n } from '@/lib/i18n';

export interface FilterControlOption<FilterKey extends string> {
  key: FilterKey;
  label: string;
}

export interface FilterControlGroup<FilterKey extends string> {
  id: string;
  options: readonly FilterControlOption<FilterKey>[];
}

interface FilterControlsProps<FilterKey extends string> {
  groups: readonly FilterControlGroup<FilterKey>[];
  filters: Readonly<Record<FilterKey, boolean>>;
  onToggleFilter: (key: FilterKey) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  resultCount: number;
  totalCount: number;
  resultNoun: string;
}

const filterButtonClass = (isActive: boolean) =>
  `px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 min-h-[44px] ${
    isActive
      ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
  }`;

export default function FilterControls<FilterKey extends string>({
  groups,
  filters,
  onToggleFilter,
  hasActiveFilters,
  onClearFilters,
  resultCount,
  totalCount,
  resultNoun
}: FilterControlsProps<FilterKey>) {
  const { messages } = useI18n();
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {groups.map((group, groupIndex) => (
          <Fragment key={group.id}>
            {groupIndex > 0 && (
              <div
                className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"
                aria-hidden="true"
              ></div>
            )}
            {group.options.map((option) => {
              const isActive = filters[option.key];
              return (
                <button
                  key={option.key}
                  onClick={() => onToggleFilter(option.key)}
                  className={filterButtonClass(isActive)}
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              );
            })}
          </Fragment>
        ))}

        {hasActiveFilters && (
          <>
            <div
              className="hidden sm:block h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"
              aria-hidden="true"
            ></div>
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
              {messages.clear}
            </button>
          </>
        )}
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        {messages.results(resultCount, totalCount, resultNoun)}
      </div>
    </div>
  );
}
