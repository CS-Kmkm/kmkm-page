"use client";

import React from 'react';
import Image from 'next/image';
import { TechItem } from '@/types';

interface RelatedLanguagesProps {
  languages: TechItem[];
  onLanguageSelect?: (language: TechItem) => void;
}

/**
 * RelatedLanguages component displays languages related to a framework
 */
const RelatedLanguages: React.FC<RelatedLanguagesProps> = ({
  languages,
  onLanguageSelect
}) => {
  if (languages.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'language':
        return '💻';
      case 'framework':
        return '🔧';
      case 'tool':
        return '⚙️';
      case 'database':
        return '🗄️';
      default:
        return '📦';
    }
  };

  return (
    <div className="min-w-full w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 transition-colors duration-200">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          関連言語
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 px-2 py-0.5 rounded-lg">
          {languages.length}
        </span>
      </div>

      {/* Horizontal Chip Layout */}
      <div className="flex flex-wrap gap-2">
        {languages.map((language) => (
          <button
            key={language.id}
            onClick={() => onLanguageSelect?.(language)}
            aria-label={`${language.name}の詳細を表示`}
            className="
              group relative flex items-center gap-2.5 px-3 py-2
              bg-gray-50 dark:bg-gray-700/40
              rounded-lg
              border border-gray-200 dark:border-gray-600
              transition-colors duration-150
              hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              focus:ring-offset-2 dark:focus:ring-offset-gray-900
            "
            type="button"
          >
            {/* Logo with subtle background */}
            <div className="
              relative flex-shrink-0 w-7 h-7 
              flex items-center justify-center 
              bg-white dark:bg-gray-200
              rounded-lg
              border border-gray-200 dark:border-gray-300
            ">
              {language.logoUrl ? (
                <Image
                  src={language.logoUrl}
                  alt={language.logoAlt || `${language.name} logo`}
                  width={24}
                  height={24}
                  className="object-contain w-5 h-5"
                />
              ) : (
                <span className="text-base" role="img" aria-label={`${language.name}のアイコン`}>
                  {getCategoryIcon(language.category)}
                </span>
              )}
            </div>

            {/* Name */}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap transition-colors duration-150">
              {language.name}
            </span>

            {/* Hover Arrow */}
            <svg 
              className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-colors duration-150 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedLanguages;

