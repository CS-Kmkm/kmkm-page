/**
 * Message Constants
 * 
 * Centralized message definitions for user-facing text, instructions, and feedback.
 * All messages are in English to prepare for future i18n implementation.
 */

/**
 * Empty state messages
 */
export const EMPTY_STATE_MESSAGES = {
  noUpdates: 'No recent updates available.',
  noEvents: 'No events found.',
  noPublications: 'No publications found.',
  noProjects: 'No projects found.',
  noResults: 'No results found.',
  noData: 'No data available.',
} as const;

/**
 * Instruction messages
 */
export const INSTRUCTION_MESSAGES = {
  clickToViewDetails: 'クリックして詳細を表示。',
  clickEventForDetails: 'イベントをクリックして詳細を表示。',
  useArrowKeysToNavigate: '矢印キーで移動、Enterキーで選択。',
  useArrowKeysAndEnter: '矢印キーで移動、Enterキーで選択。',
  pressEscapeToClose: 'Escapeキーで閉じる。',
  selectFilters: 'フィルターを選択して結果を絞り込む。',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  filterApplied: 'Filters applied successfully.',
  settingsSaved: 'Settings saved successfully.',
  changesSaved: 'Changes saved successfully.',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  loadingFailed: 'Failed to load data. Please try again.',
  savingFailed: 'Failed to save changes. Please try again.',
  invalidInput: 'Invalid input. Please check your data.',
  networkError: 'Network error. Please check your connection.',
  unknownError: 'An unknown error occurred.',
} as const;

/**
 * Loading messages
 */
export const LOADING_MESSAGES = {
  loading: 'Loading...',
  loadingData: 'Loading data...',
  loadingContent: 'Loading content...',
  pleaseWait: 'Please wait...',
} as const;

/**
 * Count and pagination messages
 */
export const COUNT_MESSAGES = {
  /**
   * Format: "5 events in 2024"
   */
  eventsInYear: (count: number, year: number): string => {
    return `${count} ${count === 1 ? 'event' : 'events'} in ${year}`;
  },
  
  /**
   * Format: "3 more items"
   */
  moreItems: (count: number): string => {
    return `${count} more ${count === 1 ? 'item' : 'items'}`;
  },
  
  /**
   * Format: "Showing 10 of 50"
   */
  itemsShowing: (showing: number, total: number): string => {
    return `Showing ${showing} of ${total}`;
  },
  
  /**
   * Format: "5 / 20"
   */
  pageOf: (current: number, total: number): string => {
    return `${current} / ${total}`;
  },
  
  /**
   * Format: "5 results"
   */
  resultsCount: (count: number): string => {
    return `${count} ${count === 1 ? 'result' : 'results'}`;
  },
} as const;

/**
 * Modal-specific messages
 */
export const MODAL_MESSAGES = {
  confirmClose: 'Are you sure you want to close? Unsaved changes will be lost.',
  confirmDelete: 'Are you sure you want to delete this item?',
  confirmReset: 'Are you sure you want to reset all filters?',
} as const;

/**
 * Filter-specific messages
 */
export const FILTER_MESSAGES = {
  filterPublications: 'Filter Publications',
  filterEvents: 'Filter Events',
  noFiltersApplied: 'No filters applied',
  clearAllFilters: 'Clear all filters',
  authorship: 'Authorship',
  publicationType: 'Publication Type',
} as const;

/**
 * Date and time messages
 */
export const DATE_MESSAGES = {
  present: 'Present',
  ongoing: 'Ongoing',
  to: 'to',
  from: 'from',
  duration: 'Duration',
  date: 'Date',
} as const;

/**
 * Navigation messages
 */
export const NAVIGATION_MESSAGES = {
  goToHomepage: 'Go to homepage',
  goToCareer: 'Go to career page',
  goToPublications: 'Go to publications page',
  goToProjects: 'Go to projects page',
  backToTop: 'Back to top',
} as const;

/**
 * Helper function to get empty state message
 */
export function getEmptyStateMessage(key: keyof typeof EMPTY_STATE_MESSAGES): string {
  return EMPTY_STATE_MESSAGES[key];
}

/**
 * Helper function to get instruction message
 */
export function getInstructionMessage(key: keyof typeof INSTRUCTION_MESSAGES): string {
  return INSTRUCTION_MESSAGES[key];
}

/**
 * Helper function to get error message
 */
export function getErrorMessage(key: keyof typeof ERROR_MESSAGES): string {
  return ERROR_MESSAGES[key];
}

/**
 * Helper function to get loading message
 */
export function getLoadingMessage(key: keyof typeof LOADING_MESSAGES): string {
  return LOADING_MESSAGES[key];
}
