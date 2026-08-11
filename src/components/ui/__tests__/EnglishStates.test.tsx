import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PageError from '@/components/common/PageError';
import { LocaleProvider } from '@/lib/i18n';
import EventEmptyState from '../EventEmptyState';
import PublicationEmptyState from '../PublicationEmptyState';
import UpdatesList from '../UpdatesList';

const japanesePattern = /[ぁ-んァ-ヶ一-龠々ー]/;

describe('English fallback states', () => {
  it('renders empty and error states without Japanese user-facing copy', () => {
    const { container } = render(
      <LocaleProvider locale="en">
        <EventEmptyState hasActiveFilters onClearFilters={vi.fn()} />
        <PublicationEmptyState hasActiveFilters onClearFilters={vi.fn()} />
        <UpdatesList updates={[]} />
        <PageError
          title="This page could not be loaded"
          description="Please try again later."
          reset={vi.fn()}
          containerWidth="4xl"
        />
      </LocaleProvider>,
    );

    expect(screen.getAllByRole('button', { name: 'Clear all filters' })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '/en');
    expect(container.textContent).not.toMatch(japanesePattern);
  });
});
