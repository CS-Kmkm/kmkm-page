/**
 * Badge Component
 * 
 * A reusable badge component for displaying categories, tags, and status indicators.
 * Uses Design Tokens for consistent theming.
 */

'use client';

import React from 'react';
import { BadgeVariant } from '@/lib/constants/categories';
import { getBadgeClasses } from '@/lib/ui/listItemStyles';

/**
 * Badge props interface
 */
export interface BadgeProps {
  /** Badge label text */
  label: string;
  /** Color variant */
  variant?: BadgeVariant;
  /** Optional icon (emoji or React element) */
  icon?: string | React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Custom aria-label for accessibility */
  ariaLabel?: string;
}

/**
 * Badge Component
 */
export function Badge({
  label,
  variant = 'gray',
  icon,
  className = '',
  ariaLabel,
}: BadgeProps) {
  return (
    <span
      className={`${getBadgeClasses(variant)} ${icon ? 'gap-1' : ''} ${className}`}
      aria-label={ariaLabel || `Category: ${label}`}
    >
      {icon && (
        <span aria-hidden="true">
          {typeof icon === 'string' ? icon : icon}
        </span>
      )}
      {label}
    </span>
  );
}

export default Badge;
