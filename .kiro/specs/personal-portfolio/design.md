# Design Document

## Overview

個人ポートフォリオサイトは、Next.js 16.0とReact 19.2を使用したモダンなウェブアプリケーションとして設計されます。Tailwind CSS v4を使用してレスポンシブでアクセシブルなUIを実装し、Vercelプラットフォームでホスティングされます。

### 技術スタック
- **フレームワーク**: Next.js 16.0 (App Router)
- **UI ライブラリ**: React 19.2
- **スタイリング**: Tailwind CSS v4
- **言語**: TypeScript 5
- **デプロイ**: Vercel
- **単体テスト**: Vitest + React Testing Library + @testing-library/jest-dom
- **E2Eテスト**: Playwright + @axe-core/playwright

## Architecture

### ディレクトリ構造
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # トップページ
│   ├── career/
│   │   └── page.tsx       # 経歴ページ
│   ├── dev-experience/
│   │   └── page.tsx       # 開発経験ページ
│   └── publications/
│       └── page.tsx       # 論文投稿履歴ページ
├── components/            # 再利用可能コンポーネント
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── PageLayout.tsx
│   ├── ui/
│   │   ├── UpdatesList.tsx
│   │   ├── Timeline.tsx
│   │   ├── TechGrid.tsx
│   │   ├── PublicationList.tsx
│   │   ├── NavigationCard.tsx
│   │   ├── ProjectModal.tsx
│   │   ├── TechBadge.tsx
│   │   ├── ProfileSection.tsx
│   │   └── SocialLinks.tsx
│   └── common/
│       └── index.ts       # 共通エクスポート
├── types/                 # TypeScript型定義
│   └── index.ts
├── data/                  # 静的データファイル
│   ├── updates.json       # 最新更新情報
│   ├── career.json        # 経歴・所属変遷データ
│   ├── tech-experience.json # 開発経験・技術スタックデータ
│   ├── publications.json  # 論文投稿履歴データ
│   ├── profile.json       # 個人プロフィール情報
│   └── index.ts           # データ読み込み用ヘルパー
├── styles/               # グローバルスタイル
│   └── globals.css
└── public/               # 静的ファイル
    └── images/
        ├── tech-logos/   # 技術ロゴ（SVG推奨）
        └── projects/     # プロジェクト画像
```

### ルーティング設計
- `/` - トップページ（最新更新情報 + ナビゲーション）
- `/career` - 経歴ページ（所属変遷のタイムライン）
- `/dev-experience` - 開発経験ページ（技術スタック + 実績）
- `/publications` - 論文投稿履歴ページ（書誌情報一覧）

## Components and Interfaces

### レイアウトコンポーネント

#### Header
```typescript
interface HeaderProps {
  currentPath?: string;
}

// ナビゲーションメニュー、ロゴ、アクセシビリティ対応
```

#### Footer
```typescript
interface FooterProps {
  className?: string;
}

// コピーライト、連絡先情報、ソーシャルリンク
```

#### PageLayout
```typescript
interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

// 共通ページ構造、SEOメタデータ、アクセシビリティ
```

### UIコンポーネント

#### UpdatesList
```typescript
interface UpdateItem {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'career' | 'development' | 'publication' | 'other';
}

interface UpdatesListProps {
  updates: UpdateItem[];
  maxItems?: number;
}
```

#### Timeline
```typescript
interface CareerEntry {
  id: string;
  year: string;
  organization: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
}

interface TimelineProps {
  entries: CareerEntry[];
  className?: string;
}
```

#### TechGrid
```typescript
interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  duration: string;
  role: string;
  url?: string;
  githubUrl?: string;
  imageUrl?: string;
}

interface TechItem {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  experienceYears: number;
  projects: string[]; // ProjectDetailのIDを参照
  description?: string;
}

interface TechGridProps {
  techItems: TechItem[];
  projectDetails: ProjectDetail[];
  showProjects?: boolean;
}
```

#### PublicationList
```typescript
interface PublicationEntry {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  doi?: string;
  isFirstAuthor: boolean;
  isPeerReviewed: boolean;
  publicationType: 'journal' | 'conference' | 'workshop' | 'preprint' | 'other';
}

interface PublicationListProps {
  publications: PublicationEntry[];
  showFilters?: boolean;
}

// 論文一覧の表示、主著・共著、査読有無のバッジ表示
// DOIリンクがある場合は外部リンクとして表示
```
```

#### NavigationCard
```typescript
interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
}
```

#### ProjectModal
```typescript
interface ProjectModalProps {
  project: ProjectDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

// プロジェクト詳細をポップアップで表示
// 画像、説明、技術スタック、リンクなどを含む
```

