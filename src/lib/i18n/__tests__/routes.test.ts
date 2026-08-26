import { describe, expect, it } from 'vitest';
import { localizeHref } from '../index';

describe('localized routes', () => {
  it.each([
    ['ja', '/', '/ja'],
    ['ja', '/career', '/ja/career'],
    ['en', '/', '/en'],
    ['en', '/career', '/en/career'],
  ] as const)('maps %s %s to %s', (locale, href, expected) => {
    expect(localizeHref(href, locale)).toBe(expected);
  });
});
