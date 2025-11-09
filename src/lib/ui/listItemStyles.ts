/**
 * List Item Style System
 * 
 * Unified style constants for list item components across the application.
 * Ensures consistent appearance, behavior, and accessibility.
 */

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
 * Unified list item styles
 */
export const listItemStyles: ListItemStyleConfig = {
  container: {
    base: 'rounded-lg cursor-pointer',
    background: 'bg-white dark:bg-gray-800',
    border: 'border border-gray-200 dark:border-gray-700',
    shadow: 'shadow-sm',
    padding: 'p-3 sm:p-4',
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
    transition: 'transition-all duration-200',
  },
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
    variants: {
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      gray: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    },
  },
  text: {
    title: 'text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight',
    description: 'text-sm text-gray-600 dark:text-gray-300 leading-relaxed',
    meta: 'text-sm text-gray-500 dark:text-gray-400',
  },
};

/**
 * Get complete list item container class string
 */
export const getListItemContainerClasses = (): string => {
  return `${listItemStyles.container.base} ${listItemStyles.container.background} ${listItemStyles.container.border} ${listItemStyles.container.shadow} ${listItemStyles.container.padding} ${listItemStyles.container.hover} ${listItemStyles.container.focus} ${listItemStyles.container.transition}`;
};

/**
 * Get badge classes with variant
 */
export const getBadgeClasses = (variant: keyof typeof listItemStyles.badge.variants = 'gray'): string => {
  return `${listItemStyles.badge.base} ${listItemStyles.badge.variants[variant] || listItemStyles.badge.variants.gray}`;
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
 * Technology badge styles (for tech stacks, frameworks, etc.)
 */
export const techBadgeStyles = {
  base: 'inline-block px-2 py-1 text-xs rounded-md font-medium',
  primary: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
  secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
};

/**
 * Get tech badge classes
 */
export const getTechBadgeClasses = (isPrimary: boolean = true): string => {
  return `${techBadgeStyles.base} ${isPrimary ? techBadgeStyles.primary : techBadgeStyles.secondary}`;
};

/**
 * Grid item styles (for grid layouts like RelatedFrameworks)
 */
export const gridItemStyles = {
  container: 'flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 min-h-[44px]',
  background: 'bg-white dark:bg-gray-800',
  border: 'border-gray-200 dark:border-gray-700',
  hover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
  focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
};

/**
 * Get grid item classes
 */
export const getGridItemClasses = (): string => {
  return `${gridItemStyles.container} ${gridItemStyles.background} ${gridItemStyles.border} ${gridItemStyles.hover} ${gridItemStyles.focus}`;
};

/**
 * Ensure minimum touch target size (44x44px for accessibility)
 */
export const minTouchTargetSize = 'min-h-[44px]';

/**
 * Common icon styles
 */
export const iconStyles = {
  small: 'w-4 h-4',
  medium: 'w-5 h-5',
  large: 'w-6 h-6',
  color: 'text-gray-400 dark:text-gray-500',
};

/**
 * Get icon classes
 */
export const getIconClasses = (size: 'small' | 'medium' | 'large' = 'medium'): string => {
  return `${iconStyles[size]} ${iconStyles.color}`;
};