#### TechBadge
```typescript
interface TechBadgeProps {
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database';
  experienceYears: number;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  logoUrl?: string;
  logoAlt?: string;
  onClick?: () => void;
  className?: string;
}

// 技術バッジの表示、ロゴ、経験年数とレベルを視覚的に表現
// ロゴがある場合は表示、ない場合はテキストのみ
```

#### ProfileSection
```typescript
interface ProfileSectionProps {
  profile: ProfileInfo;
  showBio?: boolean;
  showLocation?: boolean;
  className?: string;
}

// 個人プロフィール情報の表示
// 氏名、現在の所属、ポジション、簡単な自己紹介
// アバター画像がある場合は表示
```

#### SocialLinks
```typescript
interface SocialLinksProps {
  socialLinks: SocialLink[];
  showLabels?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

// SNSリンクの表示
// プラットフォームアイコンとリンク
// 水平・垂直レイアウト対応
```

## Data Models

### 静的データ管理
データはJSONファイルとして管理し、TypeScriptの型定義で型安全性を確保します。これにより、データの編集が容易になり、将来的にCMSやAPIに移行する際もスムーズに対応できます。

#### データファイル構造
```json
// data/publications.json
{
  "publications": [
    {
      "id": "pub-001",
      "title": "論文タイトル",
      "authors": ["著者1", "著者2"],
      "venue": "学会名・雑誌名",
      "year": 2024,
      "doi": "10.1000/example",
      "isFirstAuthor": true,
      "isPeerReviewed": true,
      "publicationType": "journal"
    }
  ]
}

// data/tech-experience.json
{
  "technologies": [
    {
      "id": "tech-001",
      "name": "TypeScript",
      "category": "language",
      "proficiency": "advanced",
      "experienceYears": 3,
      "projects": ["proj-001", "proj-002"],
      "description": "使用経験の詳細...",
      "logoUrl": "/images/tech-logos/typescript.svg",
      "logoAlt": "TypeScript logo"
    }
  ],
  "projects": [
    {
      "id": "proj-001",
      "name": "個人ポートフォリオサイト",
      "description": "Next.js + TypeScriptで構築した個人ポートフォリオ",
      "technologies": ["TypeScript", "Next.js", "Tailwind CSS"],
      "duration": "2024年1月 - 2024年3月",
      "role": "フルスタック開発者",
      "url": "https://example.com",
      "githubUrl": "https://github.com/user/portfolio",
      "imageUrl": "/images/projects/portfolio.png"
    }
  ]
}

// data/career.json
{
  "entries": [
    {
      "id": "career-001",
      "year": "2024",
      "organization": "所属組織名",
      "role": "役職・ポジション",
      "description": "業務内容や成果の説明",
      "startDate": "2024-01",
      "endDate": null
    }
  ]
}

// data/profile.json
{
  "name": "山田太郎",
  "nameJa": "やまだ たろう",
  "currentAffiliation": "○○大学 情報学部",
  "currentPosition": "准教授",
  "bio": "機械学習とWebテクノロジーの研究に従事。特にNext.jsを用いたフロントエンド開発に興味を持つ。",
  "location": "東京, 日本",
  "avatarUrl": "/images/avatar.jpg",
  "socialLinks": [
    {
      "id": "social-001",
      "platform": "twitter",
      "url": "https://twitter.com/username",
      "username": "@username"
    },
    {
      "id": "social-002",
      "platform": "github",
      "url": "https://github.com/username",
      "username": "username"
    },
    {
      "id": "social-003",
      "platform": "email",
      "url": "mailto:contact@example.com",
      "username": "contact@example.com"
    }
  ]
}
```

#### データ読み込みヘルパー
```typescript
// data/index.ts
import publicationsData from './publications.json';
import techExperienceData from './tech-experience.json';
import careerData from './career.json';
import updatesData from './updates.json';
import profileData from './profile.json';

export const getPublications = () => publicationsData.publications;
export const getTechExperience = () => techExperienceData.technologies;
export const getProjectDetails = () => techExperienceData.projects;
export const getCareerEntries = () => careerData.entries;
export const getUpdates = () => updatesData.updates;
export const getProfile = () => profileData;

// プロジェクト詳細を取得するヘルパー
export const getProjectById = (id: string) => 
  techExperienceData.projects.find(project => project.id === id);

// 技術に関連するプロジェクトを取得するヘルパー
export const getProjectsForTech = (techId: string) => {
  const tech = techExperienceData.technologies.find(t => t.id === techId);
  if (!tech) return [];
  return tech.projects.map(projectId => getProjectById(projectId)).filter(Boolean);
};
```

