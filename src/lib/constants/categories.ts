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
    label: 'Affiliation',
    variant: 'blue',
    icon: '🏢',
    ariaLabel: 'Category: Affiliation',
  },
  [EventCategory.PUBLICATION]: {
    label: 'Publication',
    variant: 'green',
    icon: '📄',
    ariaLabel: 'Category: Publication',
  },
  [EventCategory.EVENT]: {
    label: 'Event',
    variant: 'purple',
    icon: '📅',
    ariaLabel: 'Category: Event',
  },
  [EventCategory.INTERNSHIP]: {
    label: 'Internship',
    variant: 'orange',
    icon: '💼',
    ariaLabel: 'Category: Internship',
  },
  [EventCategory.AWARD]: {
    label: 'Award',
    variant: 'yellow',
    icon: '🏆',
    ariaLabel: 'Category: Award',
  },
  [EventCategory.OTHER]: {
    label: 'Other',
    variant: 'gray',
    icon: '📝',
    ariaLabel: 'Category: Other',
  },
} as const;

/**
 * Update category configuration mapping
 */
export const UPDATE_CATEGORY_CONFIG: Record<UpdateCategory, CategoryConfig> = {
  [UpdateCategory.CAREER]: {
    label: 'Career',
    variant: 'blue',
    icon: '👔',
    ariaLabel: 'Category: Career',
  },
  [UpdateCategory.DEVELOPMENT]: {
    label: 'Development',
    variant: 'green',
    icon: '💻',
    ariaLabel: 'Category: Development',
  },
  [UpdateCategory.PUBLICATION]: {
    label: 'Publication',
    variant: 'purple',
    icon: '📄',
    ariaLabel: 'Category: Publication',
  },
  [UpdateCategory.OTHER]: {
    label: 'Other',
    variant: 'gray',
    icon: '📝',
    ariaLabel: 'Category: Other',
  },
} as const;

/**
 * Publication type labels
 */
export const PUBLICATION_TYPE_LABELS: Record<string, string> = {
  journal: 'Journal',
  conference: 'Conference',
  workshop: 'Workshop',
  preprint: 'Preprint',
  other: 'Other',
} as const;

/**
 * Authorship type labels
 */
export const AUTHORSHIP_TYPE_LABELS = {
  all: 'All Publications',
  'first-author': 'First Author Only',
  'co-author': 'Co-author Only',
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
