'use client';

import { Fragment } from 'react';
import { useI18n } from '@/lib/i18n';

export interface FilterControlOption<FilterKey extends string> {
  key: FilterKey;
  label: string;
}

export interface FilterControlGroup<FilterKey extends string> {
  id: string;
  label?: string;
  ariaLabel?: string;
  options: readonly FilterControlOption<FilterKey>[];
}

interface FilterControlsProps<FilterKey extends string> {
  groups: readonly FilterControlGroup<FilterKey>[];
  filters: Readonly<Record<FilterKey, boolean>>;
  onToggleFilter: (key: FilterKey) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  resultCount: number;
  totalCount: number;
  resultNoun?: string;
  resultText?: string;
  regionLabel?: string;
}

const filterButtonClass = (isActive: boolean) =>
  `relative min-h-11 min-w-11 border-0 border-b-2 bg-transparent px-0.5 pb-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 sm:px-1 sm:pb-3 sm:text-sm ${
    isActive
      ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-100'
  }`;

export default function FilterControls<FilterKey extends string>({
  groups,
  filters,
  onToggleFilter,
  hasActiveFilters,
  onClearFilters,
  resultCount,
  totalCount,
  resultNoun,
  resultText,
  regionLabel,
}: FilterControlsProps<FilterKey>) {
  const { messages } = useI18n();
  return (
    <div
      className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
      role={regionLabel ? 'region' : undefined}
      aria-label={regionLabel}
    >
      <div className="flex min-w-0 flex-wrap items-end gap-x-3 gap-y-1 sm:gap-x-4">
        {groups.map((group, groupIndex) => (
          <Fragment key={group.id}>
            <div
              role="group"
              aria-label={group.ariaLabel}
              className={`flex items-end gap-2 sm:gap-3 ${
                groupIndex > 0 ? 'sm:border-l sm:border-gray-200 sm:pl-4 dark:sm:border-gray-700' : ''
              }`}
            >
              {group.label && (
                <span className="mb-2 whitespace-nowrap text-xs font-semibold tracking-wide text-gray-400 dark:text-gray-500">
                  {group.label}
                </span>
              )}
              {group.options.map((option) => {
                const isActive = filters[option.key];
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => onToggleFilter(option.key)}
                    className={filterButtonClass(isActive)}
                    aria-pressed={isActive}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </Fragment>
        ))}

        {hasActiveFilters && onClearFilters && (
          <div className="sm:border-l sm:border-gray-200 sm:pl-4 dark:sm:border-gray-700">
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex min-h-11 min-w-11 items-center border-0 bg-transparent px-0.5 pb-2 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 sm:px-1 sm:pb-3 sm:text-sm"
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
          </div>
        )}
      </div>

      <div
        className="whitespace-nowrap text-xs tabular-nums text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        {resultText ?? messages.results(resultCount, totalCount, resultNoun ?? '')}
      </div>
    </div>
  );
}
