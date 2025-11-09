'use client';

import React from 'react';
import EventList from '@/components/ui/EventList';
import { EventEntry } from '@/types';

export interface ListViewProps {
  events: EventEntry[];
  onEventClick: (event: EventEntry, index: number, filtered: EventEntry[]) => void;
}

const ListView: React.FC<ListViewProps> = ({ events, onEventClick }) => {
  return (
    <section aria-labelledby="list-heading">
      <h2 id="list-heading" className="sr-only">
        Event List
      </h2>

      {/* Description - Fixed height to match TimelineView */}
      <div className="mb-6 min-h-[52px]">
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          Displaying important events in academic and professional activities in chronological order. You can filter information by category including affiliations, publications, event participation, and internships.
        </p>
      </div>

      {/* Event List */}
      {events.length > 0 ? (
        <EventList events={events} onEventClick={onEventClick} />
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M3 7h18M5 7h14l-1 14H6L5 7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            イベントが見つかりませんでした
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            イベントが登録されていません。イベントが追加されると、ここに表示されます。
          </p>
        </div>
      )}
    </section>
  );
};

export default ListView;
