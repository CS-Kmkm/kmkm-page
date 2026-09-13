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

const internationalWorkshop: PublicationEntry = {
  id: 'pub-006',
  title: 'Identifying Implicit Research Data References in Paper Citations',
  authors: ['Koshi Motegi', 'Shigeki Matsubara'],
  venue: 'NSLP 2026',
  year: 2026,
  displayDate: '2026-05-01',
  isFirstAuthor: true,
  isPeerReviewed: true,
  publicationType: 'workshop',
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
  const group = within(button).getByTestId('publication-badges');
  return Array.from(group.children).map(child => child.textContent?.trim() ?? '');
}

describe('PublicationItem badges (Japanese)', () => {
  it('maps a peer-reviewed international conference paper to its badges', () => {
    const { button } = renderItem(internationalConference);
    expect(badgeTexts(button)).toEqual(['査読あり', '国際', '会議']);
  });

  it('maps a non-peer-reviewed domestic paper to its badges', () => {
    const { button } = renderItem({ ...awardedDomestic, awards: undefined });
    expect(badgeTexts(button)).toEqual(['査読なし', '国内', '会議']);
  });

  it('labels workshop and journal publication types', () => {
    expect(badgeTexts(renderItem(internationalWorkshop).button)).toContain('ワークショップ');
    expect(badgeTexts(renderItem(journalWithoutScope).button)).toContain('ジャーナル');
  });

  it('omits the venue scope badge when the record has none', () => {
    const texts = badgeTexts(renderItem(journalWithoutScope).button);
    expect(texts).not.toContain('国際');
    expect(texts).not.toContain('国内');
    expect(texts).toEqual(['査読あり', 'ジャーナル']);
  });
});

describe('PublicationItem award badge', () => {
  it('signals the award without printing the award title', () => {
    const { button } = renderItem(awardedDomestic);
    expect(badgeTexts(button)).toEqual(['査読なし', '国内', '会議', '🏆受賞']);
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
    expect(badgeTexts(button)).toEqual(['査読あり', '国際', '会議']);
  });
});

describe('PublicationItem badges (English)', () => {
  it('renders English badge labels', () => {
    const { button } = renderItem(internationalConference, 'en');
    expect(badgeTexts(button)).toEqual(['Peer-reviewed', 'International', 'Conference']);
  });

  it('renders the English labels for the domestic awarded record the English page shows', () => {
    const { button } = renderItem(awardedDomestic, 'en');
    expect(badgeTexts(button)).toEqual(['Not peer-reviewed', 'Domestic', 'Conference', '🏆Award']);
  });

  it('keeps no Japanese copy in the English badges', () => {
    const { button } = renderItem(internationalWorkshop, 'en');
    expect(badgeTexts(button).join(' ')).not.toMatch(/[ぁ-んァ-ヶ一-龠々ー]/);
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

  it('exposes the badges as the accessible description instead of folding them into the name', () => {
    const { button } = renderItem(awardedDomestic);
    const description = button.getAttribute('aria-describedby');
    expect(description).toBeTruthy();
    expect(button).toHaveAccessibleDescription(/査読なし/);
    expect(button).toHaveAccessibleDescription(/国内/);
    expect(button).toHaveAccessibleDescription(/受賞/);
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
