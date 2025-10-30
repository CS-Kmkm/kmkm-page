# Design Document

## Overview

このドキュメントは、ポートフォリオサイトの全ページにおけるレスポンシブデザインの実装とE2Eテストの修正に関する設計を定義します。現在のサイトはTailwind CSSを使用しており、一部のレスポンシブ対応は既に実装されていますが、モバイルデバイスでの表示に改善が必要な箇所があります。

## Architecture

### レスポンシブデザイン戦略

**ブレークポイント定義（Tailwind CSS標準）:**
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (sm - lg)
- Desktop: ≥ 1024px (lg+)

**アプローチ:**
1. Mobile-first設計: 基本スタイルをモバイル向けに設定し、大きな画面向けにメディアクエリで拡張
2. Flexbox/Grid レイアウト: コンテナの柔軟な配置とレスポンシブグリッド
3. タッチターゲット最適化: モバイルでのタップ可能要素のサイズを44x44px以上に設定
4. 横スクロール防止: すべてのコンテンツをビューポート幅内に収める

### テスト修正戦略

**現在の問題:**
1. テストデータが実際のデータと不一致（例: "山田太郎" vs 実際のプロフィール名）
2. セレクタが現在のDOM構造と一致しない
3. レスポンシブテストが不十分

**修正アプローチ:**
1. データ駆動テスト: 実際のJSONデータを読み込んでテストに使用
2. セレクタの更新: 現在のコンポーネント構造に合わせたセレクタに修正
3. レスポンシブテストの追加: 各ブレークポイントでのレイアウト検証

## Components and Interfaces

### 1. ホームページ (src/app/page.tsx)

**現在の状態:**
- グリッドレイアウト: `grid-cols-1 lg:grid-cols-3`
- 基本的なレスポンシブ対応済み

**改善点:**
- HeroSectionのモバイル最適化
- UpdatesSectionとNavigationSectionの間隔調整
- タブレットでの2カラムレイアウト

**コンポーネント構造:**
```
HomePage
├── HeroSection (プロフィール情報)
│   ├── プロフィール画像
│   ├── 名前・所属
│   └── ソーシャルメディアリンク
├── UpdatesSection (最新情報)
│   └── UpdatesList
└── NavigationSection (ナビゲーションカード)
    ├── キャリアカード
    ├── 開発経験カード
    └── 出版物カード
```

**レスポンシブ対応:**
- Mobile: 全要素を縦積み、パディング調整
- Tablet: UpdatesとNavigationを2カラム
- Desktop: 既存の3カラムレイアウト維持

### 2. キャリアページ (src/app/career/page.tsx)

**現在の状態:**
- GitBranchTimelineコンポーネントを使用
- SVGベースのタイムライン表示
- 横スクロール可能 (`overflow-x-auto`)

**改善点:**
- モバイルでのSVG表示最適化
- タイムラインノードとラベルの配置調整
- タッチターゲットサイズの確保
- 順序反転ボタンのモバイル対応

**コンポーネント構造:**
```
CareerPage
├── Breadcrumb Navigation
├── Page Header
│   ├── タイトル
│   └── 順序反転ボタン
└── GitBranchTimeline
    ├── SVG Canvas
    ├── Main Line
    ├── Branch Lines
    ├── Nodes (キャリアエントリ)
    └── Labels (組織名、役職、期間)
```

**レスポンシブ対応:**
- Mobile: 
  - SVG幅を調整してモバイル画面に収める
  - ラベルのフォントサイズ縮小
  - ノード間隔の調整
- Tablet: 中間サイズでの表示最適化
- Desktop: 既存レイアウト維持

**SVG最適化:**
- viewBox属性を使用した動的スケーリング
- preserveAspectRatio設定
- モバイルでのレーン幅調整

### 3. 開発経験ページ (src/app/dev-experience/page.tsx)

**現在の状態:**
- TechIconGridで技術アイコンを表示
- グリッドレイアウト: `grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8`
- TechDetailViewで詳細表示

**改善点:**
- モバイルでのグリッド列数調整（2-3列）
- TechDetailViewのモバイル最適化
- プロジェクトリストのカード表示改善
- 関連技術セクションのレイアウト調整

**コンポーネント構造:**
```
DevExperiencePage
├── Page Header
├── TechCategorySection (カテゴリごと)
│   ├── カテゴリタイトル
│   └── TechIconGrid
│       └── TechIcon[]
└── TechDetailView (選択時)
    ├── TechHeader
    ├── ProjectList
    ├── RelatedFrameworks
    └── RelatedLanguages
```

