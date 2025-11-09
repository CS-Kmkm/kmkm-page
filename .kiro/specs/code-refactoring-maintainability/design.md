# Design Document

## Overview

このドキュメントは、Next.jsアプリケーションのコードベースをリファクタリングし、保守性を向上させるための設計を定義します。主な目標は以下の通りです:

1. **国際化対応の準備**: すべての日本語テキストを英語に置き換え、将来的なi18n導入を容易にする
2. **コンポーネントの統一**: 重複するモーダル、リスト、フィルターコンポーネントを汎用的な共通コンポーネントに統合
3. **デザインシステムの確立**: 色やスタイルをDesign Tokenとして一元管理し、Tailwind CSSの設定と統合

## Architecture

### 1. Internationalization (i18n) Preparation

#### 1.1 Text Constants System

すべてのハードコードされたテキストを定数ファイルに移動します。

```
src/
  lib/
    constants/
      labels.ts          # UI labels and aria-labels
      categories.ts      # Category names and configurations
      messages.ts        # User-facing messages
```

**設計原則**:
- すべてのテキストは英語で定義
- 構造化されたオブジェクトとして管理（将来的にi18nライブラリに移行しやすい）
- TypeScript型定義で型安全性を確保

#### 1.2 Data Structure Updates

JSONデータファイル内の日本語フィールドを英語に変更します。

**変更対象**:
- `src/data/career.json`: `role`, `description`フィールド
- カテゴリ名やラベルの識別子

**後方互換性**:
- 既存のデータ構造を維持しつつ、表示用のラベルのみを変更
- IDやキーは変更しない

### 2. Shared Component System

#### 2.1 Generic Modal Component

現在、複数のモーダルコンポーネント（EventModal, EventDetailModal, EventListModal, ProjectModal）が存在し、重複したロジックを持っています。

**新しい構造**:

```typescript
// src/components/ui/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  className?: string;
}
```

**機能**:
- キーボードナビゲーション（Escape, Tab trap）
- フォーカス管理
- アニメーション（framer-motion）
- アクセシビリティ（ARIA属性）
- レスポンシブデザイン

**既存モーダルの移行**:
- 各モーダルは新しい`Modal`コンポーネントをラップして使用
- モーダル固有のコンテンツのみを実装

#### 2.2 Generic List Component

リストアイテムの表示パターンを統一します。

```typescript
// src/components/ui/ListItem.tsx
interface ListItemProps {
  title: string;
  description?: string;
  meta?: string | React.ReactNode;
  badge?: {
    label: string;
    variant: BadgeVariant;
  };
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

**使用箇所**:
- UpdatesList
- EventList
- PublicationList
- ProjectList

#### 2.3 Generic Filter Component

フィルター機能を汎用化します。

```typescript
// src/components/ui/Filter.tsx
interface FilterProps<T> {
  filters: FilterConfig<T>[];
  currentValues: T;
  onApply: (values: T) => void;
  onReset?: () => void;
}

interface FilterConfig<T> {
  id: keyof T;
  label: string;
  type: 'radio' | 'checkbox' | 'select';
  options: FilterOption[];
}
```

### 3. Design Token System

#### 3.1 Color Token Architecture

現在、色はTailwindクラスとして直接コンポーネントに記述されています（例: `text-gray-700`, `bg-blue-100`）。これをセマンティックトークンに置き換えます。

**新しい色システム**:

```typescript
// Semantic color tokens
{
  // Surface colors
  'surface-primary': 'bg-white dark:bg-gray-800',
  'surface-secondary': 'bg-gray-50 dark:bg-gray-700',
  'surface-elevated': 'bg-white dark:bg-gray-800',
  
  // Text colors
  'text-primary': 'text-gray-900 dark:text-gray-100',
  'text-secondary': 'text-gray-600 dark:text-gray-300',
  'text-muted': 'text-gray-500 dark:text-gray-400',
  
  // Border colors
  'border-default': 'border-gray-200 dark:border-gray-700',
  'border-focus': 'border-blue-500 dark:border-blue-400',
  
  // Interactive colors
  'interactive-primary': 'bg-blue-600 dark:bg-blue-500',
  'interactive-hover': 'hover:bg-blue-700 dark:hover:bg-blue-600',
  
  // Status colors
  'status-success': 'bg-green-100 dark:bg-green-900/20',
  'status-warning': 'bg-yellow-100 dark:bg-yellow-900/20',
  'status-error': 'bg-red-100 dark:bg-red-900/20',
  'status-info': 'bg-blue-100 dark:bg-blue-900/20',
}
```

#### 3.2 Tailwind Configuration Integration

Tailwind CSSの設定を拡張して、カスタムカラートークンを定義します。

**アプローチ**:
1. `globals.css`のCSS変数を活用
2. Tailwindの`theme.extend.colors`でセマンティックカラーを定義
3. 既存のスタイルユーティリティ（`listItemStyles.ts`, `modalStyles.ts`）を更新

**例**:

```css
/* globals.css */
:root {
  --color-surface-primary: #ffffff;
  --color-surface-secondary: #f9fafb;
  --color-text-primary: #111827;
  /* ... */
}

