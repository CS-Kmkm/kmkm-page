import { describe, expect, it } from 'vitest';
import { createTechCategoryLookup, sortTechnologyNames } from '../devExperience';
import type { TechItem } from '@/types';

describe('development experience helpers', () => {
  it('sorts technologies by category while preserving order within each category', () => {
    const techItems: Array<Pick<TechItem, 'name' | 'category'>> = [
      { name: 'Tool A', category: 'tool' },
      { name: 'Language A', category: 'language' },
      { name: 'Framework A', category: 'framework' },
      { name: 'Database A', category: 'database' },
    ];

    const categories = createTechCategoryLookup(techItems);

    expect(sortTechnologyNames([
      'Unknown A',
      'Tool A',
      'Language A',
      'Unknown B',
      'Database A',
      'Framework A',
    ], categories)).toEqual([
      'Language A',
      'Framework A',
      'Database A',
      'Tool A',
      'Unknown A',
      'Unknown B',
    ]);
  });
});