**レスポンシブ対応:**
- Mobile:
  - グリッド: 2-3列
  - TechDetailViewをフルスクリーン表示
  - プロジェクトカードを縦積み
- Tablet:
  - グリッド: 4-5列
  - TechDetailViewを最適化
- Desktop: 既存レイアウト維持

### 4. 出版物ページ (src/app/publications/page.tsx)

**現在の状態:**
- PublicationListコンポーネントを使用
- PublicationFiltersでフィルタリング
- PublicationDetailModalで詳細表示

**改善点:**
- フィルターUIのモバイル最適化（モーダルまたは折りたたみ）
- PublicationItemのカード表示改善
- 年ラベルとリストアイテムの配置調整
- モーダルのモバイル対応

**コンポーネント構造:**
```
PublicationsPage
└── PublicationList
    ├── PublicationFilters
    │   ├── フィルターボタン群
    │   └── クリアボタン
    ├── 年ラベル + PublicationItem[]
    └── PublicationDetailModal
```

**レスポンシブ対応:**
- Mobile:
  - フィルターをモーダルまたは折りたたみ式に
  - PublicationItemを縦積み、フルワイド
  - 年ラベルの配置調整
  - モーダルをフルスクリーン表示
- Tablet: 中間レイアウト
- Desktop: 既存レイアウト維持

## Data Models

### レスポンシブ設定

```typescript
// Tailwind CSS breakpoints
const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Touch target minimum size
const TOUCH_TARGET_MIN_SIZE = 44; // pixels

// Mobile viewport sizes for testing
const MOBILE_VIEWPORTS = {
  small: { width: 375, height: 667 },   // iPhone SE
  medium: { width: 390, height: 844 },  // iPhone 12/13
  large: { width: 428, height: 926 }    // iPhone 14 Pro Max
} as const;

// Tablet viewport sizes for testing
const TABLET_VIEWPORTS = {
  small: { width: 768, height: 1024 },  // iPad Mini
  large: { width: 1024, height: 1366 }  // iPad Pro
} as const;
```

### テストデータ構造

```typescript
// Test data should be loaded from actual JSON files
interface TestDataSources {
  profile: typeof import('@/data/profile.json');
  career: typeof import('@/data/career.json');
  techExperience: typeof import('@/data/tech-experience.json');
  publications: typeof import('@/data/publications.json');
  updates: typeof import('@/data/updates.json');
}
```

## Error Handling

### レスポンシブデザインのエラーハンドリング

1. **横スクロール検出:**
   - `document.body.scrollWidth > window.innerWidth` をチェック
   - 開発環境で警告を表示

2. **タッチターゲットサイズ検証:**
   - インタラクティブ要素のサイズをチェック
   - 44x44px未満の要素に警告

3. **画像オーバーフロー:**
   - `max-width: 100%` と `height: auto` を適用
   - `object-fit` プロパティで調整

### テストエラーハンドリング

1. **データ不一致:**
   - 実際のJSONデータを読み込んで動的に検証
   - ハードコードされた値を避ける

2. **タイムアウト:**
   - 適切な待機時間を設定
   - `waitForLoadState('networkidle')` を使用

3. **セレクタエラー:**
   - より堅牢なセレクタを使用（role, label, testid）
   - 複数のフォールバックセレクタを用意

## Testing Strategy

### E2Eテスト修正計画

#### 1. homepage.spec.ts

**修正内容:**
- プロフィール名を実際のデータから取得
- セレクタを現在のDOM構造に合わせて更新
- レスポンシブテストの強化

**テストケース:**
- ページロードと基本コンテンツ表示
- ナビゲーション機能
- 更新情報リスト表示
- アクセシビリティ
- モバイル/タブレット/デスクトップでのレスポンシブ表示

#### 2. career.spec.ts

**修正内容:**
- GitBranchTimelineの現在の実装に合わせたセレクタ更新
- 実際のキャリアデータを使用
- SVGベースのタイムライン要素の検証

**テストケース:**
- タイムライン表示
- 順序反転機能
- ブレッドクラムナビゲーション
- セマンティック構造
- レスポンシブ表示

#### 3. dev-experience.spec.ts

**修正内容:**
- 統計セクションのセレクタ更新
- フィルター機能の削除（現在の実装にはフィルターなし）
- カテゴリセクションとアイコングリッドの検証
- TechDetailViewの検証

**テストケース:**
- ページロードと技術グリッド表示
- カテゴリセクション表示
- 技術アイコンクリックと詳細表示
- プロジェクトモーダル表示
- キーボードナビゲーション
- レスポンシブ表示

