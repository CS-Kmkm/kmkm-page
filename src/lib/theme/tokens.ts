/**
 * Design Token System
 * 
 * Centralized design token definitions and utilities.
 * Provides semantic color tokens that map to CSS variables defined in globals.css.
 */

import { BadgeVariant } from '../constants/categories';

/**
 * Surface color tokens
 */
export const surfaceTokens = {
  primary: 'bg-white dark:bg-gray-800',
  secondary: 'bg-gray-50 dark:bg-gray-700',
  elevated: 'bg-white dark:bg-gray-800',
  overlay: 'bg-white/30 dark:bg-black/50',
} as const;

/**
 * Text color tokens
 */
export const textTokens = {
  primary: 'text-gray-900 dark:text-gray-100',
  secondary: 'text-gray-600 dark:text-gray-300',
  muted: 'text-gray-500 dark:text-gray-400',
  inverse: 'text-white dark:text-gray-900',
} as const;

/**
 * Border color tokens
 */
export const borderTokens = {
  default: 'border-gray-200 dark:border-gray-700',
  focus: 'border-blue-500 dark:border-blue-400',
  hover: 'border-gray-400 dark:border-gray-500',
} as const;

/**
 * Interactive color tokens
 */
export const interactiveTokens = {
  primary: 'bg-blue-600 dark:bg-blue-500',
  primaryHover: 'hover:bg-blue-700 dark:hover:bg-blue-600',
  primaryText: 'text-white',
  
  secondary: 'bg-gray-100 dark:bg-gray-700',
  secondaryHover: 'hover:bg-gray-200 dark:hover:bg-gray-600',
  secondaryText: 'text-gray-700 dark:text-gray-300',
  
  ghost: 'bg-transparent',
  ghostHover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
  ghostText: 'text-gray-700 dark:text-gray-300',
} as const;

/**
 * Focus ring tokens
 */
export const focusTokens = {
  ring: 'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
  ringOffset: 'focus:ring-offset-2 dark:focus:ring-offset-gray-900',
  ringFull: 'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
} as const;

/**
 * Status color tokens
 */
export const statusTokens = {
  success: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-800 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
  warning: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-800 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  error: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
  },
  info: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
} as const;

/**
 * Badge color tokens by variant
 */
export const badgeTokens: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-800 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    text: 'text-purple-800 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    text: 'text-orange-800 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-800 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  gray: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
  },
} as const;

/**
 * Shadow tokens
 */
export const shadowTokens = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
} as const;

/**
 * Spacing tokens
 */
export const spacingTokens = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
} as const;

/**
 * Border radius tokens
 */
export const radiusTokens = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
} as const;

/**
 * Transition tokens
 */
export const transitionTokens = {
  fast: 'transition-all duration-150',
  normal: 'transition-all duration-200',
  slow: 'transition-all duration-300',
  colors: 'transition-colors',
} as const;

/**
 * Combined token object for easy access
 */
export const tokens = {
  surface: surfaceTokens,
  text: textTokens,
  border: borderTokens,
  interactive: interactiveTokens,
  focus: focusTokens,
  status: statusTokens,
  badge: badgeTokens,
  shadow: shadowTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  transition: transitionTokens,
} as const;

/**
 * Get surface color token
 */
export function getSurfaceToken(variant: keyof typeof surfaceTokens = 'primary'): string {
  return surfaceTokens[variant];
}

/**
 * Get text color token
 */
export function getTextToken(variant: keyof typeof textTokens = 'primary'): string {
  return textTokens[variant];
}

/**
 * Get border color token
 */
export function getBorderToken(variant: keyof typeof borderTokens = 'default'): string {
  return borderTokens[variant];
}

/**
 * Get badge color tokens by variant
 */
export function getBadgeTokens(variant: BadgeVariant = 'gray'): { bg: string; text: string; border: string } {
  return badgeTokens[variant] || badgeTokens.gray;
}

/**
 * Get status color tokens
 */
export function getStatusTokens(status: keyof typeof statusTokens): { bg: string; text: string; border: string } {
  return statusTokens[status];
}

/**
 * Get interactive button tokens
 */
export function getInteractiveTokens(variant: 'primary' | 'secondary' | 'ghost' = 'primary'): string {
  switch (variant) {
    case 'primary':
      return `${interactiveTokens.primary} ${interactiveTokens.primaryHover} ${interactiveTokens.primaryText}`;
    case 'secondary':
      return `${interactiveTokens.secondary} ${interactiveTokens.secondaryHover} ${interactiveTokens.secondaryText}`;
    case 'ghost':
      return `${interactiveTokens.ghost} ${interactiveTokens.ghostHover} ${interactiveTokens.ghostText}`;
    default:
      return `${interactiveTokens.primary} ${interactiveTokens.primaryHover} ${interactiveTokens.primaryText}`;
  }
}

/**
 * Get complete focus ring classes
 */
export function getFocusRing(withOffset: boolean = true): string {
  return withOffset ? focusTokens.ringFull : focusTokens.ring;
}

/**
 * Type exports
 */
export type SurfaceVariant = keyof typeof surfaceTokens;
export type TextVariant = keyof typeof textTokens;
export type BorderVariant = keyof typeof borderTokens;
export type StatusVariant = keyof typeof statusTokens;
export type ShadowVariant = keyof typeof shadowTokens;
export type SpacingVariant = keyof typeof spacingTokens;
export type RadiusVariant = keyof typeof radiusTokens;
export type TransitionVariant = keyof typeof transitionTokens;
