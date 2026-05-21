import { describe, expect, it } from 'vitest';
import type { ExtendedCareerEntry } from '@/types';
import { detectCircularReferences, isValidDate, validateCareerData, validateMaxDepth } from '../validation';

const entry = (overrides: Partial<ExtendedCareerEntry>): ExtendedCareerEntry => ({
  id: 'entry',
  year: '2026',
  organization: 'Org',
  role: 'Role',
  startDate: '2026-01-01',
  displayDate: '2026-01-01',
  ...overrides,
});

describe('career validation', () => {
  it('validates strict YYYY-MM-DD calendar dates', () => {
    expect(isValidDate('2024-02-29')).toBe(true);
    expect(isValidDate('2026-02-29')).toBe(false);
    expect(isValidDate('2026-02-31')).toBe(false);
    expect(isValidDate('2026-2-01')).toBe(false);
    expect(isValidDate(null)).toBe(true);
    expect(isValidDate(undefined)).toBe(true);
  });

  it('reports missing fields, invalid parents, invalid merge targets, and reversed dates', () => {
    const errors = validateCareerData([
      entry({ id: '', organization: '', role: '', startDate: '' }),
      entry({ id: 'child', parentId: 'missing-parent' }),
      entry({ id: 'merge', mergeTargets: [{ type: 'entry', id: 'missing-target' }] }),
      entry({ id: 'date', startDate: '2026-02-01', endDate: '2026-01-01' }),
    ]);

    expect(errors.map(error => error.type)).toEqual(expect.arrayContaining([
      'missing_field',
      'invalid_parent',
      'invalid_merge_target',
      'invalid_date',
    ]));
  });

  it('detects circular parent references', () => {
    expect(detectCircularReferences([
      entry({ id: 'a', parentId: 'b' }),
      entry({ id: 'b', parentId: 'a' }),
    ])).toEqual(['b']);
  });

  it('reports entries deeper than the maximum branch depth', () => {
    expect(validateMaxDepth([
      entry({ id: 'root' }),
      entry({ id: 'child', parentId: 'root' }),
      entry({ id: 'grandchild', parentId: 'child' }),
    ], 2)).toEqual(['grandchild']);
  });
});
