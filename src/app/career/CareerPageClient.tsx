'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TimelineView from '@/components/timeline/TimelineView';
import ListView from '@/components/timeline/ListView';
import ViewToggleButton, { type ViewMode } from '@/components/ui/ViewToggleButton';
import EventDetailModal from '@/components/ui/EventDetailModal';
import PageHeading from '@/components/layout/PageHeading';
import type { EventEntry, ExtendedCareerEntry } from '@/types';
import { useI18n } from '@/lib/i18n';

const DEFAULT_VIEW_MODE: ViewMode = 'timeline';
const DEFAULT_REVERSED_STATE = true;

interface CareerPageClientProps {
  careerEntries: ExtendedCareerEntry[];
  events: EventEntry[];
}

interface PageHeaderProps {
  viewMode: ViewMode;
  isReversed: boolean;
  onViewChange: (view: ViewMode) => void;
  onToggleReverse: () => void;
}

function PageHeader({ viewMode, isReversed, onViewChange, onToggleReverse }: PageHeaderProps) {
  const { locale } = useI18n();
  const pageTitle = locale === 'en' ? 'Career' : '経歴';
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <PageHeading className="flex-shrink-0">{pageTitle}</PageHeading>
      <div className="flex min-w-0 items-end justify-between gap-4 sm:ml-auto sm:justify-end">
        <ViewToggleButton currentView={viewMode} onViewChange={onViewChange} />
        <div className="border-l border-gray-200 pl-4 dark:border-gray-700">
          <button
            onClick={onToggleReverse}
            className="min-h-11 border-0 bg-transparent px-0.5 pb-2 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 sm:px-1 sm:pb-3 sm:text-sm"
            aria-label={locale === 'en' ? 'Reverse career order' : '経歴の表示順を反転'}
            aria-pressed={isReversed}
            type="button"
          >
            {isReversed
              ? (locale === 'en' ? '↓ Oldest first' : '↓ 古い順')
              : (locale === 'en' ? '↑ Newest first' : '↑ 新しい順')}
          </button>
        </div>
      </div>
    </header>
  );
}

interface ViewContentProps extends CareerPageClientProps {
  viewMode: ViewMode;
  isReversed: boolean;
  onEventClick: (event: EventEntry, index: number, filtered: EventEntry[]) => void;
}

function ViewContent({
  viewMode,
  careerEntries,
  events,
  isReversed,
  onEventClick,
}: ViewContentProps) {
  return (
    <>
      <div
        id="career-timeline-panel"
        role="tabpanel"
        aria-labelledby="career-timeline-tab"
        hidden={viewMode !== 'timeline'}
      >
        {viewMode === 'timeline' && (
          <TimelineView
            careerEntries={careerEntries}
            events={events}
            isReversed={isReversed}
          />
        )}
      </div>
      <div
        id="career-list-panel"
        role="tabpanel"
        aria-labelledby="career-list-tab"
        hidden={viewMode !== 'list'}
      >
        {viewMode === 'list' && (
          <ListView
            events={events}
            isNewestFirst={isReversed}
            onEventClick={onEventClick}
          />
        )}
      </div>
    </>
  );
}

function useViewState(initialViewMode: ViewMode) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [isReversed, setIsReversed] = useState(DEFAULT_REVERSED_STATE);
  const [selectedEvent, setSelectedEvent] = useState<EventEntry | null>(null);
  const [eventIndex, setEventIndex] = useState(0);
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

  return {
    viewMode,
    isReversed,
    selectedEvent,
    eventIndex,
    filteredEvents,
    isModalOpen,
    changeViewMode: setViewMode,
    toggleReverse: () => setIsReversed((current) => !current),
    handleEventClick,
    handleCloseModal,
    handleNavigate,
  };
}

export default function CareerPageClient({ careerEntries, events }: CareerPageClientProps) {
  const searchParams = useSearchParams();
  const initialViewMode = searchParams.get('view') === 'list' ? 'list' : DEFAULT_VIEW_MODE;
  const viewState = useViewState(initialViewMode);

  return (
    <div className="w-full">
      <PageHeader
        viewMode={viewState.viewMode}
        isReversed={viewState.isReversed}
        onViewChange={viewState.changeViewMode}
        onToggleReverse={viewState.toggleReverse}
      />

      <ViewContent
        viewMode={viewState.viewMode}
        careerEntries={careerEntries}
        events={events}
        isReversed={viewState.isReversed}
        onEventClick={viewState.handleEventClick}
      />

      <EventDetailModal
        isOpen={viewState.isModalOpen}
        event={viewState.selectedEvent}
        eventIndex={viewState.eventIndex}
        filteredEvents={viewState.filteredEvents}
        onClose={viewState.handleCloseModal}
        onNavigate={viewState.handleNavigate}
      />
    </div>
  );
}
