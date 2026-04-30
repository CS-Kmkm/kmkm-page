import Link from 'next/link';
import { NavigationCardProps } from '@/types';

export default function NavigationCard({
  title,
  description,
  href,
  icon,
  className = ''
}: NavigationCardProps) {
  const cardId = `${title.replace(/\s+/g, '-').toLowerCase()}-card`;
  const descriptionId = `${title.replace(/\s+/g, '-').toLowerCase()}-description`;
  
  return (
    <Link
      href={href}
      className={`
        group flex min-h-[5.75rem] items-center p-4 sm:min-h-[6.5rem]
        bg-white dark:bg-gray-800/80 
        border border-gray-200/80 dark:border-gray-700/50 
        rounded-xl
        shadow-soft hover:shadow-soft-lg
        hover:border-blue-200 dark:hover:border-blue-800/50
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
        focus:ring-offset-2 dark:focus:ring-offset-gray-900
        transition-all duration-300 ease-out
        hover:-translate-y-0.5
        ${className}
      `}
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={cardId}
    >
      <article className="flex w-full items-center gap-3">
        <div className="min-w-0 flex-1">
          {/* Header with icon and title */}
          <header className={`flex items-center gap-3 ${description ? 'mb-2' : ''}`}>
            {icon && (
              <div
                className="
                  flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10
                  flex items-center justify-center
                  bg-blue-50 dark:bg-blue-900/20 rounded-lg
                  group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30
                  transition-colors duration-300
                "
                aria-hidden="true"
              >
                {icon}
              </div>
            )}
            <h3
              id={cardId}
              className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
            >
              {title}
            </h3>
          </header>

          {/* Description */}
          {description && (
            <p
              id={descriptionId}
              className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              {description}
            </p>
          )}
        </div>

        {/* Arrow indicator */}
        <div className="ml-auto flex shrink-0 items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300"
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
      </article>
    </Link>
  );
}

// Pre-built navigation cards for common pages
export function CareerNavigationCard({ className }: { className?: string }) {
  return (
    <NavigationCard
      title="経歴"
      href="/career"
      icon={
        <svg className="w-7 h-7 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      }
      className={className}
    />
  );
}

export function DevExperienceNavigationCard({ className }: { className?: string }) {
  return (
    <NavigationCard
      title="開発経験"
      href="/dev-experience"
      icon={
        <svg className="w-7 h-7 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      }
      className={className}
    />
  );
}

export function PublicationsNavigationCard({ className }: { className?: string }) {
  return (
    <NavigationCard
      title="論文・発表"
      href="/publications"
      icon={
        <svg className="w-7 h-7 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
      className={className}
    />
  );
}
