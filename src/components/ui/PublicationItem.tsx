'use client';

import React from 'react';
import { PublicationItemProps } from '@/types';

const PublicationItem: React.FC<PublicationItemProps> = ({ publication, onClick }) => {
  const formatAuthors = (authors: string[], isFirstAuthor: boolean) => {
    if (authors.length === 0) return '';

    const emphasizedNames = new Set(['茂木光志', '茂木 光志', 'Koshi Motegi']);
    const renderedAuthors = authors.map((author, index) => (
      emphasizedNames.has(author)
        ? <strong key={`${author}-${index}`}>{author}</strong>
        : <React.Fragment key={`${author}-${index}`}>{author}</React.Fragment>
    ));
    
    if (isFirstAuthor && authors.length > 0) {
      if (authors.length === 1) {
        return renderedAuthors[0];
      }
    }

    return renderedAuthors.map((author, index) => (
      <React.Fragment key={index}>
        {index > 0 && ', '}
        {author}
      </React.Fragment>
    ));
  };

  return (
    <button
      type="button"
      tabIndex={0}
      onClick={onClick}
      className="block w-full text-left border-l-4 border-gray-200 dark:border-gray-700 pl-3 sm:pl-4 py-2 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 min-h-[44px]"
      aria-label={`${publication.title}の詳細を表示`}
    >
      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
        {publication.title}
      </h3>

      {/* Authors */}
      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2">
        {formatAuthors(publication.authors, publication.isFirstAuthor)}
      </p>

      {/* Venue */}
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
        <em>{publication.venue}</em>
      </p>
    </button>
  );
};

export default PublicationItem;
