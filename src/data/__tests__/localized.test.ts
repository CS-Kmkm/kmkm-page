import { describe, expect, it } from 'vitest';
import {
  getCareerEntries,
  getEvents,
  getProfile,
  getProjectDetails,
  getPublications,
  getTechExperience,
} from '../index';
import {
  getLocalizedCareerEntries,
  getLocalizedEvents,
  getLocalizedProfile,
  getLocalizedProjectDetails,
  getLocalizedPublications,
  getLocalizedTechExperience,
  getLocalizedUpdates,
} from '../localized';

const japanesePattern = /[ぁ-んァ-ヶ一-龠々ー]/;

function userFacingStrings(value: unknown, key = ''): string[] {
  if (typeof value === 'string') {
    return ['id', 'date', 'displayDate', 'url', 'doi', 'imageUrl', 'logoUrl'].some(token => key.toLowerCase().includes(token.toLowerCase()))
      ? []
      : [value];
  }
  if (Array.isArray(value)) return value.flatMap(item => userFacingStrings(item, key));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([childKey, child]) => userFacingStrings(child, childKey));
  }
  return [];
}

describe('localized portfolio data', () => {
  it('preserves source IDs and cross-reference fields in English overlays', () => {
    const pairs = [
      [getCareerEntries(), getLocalizedCareerEntries('en')],
      [getPublications(), getLocalizedPublications('en')],
      [getTechExperience(), getLocalizedTechExperience('en')],
      [getProjectDetails(), getLocalizedProjectDetails('en')],
      [getEvents(), getLocalizedEvents('en')],
    ] as const;

    for (const [source, english] of pairs) {
      expect(english.map(item => item.id)).toEqual(source.map(item => item.id));
    }

    expect(getLocalizedTechExperience('en').map(item => item.projects))
      .toEqual(getTechExperience().map(item => item.projects));
    expect(getLocalizedProjectDetails('en').map(item => item.technologies))
      .toEqual(getProjectDetails().map(item => item.technologies));

    expect(getLocalizedProfile('en').socialLinks.map(({ id, url }) => ({ id, url })))
      .toEqual(getProfile().socialLinks.map(({ id, url }) => ({ id, url })));
    expect(getLocalizedCareerEntries('en').map(({ startDate, endDate, displayDate }) => ({ startDate, endDate, displayDate })))
      .toEqual(getCareerEntries().map(({ startDate, endDate, displayDate }) => ({ startDate, endDate, displayDate })));
    expect(getLocalizedPublications('en').map(({ date, displayDate, doi, url }) => ({ date, displayDate, doi, url })))
      .toEqual(getPublications().map(({ date, displayDate, doi, url }) => ({ date, displayDate, doi, url })));
    expect(getLocalizedProjectDetails('en').map(({ date, displayDate, url, githubUrl }) => ({ date, displayDate, url, githubUrl })))
      .toEqual(getProjectDetails().map(({ date, displayDate, url, githubUrl }) => ({ date, displayDate, url, githubUrl })));
    expect(getLocalizedEvents('en').map(({ date, displayDate, relatedLinks }) => ({ date, displayDate, relatedLinks })))
      .toEqual(getEvents().map(({ date, displayDate, relatedLinks }) => ({ date, displayDate, relatedLinks })));
  });

  it('returns English profile, content records, generated events, and updates', () => {
    const englishContent = [
      getLocalizedProfile('en'),
      getLocalizedCareerEntries('en'),
      getLocalizedPublications('en'),
      getLocalizedTechExperience('en'),
      getLocalizedProjectDetails('en'),
      getLocalizedEvents('en'),
      getLocalizedUpdates('en'),
    ];
    const japaneseStrings = userFacingStrings(englishContent).filter(value => japanesePattern.test(value));

    expect(getLocalizedProfile('en').name).toBe('Koshi Motegi');
    expect(japaneseStrings).toEqual([]);
  });

  it('returns the original objects for the Japanese locale', () => {
    expect(getLocalizedProfile('ja')).toBe(getProfile());
    expect(getLocalizedCareerEntries('ja')).toEqual(getCareerEntries());
    expect(getLocalizedPublications('ja')).toEqual(getPublications());
  });
});
