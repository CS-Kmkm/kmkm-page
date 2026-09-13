import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PageError from '../PageError';
import { LocaleProvider } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

const renderPageError = (locale: Locale) =>
  render(
    <LocaleProvider locale={locale}>
      <PageError title="title" description="description" reset={vi.fn()} containerWidth="4xl" />
    </LocaleProvider>,
  );

describe('PageError', () => {
  it.each([
    ['ja', '再読み込み', 'トップへ戻る', '/ja'],
    ['en', 'Reload', 'Back to top', '/en'],
  ] as const)('keeps the %s recovery controls in their own locale', (locale, reload, backToTop, href) => {
    renderPageError(locale);

    expect(screen.getByRole('button', { name: reload })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: backToTop })).toHaveAttribute('href', href);
  });
});
