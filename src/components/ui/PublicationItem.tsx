'use client';

import React from 'react';
import { PublicationItemProps } from '@/types';
import { getPublicationTypeLabel, getPublicationTypeColor } from '@/lib/publications/utils';

const PublicationItem: React.FC<PublicationItemProps> = ({ publication, onClick }) => {
  const formatAuthors = (authors: string[], isFirstAuthor: boolean) => {
    if (authors.length === 0) return '';
    
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="border-l-4 border-gray-200 pl-3 sm:pl-4 py-2 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px]"
      aria-label={`View details for ${publication.title}`}
    >
      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight">
        {publication.title}
      </h3>

      {/* Authors */}
      <p className="text-sm sm:text-base text-gray-700 mb-2">
        {formatAuthors(publication.authors, publication.isFirstAuthor)}
      </p>

      {/* Venue */}
      <p className="text-sm sm:text-base text-gray-600 mb-3">
        <em>{publication.venue}</em>
      </p>

      {/* Badges */}
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
      </div>
    </article>
  );
};

export default PublicationItem;
