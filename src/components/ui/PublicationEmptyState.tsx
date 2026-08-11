'use client';

import FilteredEmptyState from './FilteredEmptyState';
import { useI18n } from '@/lib/i18n';

interface PublicationEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const PublicationEmptyState = ({
  hasActiveFilters,
  onClearFilters
}: PublicationEmptyStateProps) => {
  const { messages } = useI18n();
  return (
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    }
    title={messages.noPublications}
    description={messages.noMatchingPublications}
    hasActiveFilters={hasActiveFilters}
    onClearFilters={onClearFilters}
  />
  );
};

export default PublicationEmptyState;
