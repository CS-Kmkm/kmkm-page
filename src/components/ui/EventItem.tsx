'use client';

import React from 'react';
import { EventItemProps, EventCategory } from '@/types';

const EventItem: React.FC<EventItemProps> = ({ event, onClick }) => {
  const getCategoryColor = (category: EventCategory): string => {
    switch (category) {
      case EventCategory.AFFILIATION:
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case EventCategory.PUBLICATION:
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case EventCategory.EVENT:
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case EventCategory.INTERNSHIP:
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case EventCategory.AWARD:
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case EventCategory.OTHER:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
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
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${
        onClick ? 'cursor-pointer hover:border-gray-300 dark:hover:border-gray-600' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `View details for ${event.title}` : undefined}
    >
      {/* Header with category and date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(
              event.category
            )}`}
          >
            {getCategoryLabel(event.category)}
          </span>
          {event.location && (
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
              @ {event.location}
            </span>
          )}
        </div>
        <time className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {formatDate(event.date)}
        </time>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1.5 leading-tight">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-2">
        {event.description}
      </p>

      {/* Additional info */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
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
              <span className="text-xs text-gray-500 dark:text-gray-400">
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