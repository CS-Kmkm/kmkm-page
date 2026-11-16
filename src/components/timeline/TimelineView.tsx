'use client';

import React from 'react';
import GitCommitLogTimeline from '@/components/ui/GitCommitLogTimeline';
import type { ExtendedCareerEntry, EventEntry } from '@/types';
import { useI18n } from '@/lib/i18n';

export interface TimelineViewProps {
  careerEntries: ExtendedCareerEntry[];
  events: EventEntry[];
  isReversed: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  careerEntries,
  events,
  isReversed
}) => {
  const { locale, messages } = useI18n();
  const hasCareerData = careerEntries.length > 0;

  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="sr-only">
        {messages.careerTimeline}
      </h2>

      {hasCareerData ? (
        <div>
          <p className="mb-2 text-xs text-gray-600 dark:text-gray-300 md:hidden">
            {locale === 'en' ? 'Scroll horizontally to read career labels. Select a career to view its full details.' : '横スクロールで経歴を確認できます。経歴を選択すると詳細を表示します。'}
          </p>
          <div className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-blue-600" role="region" aria-label={messages.careerTimeline} tabIndex={0}>
          <GitCommitLogTimeline
            entries={careerEntries}
            events={events}
            isReversed={isReversed}
            rowHeight={36}
            fitToViewport
            viewportBottomOffset={32}
          />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {messages.careerNotFound}
          </p>
        </div>
      )}
    </section>
  );
};

export default TimelineView;
