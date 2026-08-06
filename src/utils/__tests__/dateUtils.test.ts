import { afterEach, describe, expect, it, vi } from 'vitest';
import { filterByDisplayDate, isDisplayable, parseDisplayDate } from '../dateUtils';

describe('dateUtils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('parses valid YYYY-MM-DD dates', () => {
    const date = parseDisplayDate('2026-05-21');

    expect(date).not.toBeNull();
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(4);
    expect(date?.getDate()).toBe(21);
  });

  it('rejects malformed or impossible dates', () => {
    expect(parseDisplayDate('2026-5-21')).toBeNull();
    expect(parseDisplayDate('2026-02-29')).toBeNull();
    expect(parseDisplayDate('2024-02-31')).toBeNull();
    expect(parseDisplayDate('not-a-date')).toBeNull();
  });

  it('checks displayability against a reference date', () => {
    expect(isDisplayable('2026-05-20', '2026-05-21')).toBe(true);
    expect(isDisplayable('2026-05-21', '2026-05-21')).toBe(true);
    expect(isDisplayable('2026-05-22', '2026-05-21')).toBe(false);
  });

  it('filters by display date with includeToday control and toBeAppear override', () => {
    const items = [
      { id: 'past', displayDate: '2026-05-20' },
      { id: 'today', displayDate: '2026-05-21' },
      { id: 'future', displayDate: '2026-05-22' },
      { id: 'override', displayDate: '2026-05-22', toBeAppear: true },
    ];

    expect(filterByDisplayDate(items, { referenceDate: '2026-05-21' }).map(item => item.id))
      .toEqual(['past', 'today', 'override']);
    expect(filterByDisplayDate(items, { referenceDate: '2026-05-21', includeToday: false }).map(item => item.id))
      .toEqual(['past', 'override']);
  });

  it('keeps invalid dates displayable as a fail-safe and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const items = [{ id: 'invalid', displayDate: '2026-02-29' }];

    expect(filterByDisplayDate(items, { referenceDate: '2026-05-21' })).toEqual(items);
    expect(warn).toHaveBeenCalledWith(
      'Date parsing error for item: displayDate=2026-02-29, referenceDate=2026-05-21'
    );
  });
});
