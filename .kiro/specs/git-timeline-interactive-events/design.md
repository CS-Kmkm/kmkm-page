# Design Document

## Overview

Git Timeline Interactive Events Systemは、既存のGit-Style Career Timelineを拡張し、メインブランチ上にクリック可能なイベントポイントを追加する機能です。ユーザーはイベントポイントをクリックすることで、詳細情報をモーダルで確認できます。同一年に複数のイベントがある場合は、まずイベントリストを表示してから個別の詳細を表示します。

### Key Design Principles

1. **既存デザインとの調和**: 現在のGitタイムラインのデザインシステムと一貫性を保つ
2. **直感的なインタラクション**: クリック可能な要素を明確に示し、期待される動作を提供
3. **階層的な情報表示**: 年→イベントリスト→詳細の順で情報を段階的に表示
4. **アクセシビリティ**: キーボード操作とスクリーンリーダーをサポート
5. **レスポンシブデザイン**: すべてのデバイスで快適に利用可能

### Visual Concept

```
メインブランチ上のイベントポイント表示:

2024年 ├─ ● 名古屋大学 情報学部 [既存のブランチ]
│      │   学部学生
│      │   2024-04-01 - 2025-03-31
│      │
│      ◆ ← イベントポイント（クリック可能）
│      │   
2025年 ├─ ● 名古屋大学大学院 [既存のブランチ]
│      │   大学院生
│      │   2025-04-01 - 現在
│      │
│      ◆ ← 複数イベントのポイント
│      │
現在   ├─

クリック時の動作:
1. 単一イベント → 直接詳細モーダル表示
2. 複数イベント → イベントリストモーダル → 詳細モーダル
```

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                 GitBranchTimeline                            │
│  (既存コンポーネントを拡張)                                   │
│  - イベントポイントの描画                                     │
│  - イベントクリックハンドリング                               │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ EventPoint   │ │ EventModal   │ │ EventList    │
│ Component    │ │ Component    │ │ Modal        │
│              │ │              │ │ Component    │
│ - SVG描画    │ │ - 詳細表示   │ │ - リスト表示 │
│ - クリック   │ │ - アニメーション│ │ - 時系列順   │
│ - ホバー効果 │ │ - キーボード │ │ - 選択機能   │
└──────────────┘ └──────────────┘ └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Event Data Layer                            │
│  - EventEntry型の定義                                        │
│  - イベントデータの管理                                       │
│  - 年別グループ化ロジック                                     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **データ読み込み**: events.jsonからイベントデータを読み込む
2. **年別グループ化**: イベントを年別にグループ化
3. **ポイント配置**: メインブランチ上の適切な位置にイベントポイントを配置
4. **インタラクション**: クリック時にモーダル表示の判定と表示
5. **モーダル管理**: 単一/複数イベントに応じたモーダル表示制御

## Components and Interfaces

### 1. EventEntry Type

イベントデータの型定義:

```typescript
export interface EventEntry {
  id: string;
  title: string;
  date: string;           // ISO 8601形式 (YYYY-MM-DD)
  description: string;
  category?: string;      // オプション: イベントのカテゴリ
  year: string;          // 表示用の年（dateから自動計算）
}

// 年別グループ化されたイベント
export interface YearEventGroup {
  year: string;
  events: EventEntry[];
}
```

### 2. EventPoint Component

メインブランチ上に表示されるイベントポイント:

```typescript
interface EventPointProps {
  x: number;              // X座標（メインブランチの位置）
  y: number;              // Y座標（年に対応する位置）
  eventCount: number;     // その年のイベント数
  isMultiple: boolean;    // 複数イベントかどうか
  onClick: () => void;    // クリックハンドラー
  onHover?: (isHovered: boolean) => void;
}

// SVGでの描画例
<g className="event-point">
  <circle
    cx={x}
    cy={y}
    r={isMultiple ? 8 : 6}
    fill={isMultiple ? '#F59E0B' : '#3B82F6'}
    stroke="#FFFFFF"
    strokeWidth={2}
    className="cursor-pointer hover:scale-110 transition-transform"
    onClick={onClick}
  />
  {isMultiple && (
    <text
      x={x}
      y={y + 3}
      textAnchor="middle"
      className="text-xs font-bold fill-white pointer-events-none"
    >
      {eventCount}
    </text>
  )}
</g>
```

