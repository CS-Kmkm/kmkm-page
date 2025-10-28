'use client';

import { useState } from 'react';
import { UpdatesListProps, UpdateItem } from '@/types';

// Category configuration for badges
const categoryConfig = {
  career: {
    label: 'キャリア',
    color: 'bg-blue-100 text-blue-900 border border-blue-200',
    icon: '👔'
  },
  development: {
    label: '開発',
    color: 'bg-green-100 text-green-900 border border-green-200',
    icon: '💻'
  },
  publication: {
    label: '論文',
    color: 'bg-purple-100 text-purple-900 border border-purple-200',
    icon: '📄'
  },
  other: {
    label: 'その他',
    color: 'bg-gray-100 text-gray-900 border border-gray-200',
    icon: '📝'
  }
};

function CategoryBadge({ category }: { category: UpdateItem['category'] }) {
  const config = categoryConfig[category];
  
  return (
    <span 
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
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
      className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-white/30"
      onClick={onClose}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div 
        className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-200/50"
        onClick={(e) => e.stopPropagation()}
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <time 
                  dateTime={update.date}
                  className="text-sm text-gray-500 font-medium"
                >
                  {formatDate(update.date)}
                </time>
                <CategoryBadge category={update.category} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {update.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="閉じる"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <div className="prose prose-gray max-w-none">
            <p className="text-base text-gray-700 leading-relaxed">
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
      className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
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
          className="text-xs sm:text-sm text-gray-500 font-medium"
        >
          <span className="sr-only">投稿日: </span>
          {formatDate(update.date)}
        </time>
        <CategoryBadge category={update.category} />
      </header>

      {/* Title */}
      <h3 
        id={titleId}
        className="text-base sm:text-lg font-semibold text-gray-900 leading-tight flex items-center justify-between"
      >
        <span>{update.title}</span>
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <p className="text-gray-500">最新の更新情報はありません。</p>
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
          className="text-2xl font-bold text-gray-900 mb-6"
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
            <p className="text-sm text-gray-500">
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