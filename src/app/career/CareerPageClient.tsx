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
  onToggleView: () => void;
  onToggleReverse: () => void;
}

function PageHeader({ viewMode, isReversed, onToggleView, onToggleReverse }: PageHeaderProps) {
  const { locale } = useI18n();
  const pageTitle = locale === 'en' ? 'Career' : '経歴';
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <PageHeading compact className="flex-shrink-0">{pageTitle}</PageHeading>
        <div className="sm:ml-auto flex-shrink-0 flex items-center gap-2 sm:gap-3">
          <ViewToggleButton currentView={viewMode} onToggle={onToggleView} />
          {viewMode === 'timeline' && (
            <button
              onClick={onToggleReverse}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={locale === 'en' ? 'Reverse branch order' : 'ブランチの順序を反転'}
              aria-pressed={isReversed}
              type="button"
            >
              {isReversed
                ? (locale === 'en' ? '↓ Oldest first' : '↓ 古い順')
                : (locale === 'en' ? '↑ Newest first' : '↑ 新しい順')}
            </button>
          )}
        </div>
      </div>
    </div>
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
  if (viewMode === 'timeline') {
    return (
      <TimelineView
        careerEntries={careerEntries}
        events={events}
        isReversed={isReversed}
      />
    );
  }

  return <ListView events={events} onEventClick={onEventClick} />;
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
    toggleViewMode: () => setViewMode((current) => current === 'timeline' ? 'list' : 'timeline'),
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
        onToggleView={viewState.toggleViewMode}
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
