import { describe, expect, it } from 'vitest';
import { getTechnologyCategoryMetadata } from '../categories';
import type { TechItem } from '@/types';

describe('technology category metadata', () => {
  it('returns fallback metadata for an invalid runtime category', () => {
    const invalidCategory = 'platfrom' as TechItem['category'];

    expect(getTechnologyCategoryMetadata(invalidCategory)).toEqual({
      icon: '📦',
      label: 'platfrom',
    });
  });
});