**責務**:
- イベントポイントのSVG描画
- ホバー効果の適用
- クリックイベントの処理
- 単一/複数イベントの視覚的区別

### 3. EventModal Component

イベントの詳細情報を表示するモーダル:

```typescript
interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventEntry | null;
  className?: string;
}

// モーダルの構造
<div className="fixed inset-0 z-50 flex items-center justify-center">
  {/* オーバーレイ */}
  <div 
    className="absolute inset-0 bg-black bg-opacity-50"
    onClick={onClose}
  />
  
  {/* モーダルコンテンツ */}
  <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {event?.title}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm text-gray-500">
          {formatDate(event?.date)}
        </div>
        {event?.category && (
          <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            {event.category}
          </div>
        )}
        <p className="text-gray-700 leading-relaxed">
          {event?.description}
        </p>
      </div>
    </div>
  </div>
</div>
```

**責務**:
- モーダルの表示/非表示制御
- イベント詳細情報の表示
- キーボード操作のサポート
- アニメーション効果の適用

### 4. EventListModal Component

同一年の複数イベントを一覧表示するモーダル:

```typescript
interface EventListModalProps {
  isOpen: boolean;
  onClose: () => void;
  yearGroup: YearEventGroup | null;
  onEventSelect: (event: EventEntry) => void;
}

// イベントリストモーダルの構造
<div className="fixed inset-0 z-50 flex items-center justify-center">
  <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
  
  <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {yearGroup?.year}年のイベント
        </h2>
        <button onClick={onClose}>✕</button>
      </div>
      
      <div className="space-y-2">
        {yearGroup?.events.map(event => (
          <div
            key={event.id}
            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => onEventSelect(event)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
```

**責務**:
- 年別イベントリストの表示
- 時系列順でのイベント並び替え
- 個別イベント選択の処理
- EventModalへの遷移管理

### 5. Enhanced GitBranchTimeline Component

既存のGitBranchTimelineコンポーネントを拡張:

```typescript
interface EnhancedGitBranchTimelineProps extends GitBranchTimelineProps {
  events?: EventEntry[];  // 新規追加: イベントデータ
}

// 新規追加の状態管理
const [selectedEvent, setSelectedEvent] = useState<EventEntry | null>(null);
const [selectedYearGroup, setSelectedYearGroup] = useState<YearEventGroup | null>(null);
const [isEventModalOpen, setIsEventModalOpen] = useState(false);
const [isEventListModalOpen, setIsEventListModalOpen] = useState(false);

// イベントデータの処理
const yearEventGroups = useMemo(() => {
  if (!events) return [];
  
  const groups = events.reduce((acc, event) => {
    const year = event.year;
    if (!acc[year]) {
      acc[year] = { year, events: [] };
    }
    acc[year].events.push(event);
    return acc;
  }, {} as Record<string, YearEventGroup>);
  
  // 各年のイベントを日付順でソート
  Object.values(groups).forEach(group => {
    group.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });
  
  return Object.values(groups);
}, [events]);
```

**新規追加機能**:
- イベントポイントの描画
- イベントクリック時のモーダル表示制御
- 年別イベントグループの管理
- 既存タイムラインとの統合

## Data Models

### Event Data Structure

events.jsonのデータ構造:

```json
{
  "events": [
    {
      "id": "event-001",
      "title": "研究発表",
      "date": "2024-03-15",
      "description": "学会での研究成果発表を行いました。機械学習を用いた新しいアプローチについて発表し、多くの質問をいただきました。",
      "category": "学術"
    },
    {
      "id": "event-002", 
      "title": "インターンシップ開始",
      "date": "2024-07-01",
      "description": "IT企業でのサマーインターンシップを開始しました。実際の開発プロジェクトに参加し、貴重な経験を積むことができました。",
      "category": "キャリア"
    },
    {
      "id": "event-003",
      "title": "論文採択",
      "date": "2024-09-20", 
      "description": "国際会議に投稿した論文が採択されました。初めての国際会議での発表となり、大きな成果となりました。",
      "category": "学術"
    }
  ]
}
```

