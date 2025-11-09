/**
 * Modal Style System
 * 
 * Unified style constants for modal components across the application.
 * Ensures consistent appearance, behavior, and accessibility.
 */

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
 * Unified modal styles
 */
export const modalStyles: ModalStyleConfig = {
  backdrop: {
    base: 'fixed inset-0 z-50 flex items-center justify-center p-4',
    blur: 'backdrop-blur-sm',
    lightMode: 'bg-white/30',
    darkMode: 'dark:bg-black/50',
  },
  container: {
    base: 'relative rounded-lg overflow-y-auto',
    background: 'bg-white dark:bg-gray-800',
    border: '',
    shadow: 'shadow-xl',
    padding: 'p-6',
    maxWidth: 'max-w-2xl w-full',
    maxHeight: 'max-h-[90vh]',
  },
  header: {
    base: 'flex items-start justify-between mb-4',
    title: 'text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight pr-4',
    closeButton: 'flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
  },
  content: {
    base: 'space-y-4',
    text: 'text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap',
  },
  footer: {
    base: 'flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700',
    button: 'px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors',
    buttonPrimary: 'px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors',
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
