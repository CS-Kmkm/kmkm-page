import { describe, expect, it } from 'vitest';
import { getPublications } from '../index';

const japanesePattern = /[ぁ-んァ-ヶ一-龠々ー]/;
const doiPattern = /^10\.\d{4,9}\/\S+$/;

// The ANLP annual meeting publishes its proceedings as PDFs without registering DOIs.
const isAnlpProceedingsPdf = (url: string | undefined) =>
  url?.startsWith('https://www.anlp.jp/proceedings/') === true;

describe('publication bibliographic data', () => {
  it('records an abstract for every publication', () => {
    const missing = getPublications()
      .filter(publication => (publication.abstract ?? '').trim().length === 0)
      .map(publication => publication.id);

    expect(missing).toEqual([]);
  });

  it('writes each abstract in the language the paper is written in', () => {
    getPublications().forEach(publication => {
      const abstract = publication.abstract ?? '';
      if (publication.conferenceScope === 'domestic') {
        expect(abstract, publication.id).toMatch(japanesePattern);
      } else {
        expect(abstract, publication.id).not.toMatch(japanesePattern);
      }
    });
  });

  it('records a DOI for every publication whose publisher registers one', () => {
    const missing = getPublications()
      .filter(publication => !isAnlpProceedingsPdf(publication.url) && !publication.doi)
      .map(publication => publication.id);

    expect(missing).toEqual([]);
  });

  it('stores bare, unique DOIs rather than resolver URLs', () => {
    const dois = getPublications()
      .map(publication => publication.doi)
      .filter((doi): doi is string => Boolean(doi));

    dois.forEach(doi => expect(doi).toMatch(doiPattern));
    expect(new Set(dois).size).toBe(dois.length);
  });

  it('keeps the update-feed venue label short for every publication that sets one', () => {
    getPublications().forEach(publication => {
      if (publication.shortVenue === undefined) return;
      expect(publication.shortVenue.length, publication.id)
        .toBeLessThanOrEqual(publication.venue.length);
    });
  });
});
