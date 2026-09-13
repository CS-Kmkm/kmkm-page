'use client';

import React, { useId } from 'react';
import { PublicationItemProps } from '@/types';
import { useI18n } from '@/lib/i18n';
import type { BadgeVariant } from '@/lib/constants/categories';
import { Badge } from './Badge';

type PublicationBadge = {
  key: string;
  label: string;
  variant: BadgeVariant;
  icon?: string;
};

const PublicationItem: React.FC<PublicationItemProps> = ({ publication, onClick }) => {
  const { messages } = useI18n();
  const badgesId = useId();
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

  // The filter bar offers peer review as a criterion and the record also carries venue scope,
  // publication type and awards, none of which used to be visible on a result row. The badges
  // below surface exactly those facts so a row explains why it matched.
  const awardCount = publication.awards?.length ?? 0;
  const badges: PublicationBadge[] = [
    publication.isPeerReviewed
      ? { key: 'peer-review', label: messages.peerReviewed, variant: 'green' }
      : { key: 'peer-review', label: messages.notPeerReviewed, variant: 'gray' },
    ...(publication.conferenceScope
      ? [publication.conferenceScope === 'international'
        ? { key: 'scope', label: messages.internationalVenue, variant: 'blue' as const }
        : { key: 'scope', label: messages.domesticVenue, variant: 'purple' as const }]
      : []),
    { key: 'type', label: messages.publicationTypeLabel(publication.publicationType), variant: 'orange' },
    // Award titles are long enough to swamp the row, so only their presence (and count) is shown;
    // the full titles stay in the detail modal.
    ...(awardCount > 0
      ? [{ key: 'award', label: messages.awardBadge(awardCount), variant: 'yellow' as const, icon: '🏆' }]
      : []),
  ];

  return (
    <button
      type="button"
      tabIndex={0}
      onClick={onClick}
      className="block w-full text-left border-l-4 border-gray-200 dark:border-gray-700 pl-3 sm:pl-4 py-2 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 min-h-[44px]"
      aria-label={messages.showPublicationDetails(publication.title)}
      aria-describedby={badgesId}
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

      {/* Filterable facts. The button keeps its title-only accessible name; the badges are the
          accessible description, so they inform without turning the name into noise. */}
      <span
        id={badgesId}
        data-testid="publication-badges"
        className="mt-2 flex flex-wrap items-center gap-1.5"
      >
        {badges.map(badge => (
          <Badge key={badge.key} label={badge.label} variant={badge.variant} icon={badge.icon} />
        ))}
      </span>
    </button>
  );
};

export default PublicationItem;