### Year-based Event Grouping

年別グループ化のアルゴリズム:

```typescript
function groupEventsByYear(events: EventEntry[]): YearEventGroup[] {
  // 1. 年を抽出してグループ化
  const yearGroups = events.reduce((acc, event) => {
    const year = new Date(event.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = { year, events: [] };
    }
    acc[year].events.push({ ...event, year });
    return acc;
  }, {} as Record<string, YearEventGroup>);
  
  // 2. 各年内で日付順にソート
  Object.values(yearGroups).forEach(group => {
    group.events.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  });
  
  // 3. 年順でソートして返す
  return Object.values(yearGroups).sort((a, b) => 
    parseInt(a.year) - parseInt(b.year)
  );
}
```

### Event Point Positioning

イベントポイントの位置計算:

```typescript
function calculateEventPointPosition(
  year: string,
  minDate: Date,
  pixelsPerYear: number,
  layoutConstants: typeof LAYOUT
): { x: number; y: number } {
  // メインブランチのX座標
  const x = layoutConstants.MAIN_LINE_X;
  
  // 年の中央位置を計算（7月1日を基準）
  const yearDate = new Date(`${year}-07-01`);
  const yearsDiff = (yearDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const y = layoutConstants.TOP_PADDING + (yearsDiff * pixelsPerYear);
  
  return { x, y };
}
```

## Layout and Positioning

### Event Point Placement

イベントポイントの配置ルール:

1. **X座標**: メインブランチと同じ位置（MAIN_LINE_X）
2. **Y座標**: 該当年の中央位置（7月1日相当）
3. **重複回避**: 同じY座標に複数のポイントがある場合は微調整
4. **視覚的区別**: 単一イベントと複数イベントで異なるスタイル

```typescript
// イベントポイントの配置計算
function calculateEventPointPositions(
  yearGroups: YearEventGroup[],
  minDate: Date,
  pixelsPerYear: number,
  layoutConstants: typeof LAYOUT
): Array<{ yearGroup: YearEventGroup; x: number; y: number }> {
  return yearGroups.map(yearGroup => {
    const position = calculateEventPointPosition(
      yearGroup.year,
      minDate,
      pixelsPerYear,
      layoutConstants
    );
    
    return {
      yearGroup,
      ...position
    };
  });
}
```

### Modal Positioning

モーダルの配置とサイズ:

```css
/* デスクトップ */
.event-modal {
  max-width: 28rem;  /* 448px */
  width: 100%;
  margin: 0 1rem;
}

.event-list-modal {
  max-width: 32rem;  /* 512px */
  width: 100%;
  margin: 0 1rem;
}

/* モバイル */
@media (max-width: 768px) {
  .event-modal,
  .event-list-modal {
    margin: 0 0.75rem;
    max-height: 90vh;
    overflow-y: auto;
  }
}
```

## Interaction Design

### Click Behavior

イベントポイントクリック時の動作フロー:

```typescript
function handleEventPointClick(yearGroup: YearEventGroup) {
  if (yearGroup.events.length === 1) {
    // 単一イベント: 直接詳細モーダルを表示
    setSelectedEvent(yearGroup.events[0]);
    setIsEventModalOpen(true);
  } else {
    // 複数イベント: イベントリストモーダルを表示
    setSelectedYearGroup(yearGroup);
    setIsEventListModalOpen(true);
  }
}

function handleEventSelect(event: EventEntry) {
  // イベントリストから詳細への遷移
  setIsEventListModalOpen(false);
  setSelectedEvent(event);
  setIsEventModalOpen(true);
}
```

### Keyboard Navigation

キーボード操作のサポート:

