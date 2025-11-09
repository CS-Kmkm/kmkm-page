/**
 * Label Constants
 * 
 * Centralized label definitions for UI text and ARIA labels.
 * All labels are in English to prepare for future i18n implementation.
 */

/**
 * ARIA labels for accessibility
 */
export const ARIA_LABELS = {
  // Modal actions
  closeModal: 'Close modal',
  openModal: 'Open modal',
  
  // Navigation
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  previousItem: 'Previous item',
  nextItem: 'Next item',
  previousEvent: 'Previous event',
  nextEvent: 'Next event',
  
  // Theme
  toggleTheme: 'Toggle theme',
  switchToLightMode: 'Switch to light mode',
  switchToDarkMode: 'Switch to dark mode',
  
  // Timeline
  reverseBranchOrder: 'Reverse branch order',
  toggleView: 'Toggle view',
  switchToTimelineView: 'Switch to timeline view',
  switchToListView: 'Switch to list view',
  
  // Events
  viewEventDetails: 'View event details',
  eventTimeline: 'Event timeline',
  eventList: 'Event list',
  
  // Social links
  socialMediaLinks: 'Social media links',
  viewProfile: 'View profile',
  
  // Filters
  openFilters: 'Open filters',
  closeFilters: 'Close filters',
  applyFilters: 'Apply filters',
  resetFilters: 'Reset filters',
  
  // General
  loading: 'Loading',
  search: 'Search',
  close: 'Close',
  open: 'Open',
  select: 'Select',
  
  // Keyboard instructions
  useArrowKeys: 'Use arrow keys to navigate',
  pressEnterToSelect: 'Press Enter to select',
  pressEscapeToClose: 'Press Escape to close',
} as const;

/**
 * UI labels for buttons, headings, and other interface elements
 */
export const UI_LABELS = {
  // Actions
  close: 'Close',
  cancel: 'Cancel',
  apply: 'Apply',
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  confirm: 'Confirm',
  submit: 'Submit',
  reset: 'Reset',
  
  // Navigation
  previous: 'Previous',
  next: 'Next',
  back: 'Back',
  forward: 'Forward',
  
  // View modes
  timeline: 'Timeline',
  list: 'List',
  grid: 'Grid',
  
  // Filters
  filterBy: 'Filter by',
  sortBy: 'Sort by',
  showAll: 'Show all',
  
  // Status
  loading: 'Loading...',
  noResults: 'No results found',
  error: 'Error',
  success: 'Success',
  
  // Links
  viewLiveSite: 'View Live Site',
  viewOnGitHub: 'View on GitHub',
  learnMore: 'Learn more',
  readMore: 'Read more',
  
  // Sections
  projectDescription: 'Project Description',
  technologyStack: 'Technology Stack',
  relatedLinks: 'Related Links',
  tags: 'Tags',
  
  // Time
  duration: 'Duration',
  date: 'Date',
  year: 'Year',
  
  // Authorship
  allPublications: 'All Publications',
  firstAuthorOnly: 'First Author Only',
  coAuthorOnly: 'Co-author Only',
  
  // Publication types
  publicationType: 'Publication Type',
  journal: 'Journal',
  conference: 'Conference',
  workshop: 'Workshop',
  preprint: 'Preprint',
  other: 'Other',
} as const;

/**
 * Heading labels for sections
 */
export const HEADING_LABELS = {
  latestUpdates: '最新の更新情報',
  careerTimeline: '経歴タイムライン',
  publications: '論文',
  projects: 'プロジェクト',
  skills: 'スキル',
  experience: '経験',
  education: '学歴',
  awards: '受賞',
  events: 'イベント',
} as const;

/**
 * Message labels for user feedback
 */
export const MESSAGE_LABELS = {
  // Empty states
  noUpdates: 'No recent updates available.',
  noEvents: 'No events found.',
  noPublications: 'No publications found.',
  noProjects: 'No projects found.',
  
  // Instructions
  clickToViewDetails: 'Click to view details.',
  useArrowKeysToNavigate: 'Use arrow keys to navigate, Enter to select.',
  
  // Counts
  eventsInYear: (count: number, year: number) => `${count} events in ${year}`,
  moreItems: (count: number) => `${count} more items`,
  itemsShowing: (showing: number, total: number) => `Showing ${showing} of ${total}`,
  
  // Pagination
  pageOf: (current: number, total: number) => `${current} / ${total}`,
} as const;

/**
 * Type definitions for label keys
 */
export type AriaLabelKey = keyof typeof ARIA_LABELS;
export type UILabelKey = keyof typeof UI_LABELS;
export type HeadingLabelKey = keyof typeof HEADING_LABELS;

/**
 * Helper function to get ARIA label
 */
export function getAriaLabel(key: AriaLabelKey): string {
  return ARIA_LABELS[key];
}

/**
 * Helper function to get UI label
 */
export function getUILabel(key: UILabelKey): string {
  return UI_LABELS[key];
}

/**
 * Helper function to get heading label
 */
export function getHeadingLabel(key: HeadingLabelKey): string {
  return HEADING_LABELS[key];
}
