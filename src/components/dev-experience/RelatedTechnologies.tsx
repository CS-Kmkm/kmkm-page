'use client';

import Image from 'next/image';
import { getTechnologyCategoryMetadata } from '@/lib/tech/categories';
import type { TechItem } from '@/types';

interface RelatedTechnologiesProps {
  title: string;
  technologies: TechItem[];
  onSelect?: (technology: TechItem) => void;
}

export default function RelatedTechnologies({
  title,
  technologies,
  onSelect,
}: RelatedTechnologiesProps) {
  if (technologies.length === 0) {
    return null;
  }

  return (
    <div className="min-w-full w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 transition-colors duration-200">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 px-2 py-0.5 rounded-lg">
          {technologies.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {technologies.map((technology) => (
          <button
            key={technology.id}
            onClick={() => onSelect?.(technology)}
            aria-label={`${technology.name}の詳細を表示`}
            className="
              group relative flex items-center gap-2.5 px-3 py-2
              bg-gray-50 dark:bg-gray-700/40
              rounded-lg
              border border-gray-200 dark:border-gray-600
              transition-colors duration-150
              hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              focus:ring-offset-2 dark:focus:ring-offset-gray-900
            "
            type="button"
          >
            <div className="
              relative flex-shrink-0 w-7 h-7
              flex items-center justify-center
              bg-white dark:bg-gray-200
              rounded-lg
              border border-gray-200 dark:border-gray-300
            ">
              {technology.logoUrl ? (
                <Image
                  src={technology.logoUrl}
                  alt={technology.logoAlt || `${technology.name} logo`}
                  width={24}
                  height={24}
                  className="object-contain w-5 h-5"
                />
              ) : (
                <span className="text-base" role="img" aria-label={`${technology.name}のアイコン`}>
                  {getTechnologyCategoryMetadata(technology.category).icon}
                </span>
              )}
            </div>

            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap transition-colors duration-150">
              {technology.name}
            </span>

            <svg
              className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-colors duration-150 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
