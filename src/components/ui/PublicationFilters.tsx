'use client';
import { useI18n } from '@/lib/i18n';

export const PUBLICATION_FILTER_GROUPS = [
  {
    id: 'authorship',
    label: '著者',
    ariaLabel: '著者区分',
    options: [
      { key: 'showFirstAuthor', label: '主著' },
      { key: 'showCoAuthor', label: '共著' },
    ],
  },
  {
    id: 'peerReview',
    label: '査読',
    ariaLabel: '査読区分',
    options: [
      { key: 'showPeerReviewed', label: 'あり' },
      { key: 'showNonPeerReviewed', label: 'なし' },
    ],
  },
] as const;

export type PublicationFilterKey = typeof PUBLICATION_FILTER_GROUPS[number]['options'][number]['key'];

export const PUBLICATION_FILTER_KEYS = PUBLICATION_FILTER_GROUPS.flatMap((group) =>
  group.options.map((option) => option.key)
);

interface PublicationFiltersProps {
  filters: Record<PublicationFilterKey, boolean>;
  onToggleFilter: (key: PublicationFilterKey) => void;
  resultCount: number;
  totalCount: number;
}

export default function PublicationFilters(props: PublicationFiltersProps) {
  const { messages } = useI18n();
  const groups = [
    { id: 'authorship', label: messages.authors, ariaLabel: messages.authorship, options: [{ key: 'showFirstAuthor', label: messages.firstAuthor }, { key: 'showCoAuthor', label: messages.coAuthor }] },
    { id: 'peerReview', label: messages.peerReview, ariaLabel: messages.peerReviewType, options: [{ key: 'showPeerReviewed', label: messages.yes }, { key: 'showNonPeerReviewed', label: messages.no }] },
  ] as const;
  return (
    <div
      role="region"
      aria-label={messages.publicationFilters}
      className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-gray-200/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-sm dark:border-gray-700/80 dark:bg-gray-800/60 sm:w-auto"
    >
      {groups.map((group) => (
        <div
          key={group.id}
          role="group"
          aria-label={group.ariaLabel}
          className="flex items-center gap-1.5"
        >
          <span className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400">
            {group.label}
          </span>
          <div className="inline-flex rounded-lg bg-gray-100 p-0.5 ring-1 ring-inset ring-gray-200 dark:bg-gray-900/70 dark:ring-gray-700">
            {group.options.map((option) => {
              const isActive = props.filters[option.key];

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => props.onToggleFilter(option.key)}
                  aria-pressed={isActive}
                  className={`min-h-9 rounded-md px-2.5 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 sm:text-sm ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-sm dark:bg-gray-100 dark:text-gray-900'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="ml-auto flex items-center gap-1.5">
        <span
          className="whitespace-nowrap text-xs tabular-nums text-gray-500 dark:text-gray-400"
          aria-live="polite"
        >
          {messages.publicationsFound(props.resultCount, props.totalCount)}
        </span>
      </div>
    </div>
  );
}
