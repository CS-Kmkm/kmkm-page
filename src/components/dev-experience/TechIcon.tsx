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
    <div className="relative flex flex-col items-center w-24 sm:w-28">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="relative w-24 h-24 sm:w-28 sm:h-28 p-4 sm:p-5 bg-white dark:bg-gray-300 rounded-lg border-2 border-gray-200 dark:border-gray-400 transition-all duration-150 hover:shadow-lg hover:scale-110 hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 active:scale-95"
        aria-label={`View ${tech.name} details`}
        role="button"
        type="button"
      >
        {/* Logo Image */}
        <div className="w-full h-full flex items-center justify-center">
          {tech.logoUrl && !imageError ? (
            <Image
              src={tech.logoUrl}
              alt={tech.logoAlt || `${tech.name} logo`}
              width={48}
              height={48}
              onError={handleImageError}
              className="object-contain w-12 h-12 sm:w-14 sm:h-14 dark:mix-blend-multiply"
              priority={false}
              unoptimized={true}
            />
          ) : (
            <span className="text-2xl sm:text-3xl" role="img" aria-label={`${tech.name} icon`}>
              {getCategoryIcon(tech.category)}
            </span>
          )}
        </div>
      </button>

      {/* Tech Name Label */}
      <div className="mt-2 sm:mt-3 text-center h-10 sm:h-12 flex items-center justify-center w-full px-1">
        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-2 leading-3 sm:leading-4 text-center overflow-hidden text-ellipsis w-full">
          {tech.name}
        </span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-md whitespace-nowrap pointer-events-none z-10 animate-fade-in"
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
