'use client';

import FilterControls, { type FilterControlGroup } from './FilterControls';
import { useI18n } from '@/lib/i18n';

export const EVENT_FILTER_GROUPS = [
  {
    id: 'category',
    options: [
      { key: 'showAffiliation', label: '所属' },
      { key: 'showPublication', label: '論文' },
      { key: 'showEvent', label: 'イベント' },
      { key: 'showInternship', label: 'インターン' },
      { key: 'showAward', label: '受賞' },
      { key: 'showOther', label: 'その他' },
    ],
  },
] as const satisfies readonly FilterControlGroup<string>[];

export type EventFilterKey = typeof EVENT_FILTER_GROUPS[number]['options'][number]['key'];

export const EVENT_FILTER_KEYS = EVENT_FILTER_GROUPS.flatMap((group) =>
  group.options.map((option) => option.key)
);

interface EventFiltersProps {
  filters: Record<EventFilterKey, boolean>;
  onToggleFilter: (key: EventFilterKey) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
  totalCount: number;
}

export default function EventFilters(props: EventFiltersProps) {
  const { locale, messages } = useI18n();
  const groups = [{ id: 'category', options: [
    { key: 'showAffiliation', label: messages.affiliation }, { key: 'showPublication', label: messages.publication },
    { key: 'showEvent', label: messages.event }, { key: 'showInternship', label: messages.internship },
    { key: 'showAward', label: messages.award }, { key: 'showOther', label: messages.other },
  ] }] as const satisfies readonly FilterControlGroup<EventFilterKey>[];
  return (
    <FilterControls
      groups={groups}
      filters={props.filters}
      onToggleFilter={props.onToggleFilter}
      onClearFilters={props.onClearFilters}
      hasActiveFilters={props.hasActiveFilters}
      resultCount={props.resultCount}
      totalCount={props.totalCount}
      resultNoun={messages.events}
      regionLabel={locale === 'en' ? 'Event filters' : 'イベントフィルタ'}
    />
  );
}
