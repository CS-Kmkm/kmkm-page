import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HeroSection from '../HeroSection';
import { getProfile } from '@/data';
import { getLocalizedProfile } from '@/data/localized';
import { LocaleProvider } from '@/lib/i18n';

const laboratoryUrl = 'https://slp.itc.nagoya-u.ac.jp';

describe('HeroSection', () => {
  it('introduces the owner and links the laboratory site in Japanese', () => {
    const profile = getProfile();
    expect(profile.bio).toBeTruthy();

    render(
      <LocaleProvider locale="ja">
        <HeroSection profile={profile} />
      </LocaleProvider>,
    );

    const bio = screen.getByText(profile.bio as string);
    expect(bio).toBeInTheDocument();

    const laboratory = screen.getByRole('link', { name: '研究室サイトを新しいタブで開く' });
    expect(laboratory).toHaveAttribute('href', laboratoryUrl);
    expect(laboratory).toHaveTextContent('研究室サイト');

    // The self-introduction has to be read before the links it precedes.
    expect(
      bio.compareDocumentPosition(laboratory) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('introduces the owner and links the laboratory site in English', () => {
    const profile = getLocalizedProfile('en');
    expect(profile.bio).toBeTruthy();

    render(
      <LocaleProvider locale="en">
        <HeroSection profile={profile} />
      </LocaleProvider>,
    );

    expect(screen.getByText(profile.bio as string)).toBeInTheDocument();

    const laboratory = screen.getByRole('link', { name: 'Open Laboratory website in a new tab' });
    expect(laboratory).toHaveAttribute('href', laboratoryUrl);
    expect(laboratory).toHaveTextContent('Laboratory website');
  });

  it('leaves the country out of the compact hero', () => {
    const profile = getProfile();
    expect(profile.location).toBeTruthy();

    render(
      <LocaleProvider locale="ja">
        <HeroSection profile={profile} />
      </LocaleProvider>,
    );

    expect(screen.queryByText(profile.location as string)).not.toBeInTheDocument();
  });
});
