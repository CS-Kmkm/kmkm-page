'use client';

import { useId, useLayoutEffect, useRef, type ReactNode, type PointerEvent } from 'react';
import {
  getModalContainerClasses, getModalHeaderClasses, getModalTitleClasses,
  getCloseButtonClasses, getModalContentClasses,
} from '@/lib/ui/modalStyles';
import { useI18n } from '@/lib/i18n';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  closeButtonLabel?: string;
  footer?: ReactNode;
  className?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

export function Modal({
  isOpen, onClose, title, description, children, showCloseButton = true,
  closeButtonLabel, footer, className = '', ariaLabelledBy, ariaDescribedBy,
}: ModalProps) {
  const { locale, messages } = useI18n();
  const modalRef = useRef<HTMLDialogElement>(null);
  const pressedOutside = useRef(false);
  const dismissAnimation = useRef<Animation | null>(null);
  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  const instanceId = useId();
  const titleId = ariaLabelledBy || `${instanceId}-title`;
  const descriptionId = ariaDescribedBy || (description ? `${instanceId}-description` : undefined);
  const resolvedCloseButtonLabel = closeButtonLabel ?? (locale === 'en' ? messages.closeModal : 'Close modal');

  // Native modal behavior owns containment, background inertness, Escape and focus return.
  // Keep this independent of onClose: callers may recreate that callback on every render.
  useLayoutEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;
    if (!isOpen) { if (dialog.open) dialog.close(); return; }
    dialog.removeAttribute('data-closing');
    // React autoFocus runs before showModal and would replace the native return target.
    dialog.querySelector('[data-modal-autofocus]')?.setAttribute('autofocus', '');
    dialog.showModal();
    return () => {
      // An unmount or controlled close must never deliver a stale close callback.
      dismissAnimation.current?.cancel();
      dismissAnimation.current = null;
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  const outside = (event: PointerEvent<HTMLDialogElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };

  // Close while the element is connected, before the controlled parent removes it.
  // Removing first prevents the browser from restoring focus to the invoker.
  const dismiss = () => {
    const dialog = modalRef.current;
    if (!dialog?.open || dismissAnimation.current) return;
    const finish = () => {
      dialog.close();
      // Clear WAAPI's forwards fill before a retained dialog can reopen.
      dismissAnimation.current?.cancel();
      dismissAnimation.current = null;
      dialog.removeAttribute('data-closing');
      onCloseRef.current();
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !dialog.animate) {
      finish();
      return;
    }
    // Keep the dialog in the top layer until its exit finishes, so the background
    // stays inert and native focus restoration still runs before parent removal.
    dialog.setAttribute('data-closing', '');
    const current = getComputedStyle(dialog);
    const animation = dialog.animate([
      { opacity: current.opacity, transform: current.transform },
      { opacity: 0, transform: 'translateY(8px) scale(0.98)' },
    ], { duration: 140, easing: 'ease-in', fill: 'forwards' });
    dismissAnimation.current = animation;
    void animation.finished.then(() => {
      if (dismissAnimation.current !== animation) return;
      finish();
    }, () => { /* Cleanup cancels an interrupted exit. */ });
  };

  return (
    <dialog
      ref={modalRef}
      className={`site-modal m-auto border-0 p-0 ${getModalContainerClasses()} ${className}`}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={event => { event.preventDefault(); event.stopPropagation(); dismiss(); }}
      onPointerDown={event => { pressedOutside.current = outside(event); }}
      onPointerUp={event => {
        if (pressedOutside.current && outside(event)) dismiss();
        pressedOutside.current = false;
      }}
    >
      <div className="p-4 sm:p-6">
        <div className={getModalHeaderClasses()}>
          <div className="flex-1 min-w-0">
            <h2 id={titleId} className={getModalTitleClasses()} tabIndex={showCloseButton ? undefined : -1} data-modal-autofocus={!showCloseButton || undefined}>{title}</h2>
            {description && <p id={descriptionId} className="sr-only">{description}</p>}
          </div>
          {showCloseButton && (
            <button type="button" data-modal-autofocus onClick={dismiss} className={getCloseButtonClasses()} aria-label={resolvedCloseButtonLabel}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className={getModalContentClasses()}>{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </dialog>
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
