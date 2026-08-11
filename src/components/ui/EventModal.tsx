/**
 * EventModal - Modal for displaying event details
 * Refactored to use the generic Modal component
 */

'use client';

import { useState } from 'react';
import { EventModalProps, TimelineEventEntry } from '@/types';
import { formatEventDate } from '@/lib/career/eventUtils';
import { Modal } from './Modal';
import { getEventCategoryConfig } from '@/lib/constants/categories';
import { getBadgeClasses } from '@/lib/ui/listItemStyles';
import { tokens } from '@/lib/theme/tokens';
import LinkedPublicationTitles from './LinkedPublicationTitles';
import { useI18n } from '@/lib/i18n';

/**
 * EventModal component for displaying detailed event information
 * Now using the generic Modal component
 */
export default function EventModal({
  isOpen,
  onClose,
  event,
  className = ''
}: EventModalProps) {
  const { locale, messages } = useI18n();
  if (!event) return null;

  // Get category configuration
  const categoryConfig = event.category ? getEventCategoryConfig(event.category) : null;
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
      className={className}
    >
      {/* Date */}
      <div className={`text-sm ${tokens.text.muted} font-medium`}>
        {formatEventDate(event.date, locale)}
      </div>

      {/* Category Badge */}
      {categoryConfig && (
        <div className="inline-block">
          <span className={getBadgeClasses(categoryConfig.variant)} aria-label={messages.categoryLabel(categoryLabel)}>
            <span aria-hidden="true">{categoryConfig.icon}</span>
            {categoryLabel}
          </span>
        </div>
      )}

      {/* Description */}
      <div className={`${tokens.text.secondary} leading-relaxed whitespace-pre-line`}>
        <LinkedPublicationTitles text={event.description} links={event.publicationLinks} />
      </div>
    </Modal>
  );
}

/**
 * Hook for managing event modal state
 */
export function useEventModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEventEntry | null>(null);

  const openModal = (event: TimelineEventEntry) => {
    setSelectedEvent(event);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Delay clearing the event to allow exit animation
    setTimeout(() => {
      setSelectedEvent(null);
    }, 300);
  };

  return {
    isOpen,
    selectedEvent,
    openModal,
    closeModal
  };
}
