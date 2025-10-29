# 設計書

## 概要

DevExperienceページを言語中心のUIに再設計し、3段階の情報表示（言語アイコン → 言語詳細 → プロジェクト詳細）を実現する。現在のフィルター・ソート機能を持つグリッド表示から、よりインタラクティブで段階的な情報開示を行うUIに変更する。

## アーキテクチャ

### コンポーネント構造

```
src/app/dev-experience/page.tsx (変更)
├── LanguageIconGrid (新規作成)
│   └── LanguageIcon (新規作成)
├── LanguageDetailView (新規作成)
│   ├── LanguageHeader (新規作成)
│   ├── LanguageDescription (新規作成)
│   └── ProjectList (新規作成)
│       └── ProjectListItem (新規作成)
└── ProjectModal (既存、再利用)
```

### 状態管理

```typescript
// ページレベルの状態
interface DevExperiencePageState {
  selectedLanguage: TechItem | null;  // 選択された言語
  selectedProject: ProjectDetail | null;  // 選択されたプロジェクト
  isProjectModalOpen: boolean;  // プロジェクトモーダルの表示状態
}
```

### データフロー

1. **初期表示**: `getTechExperience()` から言語カテゴリーのみをフィルタリング
2. **言語選択**: ユーザーがアイコンをクリック → `selectedLanguage` を更新 → `LanguageDetailView` を表示
3. **プロジェクト選択**: ユーザーがプロジェクトリストアイテムをクリック → `selectedProject` を更新 → `ProjectModal` を表示
4. **戻る操作**: `selectedLanguage` を `null` に設定 → アイコングリッドに戻る

## コンポーネントとインターフェース

### 1. LanguageIconGrid コンポーネント

**責務**: 言語アイコンのグリッド表示

**Props**:
```typescript
interface LanguageIconGridProps {
  languages: TechItem[];
  onLanguageSelect: (language: TechItem) => void;
}
```

**実装詳細**:
- レスポンシブグリッドレイアウト（2列 → 3列 → 4列）
- 熟練度順、経験年数順でソート
- アニメーション: フェードイン、ホバー時のスケール

### 2. LanguageIcon コンポーネント

**責務**: 個別の言語アイコン表示

**Props**:
```typescript
interface LanguageIconProps {
  language: TechItem;
  onClick: () => void;
}
```

**実装詳細**:
- 正方形のアイコンボタン
- ロゴ画像を中央配置
- ホバー時にツールチップで言語名を表示
- キーボードフォーカス対応

### 3. LanguageDetailView コンポーネント

**責務**: 選択された言語の詳細情報表示

**Props**:
```typescript
interface LanguageDetailViewProps {
  language: TechItem;
  projects: ProjectDetail[];
  onBack: () => void;
  onProjectSelect: (project: ProjectDetail) => void;
}
```

**実装詳細**:
- スライドインアニメーション
- 戻るボタンを左上に配置
- 3つのセクション: ヘッダー、説明、プロジェクトリスト

### 4. LanguageHeader コンポーネント

**責務**: 言語の基本情報表示

**Props**:
```typescript
interface LanguageHeaderProps {
  language: TechItem;
}
```

**実装詳細**:
- 言語ロゴ、名前、熟練度バッジ、経験年数を表示
- 熟練度に応じた色分け

### 5. LanguageDescription コンポーネント

**責務**: 言語の説明文表示

**Props**:
```typescript
interface LanguageDescriptionProps {
  description: string;
}
```

**実装詳細**:
- マークダウン対応（将来的な拡張）
- 読みやすいタイポグラフィ

### 6. ProjectList コンポーネント

**責務**: プロジェクトリストの表示

**Props**:
```typescript
interface ProjectListProps {
  projects: ProjectDetail[];
  onProjectSelect: (project: ProjectDetail) => void;
}
```

**実装詳細**:
- 縦スクロール可能なリスト
- 各プロジェクトを `ProjectListItem` で表示

### 7. ProjectListItem コンポーネント

**責務**: 個別のプロジェクトリストアイテム表示

**Props**:
```typescript
interface ProjectListItemProps {
  project: ProjectDetail;
  onClick: () => void;
}
```

**実装詳細**:
- プロジェクト名、期間、役割を表示
- ホバー時に背景色変更
- クリック可能なボタンとして実装

### 8. ProjectModal コンポーネント（既存）

**変更点**: なし（既存のコンポーネントをそのまま再利用）

## データモデル

### 既存の型定義（変更なし）

```typescript
interface TechItem {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  experienceYears: number;
  projects: string[];
  description?: string;
  logoUrl?: string;
  logoAlt?: string;
}

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
```

### 新規の型定義

```typescript
// ビューの状態を表す列挙型
enum ViewState {
  ICON_GRID = 'icon_grid',
  LANGUAGE_DETAIL = 'language_detail'
}
```

## エラーハンドリング

### エラーケース

1. **言語データが存在しない**
   - 空の状態メッセージを表示
   - 「言語データが見つかりません」

2. **プロジェクトデータが存在しない**
   - 言語詳細ビューで「関連プロジェクトがありません」と表示

3. **画像の読み込み失敗**
   - フォールバックアイコンを表示
   - カテゴリーに応じた絵文字アイコン

4. **無効な言語ID**
   - コンソールに警告を出力
   - アイコングリッドに戻る

## テスト戦略

### ユニットテスト

1. **LanguageIconGrid**
   - 言語リストが正しくソートされること
   - クリックイベントが正しく発火すること

2. **LanguageDetailView**
   - 戻るボタンが機能すること
   - プロジェクトリストが正しく表示されること

3. **ProjectListItem**
   - クリックイベントが正しく発火すること

