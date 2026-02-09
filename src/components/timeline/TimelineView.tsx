'use client';

import React from 'react';
import GitCommitLogTimeline from '@/components/ui/GitCommitLogTimeline';
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
        経歴タイムライン
      </h2>

      {/* Control Area */}
      <div className="mb-4 flex items-center justify-end gap-3">
        <button
          onClick={onToggleReverse}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="button"
        >
          {isReversed ? "↓ 古い順" : "↑ 新しい順"}
        </button>
      </div>

      {hasCareerData ? (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              左のブランチ図は所属の重複・派生関係を表示。色でブランチを識別。
            </p>
          </div>
          <GitCommitLogTimeline
            entries={careerEntries}
            isReversed={isReversed}
            rowHeight={28}
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
