import { describe, expect, it } from 'vitest';
import type { PublicationEntry } from '@/types';
import {
  filterPublications,
  formatAuthorsString,
  sortPublications,
} from '../utils';

const publication = (overrides: Partial<PublicationEntry>): PublicationEntry => ({
  id: 'publication',
  title: 'Publication',
  authors: ['Author'],
  venue: 'Venue',
  year: 2026,
  displayDate: '2026-01-01',
  isFirstAuthor: true,
  isPeerReviewed: true,
  publicationType: 'conference',
  ...overrides,
});

describe('publication utils', () => {
  it('formats authors as a comma-separated string', () => {
    expect(formatAuthorsString(['A', 'B', 'C'])).toBe('A, B, C');
    expect(formatAuthorsString([])).toBe('');
  });

  it('sorts by date, then year, then id', () => {
    const sorted = sortPublications([
      publication({ id: 'b', year: 2025, date: undefined }),
      publication({ id: 'a', year: 2025, date: undefined }),
      publication({ id: 'dated-old', date: '2026-01-01' }),
      publication({ id: 'dated-new', date: '2026-02-01' }),
    ]);

    expect(sorted.map(item => item.id)).toEqual(['dated-new', 'dated-old', 'a', 'b']);
  });

  it('filters by authorship and peer-review status', () => {
    const publications = [
      publication({ id: 'domestic', isFirstAuthor: true, isPeerReviewed: false, conferenceScope: 'domestic' }),
      publication({ id: 'international', isFirstAuthor: false, isPeerReviewed: true, conferenceScope: 'international' }),
      publication({ id: 'journal', publicationType: 'journal', isFirstAuthor: true, isPeerReviewed: true }),
    ];

    expect(filterPublications(publications, {
      showFirstAuthor: true,
      showCoAuthor: false,
      showPeerReviewed: false,
      showNonPeerReviewed: false,
    }).map(item => item.id)).toEqual(['domestic', 'journal']);

    expect(filterPublications(publications, {
      showFirstAuthor: false,
      showCoAuthor: false,
      showPeerReviewed: true,
      showNonPeerReviewed: false,
    }).map(item => item.id)).toEqual(['international', 'journal']);
  });
});
