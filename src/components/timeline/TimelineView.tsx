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
  const { messages } = useI18n();
  const hasCareerData = careerEntries.length > 0;

  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="sr-only">
        {messages.careerTimeline}
      </h2>

      {hasCareerData ? (
        <div className="overflow-hidden">
          <GitCommitLogTimeline
            entries={careerEntries}
            events={events}
            isReversed={isReversed}
            rowHeight={36}
            fitToViewport
            viewportBottomOffset={32}
          />
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
