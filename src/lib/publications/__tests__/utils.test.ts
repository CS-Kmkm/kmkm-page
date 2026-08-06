import { describe, expect, it } from 'vitest';
import type { PublicationEntry } from '@/types';
import {
  filterPublications,
  formatAuthorsString,
  getPublicationScopeLabel,
  shouldShowPublicationScopeBadge,
  shouldShowPublicationTypeBadge,
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

  it('filters by authorship, peer-review status, and venue scope', () => {
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
      showDomesticConference: false,
      showInternationalConference: false,
    }).map(item => item.id)).toEqual(['domestic', 'journal']);

    expect(filterPublications(publications, {
      showFirstAuthor: false,
      showCoAuthor: false,
      showPeerReviewed: false,
      showNonPeerReviewed: false,
      showDomesticConference: false,
      showInternationalConference: true,
    }).map(item => item.id)).toEqual(['international']);
  });

  it('keeps publication and scope badge rules distinct', () => {
    expect(shouldShowPublicationTypeBadge(publication({ conferenceScope: 'domestic' }))).toBe(false);
    expect(shouldShowPublicationTypeBadge(publication({ conferenceScope: 'international' }))).toBe(true);
    expect(getPublicationScopeLabel('domestic')).toBe('国内');
    expect(getPublicationScopeLabel('international')).toBe('国外');
    expect(shouldShowPublicationScopeBadge(publication({ publicationType: 'workshop', conferenceScope: 'international' })))
      .toBe(true);
  });
});
