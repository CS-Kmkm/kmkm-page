import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { PublicationEntry } from '@/types';

const SITE_URL = 'https://portfolio.example';
const ORCID = 'https://orcid.org/0009-0003-5276-1514';

async function loadModule(siteUrl?: string) {
  vi.resetModules();
  if (siteUrl) {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', siteUrl);
  } else {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
  }
  return import('../StructuredData');
}

async function loadPublications(locale: 'ja' | 'en'): Promise<PublicationEntry[]> {
  const { getLocalizedPublications } = await import('@/data/localized');
  return getLocalizedPublications(locale);
}

describe('serializeJsonLd', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('escapes characters that could terminate the script element', async () => {
    const { serializeJsonLd } = await loadModule(SITE_URL);

    const payload = serializeJsonLd({ name: '</script><script>alert(1)</script>', note: 'a & b' });

    expect(payload).not.toContain('</script');
    expect(payload).not.toContain('<');
    expect(payload).not.toContain('>');
    expect(payload).not.toContain('&');
  });

  it('keeps the escaped payload parseable back to the original data', async () => {
    const { serializeJsonLd } = await loadModule(SITE_URL);
    const data = { name: '</script>', separator: '\u2028\u2029', amp: 'A & B' };

    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });

  it('escapes the line separators that break inline scripts', async () => {
    const { serializeJsonLd } = await loadModule(SITE_URL);

    const payload = serializeJsonLd({ text: '\u2028\u2029' });

    expect(payload).not.toContain('\u2028');
    expect(payload).not.toContain('\u2029');
  });
});

describe('buildPersonSchema', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('describes the site owner as a bilingual Person entity', async () => {
    const { buildPersonSchema } = await loadModule(SITE_URL);

    const person = buildPersonSchema();

    expect(person['@context']).toBe('https://schema.org');
    expect(person['@type']).toBe('Person');
    expect(person['@id']).toBe(ORCID);
    expect(person.name).toBe('茂木光志');
    expect(person.alternateName).toContain('Koshi Motegi');
    expect(person.jobTitle).toEqual(expect.arrayContaining(['修士課程学生']));
    expect(person.url).toBe(`${SITE_URL}/ja`);
    expect(person.image).toBe(`${SITE_URL}/images/avatar.jpg`);
  });

  it('carries the ORCID both as an identifier and in sameAs', async () => {
    const { buildPersonSchema } = await loadModule(SITE_URL);

    const person = buildPersonSchema();

    expect(person.identifier).toEqual({
      '@type': 'PropertyValue',
      propertyID: 'ORCID',
      value: '0009-0003-5276-1514',
      url: ORCID,
    });
    expect(person.sameAs).toEqual(expect.arrayContaining([ORCID]));
  });

  it('lists every public profile link in sameAs', async () => {
    const { buildPersonSchema } = await loadModule(SITE_URL);

    expect(buildPersonSchema().sameAs).toEqual([
      'https://x.com/mrkow_cs',
      'https://github.com/CS-Kmkm',
      ORCID,
      'https://slp.itc.nagoya-u.ac.jp',
    ]);
  });

  it('names the affiliation in both languages and links the laboratory site', async () => {
    const { buildPersonSchema } = await loadModule(SITE_URL);

    expect(buildPersonSchema().affiliation).toEqual({
      '@type': 'Organization',
      name: '名古屋大学大学院 情報学研究科 知能システム学専攻 松原研究室',
      alternateName: 'Matsubara Laboratory, Department of Intelligent Systems, Graduate School of Informatics, Nagoya University',
      url: 'https://slp.itc.nagoya-u.ac.jp',
      parentOrganization: {
        '@type': 'CollegeOrUniversity',
        name: '名古屋大学',
        alternateName: 'Nagoya University',
      },
    });
  });

  it('omits site-relative fields when the site URL is not configured', async () => {
    const { buildPersonSchema } = await loadModule();

    const person = buildPersonSchema();

    expect(person['@id']).toBe(ORCID);
    expect(person).not.toHaveProperty('url');
    expect(person).not.toHaveProperty('image');
    expect(person.sameAs).toEqual(expect.arrayContaining([ORCID]));
  });
});

