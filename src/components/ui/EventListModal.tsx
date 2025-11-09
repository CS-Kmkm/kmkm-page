/**
 * EventListModal - Modal for displaying a list of events from the same year
 * Refactored to use the generic Modal component
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EventListModalProps, YearEventGroup } from '@/types';
import { formatEventDate } from '@/lib/career/eventUtils';
import { Modal } from './Modal';
import { getEventCategoryConfig } from '@/lib/constants/categories';
import { UI_LABELS, ARIA_LABELS, MESSAGE_LABELS } from '@/lib/constants/labels';
import { COUNT_MESSAGES, INSTRUCTION_MESSAGES } from '@/lib/constants/messages';
import { getBadgeClasses } from '@/lib/ui/listItemStyles';
import { tokens } from '@/lib/theme/tokens';

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
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  // Handle keyboard events for list navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !yearGroup) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev < yearGroup.events.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (yearGroup.events[focusedIndex]) {
            onEventSelect(yearGroup.events[focusedIndex]);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onEventSelect, yearGroup, focusedIndex]);

  // Reset focused index when modal opens
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(0);
    }
  }, [isOpen]);

  // Animation variants for list items
  const listItemVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3
      }
    })
  };

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!yearGroup) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Events in ${yearGroup.year}`}
      description={COUNT_MESSAGES.eventsInYear(yearGroup.events.length, parseInt(yearGroup.year))}
      size="md"
      className={className}
      footer={
        <div className="flex items-center justify-between w-full">
          <p className={`text-xs ${tokens.text.muted}`}>
            {INSTRUCTION_MESSAGES.useArrowKeysAndEnter}
          </p>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium ${tokens.text.secondary} ${tokens.surface.primary} border ${tokens.border.default} ${tokens.radius.md} ${tokens.surface.secondary.replace('bg-', 'hover:bg-')} ${tokens.focus.ringFull} ${tokens.transition.colors}`}
          >
            {UI_LABELS.close}
          </button>
        </div>
      }
    >
      {/* Description */}
      <p className={`text-sm ${tokens.text.secondary} mb-4`}>
        {COUNT_MESSAGES.eventsInYear(yearGroup.events.length, parseInt(yearGroup.year))}. {INSTRUCTION_MESSAGES.clickEventForDetails}
      </p>

      {/* Event List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <ul role="list" className="space-y-2">
          {yearGroup.events.map((event, index) => {
            const categoryConfig = event.category ? getEventCategoryConfig(event.category) : null;
            
            return (
              <motion.li
                key={event.id}
                role="listitem"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={prefersReducedMotion ? {} : listItemVariants}
              >
                <button
                  className={`w-full p-3 text-left border ${tokens.radius.lg} ${tokens.transition.normal} ${tokens.focus.ringFull} ${
                    focusedIndex === index
                      ? `${tokens.surface.primary} ${tokens.border.focus}`
                      : `${tokens.surface.primary} ${tokens.border.default} ${tokens.border.hover.replace('border-', 'hover:border-')}`
                  }`}
                  onClick={() => onEventSelect(event)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  aria-label={`${event.title} - ${ARIA_LABELS.viewEventDetails}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${tokens.text.primary} truncate`}>
                        {event.title}
                      </h3>
                      <p className={`text-sm ${tokens.text.muted} mt-1`}>
                        {formatEventDate(event.date)}
                      </p>
                      {categoryConfig && (
                        <span className={`${getBadgeClasses(categoryConfig.variant)} mt-2`}>
                          <span aria-hidden="true">{categoryConfig.icon}</span>
                          {categoryConfig.label}
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
              </motion.li>
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
