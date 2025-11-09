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
import { UI_LABELS } from '@/lib/constants/labels';
import { getBadgeClasses } from '@/lib/ui/listItemStyles';
import { tokens } from '@/lib/theme/tokens';

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
  if (!event) return null;

  // Get category configuration
  const categoryConfig = event.category ? getEventCategoryConfig(event.category) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      description={event.description}
      size="sm"
      className={className}
      footer={
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium ${tokens.text.secondary} ${tokens.surface.primary} border ${tokens.border.default} ${tokens.radius.md} ${tokens.surface.secondary.replace('bg-', 'hover:bg-')} ${tokens.focus.ringFull} ${tokens.transition.colors}`}
          >
            {UI_LABELS.close}
          </button>
        </div>
      }
    >
      {/* Date */}
      <div className={`text-sm ${tokens.text.muted} font-medium`}>
        {formatEventDate(event.date)}
      </div>

      {/* Category Badge */}
      {categoryConfig && (
        <div className="inline-block">
          <span className={getBadgeClasses(categoryConfig.variant)} aria-label={categoryConfig.ariaLabel}>
            <span aria-hidden="true">{categoryConfig.icon}</span>
            {categoryConfig.label}
          </span>
        </div>
      )}

      {/* Description */}
      <div className={`${tokens.text.secondary} leading-relaxed`}>
        {event.description}
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