### インテグレーションテスト

1. **ナビゲーションフロー**
   - アイコングリッド → 言語詳細 → プロジェクトモーダル → 言語詳細 → アイコングリッド

2. **データ整合性**
   - 選択された言語のプロジェクトのみが表示されること

### E2Eテスト

1. **基本フロー**
   - ページ読み込み → 言語アイコンクリック → プロジェクトクリック → モーダル表示 → 閉じる

2. **アクセシビリティ**
   - キーボードナビゲーション
   - スクリーンリーダー対応

3. **レスポンシブデザイン**
   - モバイル、タブレット、デスクトップでの表示確認

## UIデザイン仕様

### レイアウト

#### アイコングリッド
```
┌─────────────────────────────────────┐
│  Development Experience             │
│  ─────────────────────────────────  │
│                                     │
│  ┌───┐  ┌───┐  ┌───┐  ┌───┐       │
│  │ P │  │ T │  │ J │  │ C │       │
│  └───┘  └───┘  └───┘  └───┘       │
│                                     │
│  ┌───┐                              │
│  │ C#│                              │
│  └───┘                              │
└─────────────────────────────────────┘
```

#### 言語詳細ビュー
```
┌─────────────────────────────────────┐
│  ← Back                             │
│  ─────────────────────────────────  │
│                                     │
│  ┌───┐  Python                      │
│  │ P │  Expert • 4 years            │
│  └───┘                              │
│                                     │
│  研究におけるデータ分析・実験...    │
│                                     │
│  Related Projects                   │
│  ─────────────────────────────────  │
│  • 生成AIチャットボット開発         │
│    2025年4月 - 2025年9月            │
│    フルスタック開発者                │
│                                     │
│  • データ分析・実験（研究）         │
│    2021年4月 - 現在                 │
│    研究者                            │
└─────────────────────────────────────┘
```

### カラースキーム

- **熟練度バッジ**:
  - Expert: `bg-green-100 text-green-900 border-green-300`
  - Advanced: `bg-blue-100 text-blue-900 border-blue-300`
  - Intermediate: `bg-yellow-100 text-yellow-900 border-yellow-300`
  - Beginner: `bg-gray-100 text-gray-900 border-gray-300`

- **アイコンホバー**: `hover:shadow-lg hover:scale-110`
- **プロジェクトリストアイテムホバー**: `hover:bg-gray-50`

### アニメーション

1. **アイコングリッド表示**: フェードイン（300ms）
2. **言語詳細ビュー表示**: スライドイン（400ms）
3. **プロジェクトモーダル表示**: フェードイン（200ms）
4. **ホバーエフェクト**: スケール変換（150ms）

### レスポンシブブレークポイント

- **モバイル** (< 640px): 2列グリッド
- **タブレット** (640px - 1024px): 3列グリッド
- **デスクトップ** (> 1024px): 4列グリッド

## アクセシビリティ

### ARIA属性

- `role="button"` on language icons
- `aria-label` for icon buttons
- `aria-expanded` for detail view state
- `role="list"` and `role="listitem"` for project list

### キーボードナビゲーション

- Tab: 次の要素にフォーカス
- Shift+Tab: 前の要素にフォーカス
- Enter/Space: 選択
- Escape: モーダルを閉じる、詳細ビューから戻る

### フォーカス管理

- 言語詳細ビュー表示時に戻るボタンにフォーカス
- モーダル表示時にモーダル内にフォーカストラップ
- モーダル閉じる時に元の要素にフォーカスを戻す

## パフォーマンス最適化

1. **画像最適化**
   - Next.js Image コンポーネントを使用
   - 遅延読み込み
   - WebP形式の使用

2. **コード分割**
   - 動的インポートでモーダルコンポーネントを遅延読み込み

3. **メモ化**
   - `useMemo` でソート済み言語リストをキャッシュ
   - `useCallback` でイベントハンドラーをメモ化

4. **アニメーション**
   - CSS transforms を使用（GPU加速）
   - `will-change` プロパティの適切な使用

## 実装の優先順位

### Phase 1: 基本機能
1. LanguageIconGrid と LanguageIcon コンポーネント
2. 言語フィルタリングとソート
3. 基本的なクリックイベント処理

### Phase 2: 詳細ビュー
1. LanguageDetailView コンポーネント
2. LanguageHeader と LanguageDescription
3. 戻るボタンの実装

### Phase 3: プロジェクトリスト
1. ProjectList と ProjectListItem コンポーネント
2. プロジェクトモーダルとの連携
3. データフィルタリング

### Phase 4: 仕上げ
1. アニメーション実装
2. アクセシビリティ対応
3. レスポンシブデザイン調整
4. パフォーマンス最適化

## 技術スタック

- **フレームワーク**: Next.js 14+ (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks (useState, useMemo, useCallback)
- **アニメーション**: Tailwind CSS transitions + Framer Motion（オプション）
- **画像最適化**: Next.js Image コンポーネント

## 移行戦略

### 既存コードからの変更点

1. **削除する機能**
   - フィルター・ソートコントロール
   - カテゴリー別グリッド表示
   - 統計情報セクション
   - 凡例セクション

2. **保持する機能**
   - ProjectModal コンポーネント
   - データ取得ロジック（getTechExperience, getProjectDetails）
   - 基本的なページレイアウト

3. **新規追加する機能**
   - 言語アイコングリッド
   - 言語詳細ビュー
   - プロジェクトリスト

### 段階的な実装

1. 新しいコンポーネントを別ファイルで作成
2. 既存のページコンポーネントを新しいコンポーネントに置き換え
3. 不要なコードを削除
4. テストとリファクタリング
