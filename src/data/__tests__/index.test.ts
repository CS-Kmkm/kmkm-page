import { describe, expect, it } from 'vitest';
import { EventCategory, type EventEntry } from '@/types';
import { filterEvents, getEvents, validateDataIntegrity } from '../index';

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

  it('uses an award announcement URL as the related link for its event', () => {
    const awardEvent = getEvents().find(item => item.id === 'award-pub-003-0');

    expect(awardEvent?.relatedLinks).toEqual(['https://axies.jp/news/6554/']);
  });

  it.each([
    ['career-start-career-001', '名古屋大学大学院 情報学研究科 知能システム学専攻 入学'],
    ['career-start-career-000', '東海国立大学機構 情報環境部 技術補佐員として勤務開始'],
  ])('uses an appropriate career start label for %s', (id, expectedTitle) => {
    const careerEvent = getEvents().find(item => item.id === id);

    expect(careerEvent?.title).toBe(expectedTitle);
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
