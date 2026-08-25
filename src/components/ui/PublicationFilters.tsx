'use client';
import { useI18n } from '@/lib/i18n';
import FilterControls from './FilterControls';

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
    <FilterControls
      groups={groups}
      filters={props.filters}
      onToggleFilter={props.onToggleFilter}
      resultCount={props.resultCount}
      totalCount={props.totalCount}
      resultText={messages.publicationsFound(props.resultCount, props.totalCount)}
      regionLabel={messages.publicationFilters}
    />
  );
}
