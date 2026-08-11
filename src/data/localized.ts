import type {
  CareerEntry,
  EventEntry,
  ProfileInfo,
  ProjectDetail,
  PublicationEntry,
  TechItem,
  UpdateItem,
} from '@/types';
import {
  getCareerEntries,
  getEvents,
  getProfile,
  getProjectDetails,
  getPublications,
  getTechExperience,
} from './index';
import profileEnglishJson from './en/profile.json';
import careerEnglishJson from './en/career.json';
import publicationsEnglishJson from './en/publications.json';
import techExperienceEnglishJson from './en/tech-experience.json';

export type ContentLocale = 'ja' | 'en';

type ProfileOverlay = Partial<Omit<ProfileInfo, 'socialLinks'>> & {
  socialLinks?: Record<string, Partial<ProfileInfo['socialLinks'][number]>>;
};

type CareerOverlay = {
  entries: Record<string, Partial<CareerEntry>>;
};

type PublicationOverlay = {
  publications: Record<string, Partial<PublicationEntry>>;
};

type TechExperienceOverlay = {
  technologies: Record<string, Partial<TechItem>>;
  projects: Record<string, Partial<ProjectDetail>>;
};

const profileEnglish = profileEnglishJson as unknown as ProfileOverlay;
const careerEnglish = careerEnglishJson as unknown as CareerOverlay;
const publicationsEnglish = publicationsEnglishJson as unknown as PublicationOverlay;
const techExperienceEnglish = techExperienceEnglishJson as unknown as TechExperienceOverlay;

export function getLocalizedProfile(locale: ContentLocale): ProfileInfo {
  const profile = getProfile();
  if (locale === 'ja') return profile;

  return {
    ...profile,
    ...profileEnglish,
    nameEn: undefined,
    nameJa: undefined,
    socialLinks: profile.socialLinks.map(link => ({
      ...link,
      ...(profileEnglish.socialLinks?.[link.id] ?? {}),
    })),
  };
}

export function getLocalizedCareerEntries(locale: ContentLocale): CareerEntry[] {
  const entries = getCareerEntries();
  if (locale === 'ja') return entries;
  return entries.map(entry => ({ ...entry, ...(careerEnglish.entries[entry.id] ?? {}) }));
}

export function getLocalizedPublications(locale: ContentLocale): PublicationEntry[] {
  const publications = getPublications();
  if (locale === 'ja') return publications;

  return publications.map(publication => {
    const overlay = publicationsEnglish.publications[publication.id];
    return {
      ...publication,
      ...overlay,
      awards: publication.awards?.map((award, index) => ({
        ...award,
        ...(overlay?.awards?.[index] ?? {}),
      })),
    };
  });
}

export function getLocalizedTechExperience(locale: ContentLocale): TechItem[] {
  const technologies = getTechExperience();
  if (locale === 'ja') return technologies;
  return technologies.map(technology => ({
    ...technology,
    ...(techExperienceEnglish.technologies[technology.id] ?? {}),
  }));
}

export function getLocalizedProjectDetails(locale: ContentLocale): ProjectDetail[] {
  const projects = getProjectDetails();
  if (locale === 'ja') return projects;
  return projects.map(project => ({
    ...project,
    ...(techExperienceEnglish.projects[project.id] ?? {}),
  }));
}

function findEntryForEvent(eventId: string, entries: CareerEntry[]): CareerEntry | undefined {
  return entries.find(entry => eventId.endsWith(entry.id));
}

function localizeCareerEvent(event: EventEntry): EventEntry {
  const source = findEntryForEvent(event.id, getCareerEntries());
  const localized = findEntryForEvent(event.id, getLocalizedCareerEntries('en'));
  if (!source || !localized) return event;

  const isStart = event.id.startsWith('career-start-');
  const isSchool = ['小学校', '中学校', '高校', '高等学校'].some(label => source.organization.includes(label));
  const isDegree = source.role === '学士' || source.role.includes('修士');
  const isAssignment = source.role === '配属';
  let title: string;
  let description: string;

  if (isStart && (isSchool || isDegree)) {
    title = `Entered ${localized.organization}`;
    description = `Enrolled at ${localized.organization}.`;
  } else if (!isStart && (isSchool || source.role === '学士')) {
    title = `Graduated from ${localized.organization}`;
    description = `Graduated from ${localized.organization}.`;
  } else if (!isStart && source.role.includes('修士')) {
    title = `Completed studies at ${localized.organization}`;
    description = `Completed the master's program at ${localized.organization}.`;
  } else if (isAssignment) {
    title = isStart ? `Joined ${localized.organization}` : `Left ${localized.organization}`;
    description = localized.description || title;
  } else {
    title = isStart
      ? `Started as ${localized.role} at ${localized.organization}`
      : `Finished as ${localized.role} at ${localized.organization}`;
    description = localized.description || title;
  }

  const location = source.organization.includes('名古屋大学')
    ? 'Nagoya University'
    : source.organization.includes('岐阜')
      ? 'Gifu Prefecture'
      : undefined;

  return { ...event, title, description, location };
}

