/**
 * EventModal - Modal for displaying event details
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventModalProps, TimelineEventEntry } from '@/types';
import { formatEventDate } from '@/lib/career/eventUtils';
import {
  getBackdropClassesWithFallback,
  getModalContainerClasses,
  getModalHeaderClasses,
  getModalTitleClasses,
  getCloseButtonClasses,
  getModalContentClasses,
  getModalTextClasses,
  getFooterButtonClasses,
} from '@/lib/ui/modalStyles';

/**
 * EventModal component for displaying detailed event information
 */
export default function EventModal({
  isOpen,
  onClose,
  event,
  className = ''
}: EventModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
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
  }, [isOpen, onClose]);

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

  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={getBackdropClassesWithFallback()}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            className={`${getModalContainerClasses('max-w-md')} mx-4 ${className}`}
            {...animationProps}
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-modal-title"
            aria-describedby="event-modal-description"
          >
            <div className="p-6">
              {/* Header */}
              <div className={getModalHeaderClasses()}>
                <h2
                  id="event-modal-title"
                  className={getModalTitleClasses()}
                >
                  {event.title}
                </h2>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className={getCloseButtonClasses()}
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

              {/* Content */}
              <div className={getModalContentClasses()}>
                {/* Date */}
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {formatEventDate(event.date)}
                </div>

                {/* Category Badge */}
                {event.category && (
                  <div className="inline-block">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                      {event.category}
                    </span>
                  </div>
                )}

                {/* Description */}
                <div
                  id="event-modal-description"
                  className={getModalTextClasses()}
                >
                  {event.description}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className={getFooterButtonClasses()}
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