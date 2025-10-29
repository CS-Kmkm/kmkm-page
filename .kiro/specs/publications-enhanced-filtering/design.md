# Design Document

## Overview

このドキュメントは、publicationsページの改善に関する設計を定義します。主な変更点は以下の通りです：

1. 統計情報セクションの削除
2. モーダルベースのフィルタリングUIの実装
3. 論文詳細情報を表示するモーダルの実装
4. データ構造の拡張（抄録と画像のサポート）

## Architecture

### Component Structure

```
src/app/publications/page.tsx (修正)
  └─ PublicationList (修正)
      ├─ FilterButton (新規)
      ├─ FilterModal (新規)
      │   ├─ AuthorshipFilter
      │   └─ PublicationTypeFilter
      ├─ PublicationItem (新規 - リスト項目を分離)
      └─ PublicationDetailModal (新規)
          ├─ BibliographicInfo
          ├─ AbstractSection
          └─ ImageSection
```

### Data Flow

1. **初期表示**: publications.jsonからデータを読み込み、年順（降順）でソート
2. **フィルタリング**: FilterModalでユーザーが選択した条件に基づいてフィルタリング
3. **詳細表示**: PublicationItemクリック時にPublicationDetailModalを開く

## Components and Interfaces

### 1. 型定義の拡張

`src/types/index.ts`に以下の型を追加：

```typescript
export interface PublicationEntry {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  doi?: string;
  url?: string;
  isFirstAuthor: boolean;
  isPeerReviewed: boolean;
  publicationType: 'journal' | 'conference' | 'workshop' | 'preprint' | 'other';
  abstract?: string;        // 新規: 抄録
  imageUrl?: string;        // 新規: 説明用画像のURL
  imageAlt?: string;        // 新規: 画像の代替テキスト
}

export interface PublicationFilters {
  authorshipType: 'all' | 'first-author' | 'co-author';
  publicationTypes: string[];  // 選択された論文タイプの配列
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: PublicationFilters) => void;
  currentFilters: PublicationFilters;
  availableTypes: string[];
}

export interface PublicationDetailModalProps {
  publication: PublicationEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface PublicationItemProps {
  publication: PublicationEntry;
  onClick: () => void;
}
```

### 2. FilterModal Component

**責務**: フィルタリング条件を設定するモーダルUI

**Props**: `FilterModalProps`

**State**:
- `localFilters: PublicationFilters` - モーダル内での一時的なフィルタ状態

**主要機能**:
- 主著/共著の選択（ラジオボタン）
- 論文タイプの複数選択（チェックボックス）
- Apply/Cancelボタン
- キーボードナビゲーション（Tab、Escape）
- フォーカストラップ

**実装詳細**:
```typescript
// フィルタ適用ロジック
const handleApply = () => {
  onApply(localFilters);
  onClose();
};

// モーダル外クリックで閉じる
const handleBackdropClick = (e: React.MouseEvent) => {
  if (e.target === e.currentTarget) {
    onClose();
  }
};
```

### 3. PublicationDetailModal Component

**責務**: 論文の詳細情報を表示するモーダルUI

**Props**: `PublicationDetailModalProps`

**主要機能**:
- 書誌情報の表示（タイトル、著者、会場、年）
- 抄録の表示（存在する場合）
- 画像の表示（存在する場合）
- DOI/URLリンク
- 閉じるボタン
- キーボードナビゲーション（Escape）
- フォーカストラップ

**レイアウト**:
```
┌─────────────────────────────────────┐
│ [×] Close                           │
│                                     │
│ Title (Large, Bold)                 │
│ Authors                             │
│ Venue, Year                         │
│ [Badges: Type, First Author, etc.]  │
│ [DOI] [PDF]                         │
│                                     │
│ Abstract                            │
│ ─────────────────────────────────   │
│ Lorem ipsum dolor sit amet...       │
│                                     │
│ [Image if available]                │
│                                     │
└─────────────────────────────────────┘
```

### 4. PublicationItem Component

**責務**: 個別の論文アイテムを表示（クリック可能）

**Props**: `PublicationItemProps`

**主要機能**:
- 論文の基本情報を表示
- クリック時にonClickコールバックを実行
- ホバー効果
- キーボードアクセシビリティ（Enter/Space）

**実装詳細**:
```typescript
// クリック可能な要素として実装
<article
  role="button"
  tabIndex={0}
  onClick={onClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }}
  className="cursor-pointer hover:bg-gray-50 transition-colors"
>
  {/* 論文情報 */}
</article>
```

### 5. PublicationList Component (修正)

**変更点**:
- 統計情報の表示を削除
- フィルタボタンとモーダルの統合
- PublicationItemコンポーネントの使用
- PublicationDetailModalの統合

