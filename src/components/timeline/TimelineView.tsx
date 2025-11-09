'use client';

import React from 'react';
import GitBranchTimeline from '@/components/ui/GitBranchTimeline';
import { ExtendedCareerEntry, TimelineEventEntry } from '@/types';

export interface TimelineViewProps {
  careerEntries: ExtendedCareerEntry[];
  timelineEvents: TimelineEventEntry[];
  isReversed: boolean;
  onToggleReverse: () => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  careerEntries,
  timelineEvents,
  isReversed,
  onToggleReverse
}) => {
  const hasCareerData = careerEntries.length > 0;

  return (
    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="sr-only">
        Career Timeline
      </h2>

      {/* Control Area - Fixed height to match ListView */}
      <div className="mb-6 min-h-[52px] flex items-start justify-end">
        <button
          onClick={onToggleReverse}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label="Reverse branch order"
          type="button"
        >
          {isReversed ? "↓" : "↑"} Reverse Order
        </button>
      </div>

      {/* Timeline Content */}
      {hasCareerData ? (
        <GitBranchTimeline
          entries={careerEntries}
          events={timelineEvents}
          enableEventPoints={true}
          className="px-2 sm:px-4"
          isReversed={isReversed}
        />
      ) : (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
            経歴情報が見つかりませんでした。
          </p>
        </div>
      )}
    </section>
  );
};

export default TimelineView;
