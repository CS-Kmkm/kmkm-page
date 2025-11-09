/**
 * Generic ListItem Component
 * 
 * A reusable list item component with consistent styling and behavior.
 * Supports both button and link variants with proper accessibility.
 */

'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { getListItemContainerClasses, getTitleClasses, getDescriptionClasses, getMetaClasses } from '@/lib/ui/listItemStyles';
import { Badge } from '@/components/ui/Badge';
import type { BadgeProps } from '@/components/ui/Badge';

/**
 * ListItem props interface
 */
export interface ListItemProps {
  /** Item title */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional metadata (date, author, etc.) */
  meta?: string | ReactNode;
  /** Optional badge */
  badge?: BadgeProps;
  /** Optional icon */
  icon?: ReactNode;
  /** Click handler for button variant */
  onClick?: () => void;
  /** URL for link variant */
  href?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom aria-label */
  ariaLabel?: string;
  /** Whether the item is currently selected/active */
  isActive?: boolean;
}

/**
 * Generic ListItem Component
 */
export function ListItem({
  title,
  description,
  meta,
  badge,
  icon,
  onClick,
  href,
  className = '',
  ariaLabel,
  isActive = false,
}: ListItemProps) {
  const baseClasses = `${getListItemContainerClasses()} ${className}`;
  const titleId = `list-item-${title.replace(/\s+/g, '-').toLowerCase()}`;

  // Content to render
  const content = (
    <>
      {/* Header with meta and badge */}
      {(meta || badge) && (
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          {meta && (
            <div className={getMetaClasses()}>
              {typeof meta === 'string' ? <span>{meta}</span> : meta}
            </div>
          )}
          {badge && <Badge {...badge} />}
        </header>
      )}

      {/* Title with optional icon */}
      <h3 id={titleId} className={`${getTitleClasses()} flex items-center justify-between`}>
        <span className="flex items-center gap-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{title}</span>
        </span>
        {(onClick || href) && (
          <svg
            className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </h3>

      {/* Description */}
      {description && (
        <p className={`${getDescriptionClasses()} mt-2`}>
          {description}
        </p>
      )}
    </>
  );

  // Link variant
  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        aria-labelledby={titleId}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  // Button variant
  if (onClick) {
    return (
      <article
        className={baseClasses}
        aria-labelledby={titleId}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {content}
      </article>
    );
  }

  // Static variant (no interaction)
  return (
    <article className={`${baseClasses} cursor-default`} aria-labelledby={titleId}>
      {content}
    </article>
  );
}

export default ListItem;
