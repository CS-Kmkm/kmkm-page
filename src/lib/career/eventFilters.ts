import { EventCategory, type EventEntry, type EventFilters } from '@/types';

export const filterEvents = (
  events: EventEntry[],
  filters: EventFilters
): EventEntry[] => {
  const hasActiveFilters = Object.values(filters).some(Boolean);

  if (!hasActiveFilters) {
    return [...events];
  }

  return events.filter(event => {
    switch (event.category) {
      case EventCategory.AFFILIATION:
        return filters.showAffiliation;
      case EventCategory.PUBLICATION:
        return filters.showPublication;
      case EventCategory.EVENT:
        return filters.showEvent;
      case EventCategory.INTERNSHIP:
        return filters.showInternship;
      case EventCategory.AWARD:
        return filters.showAward;
      case EventCategory.OTHER:
        return filters.showOther;
      default:
        return false;
    }
  });
};
