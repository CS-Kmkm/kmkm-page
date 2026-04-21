'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PublicationDetailModalProps } from '@/types';
import { getBackdropClassesWithFallback } from '@/lib/ui/modalStyles';
import {
  getPublicationTypeLabel,
  getPublicationTypeColor,
  shouldShowPublicationTypeBadge
} from '@/lib/publications/utils';

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
      closeButtonRef.current?.focus();
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

  return (
    <div
      className={`${getBackdropClassesWithFallback()} p-0 sm:p-4`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="publication-detail-title"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg shadow-xl w-full h-full sm:max-w-3xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-start z-10">
          <h2 id="publication-detail-title" className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 pr-8">
            論文詳細
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-full p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="モーダルを閉じる"
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
        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Bibliographic Information */}
          <div className="space-y-3 sm:space-y-4">
            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {publication.title}
            </h3>

            {/* Authors */}
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {formatAuthors(publication.authors, publication.isFirstAuthor)}
            </p>

            {/* Venue and Year */}
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              <em>{publication.venue}</em>, {publication.year}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Publication Type Badge */}
              {shouldShowPublicationTypeBadge(publication) && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPublicationTypeColor(
                    publication.publicationType
                  )}`}
                >
                  {getPublicationTypeLabel(publication.publicationType, publication.conferenceScope)}
                </span>
              )}

              {/* First Author Badge */}
              {publication.isFirstAuthor && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  第一著者
                </span>
              )}

              {/* Peer Reviewed Badge */}
              {publication.isPeerReviewed && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  査読あり
                </span>
              )}

              {publication.awards?.map((award, index) => (
                <span
                  key={`${publication.id}-award-badge-${index}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-900"
                >
                  {award.title}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="space-y-3">
              {publication.doi && (
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 break-all">
                  DOI:{' '}
                  <a
                    href={`https://doi.org/${publication.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:underline"
                  >
                    {`https://doi.org/${publication.doi}`}
                  </a>
                </p>
              )}
              {publication.url && (
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 break-all">
                  URL:{' '}
                  <a
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:underline"
                  >
                    {publication.url}
                  </a>
                </p>
              )}
            </div>
          </div>

          {publication.awards && publication.awards.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                受賞
              </h4>
              <ul className="mt-2 sm:mt-3 space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                {publication.awards.map((award, index) => (
                  <li key={`${publication.id}-award-${index}`} className="leading-relaxed">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{award.title}</div>
                    <div>{new Date(award.date).toLocaleDateString('ja-JP')}</div>
                    {award.organization && <div>{award.organization}</div>}
                    {award.description && <div>{award.description}</div>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Abstract Section */}
          {publication.abstract && (
            <details className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
              <summary className="cursor-pointer text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                Abstract（概要）
              </summary>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {publication.abstract}
              </p>
            </details>
          )}

          {/* Memo Section */}
          {publication.memo && (
            <details className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
              <summary className="cursor-pointer text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                メモ・受賞履歴
              </summary>
              {Array.isArray(publication.memo) ? (
                <ul className="mt-2 sm:mt-3 list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  {publication.memo.map((memoItem, index) => (
                    <li key={`${publication.id}-memo-${index}`}>{memoItem}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {publication.memo}
                </p>
              )}
            </details>
          )}

          {/* Image Section */}
          {publication.imageUrl && !imageError && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">図</h4>
              <img
                src={publication.imageUrl}
                alt={publication.imageAlt || '論文の関連図'}
                onError={() => setImageError(true)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
              />
              {publication.imageAlt && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">{publication.imageAlt}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicationDetailModal;
