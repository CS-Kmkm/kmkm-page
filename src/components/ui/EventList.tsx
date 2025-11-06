'use client';

import React, { useState, useMemo } from 'react';
import { EventListProps, EventEntry } from '@/types';
import EventItem from './EventItem';
import EventFilters from './EventFilters';
import EventEmptyState from './EventEmptyState';
import { filterEvents } from '@/data';

const EventList: React.FC<EventListProps> = ({ events, onEventClick }) => {
  const [showAffiliation, setShowAffiliation] = useState(false);
  const [showPublication, setShowPublication] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [showInternship, setShowInternship] = useState(false);
  const [showAward, setShowAward] = useState(false);
  const [showOther, setShowOther] = useState(false);

  // Check if any filter is active
  const hasActiveFilters = showAffiliation || showPublication || showEvent || showInternship || showAward || showOther;

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    return filterEvents(events, {
      showAffiliation,
      showPublication,
      showEvent,
      showInternship,
      showAward,
      showOther
    });
  }, [events, showAffiliation, showPublication, showEvent, showInternship, showAward, showOther]);

  const handleClearFilters = () => {
    setShowAffiliation(false);
    setShowPublication(false);
    setShowEvent(false);
    setShowInternship(false);
    setShowAward(false);
    setShowOther(false);
  };

  const handleEventClick = (event: EventEntry, eventIndex: number) => {
    if (onEventClick) {
      onEventClick(event, eventIndex, filteredEvents);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <EventFilters
        showAffiliation={showAffiliation}
        showPublication={showPublication}
        showEvent={showEvent}
        showInternship={showInternship}
        showAward={showAward}
        showOther={showOther}
        onToggleAffiliation={() => setShowAffiliation(!showAffiliation)}
        onTogglePublication={() => setShowPublication(!showPublication)}
        onToggleEvent={() => setShowEvent(!showEvent)}
        onToggleInternship={() => setShowInternship(!showInternship)}
        onToggleAward={() => setShowAward(!showAward)}
        onToggleOther={() => setShowOther(!showOther)}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredEvents.length}
        totalCount={events.length}
      />

      {/* Events List */}
      <div className="space-y-4 sm:space-y-6">
        {filteredEvents.length === 0 ? (
          <EventEmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        ) : (
          filteredEvents.map((event, index) => {
            // Check if this is the first event of a new year
            const showYear = index === 0 || filteredEvents[index - 1].year !== event.year;
            
            return (
              <div key={event.id}>
                {showYear && (
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 min-w-[60px] sm:min-w-[80px]">
                      {event.year}
                    </div>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>
                )}
                <div className="ml-0 sm:ml-20 md:ml-24">
                  <EventItem 
                    event={event} 
                    onClick={() => handleEventClick(event, index)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventList;