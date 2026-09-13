import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import NotFoundContent from '../NotFoundContent';

const pathname = vi.hoisted(() => ({ current: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => pathname.current,
}));

describe('NotFoundContent', () => {
  it('renders the Japanese 404 with Japanese recovery links outside the English tree', () => {
    pathname.current = '/ja/does-not-exist';
    render(<NotFoundContent />);

    expect(screen.getByRole('heading', { name: '404 - ページが見つかりません' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'トップへ戻る' })).toHaveAttribute('href', '/ja');
    expect(screen.getByRole('link', { name: '経歴' })).toHaveAttribute('href', '/ja/career');
    expect(screen.getByRole('link', { name: '開発経験' })).toHaveAttribute('href', '/ja/dev-experience');
    expect(screen.getByRole('link', { name: '論文' })).toHaveAttribute('href', '/ja/publications');
  });

  it('renders the English 404 with English recovery links inside the English tree', () => {
    pathname.current = '/en/does-not-exist';
    const { container } = render(<NotFoundContent />);

    expect(screen.getByRole('heading', { name: '404 - Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '/en');
    expect(screen.getByRole('link', { name: 'Career' })).toHaveAttribute('href', '/en/career');
    expect(screen.getByRole('link', { name: 'Development Experience' })).toHaveAttribute('href', '/en/dev-experience');
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute('href', '/en/publications');
    expect(container.textContent).not.toMatch(/[ぁ-んァ-ヶ一-龠々ー]/);
  });

  it('prefers the locale of the boundary that renders it', () => {
    pathname.current = '/ja/does-not-exist';
    render(<NotFoundContent locale="en" />);

    expect(screen.getByRole('heading', { name: '404 - Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '/en');
  });
});
