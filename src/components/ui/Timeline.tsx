'use client';

import { CareerEntry } from '@/types';

interface TimelineProps {
  entries: CareerEntry[];
  className?: string;
}

export default function Timeline({ entries, className = '' }: TimelineProps) {
  // Sort entries by start date (most recent first)
  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className={`relative ${className}`} role="list" aria-label="Career timeline">
      {/* Timeline line - hidden on mobile, visible on larger screens */}
      <div 
        className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600 hidden md:block"
        aria-hidden="true"
      />
      
      {sortedEntries.map((entry) => (
        <div
          key={entry.id}
          className="relative flex flex-col md:flex-row gap-3 sm:gap-4 pb-6 sm:pb-8 last:pb-0"
          role="listitem"
        >
          {/* Timeline dot */}
          <div className="flex-shrink-0 flex items-start">
            <div 
              className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 dark:bg-blue-500 rounded-full border-2 sm:border-4 border-white dark:border-gray-900 shadow-md flex items-center justify-center relative z-10"
              aria-hidden="true"
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Year badge */}
            <div 
              className="inline-block px-2 sm:px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-full mb-2"
              data-testid={`career-year-${entry.id}`}
            >
              {entry.year}
            </div>
            
            {/* Organization and role */}
            <div className="mb-2">
              <h3 
                className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1"
                data-testid={`career-role-${entry.id}`}
              >
                {entry.role}
              </h3>
              <p 
                className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium"
                data-testid={`career-org-${entry.id}`}
              >
                {entry.organization}
              </p>
            </div>
            
            {/* Description */}
            {entry.description && (
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {entry.description}
              </p>
            )}
            
            {/* Date range for screen readers */}
            <div className="sr-only">
              在職期間: {entry.startDate}
              {entry.endDate ? ` から ${entry.endDate}` : ' から現在まで'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}