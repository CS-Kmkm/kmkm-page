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
import publicationsEnglishJson from '../en/publications.json';

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
    expect(getLocalizedCareerEntries('en').map(item => item.id))
      .toEqual(getCareerEntries().map(item => item.id));
    const visiblePublications = getPublications().filter(
      publication => publication.conferenceScope === 'international'
        || publication.hasOfficialEnglishTitle === true,
    );
    expect(getLocalizedPublications('en').map(item => item.id))
      .toEqual(visiblePublications.map(item => item.id));
    expect(getLocalizedTechExperience('en').map(item => item.id))
      .toEqual(getTechExperience().map(item => item.id));
    expect(getLocalizedProjectDetails('en').map(item => item.id))
      .toEqual(getProjectDetails().map(item => item.id));

    const visiblePublicationIds = new Set(visiblePublications.map(item => item.id));
    const visibleEvents = getEvents().filter(event => {
      if (event.category === 'event' && !event.id.startsWith('project-')) return false;
      if (event.category === 'publication' || event.category === 'award') {
        return [...visiblePublicationIds].some(publicationId => event.id.includes(publicationId));
      }
      return true;
    });
    const englishEvents = getLocalizedEvents('en');
    expect(englishEvents.map(item => item.id)).toEqual(visibleEvents.map(item => item.id));
    expect(englishEvents.map(item => item.id)).toEqual(expect.arrayContaining([
      'project-proj-005',
      'project-proj-006',
      'project-proj-012',
    ]));

    expect(getLocalizedTechExperience('en').map(item => item.projects))
      .toEqual(getTechExperience().map(item => item.projects));
    // Technology names are cross-reference keys into the technology registry and
    // must stay identical across locales. Labels that are not registered
    // technologies (the participation label of the non-coding event project) are
    // plain copy and may be localized.
    const registeredTechnologies = new Set(getTechExperience().map(tech => tech.name));
    const registeredNamesOf = (project: { technologies: string[] }) =>
      project.technologies.filter(name => registeredTechnologies.has(name));
    expect(getLocalizedProjectDetails('en').map(registeredNamesOf))
      .toEqual(getProjectDetails().map(registeredNamesOf));

    expect(getLocalizedProfile('en').socialLinks.map(({ id, url }) => ({ id, url })))
      .toEqual(getProfile().socialLinks.map(({ id, url }) => ({ id, url })));
    expect(getLocalizedCareerEntries('en').map(({ startDate, endDate, displayDate }) => ({ startDate, endDate, displayDate })))
      .toEqual(getCareerEntries().map(({ startDate, endDate, displayDate }) => ({ startDate, endDate, displayDate })));
    expect(getLocalizedPublications('en').map(({ date, displayDate, doi, url }) => ({ date, displayDate, doi, url })))
      .toEqual(visiblePublications.map(({ date, displayDate, doi, url }) => ({ date, displayDate, doi, url })));
    expect(getLocalizedProjectDetails('en').map(({ date, displayDate, url, githubUrl }) => ({ date, displayDate, url, githubUrl })))
      .toEqual(getProjectDetails().map(({ date, displayDate, url, githubUrl }) => ({ date, displayDate, url, githubUrl })));
    expect(englishEvents.map(({ date, displayDate, relatedLinks }) => ({ date, displayDate, relatedLinks })))
      .toEqual(visibleEvents.map(({ date, displayDate, relatedLinks }) => ({ date, displayDate, relatedLinks })));
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

  it('includes domestic publications with an official English title', () => {
    const axiesPublication = getLocalizedPublications('en').find(
      publication => publication.id === 'pub-003',
    );

    expect(axiesPublication?.title).toBe(
      'Accelerating Open Access to Research Data: Metadata Generation Using Generative AI and Its Deposition in Institutional Repositories',
    );
  });

  it('shows only international venues and papers with an official English title', () => {
    const englishIds = getLocalizedPublications('en').map(publication => publication.id);
    const hiddenIds = getPublications()
      .filter(publication => publication.conferenceScope !== 'international'
        && publication.hasOfficialEnglishTitle !== true)
      .map(publication => publication.id);

    expect(englishIds).toEqual(['pub-006', 'pub-001', 'pub-003']);
    expect(hiddenIds).toEqual(['pub-002', 'pub-004', 'pub-005']);
    hiddenIds.forEach(hiddenId => expect(englishIds).not.toContain(hiddenId));
  });

  it('carries an English overlay entry for the visible publications and none for the hidden ones', () => {
    const overlayIds = Object.keys(publicationsEnglishJson.publications).sort();
    const visibleIds = getLocalizedPublications('en').map(publication => publication.id).sort();

    expect(overlayIds).toEqual(visibleIds);
  });

  it('applies the English overlay to the publications the English page shows', () => {
    const englishPublications = getLocalizedPublications('en');
    const nslp = englishPublications.find(publication => publication.id === 'pub-006');
    const icadl = englishPublications.find(publication => publication.id === 'pub-001');

    expect(icadl?.shortVenue).toBe('ICADL 2025');
    expect(nslp?.abstract).toContain('citation counts');
    expect(icadl?.abstract).toContain('research data provenance');
  });

  it('omits prose the English overlay does not translate instead of inheriting it', () => {
    const axies = getLocalizedPublications('en').find(publication => publication.id === 'pub-003');

    // The AXIES paper has no official English abstract, so the English page shows none
    // rather than falling back to the Japanese one.
    expect(axies).not.toHaveProperty('abstract');
    expect(getPublications().find(publication => publication.id === 'pub-003')?.abstract)
      .toMatch(japanesePattern);
  });

  it('translates the tags derived from the project technology labels', () => {
    const event = getLocalizedEvents('en').find(item => item.id === 'project-proj-012');

    expect(event?.tags).toEqual(['development', 'Event Participation']);
  });

  it('localizes the participation label of the non-coding event project', () => {
    const japaneseProject = getProjectDetails().find(project => project.id === 'proj-012');
    const englishProject = getLocalizedProjectDetails('en').find(project => project.id === 'proj-012');

    expect(japaneseProject?.technologies).toEqual(['イベント参加']);
    expect(englishProject?.technologies).toEqual(['Event Participation']);
  });

  it('returns the original objects for the Japanese locale', () => {
    expect(getLocalizedProfile('ja')).toBe(getProfile());
    expect(getLocalizedCareerEntries('ja')).toEqual(getCareerEntries());
    expect(getLocalizedPublications('ja')).toEqual(getPublications());
  });
});