describe('buildPublicationsSchema', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('emits one ScholarlyArticle per rendered publication', async () => {
    const { buildPublicationsSchema } = await loadModule(SITE_URL);
    const publications = await loadPublications('ja');

    const schema = buildPublicationsSchema(publications);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@graph']).toHaveLength(publications.length);
    expect(new Set(schema['@graph'].map(node => node['@type']))).toEqual(new Set(['ScholarlyArticle']));
  });

  it('describes only the publications the English page shows', async () => {
    const { buildPublicationsSchema } = await loadModule(SITE_URL);
    const englishPublications = await loadPublications('en');
    const japanesePublications = await loadPublications('ja');

    const schema = buildPublicationsSchema(englishPublications);

    expect(englishPublications.length).toBeLessThan(japanesePublications.length);
    expect(schema['@graph'].map(node => node.headline)).toEqual(
      englishPublications.map(publication => publication.title),
    );
  });

  it('maps the bibliographic fields of a DOI-bearing conference paper', async () => {
    const { buildPublicationsSchema } = await loadModule(SITE_URL);
    const publications = await loadPublications('ja');
    const source = publications.find(publication => publication.id === 'pub-001')!;

    const [article] = buildPublicationsSchema([source])['@graph'];

    expect(article).toEqual({
      '@type': 'ScholarlyArticle',
      '@id': 'https://doi.org/10.1007/978-981-95-4861-3_29',
      headline: source.title,
      name: source.title,
      author: [
        { '@type': 'Person', '@id': ORCID, name: 'Koshi Motegi' },
        { '@type': 'Person', name: 'Koichiro Ito' },
        { '@type': 'Person', name: 'Shigeki Matsubara' },
      ],
      datePublished: '2025-12-04',
      inLanguage: 'en',
      abstract: source.abstract,
      url: source.url,
      sameAs: 'https://doi.org/10.1007/978-981-95-4861-3_29',
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'DOI',
        value: '10.1007/978-981-95-4861-3_29',
      },
      publication: {
        '@type': 'PublicationEvent',
        name: source.venue,
        startDate: '2025-12-04',
      },
    });
  });

  it('falls back to the source URL and the year when a paper has no DOI', async () => {
    const { buildPublicationsSchema } = await loadModule(SITE_URL);
    const publications = await loadPublications('ja');
    const source = publications.find(publication => publication.id === 'pub-002')!;

    const [article] = buildPublicationsSchema([source])['@graph'];

    expect(article['@id']).toBe(source.url);
    expect(article).not.toHaveProperty('identifier');
    expect(article).not.toHaveProperty('sameAs');
    expect(article.inLanguage).toBe('ja');
    expect(article.author).toContainEqual({ '@type': 'Person', '@id': ORCID, name: '茂木光志' });
  });

  it('carries awards granted to a publication', async () => {
    const { buildPublicationsSchema } = await loadModule(SITE_URL);
    const publications = await loadPublications('ja');
    const source = publications.find(publication => publication.id === 'pub-003')!;

    const [article] = buildPublicationsSchema([source])['@graph'];

    expect(article.award).toEqual(source.awards!.map(award => award.title));
    expect(article.author[1]).toEqual({ '@type': 'Person', '@id': ORCID, name: '茂木光志' });
  });

  it('files a journal article under its periodical instead of a publication event', async () => {
    const { buildPublicationsSchema } = await loadModule(SITE_URL);
    const journalArticle: PublicationEntry = {
      id: 'pub-journal',
      title: 'A journal paper',
      authors: ['Koshi Motegi'],
      venue: 'Journal of Testing',
      year: 2026,
      displayDate: '2026-01-01',
      date: '2026-01-15',
      isFirstAuthor: true,
      isPeerReviewed: true,
      publicationType: 'journal',
      conferenceScope: 'international',
    };

    const [article] = buildPublicationsSchema([journalArticle])['@graph'];

    expect(article.isPartOf).toEqual({ '@type': 'Periodical', name: 'Journal of Testing' });
    expect(article).not.toHaveProperty('publication');
  });

  it('drops the whitespace variant of the owner name when linking the author entity', async () => {
    const { buildPublicationsSchema } = await loadModule(SITE_URL);
    const publications = await loadPublications('ja');
    const source = publications.find(publication => publication.id === 'pub-004')!;

    const [article] = buildPublicationsSchema([source])['@graph'];

    expect(article.author[0]).toEqual({ '@type': 'Person', '@id': ORCID, name: '茂木 光志' });
  });
});

describe('<StructuredData />', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', SITE_URL);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('renders a parseable ld+json script that cannot break out of the element', async () => {
    const { default: StructuredData } = await loadModule(SITE_URL);
    const data = { '@context': 'https://schema.org', '@type': 'Person', name: '</script>' };

    const { container } = render(<StructuredData data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).not.toBeNull();
    expect(script!.innerHTML).not.toContain('</script');
    expect(JSON.parse(script!.textContent!)).toEqual(data);
  });
});
