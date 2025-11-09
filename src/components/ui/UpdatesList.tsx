'use client';

import { useState } from 'react';
import { UpdatesListProps, UpdateItem } from '@/types';
import {
  getBackdropClassesWithFallback,
  getModalContainerClasses,
  getModalHeaderClasses,
  getModalTitleClasses,
  getCloseButtonClasses,
  getModalTextClasses,
} from '@/lib/ui/modalStyles';
import {
  getListItemContainerClasses,
  getBadgeClasses,
  getTitleClasses,
  getMetaClasses,
} from '@/lib/ui/listItemStyles';

// Category configuration for badges
const categoryConfig = {
  career: {
    label: 'キャリア',
    variant: 'blue' as const,
    icon: '👔'
  },
  development: {
    label: '開発',
    variant: 'green' as const,
    icon: '💻'
  },
  publication: {
    label: '論文',
    variant: 'purple' as const,
    icon: '📄'
  },
  other: {
    label: 'その他',
    variant: 'gray' as const,
    icon: '📝'
  }
};

function CategoryBadge({ category }: { category: UpdateItem['category'] }) {
  const config = categoryConfig[category];
  
  return (
    <span 
      className={`${getBadgeClasses(config.variant)} gap-1`}
      aria-label={`カテゴリ: ${config.label}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function UpdateModal({ update, onClose }: { update: UpdateItem | null; onClose: () => void }) {
  if (!update) return null;

  return (
    <div 
      className={getBackdropClassesWithFallback()}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-modal-title"
      aria-describedby="update-modal-description"
    >
      <div 
        className={getModalContainerClasses()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className={getModalHeaderClasses()}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <time 
                  dateTime={update.date}
                  className={`${getMetaClasses()} font-medium`}
                >
                  {formatDate(update.date)}
                </time>
                <CategoryBadge category={update.category} />
              </div>
              <h3 id="update-modal-title" className={getModalTitleClasses()}>
                {update.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className={getCloseButtonClasses()}
              aria-label="閉じる"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <div className="prose prose-gray max-w-none">
            <p id="update-modal-description" className={getModalTextClasses()}>
              {update.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpdateCard({ update, onClick }: { update: UpdateItem; onClick: () => void }) {
  const titleId = `update-title-${update.id}`;
  
  return (
    <article 
      className={getListItemContainerClasses()}
      aria-labelledby={titleId}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Header with date and category */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <time 
          dateTime={update.date}
          className={`${getMetaClasses()} font-medium`}
        >
          <span className="sr-only">投稿日: </span>
          {formatDate(update.date)}
        </time>
        <CategoryBadge category={update.category} />
      </header>

      {/* Title */}
      <h3 
        id={titleId}
        className={`${getTitleClasses()} flex items-center justify-between`}
      >
        <span>{update.title}</span>
        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </h3>
    </article>
  );
}

export default function UpdatesList({ 
  updates, 
  maxItems = 5,
  showScrollable = false,
  className = ''
}: UpdatesListProps & { showScrollable?: boolean; className?: string }) {
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateItem | null>(null);

  // Sort updates by date (newest first)
  const sortedUpdates = [...updates]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedUpdates.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">最新の更新情報はありません。</p>
      </div>
    );
  }

  // Display logic: show maxItems initially, or all if not scrollable
  const displayUpdates = showScrollable ? sortedUpdates : sortedUpdates.slice(0, maxItems);

  return (
    <>
      <section className={className} aria-labelledby="updates-heading">
        <h2 
          id="updates-heading" 
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6"
        >
          最新の更新情報
        </h2>
        
        <div 
          className={`space-y-4 ${showScrollable ? 'max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400' : ''}`}
          style={showScrollable ? { scrollbarWidth: 'thin' } : undefined}
        >
          {displayUpdates.map((update) => (
            <UpdateCard 
              key={update.id} 
              update={update} 
              onClick={() => setSelectedUpdate(update)}
            />
          ))}
        </div>

        {!showScrollable && updates.length > maxItems && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {updates.length - maxItems}件の更新情報があります
            </p>
          </div>
        )}
      </section>

      <UpdateModal 
        update={selectedUpdate} 
        onClose={() => setSelectedUpdate(null)} 
      />
    </>
  );
}