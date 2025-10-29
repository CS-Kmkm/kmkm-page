'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PublicationDetailModalProps } from '@/types';

const PublicationDetailModal: React.FC<PublicationDetailModalProps> = ({
  publication,
  isOpen,
  onClose
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [imageError, setImageError] = useState(false);

  // Handle Escape key and focus management
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus close button when modal opens
      closeButtonRef.current?.focus();
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset image error state when publication changes
  useEffect(() => {
    setImageError(false);
  }, [publication]);

  if (!isOpen || !publication) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="publication-detail-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-start">
          <h2 id="publication-detail-title" className="text-xl font-semibold text-gray-900 pr-8">
            Publication Details
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Bibliographic Information */}
          <div className="space-y-4">
            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              {publication.title}
            </h3>

            {/* Authors */}
            <p className="text-base text-gray-700">
              {formatAuthors(publication.authors, publication.isFirstAuthor)}
            </p>

            {/* Venue and Year */}
            <p className="text-base text-gray-600">
              <em>{publication.venue}</em>, {publication.year}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Publication Type Badge */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPublicationTypeColor(
                  publication.publicationType
                )}`}
              >
                {getPublicationTypeLabel(publication.publicationType)}
              </span>

              {/* First Author Badge */}
              {publication.isFirstAuthor && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  First Author
                </span>
              )}

              {/* Peer Reviewed Badge */}
              {publication.isPeerReviewed && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  Peer Reviewed
                </span>
              )}
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-3">
              {publication.doi && (
                <a
                  href={`https://doi.org/${publication.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  View DOI
                </a>
              )}
              {publication.url && (
                <a
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  View PDF
                </a>
              )}
            </div>
          </div>

          {/* Abstract Section */}
          {publication.abstract && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Abstract</h4>
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                {publication.abstract}
              </p>
            </div>
          )}

          {/* Image Section */}
          {publication.imageUrl && !imageError && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Figure</h4>
              <img
                src={publication.imageUrl}
                alt={publication.imageAlt || 'Publication figure'}
                onError={() => setImageError(true)}
                className="w-full rounded-lg border border-gray-200"
              />
              {publication.imageAlt && (
                <p className="text-sm text-gray-600 mt-2 italic">{publication.imageAlt}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicationDetailModal;
