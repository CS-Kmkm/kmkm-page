import profileJson from '@/data/profile.json';
import type { ProfileInfo, SocialLink } from '@/types';

const profile = profileJson as ProfileInfo;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || null;

type NavigationItem = {
  href: string;
  label: string;
  ariaLabel: string;
};

type FooterLink = {
  href: string;
  label: string;
};

export const siteConfig = {
  personName: profile.name,
  personNameEn: profile.nameEn ?? 'Koshi Motegi',
  siteName: `${profile.name}の個人ポートフォリオ`,
  defaultTitle: `${profile.name} | 個人ポートフォリオ`,
  description:
    '名古屋大学大学院情報学研究科知能システム学専攻松原研究室に所属する茂木光志の個人ポートフォリオです。自然言語処理の研究活動、開発経験、論文投稿履歴を掲載しています。',
  locale: 'ja_JP',
  lang: 'ja',
  siteUrl,
  currentAffiliation: profile.currentAffiliation,
  currentPosition: profile.currentPosition,
} as const;

export const navigationItems: NavigationItem[] = [
  { href: '/', label: 'トップ', ariaLabel: 'トップページへ移動' },
  { href: '/career', label: '経歴', ariaLabel: '経歴ページへ移動' },
  { href: '/publications', label: '論文・発表', ariaLabel: '論文・発表ページへ移動' },
  { href: '/dev-experience', label: '開発経験', ariaLabel: '開発経験ページへ移動' },
];

export const footerLinks: FooterLink[] = [
  // Footer policy links are intentionally hidden to keep the footer compact.
];

const socialLinkLabels: Record<SocialLink['platform'], string> = {
  twitter: 'X',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  orcid: 'ORCID',
  researchgate: 'ResearchGate',
  email: 'メール',
  website: '研究室サイト',
};

const footerSocialPlatforms: SocialLink['platform'][] = ['github', 'twitter', 'orcid'];

export const footerSocialLinks = profile.socialLinks
  .filter((link) => footerSocialPlatforms.includes(link.platform))
  .map((link) => ({
    ...link,
    label: socialLinkLabels[link.platform],
  }));