**State**:
- `filters: PublicationFilters` - 現在のフィルタ状態
- `isFilterModalOpen: boolean` - フィルタモーダルの開閉状態
- `selectedPublication: PublicationEntry | null` - 選択された論文
- `isDetailModalOpen: boolean` - 詳細モーダルの開閉状態

**フィルタリングロジック**:
```typescript
const filteredPublications = useMemo(() => {
  let result = [...publications];
  
  // 主著/共著フィルタ
  if (filters.authorshipType === 'first-author') {
    result = result.filter(pub => pub.isFirstAuthor);
  } else if (filters.authorshipType === 'co-author') {
    result = result.filter(pub => !pub.isFirstAuthor);
  }
  
  // 論文タイプフィルタ
  if (filters.publicationTypes.length > 0) {
    result = result.filter(pub => 
      filters.publicationTypes.includes(pub.publicationType)
    );
  }
  
  // 年順ソート（降順）
  return result.sort((a, b) => b.year - a.year);
}, [publications, filters]);
```

### 6. Publications Page (修正)

**変更点**:
- 統計情報セクションの削除
- "About These Publications"セクションの削除
- ページヘッダーの簡素化

## Data Models

### PublicationEntry (拡張)

既存のフィールドに加えて：

```typescript
{
  // ... 既存フィールド
  abstract?: string;      // 論文の抄録（オプション）
  imageUrl?: string;      // 説明用画像のURL（オプション）
  imageAlt?: string;      // 画像の代替テキスト（オプション）
}
```

### PublicationFilters

```typescript
{
  authorshipType: 'all' | 'first-author' | 'co-author';
  publicationTypes: string[];  // 例: ['journal', 'conference']
}
```

## Error Handling

### モーダル関連

1. **フォーカストラップの失敗**: フォールバックとして手動でフォーカス管理
2. **モーダルの重複表示**: 状態管理で同時に1つのモーダルのみ開くよう制御

### データ関連

1. **画像読み込み失敗**: 代替テキストを表示、エラー時は画像セクションを非表示
2. **抄録の欠損**: 抄録セクション自体を非表示

### フィルタリング

1. **フィルタ結果が0件**: "No publications found"メッセージを表示
2. **無効なフィルタ値**: デフォルト値にフォールバック

## Testing Strategy

### Unit Tests

1. **FilterModal**:
   - フィルタ選択の状態管理
   - Apply/Cancelボタンの動作
   - キーボードナビゲーション

2. **PublicationDetailModal**:
   - 論文情報の表示
   - 抄録/画像の条件付き表示
   - 閉じる操作（ボタン、Escape、背景クリック）

3. **PublicationItem**:
   - クリックイベントの発火
   - キーボード操作（Enter/Space）

4. **PublicationList**:
   - フィルタリングロジック
   - ソート機能
   - モーダルの開閉制御

### Integration Tests (E2E)

1. **フィルタリングフロー**:
   - フィルタボタンをクリック
   - フィルタを選択
   - Applyをクリック
   - フィルタされた結果を確認

2. **詳細表示フロー**:
   - 論文アイテムをクリック
   - 詳細モーダルが開く
   - 情報が正しく表示される
   - モーダルを閉じる

3. **アクセシビリティ**:
   - キーボードのみでの操作
   - スクリーンリーダーでの読み上げ
   - フォーカス管理

## Accessibility Considerations

### ARIA Attributes

- **FilterModal**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **PublicationDetailModal**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **PublicationItem**: `role="button"`, `tabIndex={0}`
- **Filter buttons**: `aria-pressed` for toggle states

### Keyboard Navigation

- **Tab**: モーダル内の要素間を移動
- **Escape**: モーダルを閉じる
- **Enter/Space**: ボタンやアイテムを選択

### Focus Management

1. モーダルを開く時: 最初のフォーカス可能な要素にフォーカス
2. モーダルを閉じる時: トリガー要素にフォーカスを戻す
3. フォーカストラップ: モーダル内でフォーカスをループ

## Performance Considerations

1. **メモ化**: `useMemo`でフィルタリング結果をキャッシュ
2. **遅延ロード**: 画像は必要に応じて読み込み
3. **仮想化**: 論文数が多い場合は将来的に検討（現在は不要）

## Migration Path

1. 型定義の拡張
2. 新規コンポーネントの作成（FilterModal、PublicationDetailModal、PublicationItem）
3. PublicationListコンポーネントの修正
4. Publications Pageの修正（統計情報削除）
5. テストの更新
6. E2Eテストの更新

既存のデータ構造は後方互換性を保つため、`abstract`と`imageUrl`はオプションフィールドとして追加します。
