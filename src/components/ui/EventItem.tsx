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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={getListItemContainerClasses()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `View details for ${event.title}` : undefined}
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

      {/* Description */}
      <p className={`${getDescriptionClasses()} mb-2`}>
        {event.description}
      </p>

      {/* Additional info */}
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
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="text-xs">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Related links indicator */}
      {event.relatedLinks && event.relatedLinks.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            🔗 {event.relatedLinks.length} related link{event.relatedLinks.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default EventItem;