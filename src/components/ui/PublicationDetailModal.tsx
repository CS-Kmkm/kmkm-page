'use client';

import React, { useState } from 'react';
import { PublicationDetailModalProps } from '@/types';
import { Modal } from './Modal';

const PublicationDetailModal: React.FC<PublicationDetailModalProps> = ({
  publication,
  isOpen,
  onClose
}) => {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  if (!isOpen || !publication) return null;

  const imageError = failedImageUrl === publication.imageUrl;

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="論文詳細"
      description={publication.title}
      closeButtonLabel="モーダルを閉じる"
    >
      <div className="space-y-4 sm:space-y-6">
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
              <em>{publication.venue}</em>
              {!publication.venue.includes(String(publication.year)) && `, ${publication.year}`}
            </p>

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
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {award.url ? (
                        <a
                          href={award.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline focus:outline-none focus:underline dark:text-blue-400"
                        >
                          {award.title}
                        </a>
                      ) : award.title}
                    </div>
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
              {/* eslint-disable-next-line @next/next/no-img-element -- publication images may be arbitrary external assets */}
              <img
                src={publication.imageUrl}
                alt={publication.imageAlt || '論文の関連図'}
                onError={() => setFailedImageUrl(publication.imageUrl ?? null)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
              />
              {publication.imageAlt && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">{publication.imageAlt}</p>
              )}
            </div>
          )}
      </div>
    </Modal>
  );
};

export default PublicationDetailModal;
