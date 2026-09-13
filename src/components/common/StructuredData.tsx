import { getLocalizedProfile } from '@/data/localized';
import { siteConfig } from '@/lib/site';
import type { PublicationEntry } from '@/types';

/**
 * schema.org JSON-LD for the site.
 *
 * The shapes below only use properties that exist on the corresponding schema.org types:
 * Person (name, alternateName, jobTitle, description, knowsAbout, affiliation, identifier,
 * sameAs, url, image), Organization (name, alternateName, url, parentOrganization),
 * ScholarlyArticle / Article / CreativeWork (headline, name, author, datePublished, inLanguage,
 * abstract, url, sameAs, identifier, award, publication, isPartOf) and PropertyValue
 * (propertyID, value, url).
 */

export interface PropertyValueSchema {
  '@type': 'PropertyValue';
  propertyID: string;
  value: string;
  url?: string;
}

export interface OrganizationSchema {
  '@type': 'Organization';
  name: string;
  alternateName?: string;
  url?: string;
  parentOrganization?: {
    '@type': 'CollegeOrUniversity';
    name: string;
    alternateName?: string;
  };
}

export interface PersonReferenceSchema {
  '@type': 'Person';
  '@id'?: string;
  name: string;
}

export interface PersonSchema {
  '@context': 'https://schema.org';
  '@type': 'Person';
  '@id'?: string;
  name: string;
  alternateName: string[];
  jobTitle: string[];
  description: string[];
  knowsAbout: string[];
  affiliation: OrganizationSchema;
  identifier?: PropertyValueSchema;
  sameAs: string[];
  url?: string;
  image?: string;
}

export interface ScholarlyArticleSchema {
  '@type': 'ScholarlyArticle';
  '@id'?: string;
  headline: string;
  name: string;
  author: PersonReferenceSchema[];
  datePublished: string;
  inLanguage: string;
  abstract?: string;
  url?: string;
  sameAs?: string;
  identifier?: PropertyValueSchema;
  publication?: {
    '@type': 'PublicationEvent';
    name: string;
    startDate?: string;
  };
  isPartOf?: {
    '@type': 'Periodical';
    name: string;
  };
  award?: string[];
}

export interface PublicationsSchema {
  '@context': 'https://schema.org';
  '@graph': ScholarlyArticleSchema[];
}

/**
 * Serialize a JSON-LD payload for embedding in `<script type="application/ld+json">`.
 *
 * The content of a `script` element is raw text: the HTML parser does not decode entities
 * there, so entity-encoding the payload would corrupt it, while a literal `</script` (or
 * `<!--`) inside the JSON would end the element early and turn the rest of the payload into
 * markup. JSON string escapes solve both problems: the escape sequence for `<` is decoded by
 * the JSON parser back into `<` while the HTML tokenizer never sees an angle bracket. U+2028 and U+2029
 * are escaped as well: they are valid inside JSON strings but terminate a line in older
 * JavaScript parsers that may re-read the block.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function findSocialUrl(platform: string): string | undefined {
  return getLocalizedProfile('ja').socialLinks.find(link => link.platform === platform)?.url;
}

function splitInterests(interests: string | undefined): string[] {
  if (!interests) return [];
  return interests
    .split(/[、,]|\sand\s/)
    .map(interest => interest.trim())
    .filter(Boolean);
}

function normalizeName(name: string): string {
  // JavaScript's \s already covers the ideographic space used in Japanese author names.
  return name.replace(/\s/g, '').toLowerCase();
}

/**
 * The site-wide `Person` graph.
 *
 * The root layout is shared by both locale trees, so the entity is described bilingually:
 * the Japanese values stay in `name` / the first `jobTitle`, and the English ones are carried
 * by `alternateName` and the repeated values, which schema.org allows for these properties.
 * The ORCID doubles as the node identity, so the author nodes on the publications pages
 * resolve to this same entity without depending on the deployment URL.
 */
