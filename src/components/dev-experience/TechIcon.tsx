"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { TechIconProps } from '@/types';
import { getTechnologyCategoryMetadata } from '@/lib/tech/categories';
import { useI18n } from '@/lib/i18n';

/**
 * TechIcon component displays a clickable technology icon
 * as a concise logo-and-name card
 */
const TechIcon: React.FC<TechIconProps> = ({ tech, onClick }) => {
  const { messages } = useI18n();
  const [imageError, setImageError] = useState(false);

  const buttonClassName = [
    'group relative flex h-full min-h-16 w-full items-center gap-2 p-2.5 text-left sm:min-h-20 sm:gap-3 sm:p-4',
    'bg-gray-50/80 dark:bg-gray-900/30 rounded-xl',
    'border border-gray-200/80 dark:border-gray-700/60',
    'transition-all duration-200',
    'hover:-translate-y-0.5 hover:bg-white dark:hover:bg-gray-800',
    'hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
    'focus:ring-offset-2 dark:focus:ring-offset-gray-900',
  ].join(' ');

  const handleClick = () => {
    onClick();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative flex w-full min-w-0 flex-col items-stretch">
      <button
        id={`tech-card-${tech.id}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={buttonClassName}
        aria-label={messages.showTechDetails(tech.name)}
        type="button"
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white p-2 shadow-sm dark:border-gray-300 dark:bg-gray-100 sm:h-11 sm:w-11">
          {tech.logoUrl && !imageError ? (
            <Image
              src={tech.logoUrl}
              alt={tech.logoAlt || messages.techLogo(tech.name)}
              width={48}
              height={48}
              onError={handleImageError}
              className="h-full w-full object-contain"
              priority={false}
              unoptimized={true}
            />
          ) : (
            <span className="text-2xl sm:text-3xl" role="img" aria-label={messages.techIcon(tech.name)}>
              {getTechnologyCategoryMetadata(tech.category).icon}
            </span>
          )}
        </div>

        <span className="min-w-0 flex-1 line-clamp-2 text-sm font-semibold leading-5 text-gray-900 dark:text-gray-100 sm:text-base">
          {tech.name}
        </span>

        <svg className="hidden h-4 w-4 flex-shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500 dark:text-gray-600 sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default TechIcon;
