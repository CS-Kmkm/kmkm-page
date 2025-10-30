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
    <div className="relative">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="relative w-full aspect-square p-2 sm:p-3 bg-white rounded-lg border-2 border-gray-200 transition-all duration-150 hover:shadow-lg hover:scale-110 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
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
              className="object-contain w-full h-full max-w-[48px] max-h-[48px]"
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

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap pointer-events-none z-10 animate-fade-in"
          role="tooltip"
        >
          {tech.name}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

export default TechIcon;
