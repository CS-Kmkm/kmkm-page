/**
 * Modal Style System
 * 
 * Unified style constants for modal components across the application.
 * Ensures consistent appearance, behavior, and accessibility.
 * Uses Design Tokens for consistent theming.
 */

import { tokens } from '../theme/tokens';

/**
 * Modal style configuration interface
 */
export interface ModalStyleConfig {
  backdrop: {
    base: string;
    blur: string;
    lightMode: string;
    darkMode: string;
  };
  container: {
    base: string;
    background: string;
    border: string;
    shadow: string;
    padding: string;
    maxWidth: string;
    maxHeight: string;
  };
  header: {
    base: string;
    title: string;
    closeButton: string;
  };
  content: {
    base: string;
    text: string;
  };
  footer: {
    base: string;
    button: string;
    buttonPrimary: string;
  };
}

/**
 * Unified modal styles using Design Tokens
 */
export const modalStyles: ModalStyleConfig = {
  backdrop: {
    base: 'fixed inset-0 z-50 flex items-center justify-center p-4',
    blur: 'backdrop-blur-sm',
    lightMode: 'bg-white/30',
    darkMode: 'dark:bg-black/50',
  },
  container: {
    base: `relative ${tokens.radius.lg} overflow-y-auto`,
    background: tokens.surface.primary,
    border: '',
    shadow: tokens.shadow.xl,
    padding: 'p-6',
    maxWidth: 'max-w-2xl w-full',
    maxHeight: 'max-h-[90vh]',
  },
  header: {
    base: 'flex items-start justify-between mb-4',
    title: `text-xl sm:text-2xl font-bold ${tokens.text.primary} leading-tight pr-4`,
    closeButton: `flex-shrink-0 ${tokens.text.muted} hover:${tokens.text.secondary.replace('text-', '')} ${tokens.transition.colors} p-2 ${tokens.radius.md} ${tokens.surface.secondary.replace('bg-', 'hover:bg-')} ${tokens.focus.ring} focus:ring-offset-2 dark:focus:ring-offset-gray-800`,
  },
  content: {
    base: 'space-y-4',
    text: `${tokens.text.secondary} leading-relaxed whitespace-pre-wrap`,
  },
  footer: {
    base: `flex items-center justify-between mt-6 pt-6 border-t ${tokens.border.default}`,
    button: `px-4 py-2 text-sm font-medium ${tokens.text.secondary} ${tokens.surface.primary} border ${tokens.border.default} ${tokens.radius.md} ${tokens.surface.secondary.replace('bg-', 'hover:bg-')} ${tokens.focus.ringFull} ${tokens.transition.colors}`,
    buttonPrimary: `px-4 py-2 text-sm font-medium ${tokens.interactive.primaryText} ${tokens.interactive.primary} border border-transparent ${tokens.radius.md} ${tokens.interactive.primaryHover} ${tokens.focus.ringFull} ${tokens.transition.colors}`,
  },
};

/**
 * Get complete backdrop class string
 */
export const getBackdropClasses = (): string => {
  return `${modalStyles.backdrop.base} ${modalStyles.backdrop.blur} ${modalStyles.backdrop.lightMode} ${modalStyles.backdrop.darkMode}`;
};

/**
 * Get complete modal container class string
 */
export const getModalContainerClasses = (customMaxWidth?: string): string => {
  const maxWidth = customMaxWidth || modalStyles.container.maxWidth;
  return `${modalStyles.container.base} ${modalStyles.container.background} ${modalStyles.container.shadow} ${maxWidth} ${modalStyles.container.maxHeight}`;
};

/**
 * Get modal header classes
 */
export const getModalHeaderClasses = (): string => {
  return modalStyles.header.base;
};

/**
 * Get modal title classes
 */
export const getModalTitleClasses = (): string => {
  return modalStyles.header.title;
};

/**
 * Get close button classes
 */
export const getCloseButtonClasses = (): string => {
  return modalStyles.header.closeButton;
};

/**
 * Get modal content classes
 */
export const getModalContentClasses = (): string => {
  return modalStyles.content.base;
};

/**
 * Get modal text classes
 */
export const getModalTextClasses = (): string => {
  return modalStyles.content.text;
};

/**
 * Get modal footer classes
 */
export const getModalFooterClasses = (): string => {
  return modalStyles.footer.base;
};

/**
 * Get footer button classes
 */
export const getFooterButtonClasses = (isPrimary: boolean = false): string => {
  return isPrimary ? modalStyles.footer.buttonPrimary : modalStyles.footer.button;
};

/**
 * Check if backdrop-filter is supported
 */
export const supportsBackdropFilter = (): boolean => {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') {
    return false;
  }
  return CSS.supports('backdrop-filter', 'blur(4px)') || CSS.supports('-webkit-backdrop-filter', 'blur(4px)');
};

/**
 * Get backdrop classes with fallback for unsupported browsers
 */
export const getBackdropClassesWithFallback = (): string => {
  const baseClasses = `${modalStyles.backdrop.base} ${modalStyles.backdrop.lightMode} ${modalStyles.backdrop.darkMode}`;
  
  if (supportsBackdropFilter()) {
    return `${baseClasses} ${modalStyles.backdrop.blur}`;
  }
  
  // Fallback: use darker background without blur
  return `${baseClasses} bg-black/60 dark:bg-black/70`;
};
