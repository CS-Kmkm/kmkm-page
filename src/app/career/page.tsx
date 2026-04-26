'use client';

import { useState, useMemo } from 'react';
import { PageLayout } from '@/components/common';
import TimelineView from '@/components/timeline/TimelineView';
import ListView from '@/components/timeline/ListView';
import ViewToggleButton, { ViewMode } from '@/components/ui/ViewToggleButton';
import EventDetailModal from '@/components/ui/EventDetailModal';
import { getCareerEntries, getEvents } from '@/data';
import { ExtendedCareerEntry, EventEntry } from '@/types';

// Constants
const DEFAULT_VIEW_MODE: ViewMode = 'timeline';
const DEFAULT_REVERSED_STATE = true;
const PAGE_TITLE = '経歴';

// Component for page header with view toggle
interface PageHeaderProps {
  viewMode: ViewMode;
  isReversed: boolean;
  onToggleView: () => void;
  onToggleReverse: () => void;
}

function PageHeader({ viewMode, isReversed, onToggleView, onToggleReverse }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex-shrink-0">
          {PAGE_TITLE}
        </h1>
        <div className="sm:ml-auto flex-shrink-0 flex items-center gap-2 sm:gap-3">
          <ViewToggleButton
            currentView={viewMode}
            onToggle={onToggleView}
          />
          {viewMode === 'timeline' && (
            <button
              onClick={onToggleReverse}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="ブランチの順序を反転"
              aria-pressed={isReversed}
              type="button"
            >
              {isReversed ? "↓ 古い順" : "↑ 新しい順"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for view content
interface ViewContentProps {
  viewMode: ViewMode;
  careerEntries: ExtendedCareerEntry[];
  events: EventEntry[];
  isReversed: boolean;
  onEventClick: (event: EventEntry, index: number, filtered: EventEntry[]) => void;
}

function ViewContent({
  viewMode,
  careerEntries,
  events,
  isReversed,
  onEventClick
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

// Custom hook for career and event data
function useCareerData() {
  return useMemo(() => {
    const careerEntries = getCareerEntries() as ExtendedCareerEntry[];
    const events = getEvents();
    
    return {
      careerEntries,
      events
    };
  }, []);
}

// Custom hook for view state management
function useViewState() {
  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE);
  const [isReversed, setIsReversed] = useState(DEFAULT_REVERSED_STATE);
  const [selectedEvent, setSelectedEvent] = useState<EventEntry | null>(null);
  const [eventIndex, setEventIndex] = useState<number>(0);
  const [filteredEvents, setFilteredEvents] = useState<EventEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'timeline' ? 'list' : 'timeline');
  };
  
  const toggleReverse = () => {
    setIsReversed(prev => !prev);
  };

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
    toggleViewMode,
    toggleReverse,
    handleEventClick,
    handleCloseModal,
    handleNavigate
  };
}

// Main component
export default function CareerPage() {
  const { careerEntries, events } = useCareerData();
  const {
    viewMode,
    isReversed,
    selectedEvent,
    eventIndex,
    filteredEvents,
    isModalOpen,
    toggleViewMode,
    toggleReverse,
    handleEventClick,
    handleCloseModal,
    handleNavigate
  } = useViewState();

  return (
    <PageLayout title={PAGE_TITLE}>
      <div className="w-[90%] max-w-7xl mx-auto px-4">
        <div className="w-full">
          <PageHeader 
            viewMode={viewMode}
            isReversed={isReversed}
            onToggleView={toggleViewMode}
            onToggleReverse={toggleReverse}
          />
          
          <ViewContent
            viewMode={viewMode}
            careerEntries={careerEntries}
            events={events}
            isReversed={isReversed}
            onEventClick={handleEventClick}
          />

          {/* Event Detail Modal for List View */}
          <EventDetailModal
            isOpen={isModalOpen}
            event={selectedEvent}
            eventIndex={eventIndex}
            filteredEvents={filteredEvents}
            onClose={handleCloseModal}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </PageLayout>
  );
}
