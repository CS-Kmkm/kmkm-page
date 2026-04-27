"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { TechIconProps } from '@/types';

/**
 * TechIcon component displays a clickable technology icon
 * with hover effects and tooltip
 */
const TechIcon: React.FC<TechIconProps> = ({ tech, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);

  const buttonClassName = [
    'relative w-full aspect-square p-3 sm:p-4',
    'bg-gray-50/80 dark:bg-gray-900/30 rounded-lg',
    'border border-gray-200/80 dark:border-gray-700/60',
    'transition-colors duration-200',
    'hover:bg-white dark:hover:bg-gray-800',
    'hover:border-gray-300 dark:hover:border-gray-600',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
    'focus:ring-offset-2 dark:focus:ring-offset-gray-900',
  ].join(' ');

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
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={buttonClassName}
        aria-label={`${tech.name}の詳細を表示`}
        type="button"
      >
        {/* Logo Image */}
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-50 p-2 dark:bg-gray-100 sm:h-14 sm:w-14">
            {tech.logoUrl && !imageError ? (
              <Image
                src={tech.logoUrl}
                alt={tech.logoAlt || `${tech.name}のロゴ`}
                width={48}
                height={48}
                onError={handleImageError}
                className="h-full w-full object-contain"
                priority={false}
                unoptimized={true}
              />
            ) : (
              <span className="text-2xl sm:text-3xl" role="img" aria-label={`${tech.name}のアイコン`}>
                {getCategoryIcon(tech.category)}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Tech Name Label */}
      <div className="mt-2 flex h-10 w-full items-start justify-center px-1 text-center sm:h-11">
        <span className="line-clamp-2 w-full overflow-hidden text-ellipsis text-center text-xs font-medium leading-4 text-gray-700 dark:text-gray-300 sm:text-sm">
          {tech.name}
        </span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white dark:bg-gray-100 dark:text-gray-900"
          role="tooltip"
        >
          {tech.name}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
        </div>
      )}
    </div>
  );
};

export default TechIcon;
