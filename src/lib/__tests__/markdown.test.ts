import { describe, expect, it } from 'vitest';
import { prefersMarkdown, prose, renderMarkdown, renderMarkdown404 } from '../markdown';
import { getLocalizedPublications } from '@/data/localized';

describe('Markdown negotiation', () => {
  it.each([null, '*/*', 'text/html', 'text/markdown;q=0', 'text/markdown;q=0.3,text/html;q=0.8', 'text/markdown;q=oops'])('keeps HTML for %s', accept => {
    expect(prefersMarkdown(accept)).toBe(false);
  });
  it.each(['text/markdown', 'text/markdown,text/html', 'text/html;q=0.2,text/markdown;q=0.8'])('selects explicit Markdown for %s', accept => {
    expect(prefersMarkdown(accept)).toBe(true);
  });
  it('escapes HTML and Markdown control characters', () => {
    expect(prose('<script>*x*</script>')).toBe('&lt;script&gt;\\*x\\*&lt;/script&gt;');
  });
  it.each(['ja', 'en'] as const)('uses visible localized publications in %s', locale => {
    const body = renderMarkdown(locale, 'publications');
    for (const publication of getLocalizedPublications(locale)) {
      expect(body).toContain(prose(publication.title));
      expect(body).toContain(prose(publication.authors.join(', ')));
      if (publication.doi) expect(body).toContain(`https://doi.org/${publication.doi}`);
    }
    expect(body).not.toMatch(/<\/?[a-z][^>]*>/i);
    expect(body).not.toContain('pub-00');
    expect(renderMarkdown404(locale)).toContain(`](/${locale}/publications)`);
  });
});
