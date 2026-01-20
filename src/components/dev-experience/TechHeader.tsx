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
        return 'bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'advanced':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'beginner':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-600';
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
    <div className="min-w-full w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200 box-border overflow-hidden">
      {/* Logo */}
      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-200 rounded-lg p-2">
        {tech.logoUrl ? (
          <Image
            src={tech.logoUrl}
            alt={tech.logoAlt || `${tech.name} logo`}
            width={80}
            height={80}
            className="object-contain w-full h-full"
          />
        ) : (
          <span className="text-4xl sm:text-5xl" role="img" aria-label={`${tech.name} icon`}>
            {getCategoryIcon(tech.category)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0 w-full overflow-hidden">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 w-full block overflow-hidden break-words">
          {tech.name}
        </h2>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full">
          {/* Proficiency Badge */}
          <span
            className={`
              px-3 py-1 rounded-full text-sm font-medium border-2
              ${getProficiencyColor(tech.proficiency)}
            `}
          >
            {getProficiencyLabel(tech.proficiency)}
          </span>

          {/* Experience Years */}
          <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
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
