'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/common';
import EventList from '@/components/ui/EventList';
import EventDetailModal from '@/components/ui/EventDetailModal';
import { getEvents } from '@/data';
import { EventEntry } from '@/types';

export default function EventsPage() {
  const events = getEvents();
  const [selectedEvent, setSelectedEvent] = useState<EventEntry | null>(null);
  const [eventIndex, setEventIndex] = useState<number>(0);
  const [filteredEvents, setFilteredEvents] = useState<EventEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event: EventEntry, index: number, filtered: EventEntry[]) => {
    setSelectedEvent(event);
    setEventIndex(index);
    setFilteredEvents(filtered);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleNavigate = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < filteredEvents.length) {
      setSelectedEvent(filteredEvents[newIndex]);
      setEventIndex(newIndex);
    }
  };

  return (
    <PageLayout title="Events">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Events</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            学術・職業活動における重要なイベントを時系列で表示しています。所属の変化、論文の投稿、イベントへの参加、インターンシップなどの情報をカテゴリ別にフィルタリングできます。
          </p>
        </div>

        {/* Events List */}
        <div className="bg-white">
          {events.length > 0 ? (
            <EventList events={events} onEventClick={handleEventClick} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Events Available
              </h3>
              <p className="text-gray-500">
                イベントが登録されていません。イベントが追加されると、ここに表示されます。
              </p>
            </div>
          )}
        </div>

        {/* Event Detail Modal */}
        <EventDetailModal
          isOpen={isModalOpen}
          event={selectedEvent}
          eventIndex={eventIndex}
          filteredEvents={filteredEvents}
          onClose={handleCloseModal}
          onNavigate={handleNavigate}
        />
      </div>
    </PageLayout>
  );
}