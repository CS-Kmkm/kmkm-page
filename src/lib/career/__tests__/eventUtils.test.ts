import { describe, expect, it } from 'vitest';
import type { TimelineEventEntry } from '@/types';
import {
  generateEventPointDescription,
  groupEventsByYear,
  isValidEventDate,
  validateEventData,
} from '../eventUtils';

const event = (overrides: Partial<TimelineEventEntry>): TimelineEventEntry => ({
  id: 'event',
  title: 'Event',
  date: '2026-05-21',
  description: 'Description',
  year: '2026',
  ...overrides,
});

describe('eventUtils', () => {
  it('validates strict event dates', () => {
    expect(isValidEventDate('2024-02-29')).toBe(true);
    expect(isValidEventDate('2026-02-29')).toBe(false);
    expect(isValidEventDate('2026-02-31')).toBe(false);
    expect(isValidEventDate('2026-2-01')).toBe(false);
  });

  it('groups events by year and sorts years and events chronologically', () => {
    const groups = groupEventsByYear([
      event({ id: 'late', date: '2026-12-01' }),
      event({ id: 'early', date: '2026-01-01' }),
      event({ id: 'previous', date: '2025-06-01' }),
    ]);

    expect(groups.map(group => group.year)).toEqual(['2025', '2026']);
    expect(groups[1].events.map(item => item.id)).toEqual(['early', 'late']);
  });

  it('reports missing fields, invalid dates, and duplicate ids', () => {
    const errors = validateEventData([
      event({ id: '', title: '', date: '', description: '' }),
      event({ id: 'invalid', date: 'not-a-date' }),
      event({ id: 'duplicate' }),
      event({ id: 'duplicate' }),
    ]);

    expect(errors.map(error => error.type)).toEqual(expect.arrayContaining([
      'missing_field',
      'invalid_date',
      'duplicate_id',
    ]));
  });

  it('generates accessible descriptions for one or multiple events', () => {
    expect(generateEventPointDescription({ year: '2026', events: [event({ title: 'Talk' })] }))
      .toBe('2026年のイベント: Talk。クリックして詳細を表示。');
    expect(generateEventPointDescription({ year: '2026', events: [event({ id: 'a' }), event({ id: 'b' })] }))
      .toBe('2026年に2件のイベント。クリックしてリストを表示。');
  });
});
