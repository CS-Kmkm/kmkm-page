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
        group block p-4 sm:p-6 bg-white border border-gray-200 rounded-lg
        hover:shadow-lg hover:border-gray-300
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transition-all duration-200
        ${className}
      `}
      aria-describedby={descriptionId}
      aria-labelledby={cardId}
    >
      <article className="h-full flex flex-col">
        {/* Header with icon and title */}
        <header className="flex items-center gap-2 sm:gap-3 mb-3">
          {icon && (
            <div 
              className="
                flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 
                flex items-center justify-center
                bg-gray-100 rounded-lg
                group-hover:bg-blue-50
                transition-colors duration-200
              "
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <h3 
            id={cardId}
            className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200"
          >
            {title}
          </h3>
        </header>

        {/* Description */}
        <p 
          id={descriptionId}
          className="text-sm sm:text-base text-gray-600 leading-relaxed flex-1"
        >
          {description}
        </p>

        {/* Arrow indicator */}
        <div className="mt-3 sm:mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
          <span className="text-xs sm:text-sm font-medium mr-2">詳しく見る</span>
          <svg 
            className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
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
      description="所属の変化や経歴を時系列で確認できます。学歴から現在のポジションまでの変遷をご覧ください。"
      href="/career"
      icon={
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      description="使用できるプログラミング言語や技術スタック、開発実績をご紹介します。プロジェクトの詳細もご覧いただけます。"
      href="/dev-experience"
      icon={
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      title="論文投稿履歴"
      description="投稿した論文の書誌情報を一覧で確認できます。主著・共著の区別や査読の有無も表示されています。"
      href="/publications"
      icon={
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
      className={className}
    />
  );
}