```typescript
// モーダル内でのキーボード操作
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      // Escapeキーでモーダルを閉じる
      if (isEventModalOpen) {
        setIsEventModalOpen(false);
      } else if (isEventListModalOpen) {
        setIsEventListModalOpen(false);
      }
    }
  };
  
  if (isEventModalOpen || isEventListModalOpen) {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }
}, [isEventModalOpen, isEventListModalOpen]);

// フォーカストラップの実装
function useFocusTrap(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;
    
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isActive]);
}
```

### Hover Effects

ホバー効果の実装:

```css
.event-point {
  transition: transform 0.2s ease-out, filter 0.2s ease-out;
  cursor: pointer;
}

.event-point:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4));
}

.event-point.multiple:hover {
  filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.4));
}
```

## Animation and Transitions

### Modal Animations

モーダルの表示・非表示アニメーション:

```typescript
// Framer Motionを使用したアニメーション
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

const overlayVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

// モーダルコンポーネントでの使用
<AnimatePresence>
  {isOpen && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
    >
      <motion.div
        className="relative bg-white rounded-lg shadow-xl"
        variants={modalVariants}
      >
        {/* モーダルコンテンツ */}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

### Event Point Animations

イベントポイントの表示アニメーション:

```typescript
// イベントポイントの段階的表示
const eventPointVariants = {
  hidden: {
    scale: 0,
    opacity: 0
  },
  visible: (index: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: index * 0.1,
      duration: 0.4,
      ease: 'easeOut'
    }
  })
};

// SVG内でのアニメーション適用
{eventPointPositions.map((position, index) => (
  <motion.g
    key={`event-point-${position.yearGroup.year}`}
    custom={index}
    initial="hidden"
    animate="visible"
    variants={eventPointVariants}
  >
    <EventPoint {...position} />
  </motion.g>
))}
```

### Reduced Motion Support

モーション削減設定への対応:

```typescript
const prefersReducedMotion = useReducedMotion();

const animationProps = prefersReducedMotion
  ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
  : {
      initial: "hidden",
      animate: "visible",
      exit: "hidden",
      variants: modalVariants
    };
```

## Accessibility

### ARIA Attributes

アクセシビリティ属性の設定:

```typescript
// イベントポイント
<circle
  role="button"
  aria-label={`${yearGroup.year}年のイベント${yearGroup.events.length > 1 ? `（${yearGroup.events.length}件）` : ''}`}
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEventPointClick(yearGroup);
    }
  }}
/>

// モーダル
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">{event?.title}</h2>
  <div id="modal-description">{event?.description}</div>
</div>

// イベントリストモーダル
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="event-list-title"
>
  <h2 id="event-list-title">{yearGroup?.year}年のイベント</h2>
  <ul role="list">
    {yearGroup?.events.map(event => (
      <li key={event.id} role="listitem">
        <button
          aria-label={`${event.title}の詳細を表示`}
          onClick={() => handleEventSelect(event)}
        >
          {event.title}
        </button>
      </li>
    ))}
  </ul>
</div>
```

### Screen Reader Support

スクリーンリーダー向けの説明文:

```typescript
function generateEventPointDescription(yearGroup: YearEventGroup): string {
  if (yearGroup.events.length === 1) {
    const event = yearGroup.events[0];
    return `${yearGroup.year}年のイベント: ${event.title}。クリックして詳細を表示。`;
  } else {
    return `${yearGroup.year}年に${yearGroup.events.length}件のイベント。クリックしてリストを表示。`;
  }
}
```

## Error Handling

### Data Validation

イベントデータの検証:

```typescript
interface EventValidationError {
  type: 'missing_field' | 'invalid_date' | 'duplicate_id';
  eventId: string;
  message: string;
}

