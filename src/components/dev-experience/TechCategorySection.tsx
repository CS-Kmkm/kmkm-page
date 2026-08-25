"use client";

import React, { useId, useState } from 'react';
import { TechItem } from '@/types';
import TechIconGrid from './TechIconGrid';
import { useI18n } from '@/lib/i18n';

interface TechCategorySectionProps {
  title: string;
  techItems: TechItem[];
  onTechSelect: (tech: TechItem) => void;
}

/**
 * TechCategorySection component displays a section for a specific tech category
 */
const TechCategorySection: React.FC<TechCategorySectionProps> = ({
  title,
  techItems,
  onTechSelect
}) => {
  const { messages } = useI18n();
  const [isExpanded, setIsExpanded] = useState(true);
  const contentId = useId();

  if (techItems.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-gray-200/80 py-4 first:border-t-0 first:pt-0 dark:border-gray-700/60 sm:py-5" aria-label={messages.category(title)}>
      {/* Section Header */}
      <div>
        <h3>
          <button
            type="button"
            className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800"
            aria-expanded={isExpanded}
            aria-controls={contentId}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            <span className="min-w-0">
              <span className="block text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300 sm:text-lg">{title}</span>
            </span>
            <span className="flex flex-shrink-0 items-center">
              <svg
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-300 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
        </h3>
      </div>

      {/* Tech Grid */}
      <div id={contentId} className="mt-3 sm:mt-4" hidden={!isExpanded}>
        <TechIconGrid
          techItems={techItems}
          onTechSelect={onTechSelect}
        />
      </div>
    </section>
  );
};

export default TechCategorySection;
