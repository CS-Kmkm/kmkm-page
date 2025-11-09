'use client';

import React, { useEffect, useRef } from 'react';
import { EventDetailModalProps, EventCategory } from '@/types';
import {
  getBackdropClassesWithFallback,
  getModalContainerClasses,
  getModalHeaderClasses,
  getModalTitleClasses,
  getCloseButtonClasses,
  getModalContentClasses,
  getModalTextClasses,
  getModalFooterClasses,
  getFooterButtonClasses,
} from '@/lib/ui/modalStyles';

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  event,
  eventIndex,
  filteredEvents,
  onClose,
  onNavigate
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onNavigate && eventIndex > 0) {
        onNavigate(eventIndex - 1);
      } else if (e.key === 'ArrowRight' && onNavigate && eventIndex < filteredEvents.length - 1) {
        onNavigate(eventIndex + 1);
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
  }, [isOpen, onClose, onNavigate, eventIndex, filteredEvents.length]);

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (onNavigate && eventIndex > 0) {
      onNavigate(eventIndex - 1);
    }
  };

  const handleNext = () => {
    if (onNavigate && eventIndex < filteredEvents.length - 1) {
      onNavigate(eventIndex + 1);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div
      className={getBackdropClassesWithFallback()}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      aria-describedby="event-modal-description"
    >
      <div
        ref={modalRef}
        className={getModalContainerClasses()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className={getModalHeaderClasses()}>
            <div className="flex-1">
              <h2
                id="event-modal-title"
                className={getModalTitleClasses()}
              >
                {event.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(
                    event.category
                  )}`}
                >
                  {getCategoryLabel(event.category)}
                </span>
                <time className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {formatDate(event.date)}
                </time>
              </div>
            </div>
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
        </div>

        {/* Content */}
        <div className="p-6">
          <div
            id="event-modal-description"
            className={`${getModalTextClasses()} mb-6`}
          >
            {event.description}
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
            )}

            {event.duration && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{event.duration}</span>
              </div>
            )}

            {event.relatedLinks && event.relatedLinks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">関連リンク</h4>
                <div className="space-y-1">
                  {event.relatedLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
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

            {event.tags && event.tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">タグ</h4>
                <div className="flex flex-wrap gap-1">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Navigation */}
        <div className={`${getModalFooterClasses()} bg-gray-50 dark:bg-gray-900`}>
          <div className="flex items-center gap-2">
            {filteredEvents.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  disabled={eventIndex === 0}
                  className={`${getFooterButtonClasses()} inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="前のイベント"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  前へ
                </button>
                <button
                  onClick={handleNext}
                  disabled={eventIndex === filteredEvents.length - 1}
                  className={`${getFooterButtonClasses()} inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="次のイベント"
                >
                  次へ
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {filteredEvents.length > 1 && `${eventIndex + 1} / ${filteredEvents.length}`}
          </div>
          <button
            onClick={onClose}
            className={getFooterButtonClasses()}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;