export function buildPersonSchema(): PersonSchema {
  const japanese = getLocalizedProfile('ja');
  const english = getLocalizedProfile('en');
  const orcidUrl = findSocialUrl('orcid');
  const orcidId = orcidUrl?.replace('https://orcid.org/', '');
  const laboratoryUrl = findSocialUrl('website');
  const siteUrl = siteConfig.siteUrl;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    ...(orcidUrl ? { '@id': orcidUrl } : {}),
    name: japanese.name,
    alternateName: [japanese.nameEn, japanese.nameJa].filter((name): name is string => Boolean(name)),
    jobTitle: [japanese.currentPosition, english.currentPosition].filter(Boolean),
    description: [japanese.bio, english.bio].filter((bio): bio is string => Boolean(bio)),
    knowsAbout: [
      ...splitInterests(japanese.researchInterests),
      ...splitInterests(english.researchInterests),
    ],
    affiliation: {
      '@type': 'Organization',
      name: japanese.currentAffiliation,
      alternateName: english.currentAffiliation,
      ...(laboratoryUrl ? { url: laboratoryUrl } : {}),
      ...(japanese.currentAffiliation.includes('名古屋大学')
        ? {
            parentOrganization: {
              '@type': 'CollegeOrUniversity' as const,
              name: '名古屋大学',
              alternateName: 'Nagoya University',
            },
          }
        : {}),
    },
    ...(orcidUrl && orcidId
      ? {
          identifier: {
            '@type': 'PropertyValue' as const,
            propertyID: 'ORCID',
            value: orcidId,
            url: orcidUrl,
          },
        }
      : {}),
    sameAs: japanese.socialLinks.map(link => link.url),
    // The root path redirects to /ja, so the Japanese home page is the canonical entry point.
    ...(siteUrl ? { url: `${siteUrl}/ja` } : {}),
    ...(siteUrl && japanese.avatarUrl ? { image: `${siteUrl}${japanese.avatarUrl}` } : {}),
  };
}

function buildAuthorReference(name: string): PersonReferenceSchema {
  const profile = getLocalizedProfile('ja');
  const orcidUrl = findSocialUrl('orcid');
  const ownerNames = [profile.name, profile.nameEn, profile.nameJa]
    .filter((candidate): candidate is string => Boolean(candidate))
    .map(normalizeName);
  const isOwner = ownerNames.includes(normalizeName(name));

  return {
    '@type': 'Person',
    // Authored papers list the owner under several spellings; linking them to the ORCID node
    // keeps them one entity for consumers that merge the page's JSON-LD blocks.
    ...(isOwner && orcidUrl ? { '@id': orcidUrl } : {}),
    name,
  };
}

function buildScholarlyArticleSchema(publication: PublicationEntry): ScholarlyArticleSchema {
  const doiUrl = publication.doi ? `https://doi.org/${publication.doi}` : undefined;
  const canonicalUrl = doiUrl ?? publication.url;
  const isEvent = publication.publicationType === 'conference'
    || publication.publicationType === 'workshop';

  return {
    '@type': 'ScholarlyArticle',
    ...(canonicalUrl ? { '@id': canonicalUrl } : {}),
    headline: publication.title,
    name: publication.title,
    author: publication.authors.map(buildAuthorReference),
    datePublished: publication.date ?? String(publication.year),
    // The language of the paper itself, which does not change with the page it is listed on:
    // domestic venues here are Japanese-language, even where an official English title exists.
    inLanguage: publication.conferenceScope === 'international' ? 'en' : 'ja',
    ...(publication.abstract ? { abstract: publication.abstract } : {}),
    ...(publication.url ? { url: publication.url } : {}),
    ...(doiUrl ? { sameAs: doiUrl } : {}),
    ...(publication.doi
      ? {
          identifier: {
            '@type': 'PropertyValue' as const,
            propertyID: 'DOI',
            value: publication.doi,
          },
        }
      : {}),
    ...(isEvent
      ? {
          publication: {
            '@type': 'PublicationEvent' as const,
            name: publication.venue,
            ...(publication.date ? { startDate: publication.date } : {}),
          },
        }
      : {}),
    ...(publication.publicationType === 'journal'
      ? { isPartOf: { '@type': 'Periodical' as const, name: publication.venue } }
      : {}),
    ...(publication.awards && publication.awards.length > 0
      ? { award: publication.awards.map(award => award.title) }
      : {}),
  };
}

/**
 * A `ScholarlyArticle` graph for exactly the publications a page renders. The caller passes the
 * list it displays (see `getLocalizedPublications`), so the English page never advertises the
 * papers it hides.
 */
export function buildPublicationsSchema(publications: PublicationEntry[]): PublicationsSchema {
  return {
    '@context': 'https://schema.org',
    '@graph': publications.map(buildScholarlyArticleSchema),
  };
}

export default function StructuredData({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Escaped by serializeJsonLd; see the comment on that function for why this is safe.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
