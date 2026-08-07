'use client';

import FilterControls, { type FilterControlGroup } from './FilterControls';

export const PUBLICATION_FILTER_GROUPS = [
  {
    id: 'authorship',
    options: [
      { key: 'showFirstAuthor', label: '第一著者' },
      { key: 'showCoAuthor', label: '共著者' },
    ],
  },
  {
    id: 'peerReview',
    options: [
      { key: 'showPeerReviewed', label: '査読あり' },
      { key: 'showNonPeerReviewed', label: '査読なし' },
    ],
  },
  {
    id: 'scope',
    options: [
      { key: 'showDomesticConference', label: '国内' },
      { key: 'showInternationalConference', label: '国外' },
    ],
  },
] as const satisfies readonly FilterControlGroup<string>[];

export type PublicationFilterKey = typeof PUBLICATION_FILTER_GROUPS[number]['options'][number]['key'];

export const PUBLICATION_FILTER_KEYS = PUBLICATION_FILTER_GROUPS.flatMap((group) =>
  group.options.map((option) => option.key)
);

interface PublicationFiltersProps {
  filters: Record<PublicationFilterKey, boolean>;
  onToggleFilter: (key: PublicationFilterKey) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
  totalCount: number;
}

export default function PublicationFilters(props: PublicationFiltersProps) {
  return (
    <FilterControls
      groups={PUBLICATION_FILTER_GROUPS}
      filters={props.filters}
      onToggleFilter={props.onToggleFilter}
      onClearFilters={props.onClearFilters}
      hasActiveFilters={props.hasActiveFilters}
      resultCount={props.resultCount}
      totalCount={props.totalCount}
      resultNoun="論文"
    />
  );
}
