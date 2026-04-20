'use client';

import React from 'react';
import GitCommitLogTimeline from '@/components/ui/GitCommitLogTimeline';
import type { ExtendedCareerEntry, EventEntry } from '@/types';

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
  const hasCareerData = careerEntries.length > 0;

  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="sr-only">
        経歴タイムライン
      </h2>

      {hasCareerData ? (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <GitCommitLogTimeline
            entries={careerEntries}
            events={events}
            isReversed={isReversed}
            rowHeight={32}
            fitToViewport
            viewportBottomOffset={32}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            経歴情報が見つかりませんでした。
          </p>
        </div>
      )}
    </section>
  );
};

export default TimelineView;
