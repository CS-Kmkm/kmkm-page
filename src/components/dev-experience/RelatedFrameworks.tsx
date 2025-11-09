"use client";

import React from 'react';
import Image from 'next/image';
import { TechItem } from '@/types';
import { getGridItemClasses } from '@/lib/ui/listItemStyles';

interface RelatedFrameworksProps {
  frameworks: TechItem[];
  onFrameworkSelect?: (framework: TechItem) => void;
}

/**
 * RelatedFrameworks component displays frameworks related to a language
 */
const RelatedFrameworks: React.FC<RelatedFrameworksProps> = ({
  frameworks,
  onFrameworkSelect
}) => {
  if (frameworks.length === 0) {
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
    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        関連フレームワーク
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        この言語と一緒に使用したフレームワーク
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {frameworks.map((framework) => (
          <button
            key={framework.id}
            onClick={() => onFrameworkSelect?.(framework)}
            className={getGridItemClasses()}
            type="button"
          >
            {/* Logo */}
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              {framework.logoUrl ? (
                <Image
                  src={framework.logoUrl}
                  alt={framework.logoAlt || `${framework.name} logo`}
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                />
              ) : (
                <span className="text-xl" role="img" aria-label={`${framework.name} icon`}>
                  {getCategoryIcon(framework.category)}
                </span>
              )}
            </div>

            {/* Name */}
            <div className="flex-grow text-left min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {framework.name}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedFrameworks;
