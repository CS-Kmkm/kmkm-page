'use client';

import React from 'react';
import { ExtendedCareerEntry } from '@/types';

interface CareerCardProps {
  entry: ExtendedCareerEntry;
  isActive?: boolean;
  branchColor?: string;
  onClick?: () => void;
}

/**
 * Icon components for different career types
 */
const SchoolIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

const LabIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const WorkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const BranchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

/**
 * Get icon component based on entry type
 */
function getCareerIcon(entry: ExtendedCareerEntry) {
  const role = entry.role?.toLowerCase() || '';
  const org = entry.organization?.toLowerCase() || '';
  
  // Work-related
  if (role.includes('補佐') || role.includes('技術') || role.includes('職員')) {
    return <WorkIcon />;
  }
  
  // Lab/Research-related
  if (org.includes('研究室') || role.includes('研究')) {
    return <LabIcon />;
  }
  
  // Branch/Department assignment
  if (role.includes('配属') || org.includes('系')) {
    return <BranchIcon />;
  }
  
  // School-related (default for students)
  return <SchoolIcon />;
}

/**
 * Format date range for display
 */
function formatDateRange(startDate: string, endDate?: string | null): string {
  const start = new Date(startDate);
  const startStr = `${start.getFullYear()}.${String(start.getMonth() + 1).padStart(2, '0')}`;
  
  if (!endDate) {
    return `${startStr} - 現在`;
  }
  
  const end = new Date(endDate);
  const endStr = `${end.getFullYear()}.${String(end.getMonth() + 1).padStart(2, '0')}`;
  return `${startStr} - ${endStr}`;
}

/**
 * CareerCard component displays individual career entries
 */
export default function CareerCard({
  entry,
  isActive = false,
  branchColor,
  onClick
}: CareerCardProps) {
  const icon = getCareerIcon(entry);
  const dateRange = formatDateRange(entry.startDate, entry.endDate);
  const isOngoing = !entry.endDate;
  
  return (
    <article
      className={`
        relative group p-4 rounded-xl border transition-all duration-200
        ${isActive 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-md' 
          : 'bg-white dark:bg-gray-800/80 border-gray-200/80 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
        }
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {/* Color accent bar */}
      {branchColor && (
        <div 
          className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
          style={{ backgroundColor: branchColor }}
        />
      )}
      
      <div className={branchColor ? 'pl-3' : ''}>
        {/* Header with icon and organization */}
        <div className="flex items-start gap-3 mb-2">
          <div 
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
            style={branchColor ? { backgroundColor: `${branchColor}15`, color: branchColor } : {}}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight truncate">
              {entry.organization}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              {entry.role}
            </p>
          </div>
        </div>
        
        {/* Date range and status */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          <span>{dateRange}</span>
          {isOngoing && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              進行中
            </span>
          )}
        </div>
        
        {/* Description (if present) */}
        {entry.description && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
            {entry.description}
          </p>
        )}
      </div>
    </article>
  );
}
