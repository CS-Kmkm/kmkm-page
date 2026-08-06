import { describe, expect, it } from 'vitest';
import { EventCategory, type EventEntry } from '@/types';
import { filterEvents, validateDataIntegrity } from '../index';

const event = (overrides: Partial<EventEntry>): EventEntry => ({
  id: 'event',
  title: 'Event',
  description: 'Description',
  date: '2026-05-21',
  year: 2026,
  category: EventCategory.EVENT,
  displayDate: '2026-05-21',
  ...overrides,
});

const noFilters = {
  showAffiliation: false,
  showPublication: false,
  showEvent: false,
  showInternship: false,
  showAward: false,
  showOther: false,
};

describe('data filtering', () => {
  it('validates the checked-in data and generated events/updates', () => {
    expect(validateDataIntegrity()).toEqual({ isValid: true, errors: [] });
  });

  it('returns all events when no filters are active', () => {
    const events = [
      event({ id: 'affiliation', category: EventCategory.AFFILIATION }),
      event({ id: 'publication', category: EventCategory.PUBLICATION }),
    ];

    expect(filterEvents(events, noFilters)).toEqual(events);
  });

  it('filters events by selected categories', () => {
    const events = [
      event({ id: 'affiliation', category: EventCategory.AFFILIATION }),
      event({ id: 'publication', category: EventCategory.PUBLICATION }),
      event({ id: 'award', category: EventCategory.AWARD }),
      event({ id: 'other', category: EventCategory.OTHER }),
    ];

    expect(filterEvents(events, {
      ...noFilters,
      showPublication: true,
      showAward: true,
    }).map(item => item.id)).toEqual(['publication', 'award']);
  });
});
