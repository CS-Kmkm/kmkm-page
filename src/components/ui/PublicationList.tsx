'use client';

import { useMemo, useState } from 'react';
import type { PublicationEntry, PublicationListProps } from '@/types';
import { useBooleanFilters } from '@/hooks/useBooleanFilters';
import { filterPublications } from '@/lib/publications/utils';
import PageHeading from '@/components/layout/PageHeading';
import PublicationDetailModal from './PublicationDetailModal';
import PublicationEmptyState from './PublicationEmptyState';
import PublicationFilters, { PUBLICATION_FILTER_KEYS } from './PublicationFilters';
import PublicationItem from './PublicationItem';
import YearGroupedList from './YearGroupedList';
import { useI18n } from '@/lib/i18n';

const PublicationList = ({ publications }: PublicationListProps) => {
  const { messages } = useI18n();
  const {
    filters,
    hasActiveFilters,
    toggleFilter,
    clearFilters
  } = useBooleanFilters(PUBLICATION_FILTER_KEYS);
  const [selectedPublication, setSelectedPublication] =
    useState<PublicationEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredPublications = useMemo(
    () => filterPublications(publications, filters),
    [publications, filters]
  );

  const handlePublicationClick = (publication: PublicationEntry) => {
    setSelectedPublication(publication);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPublication(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeading>{messages.publications}</PageHeading>
        <PublicationFilters
          filters={filters}
          onToggleFilter={toggleFilter}
          resultCount={filteredPublications.length}
          totalCount={publications.length}
        />
      </div>

      <div className="space-y-4 sm:space-y-6">
        {filteredPublications.length === 0 ? (
          <PublicationEmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          <YearGroupedList
            items={filteredPublications}
            getKey={publication => publication.id}
            getYear={publication => publication.year}
            renderItem={publication => (
              <PublicationItem
                publication={publication}
                onClick={() => handlePublicationClick(publication)}
              />
            )}
          />
        )}
      </div>

      <PublicationDetailModal
        publication={selectedPublication}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default PublicationList;
