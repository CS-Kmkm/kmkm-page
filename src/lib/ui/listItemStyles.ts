/**
 * List Item Style System
 * 
 * Unified style constants for list item components across the application.
 * Ensures consistent appearance, behavior, and accessibility.
 * Uses Design Tokens for consistent theming.
 */

import { tokens, getBadgeTokens } from '../theme/tokens';
import type { BadgeVariant } from '../constants/categories';

/**
 * List item style configuration interface
 */
export interface ListItemStyleConfig {
  container: {
    base: string;
    background: string;
    border: string;
    shadow: string;
    padding: string;
    hover: string;
    focus: string;
    transition: string;
  };
  badge: {
    base: string;
    variants: Record<string, string>;
  };
  text: {
    title: string;
    description: string;
    meta: string;
  };
}

/**
 * Unified list item styles using Design Tokens
 */
export const listItemStyles: ListItemStyleConfig = {
  container: {
    base: `${tokens.radius.lg} cursor-pointer`,
    background: tokens.surface.primary,
    border: `border ${tokens.border.default}`,
    shadow: tokens.shadow.sm,
    padding: 'p-3 sm:p-4',
    hover: 'hover:bg-gray-300 dark:hover:bg-gray-600',
    focus: tokens.focus.ringFull,
    transition: tokens.transition.normal,
  },
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
    variants: {
      blue: `${tokens.badge.blue.bg} ${tokens.badge.blue.text} ${tokens.badge.blue.border}`,
      green: `${tokens.badge.green.bg} ${tokens.badge.green.text} ${tokens.badge.green.border}`,
      purple: `${tokens.badge.purple.bg} ${tokens.badge.purple.text} ${tokens.badge.purple.border}`,
      orange: `${tokens.badge.orange.bg} ${tokens.badge.orange.text} ${tokens.badge.orange.border}`,
      yellow: `${tokens.badge.yellow.bg} ${tokens.badge.yellow.text} ${tokens.badge.yellow.border}`,
      gray: `${tokens.badge.gray.bg} ${tokens.badge.gray.text} ${tokens.badge.gray.border}`,
    },
  },
  text: {
    title: `text-base sm:text-lg font-semibold ${tokens.text.primary} leading-tight`,
    description: `text-sm ${tokens.text.secondary} leading-relaxed`,
    meta: `text-sm ${tokens.text.muted}`,
  },
};

/**
 * Get complete list item container class string
 */
export const getListItemContainerClasses = (): string => {
  return `${listItemStyles.container.base} ${listItemStyles.container.background} ${listItemStyles.container.border} ${listItemStyles.container.shadow} ${listItemStyles.container.padding} ${listItemStyles.container.hover} ${listItemStyles.container.focus} ${listItemStyles.container.transition}`;
};

/**
 * Get badge classes with variant using Design Tokens
 */
export const getBadgeClasses = (variant: BadgeVariant = 'gray'): string => {
  const badgeTokens = getBadgeTokens(variant);
  return `${listItemStyles.badge.base} ${badgeTokens.bg} ${badgeTokens.text} ${badgeTokens.border}`;
};

/**
 * Get title classes
 */
export const getTitleClasses = (): string => {
  return listItemStyles.text.title;
};

/**
 * Get description classes
 */
export const getDescriptionClasses = (): string => {
  return listItemStyles.text.description;
};

/**
 * Get meta text classes
 */
export const getMetaClasses = (): string => {
  return listItemStyles.text.meta;
};

/**
 * Button-specific list item styles (for clickable items)
 */
export const buttonListItemStyles = {
  base: 'w-full text-left',
  active: 'active:scale-[0.98]',
};

/**
 * Get complete button list item class string
 */
export const getButtonListItemClasses = (): string => {
  return `${buttonListItemStyles.base} ${getListItemContainerClasses()} ${buttonListItemStyles.active}`;
};

/**
 * Technology badge styles (for tech stacks, frameworks, etc.) using Design Tokens
 */
export const techBadgeStyles = {
  base: `inline-block px-2 py-1 text-xs ${tokens.radius.md} font-medium`,
  primary: `${tokens.badge.blue.bg} ${tokens.badge.blue.text}`,
  secondary: `${tokens.badge.gray.bg} ${tokens.badge.gray.text}`,
};

/**
 * Get tech badge classes using Design Tokens
 */
export const getTechBadgeClasses = (isPrimary: boolean = true): string => {
  return `${techBadgeStyles.base} ${isPrimary ? techBadgeStyles.primary : techBadgeStyles.secondary}`;
};

/**
 * Grid item styles (for grid layouts like RelatedFrameworks) using Design Tokens
 */
export const gridItemStyles = {
  container: `flex items-center gap-3 p-3 ${tokens.radius.lg} border ${tokens.transition.fast} min-h-[44px]`,
  background: tokens.surface.primary,
  border: tokens.border.default,
  hover: 'hover:bg-gray-300 dark:hover:bg-gray-600',
  focus: tokens.focus.ringFull,
};

/**
 * Get grid item classes using Design Tokens
 */
export const getGridItemClasses = (): string => {
  return `${gridItemStyles.container} ${gridItemStyles.background} ${gridItemStyles.border} ${gridItemStyles.hover} ${gridItemStyles.focus}`;
};

/**
 * Ensure minimum touch target size (44x44px for accessibility)
 */
export const minTouchTargetSize = 'min-h-[44px]';

/**
 * Common icon styles using Design Tokens
 */
export const iconStyles = {
  small: 'w-4 h-4',
  medium: 'w-5 h-5',
  large: 'w-6 h-6',
  color: tokens.text.muted,
};

/**
 * Get icon classes using Design Tokens
 */
export const getIconClasses = (size: 'small' | 'medium' | 'large' = 'medium'): string => {
  return `${iconStyles[size]} ${iconStyles.color}`;
};