```typescript
// types/index.ts
export interface UpdateItem {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'career' | 'development' | 'publication' | 'other';
}

export interface CareerEntry {
  id: string;
  year: string;
  organization: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  duration: string;
  role: string;
  url?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export interface TechItem {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  experienceYears: number;
  projects: string[]; // ProjectDetailのIDを参照
  description?: string;
  logoUrl?: string; // 技術ロゴのURL
  logoAlt?: string; // ロゴのalt属性
}

export interface PublicationEntry {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  doi?: string;
  isFirstAuthor: boolean;
  isPeerReviewed: boolean;
  publicationType: 'journal' | 'conference' | 'workshop' | 'preprint' | 'other';
}

export interface SocialLink {
  id: string;
  platform: 'twitter' | 'github' | 'linkedin' | 'orcid' | 'researchgate' | 'email' | 'website';
  url: string;
  username?: string;
  iconUrl?: string;
}

export interface ProfileInfo {
  name: string;
  nameJa?: string; // 日本語名（オプション）
  currentAffiliation: string;
  currentPosition: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  socialLinks: SocialLink[];
}
```

## Error Handling

### エラー境界
```typescript
// components/common/ErrorBoundary.tsx
// React Error Boundaryを実装してコンポーネントレベルのエラーをキャッチ
```

### 404ページ
```typescript
// app/not-found.tsx
// カスタム404ページでユーザーフレンドリーなエラー表示
```

### データ取得エラー
- JSONファイルの読み込みエラーハンドリング
- 外部リソース（PDF等）のリンク切れ対応
- データファイルが存在しない場合のフォールバック
- グレースフルデグラデーション（データが不完全でも表示継続）

### データファイル管理
- JSONスキーマ検証（オプション）
- データファイルの整合性チェック
- 開発時のホットリロード対応

## Testing Strategy

### 単体テスト (Vitest)
- **PublicationList コンポーネント**: 必須テスト対象
  - レンダリングテスト
  - プロパティ渡しテスト
  - アクセシビリティテスト (jest-axe)
  - インタラクションテスト

### E2Eテスト (Playwright)
- **ページナビゲーション**: 全ページ間の遷移テスト
- **インタラクティブコンポーネント**: ProjectModal、NavigationCardのテスト
- **レスポンシブデザイン**: 異なるビューポートサイズでのテスト
- **アクセシビリティ**: @axe-core/playwrightによる自動テスト

### テスト環境
```typescript
// vitest.config.ts
// Vitest + React Testing Library + happy-dom/jsdom
// playwright.config.ts
// Playwright + @axe-core/playwright
```

### テストカバレッジ
- コンポーネントの基本レンダリング
- プロパティの正しい表示
- アクセシビリティ属性の検証
- レスポンシブ動作の確認
- ユーザーインタラクションフローの検証

## Accessibility (a11y)

### WCAG 2.1 AA準拠
- セマンティックHTML構造
- 適切なARIAラベル
- キーボードナビゲーション対応
- 色のコントラスト比確保
- スクリーンリーダー対応

### 実装方針
- `next/head` でページメタデータ管理
- `alt` 属性、`aria-label` の適切な使用
- フォーカス管理とタブオーダー
- 色以外の情報伝達手段の提供

## Performance Optimization

### Next.js最適化機能
- 自動コード分割
- 画像最適化（next/image）
- 静的生成（SSG）の活用
- フォント最適化
- SVGロゴの最適化とインライン化

### Tailwind CSS最適化
- PurgeCSS による未使用スタイル削除
- JIT モードでのビルド時間短縮

## Deployment Configuration

### Vercel設定
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["nrt1"]
}
```

### 環境変数
- `NEXT_PUBLIC_SITE_URL`: サイトのベースURL
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID（オプション）

### プレビューブランチ
- `main` ブランチ: 本番デプロイ
- `develop` ブランチ: ステージング環境
- フィーチャーブランチ: プレビューデプロイ

### CI/CD パイプライン
```yaml
# .github/workflows/ci.yml
# - ESLint チェック
# - TypeScript型チェック
# - テスト実行
# - ビルド確認
```

## Design System

### カラーパレット
```css
/* モノクロベース + アクセントカラー */
:root {
  --color-primary: #000000;
  --color-secondary: #666666;
  --color-accent: #0070f3; /* Next.jsブルー */
  --color-background: #ffffff;
  --color-surface: #f8f9fa;
  --color-border: #e1e5e9;
}
```

### タイポグラフィ
- システムフォントスタック使用
- レスポンシブタイポグラフィ
- 読みやすさを重視した行間・文字間隔

### レスポンシブブレークポイント
```css
/* Tailwind CSS デフォルト */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```