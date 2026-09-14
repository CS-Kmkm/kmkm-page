import { describe, expect, it } from 'vitest';
import { getMessages, localeFromPathname } from '../index';

describe('localeFromPathname', () => {
  it.each([
    ['/', 'ja'],
    ['/ja', 'ja'],
    ['/ja/career', 'ja'],
    ['/en', 'en'],
    ['/en/career', 'en'],
    ['/en/does-not-exist', 'en'],
    ['/english', 'ja'],
    ['/enigma/career', 'ja'],
    [null, 'ja'],
    [undefined, 'ja'],
  ] as const)('resolves %s to %s', (pathname, expected) => {
    expect(localeFromPathname(pathname)).toBe(expected);
  });
});

describe('message catalogues', () => {
  it('defines the same keys for both locales', () => {
    expect(Object.keys(getMessages('en')).sort()).toEqual(Object.keys(getMessages('ja')).sort());
  });

  it.each(['notFoundTitle', 'notFoundDescription', 'notFoundSuggestions', 'career', 'devExperience', 'errorTitle', 'errorDescription', 'errorDetails'] as const)(
    'provides %s in both locales',
    (key) => {
      expect(getMessages('ja')[key]).toBeTruthy();
      expect(getMessages('en')[key]).toBeTruthy();
    },
  );

  it('keeps the English catalogue free of Japanese copy for the shared status pages', () => {
    const japanesePattern = /[ぁ-んァ-ヶ一-龠々ー]/;
    const en = getMessages('en');
    const statusPageCopy = [
      en.loading,
      en.notFoundTitle,
      en.notFoundDescription,
      en.notFoundSuggestions,
      en.career,
      en.devExperience,
      en.publications,
      en.errorTitle,
      en.errorDescription,
      en.errorDetails,
      en.reload,
      en.backToTop,
    ].join('\n');

    expect(statusPageCopy).not.toMatch(japanesePattern);
  });
});
