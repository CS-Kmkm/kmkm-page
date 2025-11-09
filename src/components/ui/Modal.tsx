/**
 * Generic Modal Component
 * 
 * A reusable modal component with built-in accessibility features,
 * keyboard navigation, focus management, and animations.
 */

'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getBackdropClassesWithFallback,
  getModalContainerClasses,
  getModalHeaderClasses,
  getModalTitleClasses,
  getCloseButtonClasses,
  getModalContentClasses,
} from '@/lib/ui/modalStyles';
import { ARIA_LABELS } from '@/lib/constants/labels';

/**
 * Modal size variants
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Modal props interface
 */
export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Optional description for accessibility */
  description?: string;
  /** Modal content */
  children: ReactNode;
  /** Modal size variant */
  size?: ModalSize;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Optional footer content */
  footer?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Custom aria-labelledby ID */
  ariaLabelledBy?: string;
  /** Custom aria-describedby ID */
  ariaDescribedBy?: string;
}

/**
 * Size to max-width mapping
 */
const sizeMap: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

/**
 * Generic Modal Component
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  footer,
  className = '',
  ariaLabelledBy,
  ariaDescribedBy,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  const titleId = ariaLabelledBy || 'modal-title';
  const descriptionId = ariaDescribedBy || (description ? 'modal-description' : undefined);

  // Handle keyboard events (Escape key)
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
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal container */}
          <motion.div
            ref={modalRef}
            className={`${getModalContainerClasses(sizeMap[size])} mx-4 ${className}`}
            {...animationProps}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
          >
            <div className="p-6">
              {/* Header */}
              <div className={getModalHeaderClasses()}>
                <div className="flex-1">
                  <h2
                    id={titleId}
                    className={getModalTitleClasses()}
                  >
                    {title}
                  </h2>
                  {description && (
                    <p
                      id={descriptionId}
                      className="sr-only"
                    >
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    className={getCloseButtonClasses()}
                    aria-label={ARIA_LABELS.closeModal}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Content */}
              <div className={getModalContentClasses()}>
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="mt-6">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;

/**
 * Modal Header Component
 */
export interface ModalHeaderProps {
  /** Header title */
  title: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Additional content to render in header */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function ModalHeader({ title, subtitle, children, className = '' }: ModalHeaderProps) {
  return (
    <div className={`${getModalHeaderClasses()} ${className}`}>
      <div className="flex-1">
        <h2 className={getModalTitleClasses()}>
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

/**
 * Modal Content Component
 */
export interface ModalContentProps {
  /** Content to render */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function ModalContent({ children, className = '' }: ModalContentProps) {
  return (
    <div className={`${getModalContentClasses()} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Modal Footer Component
 */
export interface ModalFooterProps {
  /** Footer content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div className={`flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}
