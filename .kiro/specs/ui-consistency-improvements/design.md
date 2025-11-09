# Design Document

## Overview

このドキュメントは、ポートフォリオサイト全体のUIコンポーネントの一貫性を向上させるための設計を定義します。モーダルコンポーネントとリスト項目コンポーネントの統一されたデザインシステムを確立し、コードの再利用性と保守性を高めます。

## Architecture

### Design System Approach

統一されたUIコンポーネントを実現するために、以下のアプローチを採用します:

1. **共通スタイル定数の定義**: 再利用可能なスタイル定数をユーティリティファイルに集約
2. **コンポーネントの段階的リファクタリング**: 既存のコンポーネントを一つずつ更新
3. **後方互換性の維持**: 既存の機能を壊さずにスタイルのみを統一

### Component Hierarchy

```
src/
├── lib/
│   └── ui/
│       ├── modalStyles.ts      # モーダル共通スタイル定数
│       └── listItemStyles.ts   # リスト項目共通スタイル定数
├── components/
│   ├── ui/
│   │   ├── EventModal.tsx      # 更新: 統一スタイル適用
│   │   ├── EventDetailModal.tsx # 更新: 統一スタイル適用
│   │   └── EventItem.tsx       # 更新: 統一スタイル適用
│   └── dev-experience/
│       ├── RelatedFrameworks.tsx # 更新: 統一スタイル適用
│       └── ProjectListItem.tsx   # 更新: 統一スタイル適用
```

## Components and Interfaces

### 1. Modal Style System

#### modalStyles.ts

モーダルコンポーネントで使用する共通スタイル定数を定義します。

```typescript
export interface ModalStyleConfig {
  backdrop: {
    base: string;
    blur: string;
    lightMode: string;
    darkMode: string;
  };
  container: {
    base: string;
    background: string;
    border: string;
    shadow: string;
    padding: string;
  };
  header: {
    base: string;
    title: string;
    closeButton: string;
  };
  content: {
    base: string;
    text: string;
  };
  footer: {
    base: string;
    button: string;
  };
}
```

**主要なスタイル定義**:

- **Backdrop**: `backdrop-blur-sm bg-white/30 dark:bg-black/50`
- **Container**: `bg-white dark:bg-gray-800 rounded-lg shadow-xl`
- **Padding**: `p-6` (ヘッダー、コンテンツ、フッター共通)
- **Close Button**: 統一されたホバー効果とフォーカススタイル

### 2. List Item Style System

#### listItemStyles.ts

リスト項目コンポーネントで使用する共通スタイル定数を定義します。

```typescript
export interface ListItemStyleConfig {
  container: {
    base: string;
    background: string;
    border: string;
    shadow: string;
    padding: string;
    hover: string;
    focus: string;
  };
  badge: {
    base: string;
    variants: Record<string, string>;
  };
  text: {
    title: string;
    description: string;
    meta: string;
  };
}
```

**主要なスタイル定義**:

- **Container**: `bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700`
- **Padding**: `p-3 sm:p-4`
- **Shadow**: `shadow-sm hover:shadow-md`
- **Hover**: `hover:border-gray-300 dark:hover:border-gray-600`
- **Focus**: `focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`

### 3. Updated Components

#### EventModal & EventDetailModal

両方のモーダルコンポーネントを統一されたスタイルシステムに更新します。

**変更点**:
- Backdropスタイルを`backdrop-blur-sm bg-white/30 dark:bg-black/50`に統一
- コンテナ、ヘッダー、フッターのパディングとマージンを統一
- 閉じるボタンのスタイルとアクセシビリティ属性を統一
- アニメーション設定を統一

#### EventItem

イベントリスト項目のスタイルを統一されたシステムに更新します。

**変更点**:
- コンテナスタイルを共通定数から取得
- ホバー効果とトランジションを統一
- カテゴリバッジのスタイルを統一

#### RelatedFrameworks

関連フレームワークリストのスタイルを統一されたシステムに更新します。

**変更点**:
- 個別フレームワーク項目のスタイルを統一
- ホバー効果とフォーカススタイルを統一
- パディングとマージンを統一

#### ProjectListItem

プロジェクトリスト項目のスタイルを統一されたシステムに更新します。

**変更点**:
- コンテナスタイルを共通定数から取得
- ホバー効果とトランジションを統一
- テクノロジーバッジのスタイルを統一

## Data Models

既存のデータモデルは変更しません。スタイルのみを更新します。

## Error Handling

### Style Application Errors

スタイル定数の適用時にエラーが発生した場合:

1. コンソールに警告を出力
2. フォールバックスタイルを適用
3. 既存の機能は維持

### Browser Compatibility