function validateEventData(events: EventEntry[]): EventValidationError[] {
  const errors: EventValidationError[] = [];
  const seenIds = new Set<string>();
  
  events.forEach(event => {
    // 必須フィールドのチェック
    if (!event.id || !event.title || !event.date || !event.description) {
      errors.push({
        type: 'missing_field',
        eventId: event.id || 'unknown',
        message: '必須フィールドが不足しています'
      });
    }
    
    // 日付の妥当性チェック
    if (event.date && isNaN(new Date(event.date).getTime())) {
      errors.push({
        type: 'invalid_date',
        eventId: event.id,
        message: '無効な日付形式です'
      });
    }
    
    // ID重複チェック
    if (seenIds.has(event.id)) {
      errors.push({
        type: 'duplicate_id',
        eventId: event.id,
        message: 'IDが重複しています'
      });
    }
    seenIds.add(event.id);
  });
  
  return errors;
}
```

### Error Display

エラー発生時の表示:

```typescript
function EventErrorDisplay({ errors }: { errors: EventValidationError[] }) {
  if (errors.length === 0) return null;
  
  return (
    <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <h3 className="mb-2 font-semibold text-yellow-800">
        イベントデータに問題があります
      </h3>
      <ul className="list-inside list-disc space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm text-yellow-700">
            {error.eventId}: {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Performance Considerations

### Optimization Strategies

1. **イベントデータのメモ化**:
```typescript
const yearEventGroups = useMemo(() => 
  groupEventsByYear(events || []), [events]
);

const eventPointPositions = useMemo(() => 
  calculateEventPointPositions(yearEventGroups, minDate, pixelsPerYear, layoutConstants),
  [yearEventGroups, minDate, pixelsPerYear, layoutConstants]
);
```

2. **モーダルの遅延レンダリング**:
```typescript
// モーダルが開いている時のみレンダリング
{isEventModalOpen && (
  <EventModal
    isOpen={isEventModalOpen}
    onClose={() => setIsEventModalOpen(false)}
    event={selectedEvent}
  />
)}
```

3. **イベントハンドラーの最適化**:
```typescript
const handleEventPointClick = useCallback((yearGroup: YearEventGroup) => {
  if (yearGroup.events.length === 1) {
    setSelectedEvent(yearGroup.events[0]);
    setIsEventModalOpen(true);
  } else {
    setSelectedYearGroup(yearGroup);
    setIsEventListModalOpen(true);
  }
}, []);
```

### Performance Metrics

目標パフォーマンス指標:
- イベントポイント描画: < 50ms
- モーダル表示: < 200ms
- イベントリスト表示: < 100ms
- メモリ使用量: < 5MB追加（100イベントの場合）

## Integration with Existing Timeline

### Backward Compatibility

既存のGitBranchTimelineとの互換性:

```typescript
// イベント機能はオプション
interface EnhancedGitBranchTimelineProps extends GitBranchTimelineProps {
  events?: EventEntry[];  // オプショナル
  enableEventPoints?: boolean;  // デフォルト: true
}

// 既存の使用方法は変更なし
<GitBranchTimeline entries={careerEntries} />

// 新機能を有効にする場合
<GitBranchTimeline 
  entries={careerEntries} 
  events={eventEntries}
  enableEventPoints={true}
/>
```

### CSS Integration

既存のスタイルシステムとの統合:

```css
/* 既存のタイムラインスタイルを継承 */
.event-point {
  /* 既存のノードスタイルをベースに */
  @apply transition-all duration-300;
}

.event-modal {
  /* 既存のモーダルスタイルと一貫性を保つ */
  @apply bg-white rounded-lg shadow-xl;
}

/* 既存の色パレットを使用 */
.event-point-single {
  fill: theme('colors.blue.500');
}

.event-point-multiple {
  fill: theme('colors.amber.500');
}
```

### Data Integration

既存のデータ構造との統合:

```typescript
// 既存のcareer.jsonと並行してevents.jsonを使用
export function getEventEntries(): EventEntry[] {
  try {
    return eventData.events || [];
  } catch (error) {
    console.warn('Failed to load event data:', error);
    return [];
  }
}

// 統合されたデータ取得
export function getTimelineData() {
  return {
    careerEntries: getCareerEntries(),
    eventEntries: getEventEntries()
  };
}
```