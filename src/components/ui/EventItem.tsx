'use client';

import React from 'react';
import { EventItemProps, EventCategory } from '@/types';

const EventItem: React.FC<EventItemProps> = ({ event, onClick }) => {
  const getCategoryColor = (category: EventCategory): string => {
    switch (category) {
      case EventCategory.AFFILIATION:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case EventCategory.PUBLICATION:
        return 'bg-green-100 text-green-800 border-green-200';
      case EventCategory.EVENT:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case EventCategory.INTERNSHIP:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case EventCategory.AWARD:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case EventCategory.OTHER:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${
        onClick ? 'cursor-pointer hover:border-gray-300' : ''
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
            <span className="text-sm text-gray-500 hidden sm:inline">
              @ {event.location}
            </span>
          )}
        </div>
        <time className="text-sm text-gray-500 font-medium">
          {formatDate(event.date)}
        </time>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 leading-tight">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-2">
        {event.description}
      </p>

      {/* Additional info */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-500">
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
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
              >
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Related links indicator */}
      {event.relatedLinks && event.relatedLinks.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            🔗 {event.relatedLinks.length} related link{event.relatedLinks.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default EventItem;