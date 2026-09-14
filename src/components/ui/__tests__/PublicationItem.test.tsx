import { render, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
// @ts-expect-error jest-axe ships no TypeScript declarations
import { axe } from 'jest-axe';
import { LocaleProvider } from '@/lib/i18n';
import type { PublicationEntry } from '@/types';
import PublicationItem from '../PublicationItem';

// Fixtures mirror src/data: the English page only receives records that pass
// isEnglishPublicationVisible in src/data/localized.ts (international scope, or an
// official English title), which is why the domestic record below is the awarded
// AXIES paper — the one domestic entry the English page does show.
const internationalConference: PublicationEntry = {
  id: 'pub-001',
  title: 'Where Did the Research Data Originate?',
  authors: ['Koshi Motegi', 'Shigeki Matsubara'],
  venue: 'The 27th International Conference on Asia-Pacific Digital Libraries (ICADL 2025)',
  year: 2025,
  displayDate: '2025-12-01',
  isFirstAuthor: true,
  isPeerReviewed: true,
  publicationType: 'conference',
  conferenceScope: 'international',
};

const awardedDomestic: PublicationEntry = {
  id: 'pub-003',
  title: '生成AIを活用したメタデータ生成と機関リポジトリへの登録',
  authors: ['渡邉悠', '茂木光志', '松原茂樹'],
  venue: '大学ICT推進協議会2025年度年次大会',
  year: 2025,
  displayDate: '2025-12-10',
  isFirstAuthor: false,
  isPeerReviewed: false,
  publicationType: 'conference',
  conferenceScope: 'domestic',
  hasOfficialEnglishTitle: true,
  awards: [
    {
      title: '大学ICT推進協議会2025年度年次大会（AXIES2025）最優秀論文賞',
      date: '2025-12-10',
      organization: '大学ICT推進協議会',
    },
  ],
};

const journalWithoutScope: PublicationEntry = {
  id: 'pub-100',
  title: 'A Journal Article',
  authors: ['Koshi Motegi'],
  venue: 'Some Journal',
  year: 2024,
  displayDate: '2024-04-01',
  isFirstAuthor: true,
  isPeerReviewed: true,
  publicationType: 'journal',
};

function renderItem(publication: PublicationEntry, locale: 'ja' | 'en' = 'ja') {
  const onClick = vi.fn();
  const utils = render(
    <LocaleProvider locale={locale}>
      <PublicationItem publication={publication} onClick={onClick} />
    </LocaleProvider>,
  );
  return { ...utils, onClick, button: within(utils.container).getByRole('button') };
}

function badgeTexts(button: HTMLElement): string[] {
  const group = within(button).queryByTestId('publication-badges');
  if (!group) return [];
  return Array.from(group.children).map(child => child.textContent?.trim() ?? '');
}

describe('PublicationItem badges (Japanese)', () => {
  it('renders no badges for a publication without awards', () => {
    const { button } = renderItem(internationalConference);
    expect(badgeTexts(button)).toEqual([]);
    expect(button).not.toHaveTextContent('査読あり');
    expect(button).not.toHaveTextContent('国際');
    expect(button).not.toHaveTextContent('会議');
  });
});

describe('PublicationItem award badge', () => {
  it('signals the award without printing the award title', () => {
    const { button } = renderItem(awardedDomestic);
    expect(badgeTexts(button)).toEqual(['🏆受賞']);
    expect(button).not.toHaveTextContent('最優秀論文賞');
  });

  it('counts multiple awards instead of listing them', () => {
    const twoAwards: PublicationEntry = {
      ...awardedDomestic,
      awards: [
        awardedDomestic.awards![0],
        { title: '学生奨励賞', date: '2025-12-11' },
      ],
    };
    const { button } = renderItem(twoAwards);
    expect(badgeTexts(button)).toContain('🏆受賞 ×2');
    expect(button).not.toHaveTextContent('学生奨励賞');
  });

  it('renders no award badge when the awards array is empty', () => {
    const { button } = renderItem({ ...internationalConference, awards: [] });
    expect(badgeTexts(button)).toEqual([]);
  });
});

describe('PublicationItem badges (English)', () => {
  it('renders no badges for a publication without awards', () => {
    const { button } = renderItem(internationalConference, 'en');
    expect(badgeTexts(button)).toEqual([]);
  });

  it('renders only the English award label for the domestic awarded record', () => {
    const { button } = renderItem(awardedDomestic, 'en');
    expect(badgeTexts(button)).toEqual(['🏆Award']);
  });
});

describe('PublicationItem accessibility', () => {
  it('keeps the accessible name to the publication title', () => {
    const { button } = renderItem(awardedDomestic);
    expect(button).toHaveAccessibleName(
      '生成AIを活用したメタデータ生成と機関リポジトリへの登録の詳細を表示',
    );
    expect(button).toHaveAttribute('tabindex', '0');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('exposes only the award badge as the accessible description', () => {
    const { button } = renderItem(awardedDomestic);
    const description = button.getAttribute('aria-describedby');
    expect(description).toBeTruthy();
    expect(button).toHaveAccessibleDescription('受賞');
  });

  it('does not reference an empty badge description when there is no award', () => {
    const { button } = renderItem(journalWithoutScope);
    expect(button).not.toHaveAttribute('aria-describedby');
    expect(button).not.toHaveAccessibleDescription();
  });

  it('lets the badge row wrap on narrow viewports', () => {
    const { button } = renderItem(awardedDomestic);
    expect(within(button).getByTestId('publication-badges').className).toContain('flex-wrap');
  });

  it.each(['ja', 'en'] as const)('has no axe violations (%s)', async locale => {
    const { container } = renderItem(awardedDomestic, locale);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  }, 20000);
});