function publicationsForEvent(eventId: string): PublicationEntry[] {
  return getLocalizedPublications('en').filter(publication => eventId.includes(publication.id));
}

function localizePublicationEvent(event: EventEntry): EventEntry {
  const publications = publicationsForEvent(event.id);
  if (publications.length === 0) return event;
  const isUpcoming = event.title.includes('予定');
  const firstAuthor = publications.filter(publication => publication.isFirstAuthor);
  const coAuthor = publications.filter(publication => !publication.isFirstAuthor);
  const venue = publications[0].shortVenue ?? publications[0].venue;
  const label = isUpcoming ? 'Upcoming presentation' : 'Presentation';
  const title = publications.length === 1
    ? `${venue} — ${label}`
    : `${venue} — ${label} (${publications.length} papers)`;
  const description = publications.length === 1
    ? `${isUpcoming ? 'Scheduled to present' : publications[0].isFirstAuthor ? 'Presented' : 'Co-authored'} “${publications[0].title}”${publications[0].isFirstAuthor ? ' as first author' : ''}.`
    : [
        `${isUpcoming ? 'Scheduled to present' : 'Presented'} ${publications.length} papers (${firstAuthor.length} first-author, ${coAuthor.length} co-authored).`,
        firstAuthor.length > 0 ? `First author: ${firstAuthor.map(item => item.title).join('; ')}` : '',
        coAuthor.length > 0 ? `Co-author: ${coAuthor.map(item => item.title).join('; ')}` : '',
      ].filter(Boolean).join('\n');
  const publicationLinks = publications.flatMap(publication => {
    const url = publication.url ?? (publication.doi ? `https://doi.org/${publication.doi}` : undefined);
    return url ? [{ title: publication.title, url }] : [];
  });

  return {
    ...event,
    title,
    description,
    location: venue,
    publicationLinks: publicationLinks.length > 0 ? publicationLinks : undefined,
  };
}

function localizeAwardEvent(event: EventEntry): EventEntry {
  const match = /^award-(pub-[^-]+)-([0-9]+)$/.exec(event.id);
  if (!match) return event;
  const publication = getLocalizedPublications('en').find(item => item.id === match[1]);
  const award = publication?.awards?.[Number(match[2])];
  if (!publication || !award) return event;

  return {
    ...event,
    title: award.title,
    description: award.description ?? `“${publication.title}” received ${award.title}.`,
    location: award.organization ?? publication.venue,
    publicationLinks: event.publicationLinks?.map(link => ({ ...link, title: publication.title })),
  };
}

const projectLocations: Record<string, string> = {
  'トヨタシステムズ': 'Toyota Systems',
  'ラクスル': 'Raksul',
  'ハッカソン会場': 'Hackathon venue',
  'イベント会場': 'Event venue',
};

function localizeProjectEvent(event: EventEntry): EventEntry {
  const projectId = event.id.replace(/^project-/, '');
  const source = getProjectDetails().find(project => project.id === projectId);
  const project = getLocalizedProjectDetails('en').find(item => item.id === projectId);
  if (!source || !project) return event;
  const title = source.name.includes('JPHACKS') ? `${project.name} Participation` : project.name;

  return {
    ...event,
    title,
    description: project.description,
    duration: project.duration,
    location: event.location ? (projectLocations[event.location] ?? event.location) : undefined,
  };
}

export function getLocalizedEvents(locale: ContentLocale): EventEntry[] {
  const events = getEvents();
  if (locale === 'ja') return events;

  return events.map(event => {
    if (event.id.startsWith('career-')) return localizeCareerEvent(event);
    if (event.id.startsWith('award-')) return localizeAwardEvent(event);
    if (event.id.startsWith('pub-')) return localizePublicationEvent(event);
    if (event.id.startsWith('project-')) return localizeProjectEvent(event);
    return event;
  });
}

export function getLocalizedUpdates(locale: ContentLocale): UpdateItem[] {
  return getLocalizedEvents(locale).map(event => ({
    id: event.id,
    date: event.date,
    title: event.title,
    description: event.description,
    category: event.category === 'affiliation'
      ? 'career'
      : event.category === 'publication'
        ? 'publication'
        : event.category === 'award'
          ? 'award'
          : event.category === 'event' || event.category === 'internship'
            ? 'development'
            : 'other',
    publicationLinks: event.publicationLinks,
  }));
}
