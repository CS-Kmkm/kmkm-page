'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/common';
import TimelineView from '@/components/timeline/TimelineView';
import ListView from '@/components/timeline/ListView';
import ViewToggleButton, { ViewMode } from '@/components/ui/ViewToggleButton';
import EventDetailModal from '@/components/ui/EventDetailModal';
import { getCareerEntries, getTimelineEvents, getEvents } from '@/data';
import { ExtendedCareerEntry, TimelineEventEntry, EventEntry } from '@/types';

// Constants
const DEFAULT_VIEW_MODE: ViewMode = 'timeline';
const DEFAULT_REVERSED_STATE = true;
const PAGE_TITLE = '経歴';

// Component for breadcrumb navigation
function BreadcrumbNavigation() {
  return (
    <nav aria-label="パンくずナビゲーション" className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <Link
            href="/"
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="トップページに戻る"
          >
            トップ
          </Link>
        </li>
        <li aria-hidden="true" className="text-gray-400 dark:text-gray-500">/</li>
        <li className="text-gray-900 dark:text-gray-100 font-medium" aria-current="page">
          {PAGE_TITLE}
        </li>
      </ol>
    </nav>
  );
}

// Component for page header with view toggle
interface PageHeaderProps {
  viewMode: ViewMode;
  onToggleView: () => void;
}

function PageHeader({ viewMode, onToggleView }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 flex-shrink-0">
          {PAGE_TITLE}
        </h1>
        <div className="sm:ml-auto flex-shrink-0">
          <ViewToggleButton
            currentView={viewMode}
            onToggle={onToggleView}
          />
        </div>
      </div>
    </div>
  );
}

// Component for view content
interface ViewContentProps {
  viewMode: ViewMode;
  careerEntries: ExtendedCareerEntry[];
  timelineEvents: TimelineEventEntry[];
  events: EventEntry[];
  isReversed: boolean;
  onToggleReverse: () => void;
  onEventClick: (event: EventEntry, index: number, filtered: EventEntry[]) => void;
}

function ViewContent({
  viewMode,
  careerEntries,
  timelineEvents,
  events,
  isReversed,
  onToggleReverse,
  onEventClick
}: ViewContentProps) {
  if (viewMode === 'timeline') {
    return (
      <TimelineView
        careerEntries={careerEntries}
        timelineEvents={timelineEvents}
        isReversed={isReversed}
        onToggleReverse={onToggleReverse}
      />
    );
  }

  return <ListView events={events} onEventClick={onEventClick} />;
}

// Custom hook for career and event data
function useCareerData() {
  return useMemo(() => {
    const careerEntries = getCareerEntries() as ExtendedCareerEntry[];
    const timelineEvents = getTimelineEvents();
    const events = getEvents();
    
    return {
      careerEntries,
      timelineEvents,
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
  const { careerEntries, timelineEvents, events } = useCareerData();
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
    <PageLayout
      title={PAGE_TITLE}
      className="w-[90%] max-w-7xl mx-auto px-4"
    >
      <div className="w-full">
        <BreadcrumbNavigation />
        
        <PageHeader 
          viewMode={viewMode}
          onToggleView={toggleViewMode}
        />
        
        <ViewContent
          viewMode={viewMode}
          careerEntries={careerEntries}
          timelineEvents={timelineEvents}
          events={events}
          isReversed={isReversed}
          onToggleReverse={toggleReverse}
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
    </PageLayout>
  );
}