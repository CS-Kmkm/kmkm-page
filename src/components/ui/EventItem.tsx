'use client';

import React from 'react';
import { EventItemProps, EventCategory } from '@/types';
import {
  getListItemContainerClasses,
  getBadgeClasses,
  getTitleClasses,
  getDescriptionClasses,
  getMetaClasses,
} from '@/lib/ui/listItemStyles';
import LinkedPublicationTitles from './LinkedPublicationTitles';

const EventItem: React.FC<EventItemProps> = ({ event, onClick }) => {
  const getCategoryVariant = (category: EventCategory): 'blue' | 'green' | 'purple' | 'orange' | 'yellow' | 'gray' => {
    switch (category) {
      case EventCategory.AFFILIATION:
        return 'blue';
      case EventCategory.PUBLICATION:
        return 'green';
      case EventCategory.EVENT:
        return 'purple';
      case EventCategory.INTERNSHIP:
        return 'orange';
      case EventCategory.AWARD:
        return 'yellow';
      case EventCategory.OTHER:
      default:
        return 'gray';
    }
  };

  const getCategoryLabel = (category: EventCategory): string => {
    switch (category) {
      case EventCategory.AFFILIATION:
        return '所属';
      case EventCategory.PUBLICATION:
        return '論文';
      case EventCategory.EVENT:
        return 'イベント';
      case EventCategory.INTERNSHIP:
        return 'インターン';
      case EventCategory.AWARD:
        return '受賞';
      case EventCategory.OTHER:
        return 'その他';
      default:
        return 'その他';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={getListItemContainerClasses()}
      onClick={onClick ? handleClick : undefined}
    >
      <button
        type="button"
        className="block w-full rounded-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        onClick={(clickEvent) => {
          clickEvent.stopPropagation();
          handleClick();
        }}
        aria-label={onClick ? `View details for ${event.title}` : undefined}
        disabled={!onClick}
      >
        {/* Header with category and date */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className={getBadgeClasses(getCategoryVariant(event.category))}>
              {getCategoryLabel(event.category)}
            </span>
            {event.location && (
              <span className={`${getMetaClasses()} hidden sm:inline`}>
                @ {event.location}
              </span>
            )}
          </div>
          <time className={`${getMetaClasses()} font-medium`}>
            {formatDate(event.date)}
          </time>
        </div>

        {/* Title */}
        <h3 className={`${getTitleClasses()} mb-1.5`}>
          {event.title}
        </h3>
      </button>

      {/* Description */}
      <p className={`${getDescriptionClasses()} mb-2 whitespace-pre-line`}>
        <LinkedPublicationTitles text={event.description} links={event.publicationLinks} />
      </p>

      {/* Additional info */}
      {(event.location || event.duration) && (
        <div className={`flex flex-col sm:flex-row gap-2 sm:gap-4 ${getMetaClasses()}`}>
          {event.location && (
            <span className="sm:hidden">
              📍 {event.location}
            </span>
          )}
          {event.duration && (
            <span>
              ⏱️ {event.duration}
            </span>
          )}
        </div>
      )}

      {event.relatedLinks && event.relatedLinks.length > 0 && (
        <div
          className="mt-2 space-y-1 border-t border-gray-100 pt-2 dark:border-gray-700"
          aria-label="関連リンク"
        >
          {event.relatedLinks.map((link, index) => (
            <a
              key={`${link}-${index}`}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block break-all text-xs text-blue-600 hover:underline focus:outline-none focus:underline dark:text-blue-400"
              onClick={(clickEvent) => clickEvent.stopPropagation()}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventItem;
