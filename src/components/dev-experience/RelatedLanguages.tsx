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
 * Modern chip-style design with enhanced hover animations
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
    <div className="min-w-full w-full">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-emerald-500 rounded-full" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          関連言語
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
          {languages.length}
        </span>
      </div>

      {/* Horizontal Chip Layout */}
      <div className="flex flex-wrap gap-2">
        {languages.map((language, index) => (
          <button
            key={language.id}
            onClick={() => onLanguageSelect?.(language)}
            className="
              group relative flex items-center gap-2.5 px-4 py-2.5
              bg-white dark:bg-gray-800/80 
              rounded-full
              border border-gray-200/80 dark:border-gray-700/60
              shadow-sm
              transition-all duration-300 ease-out
              hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10
              hover:border-emerald-300 dark:hover:border-emerald-600
              hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50
              focus:ring-offset-2 dark:focus:ring-offset-gray-900
              animate-fade-scale-in
            "
            style={{ animationDelay: `${index * 75}ms` }}
            type="button"
          >
            {/* Logo with subtle background */}
            <div className="
              relative flex-shrink-0 w-7 h-7 
              flex items-center justify-center 
              bg-gray-100 dark:bg-gray-200 
              rounded-lg
              transition-transform duration-300
              group-hover:scale-110
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
                <span className="text-base" role="img" aria-label={`${language.name} icon`}>
                  {getCategoryIcon(language.category)}
                </span>
              )}
            </div>

            {/* Name */}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
              {language.name}
            </span>

            {/* Hover Arrow */}
            <svg 
              className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
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

