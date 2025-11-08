'use client';

import React, { useState, useMemo } from 'react';
import { PublicationListProps, PublicationEntry } from '@/types';
import PublicationItem from './PublicationItem';
import PublicationDetailModal from './PublicationDetailModal';
import PublicationFilters from './PublicationFilters';
import PublicationEmptyState from './PublicationEmptyState';
import { filterPublications } from '@/lib/publications/utils';

const PublicationList: React.FC<PublicationListProps> = ({ publications }) => {
  const [showFirstAuthor, setShowFirstAuthor] = useState(false);
  const [showCoAuthor, setShowCoAuthor] = useState(false);
  const [showPeerReviewed, setShowPeerReviewed] = useState(false);
  const [showNonPeerReviewed, setShowNonPeerReviewed] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<PublicationEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Check if any filter is active
  const hasActiveFilters = showFirstAuthor || showCoAuthor || showPeerReviewed || showNonPeerReviewed;

  // Filter and sort publications
  const filteredPublications = useMemo(() => {
    return filterPublications(publications, {
      showFirstAuthor,
      showCoAuthor,
      showPeerReviewed,
      showNonPeerReviewed
    });
  }, [publications, showFirstAuthor, showCoAuthor, showPeerReviewed, showNonPeerReviewed]);

  const handleClearFilters = () => {
    setShowFirstAuthor(false);
    setShowCoAuthor(false);
    setShowPeerReviewed(false);
    setShowNonPeerReviewed(false);
  };

  const handlePublicationClick = (publication: PublicationEntry) => {
    setSelectedPublication(publication);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPublication(null);
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <PublicationFilters
        showFirstAuthor={showFirstAuthor}
        showCoAuthor={showCoAuthor}
        showPeerReviewed={showPeerReviewed}
        showNonPeerReviewed={showNonPeerReviewed}
        onToggleFirstAuthor={() => setShowFirstAuthor(!showFirstAuthor)}
        onToggleCoAuthor={() => setShowCoAuthor(!showCoAuthor)}
        onTogglePeerReviewed={() => setShowPeerReviewed(!showPeerReviewed)}
        onToggleNonPeerReviewed={() => setShowNonPeerReviewed(!showNonPeerReviewed)}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredPublications.length}
        totalCount={publications.length}
      />

      {/* Publications List */}
      <div className="space-y-4 sm:space-y-6">
        {filteredPublications.length === 0 ? (
          <PublicationEmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        ) : (
          filteredPublications.map((publication, index) => {
            // Check if this is the first publication of a new year
            const showYear = index === 0 || filteredPublications[index - 1].year !== publication.year;
            
            return (
              <div key={publication.id}>
                {showYear && (
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 min-w-[60px] sm:min-w-[80px]">
                      {publication.year}
                    </div>
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                )}
                <div className="ml-0 sm:ml-20 md:ml-24">
                  <PublicationItem
                    publication={publication}
                    onClick={() => handlePublicationClick(publication)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      <PublicationDetailModal
        publication={selectedPublication}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default PublicationList;
