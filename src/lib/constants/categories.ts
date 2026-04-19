/**
 * Category Constants
 * 
 * Centralized category definitions for events, updates, and other categorized content.
 * All category identifiers and labels are in English.
 */

/**
 * Event category enumeration
 */
export enum EventCategory {
  AFFILIATION = 'affiliation',
  PUBLICATION = 'publication',
  EVENT = 'event',
  INTERNSHIP = 'internship',
  AWARD = 'award',
  OTHER = 'other',
}

/**
 * Update category enumeration
 */
export enum UpdateCategory {
  CAREER = 'career',
  DEVELOPMENT = 'development',
  PUBLICATION = 'publication',
  OTHER = 'other',
}

/**
 * Badge color variants
 */
export type BadgeVariant = 'blue' | 'green' | 'purple' | 'orange' | 'yellow' | 'gray';

/**
 * Category configuration interface
 */
export interface CategoryConfig {
  label: string;
  variant: BadgeVariant;
  icon: string;
  ariaLabel: string;
}

/**
 * Event category configuration mapping
 */
export const EVENT_CATEGORY_CONFIG: Record<EventCategory, CategoryConfig> = {
  [EventCategory.AFFILIATION]: {
    label: '所属',
    variant: 'blue',
    icon: '🏢',
    ariaLabel: 'カテゴリ: 所属',
  },
  [EventCategory.PUBLICATION]: {
    label: '論文',
    variant: 'green',
    icon: '📄',
    ariaLabel: 'カテゴリ: 論文',
  },
  [EventCategory.EVENT]: {
    label: 'イベント',
    variant: 'purple',
    icon: '📅',
    ariaLabel: 'カテゴリ: イベント',
  },
  [EventCategory.INTERNSHIP]: {
    label: 'インターン',
    variant: 'orange',
    icon: '💼',
    ariaLabel: 'カテゴリ: インターン',
  },
  [EventCategory.AWARD]: {
    label: '受賞',
    variant: 'yellow',
    icon: '🏆',
    ariaLabel: 'カテゴリ: 受賞',
  },
  [EventCategory.OTHER]: {
    label: 'その他',
    variant: 'gray',
    icon: '📝',
    ariaLabel: 'カテゴリ: その他',
  },
} as const;

/**
 * Update category configuration mapping
 */
export const UPDATE_CATEGORY_CONFIG: Record<UpdateCategory, CategoryConfig> = {
  [UpdateCategory.CAREER]: {
    label: '経歴',
    variant: 'blue',
    icon: '👔',
    ariaLabel: 'カテゴリ: 経歴',
  },
  [UpdateCategory.DEVELOPMENT]: {
    label: '開発',
    variant: 'green',
    icon: '💻',
    ariaLabel: 'カテゴリ: 開発',
  },
  [UpdateCategory.PUBLICATION]: {
    label: '論文',
    variant: 'purple',
    icon: '📄',
    ariaLabel: 'カテゴリ: 論文',
  },
  [UpdateCategory.OTHER]: {
    label: 'その他',
    variant: 'gray',
    icon: '📝',
    ariaLabel: 'カテゴリ: その他',
  },
} as const;

/**
 * Publication type labels
 */
export const PUBLICATION_TYPE_LABELS: Record<string, string> = {
  journal: 'ジャーナル',
  conference: '国際会議',
  workshop: 'ワークショップ',
  preprint: 'プレプリント',
  other: 'その他',
} as const;

/**
 * Authorship type labels
 */
export const AUTHORSHIP_TYPE_LABELS = {
  all: 'すべての論文',
  'first-author': '第一著者のみ',
  'co-author': '共著のみ',
} as const;

/**
 * Helper function to get event category configuration
 */
export function getEventCategoryConfig(category: EventCategory | string): CategoryConfig {
  const categoryKey = category as EventCategory;
  return EVENT_CATEGORY_CONFIG[categoryKey] || EVENT_CATEGORY_CONFIG[EventCategory.OTHER];
}

/**
 * Helper function to get update category configuration
 */
export function getUpdateCategoryConfig(category: UpdateCategory | string): CategoryConfig {
  const categoryKey = category as UpdateCategory;
  return UPDATE_CATEGORY_CONFIG[categoryKey] || UPDATE_CATEGORY_CONFIG[UpdateCategory.OTHER];
}

/**
 * Helper function to get publication type label
 */
export function getPublicationTypeLabel(type: string): string {
  return PUBLICATION_TYPE_LABELS[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Helper function to get authorship type label
 */
export function getAuthorshipTypeLabel(type: string): string {
  return AUTHORSHIP_TYPE_LABELS[type as keyof typeof AUTHORSHIP_TYPE_LABELS] || type;
}

/**
 * Helper function to check if a string is a valid event category
 */
export function isValidEventCategory(category: string): category is EventCategory {
  return Object.values(EventCategory).includes(category as EventCategory);
}

/**
 * Helper function to check if a string is a valid update category
 */
export function isValidUpdateCategory(category: string): category is UpdateCategory {
  return Object.values(UpdateCategory).includes(category as UpdateCategory);
}
