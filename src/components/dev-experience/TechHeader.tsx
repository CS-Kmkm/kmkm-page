"use client";

import React from 'react';
import Image from 'next/image';
import { TechHeaderProps } from '@/types';

/**
 * TechHeader component displays technology logo, name, proficiency badge, and experience years
 */
const TechHeader: React.FC<TechHeaderProps> = ({ tech }) => {
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

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
      case 'advanced':
        return 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
      case 'intermediate':
        return 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
      case 'beginner':
        return 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
      default:
        return 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
    }
  };

  const getProficiencyLabel = (level: string) => {
    switch (level) {
      case 'expert':
        return 'エキスパート';
      case 'advanced':
        return '上級';
      case 'intermediate':
        return '中級';
      case 'beginner':
        return '初級';
      default:
        return level;
    }
  };

  return (
    <div className="min-w-full w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200 box-border overflow-hidden">
      {/* Logo */}
      <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-gray-50 dark:bg-gray-200 rounded-lg border border-gray-100 dark:border-gray-300 p-2.5">
        {tech.logoUrl ? (
          <Image
            src={tech.logoUrl}
            alt={tech.logoAlt || `${tech.name} logo`}
            width={80}
            height={80}
            className="object-contain w-full h-full"
          />
        ) : (
          <span className="text-2xl sm:text-3xl" role="img" aria-label={`${tech.name}のアイコン`}>
            {getCategoryIcon(tech.category)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0 w-full overflow-hidden">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 w-full block overflow-hidden break-words">
          {tech.name}
        </h2>
        
        <div className="flex flex-wrap items-center gap-2 w-full">
          {/* Proficiency Badge */}
          <span
            className={`
              px-3 py-1 rounded-lg text-sm font-medium border
              ${getProficiencyColor(tech.proficiency)}
            `}
          >
            {getProficiencyLabel(tech.proficiency)}
          </span>

          {/* Experience Years */}
          <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 px-3 py-1 rounded-lg">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">
              {tech.experienceYears}年の経験
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TechHeader;
