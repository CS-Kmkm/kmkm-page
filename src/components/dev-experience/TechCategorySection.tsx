"use client";

import React, { useId, useState } from 'react';
import { TechItem } from '@/types';
import TechIconGrid from './TechIconGrid';

interface TechCategorySectionProps {
  title: string;
  description?: string;
  techItems: TechItem[];
  onTechSelect: (tech: TechItem) => void;
}

/**
 * TechCategorySection component displays a section for a specific tech category
 */
const TechCategorySection: React.FC<TechCategorySectionProps> = ({
  title,
  description,
  techItems,
  onTechSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const contentId = useId();

  if (techItems.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 border-b border-gray-200/80 pb-6 last:border-b-0 last:pb-0 dark:border-gray-700/60" aria-label={`${title}カテゴリ`}>
      {/* Section Header */}
      <div>
        <h2>
          <button
            type="button"
            className="group flex min-h-10 w-full items-center justify-between gap-3 rounded-md text-left text-lg font-semibold text-gray-900 transition-colors duration-150 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-100 dark:hover:text-blue-300 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900 sm:text-xl"
            aria-expanded={isExpanded}
            aria-controls={contentId}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            <span className="min-w-0">
              {title} <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({techItems.length}件)</span>
            </span>
            <svg
              className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </h2>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Tech Grid */}
      <div id={contentId} hidden={!isExpanded}>
        <TechIconGrid
          techItems={techItems}
          onTechSelect={onTechSelect}
        />
      </div>
    </section>
  );
};

export default TechCategorySection;