- `backdrop-filter`のサポート確認
- サポートされていない場合は代替スタイルを適用

```typescript
const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(4px)');
const backdropClass = supportsBackdropFilter 
  ? 'backdrop-blur-sm' 
  : 'bg-black/60';
```

## Testing Strategy

### Visual Regression Testing

1. **モーダルコンポーネント**:
   - 各モーダルのスクリーンショットを取得
   - ライトモードとダークモードの両方をテスト
   - 異なる画面サイズでテスト

2. **リスト項目コンポーネント**:
   - 各リスト項目のスクリーンショットを取得
   - ホバー状態とフォーカス状態をテスト
   - レスポンシブレイアウトをテスト

### Accessibility Testing

1. **キーボードナビゲーション**:
   - Tab キーでフォーカス移動
   - Enter/Space キーで項目選択
   - Escape キーでモーダル閉じる

2. **スクリーンリーダー**:
   - ARIA 属性の検証
   - role 属性の検証
   - aria-label の検証

### Cross-Browser Testing

- Chrome, Firefox, Safari, Edge での動作確認
- モバイルブラウザでの動作確認

## Implementation Plan

### Phase 1: Style Constants Creation

1. `src/lib/ui/modalStyles.ts` を作成
2. `src/lib/ui/listItemStyles.ts` を作成
3. 共通スタイル定数を定義

### Phase 2: Modal Components Update

1. `EventModal.tsx` を更新
2. `EventDetailModal.tsx` を更新
3. 両方のモーダルで統一されたスタイルを適用

### Phase 3: List Item Components Update

1. `EventItem.tsx` を更新
2. `RelatedFrameworks.tsx` を更新
3. `ProjectListItem.tsx` を更新
4. 全てのリスト項目で統一されたスタイルを適用

### Phase 4: Testing and Validation

1. 各コンポーネントの動作確認
2. アクセシビリティテスト
3. レスポンシブデザインの確認
4. ダークモードの確認

## Design Decisions and Rationales

### 1. Backdrop Blur Effect

**決定**: 全てのモーダルで `backdrop-blur-sm` を使用

**理由**:
- 視覚的な階層を明確にする
- モダンなUIデザインのトレンドに合致
- ユーザーの注意をモーダルに集中させる

### 2. Consistent Padding

**決定**: 全てのコンポーネントで `p-3 sm:p-4` または `p-6` を使用

**理由**:
- 視覚的な一貫性を保つ
- レスポンシブデザインに対応
- タッチターゲットサイズを確保

### 3. Unified Hover Effects

**決定**: 全てのインタラクティブ要素で同じホバー効果を使用

**理由**:
- ユーザーがクリック可能な要素を識別しやすくする
- 一貫したユーザー体験を提供
- アクセシビリティを向上

### 4. Dark Mode Support

**決定**: 全てのコンポーネントでダークモードをサポート

**理由**:
- ユーザーの好みに対応
- 目の疲労を軽減
- モダンなWebアプリケーションの標準機能

### 5. Style Constants Approach

**決定**: スタイルを定数として定義し、コンポーネントで再利用

**理由**:
- コードの重複を削減
- 保守性を向上
- 一貫性を保証
- 将来の変更を容易にする

## Performance Considerations

### CSS Class Optimization

- Tailwind CSS の JIT モードを活用
- 未使用のクラスを自動的に削除
- バンドルサイズを最小化

### Animation Performance

- `transform` と `opacity` のみをアニメーション
- GPU アクセラレーションを活用
- `will-change` プロパティの適切な使用

### Lazy Loading

- モーダルコンポーネントは必要時のみレンダリング
- `AnimatePresence` を使用して適切にアンマウント

## Accessibility Compliance

### WCAG 2.1 Level AA Compliance

1. **Color Contrast**: 全てのテキストで 4.5:1 以上のコントラスト比を確保
2. **Keyboard Navigation**: 全てのインタラクティブ要素にキーボードアクセス
3. **Focus Indicators**: 明確なフォーカスインジケーター
4. **ARIA Attributes**: 適切な ARIA 属性の使用
5. **Touch Target Size**: 最小 44x44px のタッチターゲット

### Screen Reader Support

- 全てのモーダルに適切な `role` と `aria-*` 属性
- 全てのボタンに適切な `aria-label`
- 画像に適切な `alt` テキスト

## Migration Strategy

### Backward Compatibility

既存のコンポーネントの API は変更しません。内部実装のみを更新します。

### Gradual Rollout

1. 開発環境でテスト
2. ステージング環境でテスト
3. 本番環境にデプロイ

### Rollback Plan

問題が発生した場合:
1. 以前のバージョンに即座にロールバック
2. 問題を特定して修正
3. 再度テストしてデプロイ