#### 4. publications.spec.ts

**修正内容:**
- 統計セクションの削除（現在の実装にはなし）
- フィルター機能の検証（PublicationFiltersコンポーネント）
- PublicationListの現在の実装に合わせた検証

**テストケース:**
- ページロードと出版物リスト表示
- フィルター機能
- バッジ表示
- DOIリンク
- 時系列順序
- 結果カウント表示
- キーボードナビゲーション
- レスポンシブ表示
- 詳細モーダル表示

### レスポンシブテスト戦略

**各ページで実施するレスポンシブテスト:**

1. **モバイルテスト (375px):**
   - すべてのコンテンツが表示される
   - 横スクロールが発生しない
   - タッチターゲットが適切なサイズ
   - テキストが読みやすい

2. **タブレットテスト (768px):**
   - レイアウトが適切に調整される
   - ナビゲーションが使いやすい
   - コンテンツが効率的に配置される

3. **デスクトップテスト (1280px):**
   - 既存の機能が正常に動作
   - レイアウトが崩れない

### テスト実行環境

```typescript
// playwright.config.ts での設定
const config: PlaywrightTestConfig = {
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5']
      }
    },
    {
      name: 'Tablet',
      use: {
        ...devices['iPad Pro']
      }
    }
  ]
};
```

## Implementation Notes

### CSS/Tailwind修正パターン

**横スクロール防止:**
```css
/* 親コンテナ */
.container {
  @apply max-w-full overflow-x-hidden;
}

/* 子要素 */
.content {
  @apply w-full max-w-full;
}
```

**タッチターゲット最適化:**
```css
/* ボタン・リンク */
.interactive-element {
  @apply min-h-[44px] min-w-[44px] p-2;
}
```

**レスポンシブグリッド:**
```css
/* モバイルファースト */
.grid-container {
  @apply grid grid-cols-1 gap-4
         sm:grid-cols-2 sm:gap-6
         lg:grid-cols-3 lg:gap-8;
}
```

### SVG レスポンシブ対応

**GitBranchTimeline最適化:**
```typescript
// モバイルでのレイアウト調整
const MOBILE_LAYOUT = {
  LANE_WIDTH: 60,  // デスクトップ: 80
  NODE_RADIUS: 6,  // デスクトップ: 8
  LABEL_FONT_SIZE: 'text-xs',  // デスクトップ: text-sm
};

// viewBox を使用した動的スケーリング
<svg
  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
  className="w-full h-auto"
  preserveAspectRatio="xMinYMin meet"
>
```

### モーダル/詳細ビューのモバイル対応

**フルスクリーンモーダル:**
```typescript
// モバイルでフルスクリーン、デスクトップで中央配置
<div className={`
  fixed inset-0 z-50
  lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2
  lg:max-w-2xl lg:max-h-[90vh]
  w-full h-full lg:w-auto lg:h-auto
  overflow-y-auto
`}>
```

### テストヘルパー関数

```typescript
// テストデータ読み込み
async function loadTestData<T>(path: string): Promise<T> {
  const data = await import(`@/data/${path}.json`);
  return data.default || data;
}

// レスポンシブテストヘルパー
async function testResponsiveLayout(
  page: Page,
  viewport: { width: number; height: number },
  assertions: () => Promise<void>
) {
  await page.setViewportSize(viewport);
  await page.waitForLoadState('networkidle');
  await assertions();
}

// 横スクロールチェック
async function checkNoHorizontalScroll(page: Page) {
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.body.scrollWidth > window.innerWidth;
  });
  expect(hasHorizontalScroll).toBe(false);
}
```

## Performance Considerations

1. **画像最適化:**
   - Next.js Imageコンポーネントを使用
   - レスポンシブ画像サイズの自動生成
   - 遅延読み込み

2. **CSS最適化:**
   - Tailwind CSSのPurge機能で未使用スタイルを削除
   - クリティカルCSSのインライン化

3. **テスト実行時間:**
   - 並列実行の活用
   - 不要な待機時間の削減
   - 効率的なセレクタの使用

## Accessibility Considerations

1. **キーボードナビゲーション:**
   - すべてのインタラクティブ要素がキーボードでアクセス可能
   - フォーカス表示の明確化

2. **スクリーンリーダー対応:**
   - 適切なARIAラベル
   - セマンティックHTML要素の使用

3. **コントラスト比:**
   - WCAG AA基準を満たすコントラスト比
   - テキストの可読性確保

4. **タッチターゲット:**
   - 最小44x44pxのタッチターゲットサイズ
   - 十分な間隔の確保
