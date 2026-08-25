"use client";

import React from 'react';
import Image from 'next/image';
import { TechHeaderProps } from '@/types';
import { getTechnologyCategoryMetadata } from '@/lib/tech/categories';
import { useI18n } from '@/lib/i18n';

/**
 * TechHeader component displays a technology logo and name.
 */
const TechHeader: React.FC<TechHeaderProps> = ({ tech }) => {
  const { messages } = useI18n();
  return (
    <div className="min-w-full w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 py-2 sm:py-3 transition-colors duration-200 box-border overflow-hidden">
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
          <span className="text-2xl sm:text-3xl" role="img" aria-label={messages.techIcon(tech.name)}>
            {getTechnologyCategoryMetadata(tech.category).icon}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0 w-full overflow-hidden">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 w-full block overflow-hidden break-words">
          {tech.name}
        </h2>
      </div>
    </div>
  );
};

export default TechHeader;
