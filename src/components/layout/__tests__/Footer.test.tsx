import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from '../Footer';
import { englishFooterLinks, footerLinks, footerSocialLinks } from '@/lib/site';

const japaneseCharacters = /[ぁ-んァ-ヶ一-龠々ー]/;

describe('Footer policy links', () => {
  it('links to the Japanese policy documents inside the Japanese tree', () => {
    render(<Footer />);

    const policies = screen.getByRole('navigation', { name: 'サイトポリシー' });

    expect(within(policies).getByRole('link', { name: 'プライバシーポリシー' })).toHaveAttribute('href', '/ja/privacy');
    expect(within(policies).getByRole('link', { name: '利用条件' })).toHaveAttribute('href', '/ja/terms');
  });

  it('links to the English policy documents inside the English tree', () => {
    const { container } = render(<Footer locale="en" />);

    const policies = screen.getByRole('navigation', { name: 'Site policies' });

    expect(within(policies).getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/en/privacy');
    expect(within(policies).getByRole('link', { name: 'Terms of Use' })).toHaveAttribute('href', '/en/terms');
    expect(container.textContent).not.toMatch(japaneseCharacters);
  });

  it('declares the same policy documents in both locales', () => {
    expect(englishFooterLinks.map((link) => link.href)).toEqual(footerLinks.map((link) => link.href));
    expect(footerLinks.map((link) => link.href)).toEqual(['/privacy', '/terms']);
  });

  it('keeps the social icon links next to the policy links', () => {
    render(<Footer />);

    const policies = screen.getByRole('navigation', { name: 'サイトポリシー' });

    for (const link of footerSocialLinks) {
      const social = screen.getByRole('link', { name: `${link.label}を新しいタブで開く` });
      expect(social).toHaveAttribute('href', link.url);
      expect(within(policies).queryByRole('link', { name: `${link.label}を新しいタブで開く` })).toBeNull();
    }
  });
});
