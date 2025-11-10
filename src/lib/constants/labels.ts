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
  close: '閉じる',
  cancel: 'キャンセル',
  apply: '適用',
  save: '保存',
  delete: '削除',
  edit: '編集',
  confirm: '確認',
  submit: '送信',
  reset: 'リセット',
  
  // Navigation
  previous: '前へ',
  next: '次へ',
  back: '戻る',
  forward: '進む',
  
  // View modes
  timeline: 'タイムライン',
  list: 'リスト',
  grid: 'グリッド',
  
  // Filters
  filterBy: 'フィルター',
  sortBy: '並び替え',
  showAll: 'すべて表示',
  
  // Status
  loading: '読み込み中...',
  noResults: '結果が見つかりません',
  error: 'エラー',
  success: '成功',
  
  // Links
  viewLiveSite: 'サイトを見る',
  viewOnGitHub: 'GitHubで見る',
  learnMore: '詳細を見る',
  readMore: '続きを読む',
  
  // Sections
  projectDescription: 'プロジェクト概要',
  technologyStack: '技術スタック',
  relatedLinks: '関連リンク',
  tags: 'タグ',
  
  // Time
  duration: '期間',
  date: '日付',
  year: '年',
  
  // Authorship
  allPublications: 'すべての論文',
  firstAuthorOnly: '筆頭著者のみ',
  coAuthorOnly: '共著者のみ',
  
  // Publication types
  publicationType: '論文タイプ',
  journal: 'ジャーナル',
  conference: '国際会議',
  workshop: 'ワークショップ',
  preprint: 'プレプリント',
  other: 'その他',
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