.dark {
  --color-surface-primary: #1f2937;
  --color-surface-secondary: #111827;
  --color-text-primary: #f9fafb;
  /* ... */
}
```

```javascript
// tailwind.config.js (or next.config.ts)
theme: {
  extend: {
    colors: {
      surface: {
        primary: 'var(--color-surface-primary)',
        secondary: 'var(--color-surface-secondary)',
      },
      text: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
      },
      // ...
    }
  }
}
```

#### 3.3 Style Utility Updates

既存の`listItemStyles.ts`と`modalStyles.ts`を更新して、Design Tokenを使用します。

**変更方針**:
- ハードコードされたTailwindクラスをセマンティックトークンに置き換え
- 構造は維持（既存のコンポーネントへの影響を最小化）
- 型定義を強化

## Components and Interfaces

### 1. Constants and Labels

```typescript
// src/lib/constants/labels.ts
export const ARIA_LABELS = {
  closeModal: 'Close modal',
  openMenu: 'Open menu',
  toggleTheme: 'Toggle theme',
  previousItem: 'Previous item',
  nextItem: 'Next item',
  // ...
} as const;

export const UI_LABELS = {
  close: 'Close',
  cancel: 'Cancel',
  apply: 'Apply',
  save: 'Save',
  // ...
} as const;
```

```typescript
// src/lib/constants/categories.ts
export enum EventCategory {
  AFFILIATION = 'affiliation',
  PUBLICATION = 'publication',
  EVENT = 'event',
  INTERNSHIP = 'internship',
  AWARD = 'award',
  OTHER = 'other',
}

export const CATEGORY_CONFIG = {
  [EventCategory.AFFILIATION]: {
    label: 'Affiliation',
    color: 'blue',
    icon: '🏢',
  },
  [EventCategory.PUBLICATION]: {
    label: 'Publication',
    color: 'green',
    icon: '📄',
  },
  // ...
} as const;
```

### 2. Generic Modal Component

```typescript
// src/components/ui/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  className?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  footer,
  className = '',
  ariaLabelledBy,
  ariaDescribedBy,
}: ModalProps): JSX.Element;
```

**実装の詳細**:
- Framer Motionを使用したアニメーション
- キーボードトラップとフォーカス管理
- Escapeキーでの閉じる機能
- バックドロップクリックでの閉じる機能
- レスポンシブサイズ調整

### 3. Generic List Item Component

```typescript
// src/components/ui/ListItem.tsx
interface ListItemProps {
  title: string;
  description?: string;
  meta?: string | React.ReactNode;
  badge?: BadgeProps;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  ariaLabel?: string;
}

interface BadgeProps {
  label: string;
  variant: 'blue' | 'green' | 'purple' | 'orange' | 'yellow' | 'gray';
  icon?: string;
}

export function ListItem(props: ListItemProps): JSX.Element;
```

### 4. Design Token Utilities

```typescript
// src/lib/theme/tokens.ts
export const colorTokens = {
  surface: {
    primary: 'bg-surface-primary',
    secondary: 'bg-surface-secondary',
    elevated: 'bg-surface-elevated',
  },
  text: {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    muted: 'text-text-muted',
  },
  border: {
    default: 'border-border-default',
    focus: 'border-border-focus',
  },
  interactive: {
    primary: 'bg-interactive-primary',
    hover: 'hover:bg-interactive-hover',
  },
} as const;

export function getColorToken(category: string, variant: string): string;
```

## Data Models

### 1. Updated Career Data Structure

```typescript
// Before (Japanese)
{
  "role": "生徒",
  "description": "小学校での基礎教育"
}

// After (English)
{
  "role": "student",
  "description": "Elementary school education"
}
```

### 2. Category Configuration

```typescript
interface CategoryConfig {
  label: string;
  variant: BadgeVariant;
  icon: string;
  ariaLabel: string;
}

