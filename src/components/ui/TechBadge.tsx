import React from 'react';
import Image from 'next/image';
import { TechBadgeProps } from '@/types';

const TechBadge: React.FC<TechBadgeProps> = ({
  name,
  category,
  experienceYears,
  proficiency,
  logoUrl,
  logoAlt,
  onClick,
  className = ''
}) => {
  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'advanced':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'beginner':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

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
    if (onClick) {
      onClick();
    }
  };



  const badgeClasses = `
    relative flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left w-full
    ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900' : ''}
    ${getProficiencyColor(proficiency)}
    ${className}
  `.trim();

  const badgeContent = (
    <>
      {/* Logo or Category Icon */}
      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={logoAlt || `${name} logo`}
            width={32}
            height={32}
            className="object-contain w-full h-full"
          />
        ) : (
          <span className="text-base sm:text-lg" role="img" aria-label={`${category} icon`}>
            {getCategoryIcon(category)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
          <h3 className="font-semibold text-xs sm:text-sm truncate">{name}</h3>
          <span className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white/50 dark:bg-gray-900/50 capitalize self-start sm:self-auto">
            {category}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="font-medium">Experience:</span>
            <span>{experienceYears} year{experienceYears !== 1 ? 's' : ''}</span>
          </span>
          
          <span className="flex items-center gap-1">
            <span className="font-medium">Level:</span>
            <span className="capitalize font-medium">{proficiency}</span>
          </span>
        </div>
      </div>

      {/* Click indicator */}
      {onClick && (
        <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        className={badgeClasses}
        onClick={handleClick}
        aria-label={`View projects using ${name}`}
        type="button"
      >
        {badgeContent}
      </button>
    );
  }

  return (
    <div className={badgeClasses}>
      {badgeContent}
    </div>
  );
};

export default TechBadge;