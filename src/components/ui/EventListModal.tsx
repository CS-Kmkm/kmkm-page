/**
 * EventListModal - Modal for displaying a list of events from the same year
 * Refactored to use the generic Modal component
 */

'use client';

import { useState } from 'react';
import { EventListModalProps, YearEventGroup } from '@/types';
import { formatEventDate } from '@/lib/career/eventUtils';
import { Modal } from './Modal';
import { getEventCategoryConfig } from '@/lib/constants/categories';
import { getBadgeClasses } from '@/lib/ui/listItemStyles';
import { tokens } from '@/lib/theme/tokens';
import { useI18n } from '@/lib/i18n';

/**
 * EventListModal component for displaying multiple events from the same year
 */
export default function EventListModal({
  isOpen,
  onClose,
  yearGroup,
  onEventSelect,
  className = ''
}: EventListModalProps) {
  const { locale, messages } = useI18n();
  if (!yearGroup) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={messages.eventYear(yearGroup.year)}
      className={className}
    >
      {/* Event List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <ul role="list" className="space-y-2" onKeyDown={event => {
          if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
          const buttons = Array.from(event.currentTarget.querySelectorAll('button'));
          const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
          if (index < 0) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : event.key === 'ArrowDown' ? Math.min(index + 1, buttons.length - 1) : Math.max(index - 1, 0);
          buttons[next]?.focus();
        }}>
          {yearGroup.events.map((event) => {
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
              <li key={event.id} className="animate-slide-in-right">
                <button
                  className={`w-full min-h-11 p-3 text-left border ${tokens.radius.lg} ${tokens.transition.colors} ${tokens.focus.ringFull} ${tokens.surface.primary} ${tokens.border.default}`}
                  onClick={() => onEventSelect(event)}

                  aria-label={`${event.title} - ${locale === 'en' ? messages.viewDetails : 'View event details'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${tokens.text.primary} truncate`}>
                        {event.title}
                      </h3>
                      <p className={`text-sm ${tokens.text.muted} mt-1`}>
                        {formatEventDate(event.date, locale)}
                      </p>
                      {categoryConfig && (
                        <span className={`${getBadgeClasses(categoryConfig.variant)} mt-2`}>
                          <span aria-hidden="true">{categoryConfig.icon}</span>
                          {categoryLabel}
                        </span>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <svg
                        className={`w-5 h-5 ${tokens.text.muted}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}

/**
 * Hook for managing event list modal state
 */
export function useEventListModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYearGroup, setSelectedYearGroup] = useState<YearEventGroup | null>(null);

  const openModal = (yearGroup: YearEventGroup) => {
    setSelectedYearGroup(yearGroup);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Delay clearing the year group to allow exit animation
    setTimeout(() => {
      setSelectedYearGroup(null);
    }, 300);
  };

  return {
    isOpen,
    selectedYearGroup,
    openModal,
    closeModal
  };
}
