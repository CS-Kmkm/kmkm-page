import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SocialLinks from '../SocialLinks';
import { LocaleProvider } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import type { SocialLink } from '@/types';

const japanesePattern = /[ぁ-んァ-ヶ一-龠々ー]/;

const githubLink: SocialLink = {
  id: 'social-002',
  platform: 'github',
  url: 'https://github.com/CS-Kmkm',
  username: 'CS-Kmkm',
};

const laboratoryLink: SocialLink = {
  id: 'social-006',
  platform: 'website',
  url: 'https://slp.itc.nagoya-u.ac.jp',
  username: '研究室サイト',
};

// getLocalizedProfile applies the English overlay before the component sees the link.
const laboratoryLinkEn: SocialLink = { ...laboratoryLink, username: 'Laboratory website' };

function renderLinks(links: SocialLink[], locale: Locale) {
  return render(
    <LocaleProvider locale={locale}>
      <SocialLinks socialLinks={links} showLabels />
    </LocaleProvider>,
  );
}

describe('SocialLinks', () => {
  it('names a site link after the site itself in Japanese', () => {
    renderLinks([laboratoryLink], 'ja');

    const link = screen.getByRole('link', { name: '研究室サイトを新しいタブで開く' });
    expect(link).toHaveAttribute('href', 'https://slp.itc.nagoya-u.ac.jp');
    expect(link).toHaveTextContent('研究室サイト');
  });

  it('names a site link after the site itself in English', () => {
    const { container } = renderLinks([laboratoryLinkEn], 'en');

    const link = screen.getByRole('link', { name: 'Open Laboratory website in a new tab' });
    expect(link).toHaveAttribute('href', 'https://slp.itc.nagoya-u.ac.jp');
    expect(link).toHaveTextContent('Laboratory website');
    expect(container.textContent).not.toMatch(japanesePattern);
  });

  it('falls back to a locale-aware platform name when a link carries no name', () => {
    const unnamed: SocialLink = { ...laboratoryLink, username: undefined };

    const { unmount } = renderLinks([unnamed], 'ja');
    expect(screen.getByRole('link', { name: 'Webサイトを新しいタブで開く' })).toHaveTextContent(
      'Webサイト',
    );
    unmount();

    renderLinks([unnamed], 'en');
    expect(screen.getByRole('link', { name: 'Open Website in a new tab' })).toHaveTextContent(
      'Website',
    );
  });

  it('keeps the profile phrasing for account platforms', () => {
    const { unmount } = renderLinks([githubLink], 'ja');
    expect(screen.getByRole('link', { name: 'GitHubでCS-Kmkmを見る' })).toBeInTheDocument();
    unmount();

    renderLinks([githubLink], 'en');
    expect(screen.getByRole('link', { name: 'View CS-Kmkm on GitHub' })).toBeInTheDocument();
  });
});
