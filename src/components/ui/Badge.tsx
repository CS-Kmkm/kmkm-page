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
  /** Custom aria-label for accessibility. Omit when the visible label already reads correctly. */
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
  // A plain <span> carries the generic role, which prohibits aria-label. When no caller-supplied
  // label is given the visible text is already the accessible text, so no attribute is emitted.
  return (
    <span
      className={`${getBadgeClasses(variant)} ${icon ? 'gap-1' : ''} ${className}`}
      aria-label={ariaLabel}
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
