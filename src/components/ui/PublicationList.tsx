'use client';

import React, { useState, useMemo } from 'react';
import { PublicationEntry, PublicationListProps } from '@/types';

const PublicationList: React.FC<PublicationListProps> = ({ 
  publications, 
  showFilters = false 
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  // Get unique publication types for filtering
  const publicationTypes = useMemo(() => {
    const types = Array.from(new Set(publications.map(pub => pub.publicationType)));
    return types.sort();
  }, [publications]);

  // Filter publications based on selected type
  const filteredPublications = useMemo(() => {
    if (selectedType === 'all') {
      return publications;
    }
    return publications.filter(pub => pub.publicationType === selectedType);
  }, [publications, selectedType]);

  // Sort publications by year (newest first)
  const sortedPublications = useMemo(() => {
    return [...filteredPublications].sort((a, b) => b.year - a.year);
  }, [filteredPublications]);

  const formatAuthors = (authors: string[], isFirstAuthor: boolean) => {
    if (authors.length === 0) return '';
    
    // Highlight first author if this publication is first-authored
    if (isFirstAuthor && authors.length > 0) {
      const [firstAuthor, ...restAuthors] = authors;
      if (restAuthors.length === 0) {
        return <strong>{firstAuthor}</strong>;
      }
      return (
        <>
          <strong>{firstAuthor}</strong>
          {restAuthors.length > 0 && `, ${restAuthors.join(', ')}`}
        </>
      );
    }
    
    return authors.join(', ');
  };

  const getPublicationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      journal: 'Journal',
      conference: 'Conference',
      workshop: 'Workshop',
      preprint: 'Preprint',
      other: 'Other'
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getPublicationTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      journal: 'bg-blue-100 text-blue-900 border border-blue-200',
      conference: 'bg-green-100 text-green-900 border border-green-200',
      workshop: 'bg-yellow-100 text-yellow-900 border border-yellow-200',
      preprint: 'bg-gray-100 text-gray-900 border border-gray-200',
      other: 'bg-purple-100 text-purple-900 border border-purple-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-900 border border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && publicationTypes.length > 1 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
              selectedType === 'all'
                ? 'bg-gray-900 text-white hover:bg-black'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
            }`}
            aria-pressed={selectedType === 'all'}
          >
            All ({publications.length})
          </button>
          {publicationTypes.map(type => {
            const count = publications.filter(pub => pub.publicationType === type).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                  selectedType === type
                    ? 'bg-gray-900 text-white hover:bg-black'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                }`}
                aria-pressed={selectedType === type}
              >
                {getPublicationTypeLabel(type)} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Publications List */}
      <div className="space-y-4 sm:space-y-6">
        {sortedPublications.length === 0 ? (
          <p className="text-gray-500 text-center py-6 sm:py-8">
            No publications found for the selected filter.
          </p>
        ) : (
          sortedPublications.map((publication) => (
            <article
              key={publication.id}
              className="border-l-4 border-gray-200 pl-3 sm:pl-4 hover:border-gray-400 transition-colors"
            >
              {/* Title */}
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight">
                {publication.title}
              </h3>

              {/* Authors */}
              <p className="text-sm sm:text-base text-gray-700 mb-2">
                {formatAuthors(publication.authors, publication.isFirstAuthor)}
              </p>

              {/* Venue and Year */}
              <p className="text-sm sm:text-base text-gray-600 mb-3">
                <em>{publication.venue}</em>, {publication.year}
              </p>

              {/* Badges and Links */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {/* Publication Type Badge */}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPublicationTypeColor(
                    publication.publicationType
                  )}`}
                >
                  {getPublicationTypeLabel(publication.publicationType)}
                </span>

                {/* First Author Badge */}
                {publication.isFirstAuthor && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    First Author
                  </span>
                )}

                {/* Peer Reviewed Badge */}
                {publication.isPeerReviewed && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Peer Reviewed
                  </span>
                )}

                {/* DOI Link */}
                {publication.doi && (
                  <a
                    href={`https://doi.org/${publication.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                    aria-label={`View publication DOI: ${publication.doi}`}
                  >
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    DOI
                  </a>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      {/* Results count */}
      {showFilters && (
        <p className="text-sm text-gray-500 text-center">
          Showing {sortedPublications.length} of {publications.length} publications
        </p>
      )}
    </div>
  );
};

export default PublicationList;