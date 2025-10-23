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
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
        ${config.color}
      `}
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

function UpdateCard({ update }: { update: UpdateItem }) {
  const titleId = `update-title-${update.id}`;
  
  return (
    <article 
      className="
        bg-white border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6
        hover:shadow-md transition-shadow duration-200
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
      "
      aria-labelledby={titleId}
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
        className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight"
      >
        {update.title}
      </h3>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        {update.description}
      </p>
    </article>
  );
}

export default function UpdatesList({ 
  updates, 
  maxItems = 5,
  className = ''
}: UpdatesListProps & { className?: string }) {
  // Sort updates by date (newest first) and limit to maxItems
  const sortedUpdates = [...updates]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxItems);

  if (sortedUpdates.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">最新の更新情報はありません。</p>
      </div>
    );
  }

  return (
    <section className={className} aria-labelledby="updates-heading">
      <h2 
        id="updates-heading" 
        className="text-2xl font-bold text-gray-900 mb-6"
      >
        最新の更新情報
      </h2>
      
      <div className="space-y-4">
        {sortedUpdates.map((update) => (
          <UpdateCard key={update.id} update={update} />
        ))}
      </div>

      {updates.length > maxItems && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {updates.length - maxItems}件の更新情報があります
          </p>
        </div>
      )}
    </section>
  );
}