type CategoryMap = Record<string, CategoryConfig>;
```

## Error Handling

### 1. Missing Translations

将来的なi18n導入時に備えて、フォールバック機能を実装します。

```typescript
function getLabel(key: string, fallback?: string): string {
  return LABELS[key] ?? fallback ?? key;
}
```

### 2. Invalid Color Tokens

存在しないカラートークンが指定された場合のフォールバック:

```typescript
function getColorToken(token: string): string {
  return colorTokens[token] ?? colorTokens.default;
}
```

## Testing Strategy

### 1. Component Testing

**対象**:
- 新しい汎用コンポーネント（Modal, ListItem, Filter）
- 更新されたスタイルユーティリティ

**テスト項目**:
- レンダリングの正常性
- プロパティの正しい適用
- イベントハンドラの動作
- アクセシビリティ属性の存在

### 2. Visual Regression Testing

**対象**:
- すべてのページとコンポーネント
- ライトモードとダークモード

**ツール**:
- Playwright（既存のe2eテストを活用）

### 3. Accessibility Testing

**対象**:
- ARIA属性の正確性
- キーボードナビゲーション
- スクリーンリーダー対応

**ツール**:
- axe-core（既存のアクセシビリティテストを活用）

### 4. Type Safety Testing

**対象**:
- TypeScriptの型エラーがないこと
- 新しい型定義の正確性

**方法**:
- `tsc --noEmit`でのビルドチェック

## Migration Strategy

### Phase 1: Foundation (Design Tokens)

1. CSS変数の拡張（`globals.css`）
2. カラートークンの定義
3. スタイルユーティリティの更新（`listItemStyles.ts`, `modalStyles.ts`）

### Phase 2: Constants and Labels

1. 定数ファイルの作成（`labels.ts`, `categories.ts`, `messages.ts`）
2. 既存コンポーネントでの日本語テキストの置き換え
3. データファイルの更新（`career.json`など）

### Phase 3: Shared Components

1. 汎用Modalコンポーネントの実装
2. 既存モーダルの移行（1つずつ段階的に）
3. 汎用ListItemコンポーネントの実装
4. 既存リストコンポーネントの移行

### Phase 4: Verification

1. すべてのページの動作確認
2. アクセシビリティテストの実行
3. ビジュアルリグレッションテストの実行
4. TypeScriptビルドの確認

## Performance Considerations

### 1. Bundle Size

- 新しい共通コンポーネントにより、重複コードが削減され、バンドルサイズが減少
- Tree-shakingを活用して未使用のコードを除外

### 2. Runtime Performance

- CSS変数の使用により、テーマ切り替えのパフォーマンスが向上
- 共通コンポーネントのメモ化（React.memo）

### 3. Build Performance

- TypeScriptの型チェックが増加する可能性があるが、型安全性が向上

## Accessibility Considerations

### 1. ARIA Labels

- すべてのaria-label属性を英語に統一
- 意味のある、説明的なラベルを使用

### 2. Keyboard Navigation

- 既存のキーボードナビゲーション機能を維持
- 新しい共通コンポーネントでも同様の機能を実装

### 3. Screen Reader Support

- セマンティックHTMLの使用を継続
- 適切なrole属性とaria属性の設定

### 4. Color Contrast

- Design Tokenで定義する色は、WCAG AA基準を満たすコントラスト比を確保
- ダークモードでも同様の基準を適用

## Backward Compatibility

### 1. Existing Components

- 既存のコンポーネントは段階的に移行
- 古いコンポーネントと新しいコンポーネントが一時的に共存

### 2. Data Structure

- データ構造の変更は最小限に抑える
- 既存のIDやキーは変更しない

### 3. API Compatibility

- コンポーネントのpropsインターフェースは可能な限り維持
- 破壊的変更が必要な場合は、deprecation warningを追加

## Future Enhancements

### 1. Full i18n Support

現在の設計は、将来的なi18nライブラリ（next-intl, react-i18nextなど）の導入を容易にします。

**移行パス**:
```typescript
// Current
const label = UI_LABELS.close;

// Future with i18n
const label = t('ui.close');
```

### 2. Theme Customization

Design Tokenシステムにより、将来的にユーザーがテーマをカスタマイズできる機能を追加可能。

### 3. Component Library

共通コンポーネントを拡張して、完全なコンポーネントライブラリを構築可能。

## Design Decisions and Rationales

### 1. Why CSS Variables over Tailwind Extend?

**決定**: CSS変数とTailwind拡張の両方を使用

**理由**:
- CSS変数: ランタイムでの動的な変更が可能（テーマ切り替え）
- Tailwind拡張: 型安全性とオートコンプリート

### 2. Why Generic Components over Specialized?

**決定**: 汎用的な共通コンポーネントを作成

**理由**:
- コードの重複を削減
- 一貫性のあるUI/UX
- メンテナンスコストの削減
- 新機能の追加が容易

### 3. Why English for All Text?

**決定**: すべてのテキストを英語に統一

**理由**:
- 国際的な標準
- 将来的なi18n導入の準備
- コードの可読性向上（開発者間での共通言語）

### 4. Why Gradual Migration?

**決定**: 段階的な移行アプローチ

**理由**:
- リスクの最小化
- 各段階でのテストと検証が可能
- 既存機能への影響を最小化
- ロールバックが容易

## Conclusion

この設計により、以下の目標を達成します:

1. **保守性の向上**: 共通コンポーネントとDesign Tokenにより、変更が容易に
2. **国際化対応**: 英語への統一により、将来的なi18n導入が容易に
3. **一貫性**: 統一されたスタイルとコンポーネントにより、UI/UXの一貫性を確保
4. **拡張性**: 新機能の追加やカスタマイズが容易な構造

段階的な移行により、既存機能を維持しながら、安全にリファクタリングを進めることができます。
