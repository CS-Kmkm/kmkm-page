'use client';

import { useMemo } from 'react';
import type { EventEntry, EventListProps } from '@/types';
import { useBooleanFilters } from '@/hooks/useBooleanFilters';
import { filterEvents } from '@/lib/career/eventFilters';
import EventEmptyState from './EventEmptyState';
import EventFilters, { EVENT_FILTER_KEYS } from './EventFilters';
import EventItem from './EventItem';
import YearGroupedList from './YearGroupedList';

const EventList = ({ events, isNewestFirst = true, onEventClick }: EventListProps) => {
  const {
    filters,
    hasActiveFilters,
    toggleFilter,
    clearFilters
  } = useBooleanFilters(EVENT_FILTER_KEYS);

  const filteredEvents = useMemo(
    () => filterEvents(events, filters),
    [events, filters]
  );

  const orderedEvents = useMemo(
    () => isNewestFirst ? filteredEvents : [...filteredEvents].reverse(),
    [filteredEvents, isNewestFirst]
  );

  const handleEventClick = (event: EventEntry, eventIndex: number) => {
    onEventClick?.(event, eventIndex, orderedEvents);
  };

  return (
    <div className="space-y-6">
      <EventFilters
        filters={filters}
        onToggleFilter={toggleFilter}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredEvents.length}
        totalCount={events.length}
      />

      <div className="space-y-4 sm:space-y-6">
        {filteredEvents.length === 0 ? (
          <EventEmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          <YearGroupedList
            items={orderedEvents}
            getKey={event => event.id}
            getYear={event => event.year}
            renderItem={(event, index) => (
              <EventItem
                event={event}
                onClick={() => handleEventClick(event, index)}
              />
            )}
          />
        )}
      </div>
    </div>
  );
};

export default EventList;
