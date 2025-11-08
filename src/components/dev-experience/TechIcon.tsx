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
    <div className="relative flex flex-col items-center">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 p-3 sm:p-4 bg-white dark:bg-gray-400 rounded-lg border-2 border-gray-200 dark:border-gray-500 transition-all duration-150 hover:shadow-lg hover:scale-110 hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 active:scale-95"
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
              width={64}
              height={64}
              onError={handleImageError}
              className="object-contain w-full h-full max-w-[64px] max-h-[64px] dark:mix-blend-multiply"
              priority={false}
              unoptimized={true}
            />
          ) : (
            <span className="text-3xl sm:text-4xl md:text-5xl" role="img" aria-label={`${tech.name} icon`}>
              {getCategoryIcon(tech.category)}
            </span>
          )}
        </div>
      </button>

      {/* Tech Name Label */}
      <div className="mt-2 text-center">
        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-2">
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
