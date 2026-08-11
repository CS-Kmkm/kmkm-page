/**
 * EventDetailModal - Detailed modal for displaying event information with navigation
 * Refactored to use the generic Modal component
 */

'use client';

import React, { useEffect } from 'react';
import { EventDetailModalProps } from '@/types';
import { Modal } from './Modal';
import { getEventCategoryConfig } from '@/lib/constants/categories';
import { getBadgeClasses } from '@/lib/ui/listItemStyles';
import { tokens } from '@/lib/theme/tokens';
import LinkedPublicationTitles from './LinkedPublicationTitles';
import { useI18n } from '@/lib/i18n';

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  event,
  eventIndex,
  filteredEvents,
  onClose,
  onNavigate
}) => {
  const { locale, messages } = useI18n();
  // Handle keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && onNavigate && eventIndex > 0) {
        onNavigate(eventIndex - 1);
      } else if (e.key === 'ArrowRight' && onNavigate && eventIndex < filteredEvents.length - 1) {
        onNavigate(eventIndex + 1);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onNavigate, eventIndex, filteredEvents.length]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen || !event) return null;

  const categoryConfig = getEventCategoryConfig(event.category);
  const categoryLabel = event.category === 'affiliation'
    ? messages.affiliation
    : event.category === 'publication'
      ? messages.publication
      : event.category === 'event'
        ? messages.event
        : event.category === 'internship'
          ? messages.internship
          : event.category === 'award'
            ? messages.award
            : messages.other;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      description={event.description}
      footer={filteredEvents.length > 1 ? (
        <div className="flex items-center justify-between w-full">
          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate && onNavigate(eventIndex - 1)}
              disabled={eventIndex === 0}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium ${tokens.text.secondary} ${tokens.surface.primary} border ${tokens.border.default} ${tokens.radius.md} ${tokens.surface.secondary.replace('bg-', 'hover:bg-')} ${tokens.focus.ringFull} ${tokens.transition.colors} disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={messages.previousEvent}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {messages.previous}
            </button>
            <button
              onClick={() => onNavigate && onNavigate(eventIndex + 1)}
              disabled={eventIndex === filteredEvents.length - 1}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium ${tokens.text.secondary} ${tokens.surface.primary} border ${tokens.border.default} ${tokens.radius.md} ${tokens.surface.secondary.replace('bg-', 'hover:bg-')} ${tokens.focus.ringFull} ${tokens.transition.colors} disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={messages.nextEvent}
            >
              {messages.next}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Page indicator */}
          <div className={`text-xs ${tokens.text.muted}`}>
            {eventIndex + 1} / {filteredEvents.length}
          </div>
        </div>
      ) : undefined}
    >
      {/* Event metadata */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={getBadgeClasses(categoryConfig.variant)} aria-label={messages.categoryLabel(categoryLabel)}>
          <span aria-hidden="true">{categoryConfig.icon}</span>
          {categoryLabel}
        </span>
        <time className={`text-sm ${tokens.text.muted} font-medium`}>
          {formatDate(event.date)}
        </time>
      </div>

      {/* Description */}
      <div className={`${tokens.text.secondary} leading-relaxed mb-6 whitespace-pre-line`}>
        <LinkedPublicationTitles text={event.description} links={event.publicationLinks} />
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        {event.location && (
          <div className={`flex items-center gap-2 text-sm ${tokens.text.secondary}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
        )}

        {event.duration && (
          <div className={`flex items-center gap-2 text-sm ${tokens.text.secondary}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{event.duration}</span>
          </div>
        )}

        {event.relatedLinks && event.relatedLinks.length > 0 && (
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${tokens.text.primary}`}>{messages.relatedLinks}</h4>
            <div className="space-y-1">
              {event.relatedLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>{link}</span>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};

export default EventDetailModal;
