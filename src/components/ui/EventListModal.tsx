/**
 * EventListModal - Modal for displaying a list of events from the same year
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventListModalProps, TimelineEventEntry, YearEventGroup } from '@/types';
import { formatEventDate } from '@/lib/career/eventUtils';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !yearGroup) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
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
      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onEventSelect, yearGroup, focusedIndex]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Reset focused index when modal opens
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(0);
    }
  }, [isOpen]);

  // Animation variants
  const overlayVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0
    }
  };

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

  const animationProps = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: "hidden",
        animate: "visible",
        exit: "hidden",
        variants: modalVariants
      };

  if (!yearGroup) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            className={`relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden ${className}`}
            {...animationProps}
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-list-modal-title"
            aria-describedby="event-list-modal-description"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2
                  id="event-list-modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {yearGroup.year}年のイベント
                </h2>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="モーダルを閉じる"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Description */}
              <p
                id="event-list-modal-description"
                className="text-sm text-gray-600 mb-4"
              >
                {yearGroup.events.length}件のイベントがあります。詳細を見るにはイベントをクリックしてください。
              </p>

              {/* Event List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <ul role="list" className="space-y-2">
                  {yearGroup.events.map((event, index) => (
                    <motion.li
                      key={event.id}
                      role="listitem"
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={prefersReducedMotion ? {} : listItemVariants}
                    >
                      <button
                        className={`w-full p-3 text-left border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          focusedIndex === index
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                        onClick={() => onEventSelect(event)}
                        onMouseEnter={() => setFocusedIndex(index)}
                        aria-label={`${event.title}の詳細を表示`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatEventDate(event.date)}
                            </p>
                            {event.category && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                                {event.category}
                              </span>
                            )}
                          </div>
                          <div className="flex-shrink-0 ml-3">
                            <svg
                              className="w-5 h-5 text-gray-400"
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
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  矢印キーで移動、Enterで選択
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  閉じる
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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