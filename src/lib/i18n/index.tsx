'use client';

import { createContext, useContext } from 'react';

export type Locale = 'ja' | 'en';

const messages = {
  ja: {
    skipToContent: 'メインコンテンツへスキップ', home: 'トップページへ移動', mainNavigation: 'メインナビゲーション', mobileNavigation: 'モバイルナビゲーション', openMenu: 'メインメニューを開く', closeMenu: 'メインメニューを閉じる', switchToEnglish: 'Switch to English', switchToJapanese: '日本語に切り替える',
    themeLoading: 'テーマ切替を読み込み中', light: 'ライト', dark: 'ダーク', loading: '読み込み中...', mode: 'モード', switchTheme: (from: string, to: string) => `${from}モードから${to}モードへ切り替え`,
    openNewTab: (label: string) => `${label}を新しいタブで開く`, allProjects: '全プロジェクト', noProjects: 'プロジェクトがありません', allProjectsList: '全プロジェクト一覧', techNotFound: '技術データが見つかりません', techDataMissing: '技術スタックのデータが存在しません', techStackList: '技術スタック一覧', techDetails: (name: string) => `${name}の詳細`, showTechDetails: (name: string) => `${name}の詳細を表示`, techLogo: (name: string) => `${name}のロゴ`, techIcon: (name: string) => `${name}のアイコン`, backToTechList: '技術一覧に戻る', back: '戻る', relatedProjects: '関連プロジェクト', noRelatedProjects: '関連プロジェクトがありません', relatedProjectsList: '関連プロジェクト一覧', relatedLanguages: '関連言語', relatedFrameworks: '関連フレームワーク', overview: '概要', category: (name: string) => `${name}カテゴリ`,
    careerTimeline: '経歴タイムライン', careerNotFound: '経歴情報が見つかりませんでした。', eventList: 'イベントリスト', eventsNotFound: 'イベントが見つかりませんでした', noEvents: 'イベントが登録されていません。イベントが追加されると、ここに表示されます。', clear: 'クリア', events: 'イベント', results: (result: number, total: number, noun: string) => `${result}件 / ${total}件の${noun}を表示`,
    affiliation: '所属', publication: '論文', event: 'イベント', internship: 'インターン', award: '受賞', other: 'その他', relatedLinks: '関連リンク', noMatchingEvents: 'イベントが見つかりません', noEventsRegistered: 'イベントがありません', matchingEvents: '選択したフィルタに一致するイベントがありません。', eventsRegistered: 'イベントが登録されていません。', clearAllFilters: 'すべてのフィルタをクリア',
    publications: '論文', publicationFilters: '論文フィルタ', authors: '著者', authorship: '著者区分', firstAuthor: '主著', coAuthor: '共著', peerReview: '査読', peerReviewType: '査読区分', yes: 'あり', no: 'なし', publicationsFound: (result: number, total: number) => `${result} / ${total}件`, noPublications: '論文が見つかりません', noMatchingPublications: '選択したフィルタに一致する論文がありません。', publicationDetails: '論文詳細', closeModal: 'モーダルを閉じる', showPublicationDetails: (title: string) => `${title}の詳細を表示`,
    projectDetails: (name: string) => `${name}の詳細を表示`, experienceYears: '経験年数:', proficiency: '習熟度:', high: '高', medium: '中', low: '低',
    current: '現在', ongoing: '進行中', period: (start: string, end: string) => `期間: ${start}から${end}まで。`, eventYear: (year: string) => `${year}年の出来事`, eventPoint: (count: number, multiple: boolean) => `${count}件のイベント。クリックして${multiple ? 'リスト' : '詳細'}を表示`, viewDetails: '詳細を表示', profilePhoto: (name: string) => `${name}のプロフィール写真`, location: '所在地: ', socialLinks: 'ソーシャルメディアリンク', socialProfile: (name: string, user: string) => `${name}で${user}を見る`, relatedTech: '関連技術', programmingLanguages: 'プログラミング言語', frameworks: 'フレームワーク・ライブラリ', tools: 'ツール・プラットフォーム', databases: 'データベース', reload: '再読み込み', backToTop: 'トップへ戻る', viewMode: (current: string) => `表示モードを切り替え: 現在は${current}表示`, timeline: 'タイムライン', list: 'リスト', listView: 'リスト表示', timelineView: 'タイムライン表示',
    projectDescription: 'プロジェクト概要', technologyStack: '技術スタック', liveSite: 'サイトを見る', github: 'GitHubで見る', previous: '前へ', next: '次へ', latestUpdates: '最新の更新情報', noUpdatesAvailable: '公開中の更新情報はまだありません。', moreItems: (count: number) => `他${count}件`, viewMoreUpdates: (count: number) => `他${count}件を経歴リストで表示`, categoryLabel: (label: string) => `カテゴリ: ${label}`, yearEventsLabel: (year: number, count: number) => `${year}年のイベント${count}件を表示`, yearEventsTitle: (year: number) => `${year}年のイベント`, previousEvent: '前のイベント', nextEvent: '次のイベント',
  },
  en: {
    skipToContent: 'Skip to main content', home: 'Go to home page', mainNavigation: 'Main navigation', mobileNavigation: 'Mobile navigation', openMenu: 'Open main menu', closeMenu: 'Close main menu', switchToEnglish: 'Switch to English', switchToJapanese: 'Switch to Japanese',
    themeLoading: 'Loading theme switcher', light: 'light', dark: 'dark', loading: 'Loading...', mode: 'mode', switchTheme: (from: string, to: string) => `Switch from ${from} mode to ${to} mode`,
    openNewTab: (label: string) => `Open ${label} in a new tab`, allProjects: 'All projects', noProjects: 'No projects found', allProjectsList: 'All projects list', techNotFound: 'Technology data was not found', techDataMissing: 'No technology stack data is available', techStackList: 'Technology stack', techDetails: (name: string) => `${name} details`, showTechDetails: (name: string) => `Show ${name} details`, techLogo: (name: string) => `${name} logo`, techIcon: (name: string) => `${name} icon`, backToTechList: 'Back to technology list', back: 'Back', relatedProjects: 'Related projects', noRelatedProjects: 'No related projects found', relatedProjectsList: 'Related projects list', relatedLanguages: 'Related languages', relatedFrameworks: 'Related frameworks', overview: 'Overview', category: (name: string) => `${name} category`,
    careerTimeline: 'Career timeline', careerNotFound: 'Career information was not found.', eventList: 'Event list', eventsNotFound: 'No events found', noEvents: 'No events are registered yet. They will appear here when added.', clear: 'Clear', events: 'events', results: (result: number, total: number, noun: string) => `Showing ${result} of ${total} ${noun}`, 
    affiliation: 'Affiliation', publication: 'Publication', event: 'Event', internship: 'Internship', award: 'Award', other: 'Other', relatedLinks: 'Related links', noMatchingEvents: 'No matching events found', noEventsRegistered: 'No events found', matchingEvents: 'No events match the selected filters.', eventsRegistered: 'No events are registered.', clearAllFilters: 'Clear all filters',
    publications: 'Publications', publicationFilters: 'Publication filters', authors: 'Authors', authorship: 'Authorship', firstAuthor: 'First author', coAuthor: 'Co-author', peerReview: 'Peer review', peerReviewType: 'Peer review status', yes: 'Yes', no: 'No', publicationsFound: (result: number, total: number) => `${result} of ${total} publications`, noPublications: 'No publications found', noMatchingPublications: 'No publications match the selected filters.', publicationDetails: 'Publication details', closeModal: 'Close dialog', showPublicationDetails: (title: string) => `Show details for ${title}`,
    projectDetails: (name: string) => `Show details for ${name}`, experienceYears: 'Experience:', proficiency: 'Proficiency:', high: 'Advanced', medium: 'Intermediate', low: 'Beginner',
    current: 'Present', ongoing: 'Ongoing', period: (start: string, end: string) => `Period: ${start} to ${end}.`, eventYear: (year: string) => `Events in ${year}`, eventPoint: (count: number, multiple: boolean) => `${count} ${count === 1 ? 'event' : 'events'}. Click to view ${multiple ? 'the list' : 'details'}`, viewDetails: 'Show details', profilePhoto: (name: string) => `${name} profile photo`, location: 'Location: ', socialLinks: 'Social media links', socialProfile: (name: string, user: string) => `View ${user} on ${name}`, relatedTech: 'Related technologies', programmingLanguages: 'Programming languages', frameworks: 'Frameworks and libraries', tools: 'Tools and platforms', databases: 'Databases', reload: 'Reload', backToTop: 'Back to top', viewMode: (current: string) => `Switch display mode: currently ${current}`, timeline: 'timeline', list: 'list', listView: 'List view', timelineView: 'Timeline view',
    projectDescription: 'Project description', technologyStack: 'Technology stack', liveSite: 'View live site', github: 'View on GitHub', previous: 'Previous', next: 'Next', latestUpdates: 'Latest Updates', noUpdatesAvailable: 'No updates are currently available.', moreItems: (count: number) => `${count} more ${count === 1 ? 'item' : 'items'}`, viewMoreUpdates: (count: number) => `View ${count} more ${count === 1 ? 'item' : 'items'} in the career list`, categoryLabel: (label: string) => `Category: ${label}`, yearEventsLabel: (year: number, count: number) => `Show ${count} ${count === 1 ? 'event' : 'events'} from ${year}`, yearEventsTitle: (year: number) => `Events from ${year}`, previousEvent: 'Previous event', nextEvent: 'Next event',
  },
} as const;

export type Messages = (typeof messages)[Locale];

const I18nContext = createContext<{ locale: Locale; messages: Messages }>({ locale: 'ja', messages: messages.ja });

export function LocaleProvider({ locale = 'ja', children }: { locale?: Locale; children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, messages: messages[locale] }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function getMessages(locale: Locale = 'ja') {
  return messages[locale];
}

export function localizeHref(href: string, locale: Locale) {
  const prefix = `/${locale}`;
  return href === '/' ? prefix : `${prefix}${href}`;
}
