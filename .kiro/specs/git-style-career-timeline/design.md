# Design Document

## Overview

Git-Style Career Timeline Systemは、ユーザーの経歴をGitHubのブランチグラフのように視覚化するシステムです。人生の主軸を「main」ブランチとして表現し、学校や組織への所属を分岐・マージとして表現することで、経歴の流れと各所属の関係性を直感的に理解できるようにします。

### Key Design Principles

1. **視覚的な明瞭性**: ブランチの分岐・マージを明確に表現し、経歴の流れを一目で理解できるようにする
2. **階層的な情報表示**: mainブランチ、ブランチ、サブブランチの3階層構造をサポート
3. **色による識別**: 各ブランチに固有の色を割り当て、視覚的に区別しやすくする
4. **レスポンシブデザイン**: すべてのデバイスで快適に閲覧できる縦方向レイアウト
5. **アクセシビリティ**: WCAG 2.1 Level AAに準拠し、すべてのユーザーが利用可能

### Visual Concept

```
時間軸（上から下）mainブランチに年数を表示
│
2009年 ├─ ● 某公立小学校 [青色ブランチ]
│      │   生徒
│      │   2009-04-01 - 2015-03-31
│      │   小学校での基礎教育
│      │
2015年 ├─ ● 某公立中学校 [緑色ブランチ]
│      │   生徒
│      │   2015-04-01 - 2018-03-31
│      │   中学校での学習
│      │
2018年 ├─ ● 岐阜県立岐阜高等学校 [紫色ブランチ]
│      │   生徒
│      │   2018-04-01 - 2021-03-31
│      │   高等学校での学習
│      │
2021年 ├─ ● 名古屋大学 情報学部 [オレンジ色ブランチ]
│      │   学部学生
│      │   2021-04-01 - 2025-03-31
│      │   大学での学習
│      │
2023年 ├─ ├─ ● 知能システム系 [黄色サブブランチ]
│      │  │   配属
│      │  │   2023-04-01 - 2025-03-31
│      │  │   知能システム系への配属
│      │  │
2024年 ├─ │  ├─ ● 松原研究室 [赤色サブブランチ]
│      │  │  │   配属
│      │  │  │   2024-04-01 - null
│      │  │  │   松原研究室への配属
│      │  │  │
2025年 ├─ ● 名古屋大学大学院 情報学研究科 [ピンク色ブランチ]
│      │   大学院生（松原研究室）
│      │   2025-04-01 - 現在
│      │   大学院での研究活動
│      │
現在   ├─
```

### 改善点の詳細

#### 1. 説明文の配置
各経歴の説明文（description）を組織名・役職・期間と同じ場所（ノードの右側）に4行目として配置します。これにより、すべての情報が一箇所にまとまり、視認性が向上します。

```
ノード ─ 組織名
  ●      役職
         期間
         説明文
```

#### 2. 時間軸の正確な表現
mainブランチに年数の目盛りを表示し、ブランチの分岐点とマージ点を実際の開始日・終了日に対応する位置に配置します。

- 1年 = 一定のピクセル数（例: 100px）
- 分岐点のY座標 = 開始日に対応するmainブランチ上の位置
- マージ点のY座標 = 終了日に対応するmainブランチ上の位置

これにより、所属期間の長さが視覚的に正確に表現されます。


## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Career Page                             │
│  (src/app/career/page.tsx)                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              GitBranchTimeline Component                     │
│  (src/components/ui/GitBranchTimeline.tsx)                   │
│  - タイムライン全体の描画                                    │
│  - ブランチ構造の計算とレイアウト                            │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ BranchLine   │ │ BranchNode   │ │ BranchLabel  │
│ Component    │ │ Component    │ │ Component    │
│              │ │              │ │              │
│ - SVG線描画  │ │ - ノード描画 │ │ - テキスト   │
│ - 分岐/マージ│ │ - 色管理     │ │   表示       │
└──────────────┘ └──────────────┘ └──────────────┘
        │                │                │
        └────────────────┼────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Data Layer                                  │
│  - CareerEntry型の拡張                                       │
│  - ブランチ構造の計算ロジック                                │
│  - 色割り当てロジック                                        │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **データ読み込み**: career.jsonから経歴データを読み込む
2. **構造解析**: 親子関係を解析し、ブランチツリーを構築
3. **レイアウト計算**: 各ブランチの位置、色、接続線を計算
4. **レンダリング**: SVGとHTMLを使用してタイムラインを描画
5. **インタラクション**: ホバー、フォーカス時の強調表示


## Components and Interfaces

### 1. GitBranchTimeline Component

メインのタイムラインコンポーネント。ブランチ構造全体を管理し、レンダリングします。

```typescript
interface GitBranchTimelineProps {
  entries: ExtendedCareerEntry[];
  className?: string;
}

interface ExtendedCareerEntry extends CareerEntry {
  parentId?: string | null;  // 親エントリーのID（nullの場合はmainから分岐）
  branchColor?: string;       // ブランチの色（自動割り当て）
  branchLevel?: number;       // ブランチの階層レベル（0=main, 1=branch, 2=sub-branch）
}

// 内部で使用する計算済みブランチデータ
interface ComputedBranch {
  id: string;
  entry: ExtendedCareerEntry;
  color: string;
  level: number;
  xOffset: number;           // 横方向のオフセット（ブランチの位置）
  yPosition: number;         // 縦方向の位置（時間軸上の位置）
  parentBranch?: ComputedBranch;
  childBranches: ComputedBranch[];
  startY: number;            // 分岐開始位置
  endY: number;              // マージ終了位置
}
```

**責務**:
- 経歴データからブランチツリーを構築
- 各ブランチの色、位置、階層を計算
- SVGキャンバスの管理
- 子コンポーネントへのデータ渡し


### 2. BranchLine Component

ブランチの線（分岐、マージ、接続線）を描画するコンポーネント。

```typescript
interface BranchLineProps {
  branch: ComputedBranch;
  parentBranch?: ComputedBranch;
  type: 'branch' | 'merge' | 'connection';
  color: string;
  animated?: boolean;
}
```

**責務**:
- SVGパスを使用してブランチ線を描画
- 分岐点とマージ点の曲線を描画
- アニメーション効果の適用

**描画パターン**:
- **branch**: 親ブランチから分岐する曲線
- **merge**: 子ブランチが親にマージする曲線
- **connection**: ブランチ上のノード間を接続する直線

### 3. BranchNode Component

ブランチ上の各経歴エントリーを表すノード（点）を描画するコンポーネント。

```typescript
interface BranchNodeProps {
  branch: ComputedBranch;
  entry: ExtendedCareerEntry;
  color: string;
  position: { x: number; y: number };
  type: 'start' | 'end' | 'milestone';
  isActive?: boolean;
  onHover?: (entry: ExtendedCareerEntry) => void;
  onFocus?: (entry: ExtendedCareerEntry) => void;
}
```

**責務**:
- ノードの円を描画
- ホバー/フォーカス時の強調表示
- アクセシビリティ属性の設定

**ノードタイプ**:
- **start**: 分岐開始点（入学・入社）
- **end**: マージ終了点（卒業・退職）
- **milestone**: ブランチ上の重要なイベント


### 4. BranchLabel Component

ノードの横に表示される経歴情報のラベルコンポーネント。

```typescript
interface BranchLabelProps {
  entry: ExtendedCareerEntry;
  position: { x: number; y: number };
  alignment: 'left' | 'right';
  color: string;
  isHighlighted?: boolean;
}
```

**責務**:
- 組織名、役職、期間、説明文の表示（すべてノードの右側）
- レスポンシブなテキストレイアウト

**表示内容**:
```
ノード位置
    ↓
    ● ─ 名古屋大学 情報学部              ← organization（ノードの右側）
        学部学生（松原研究室）           ← role（ノードの右側）
        2024-04-01 - 2025-03-31          ← startDate - endDate（ノードの右側）
        大学での学習                     ← description（ノードの右側、4行目）
```

**レイアウト詳細**:
- すべての情報をノードの右側（x + 18px）に縦に配置
- 組織名: midY - 14px
- 役職: midY + 2px
- 期間: midY + 18px
- 説明文: midY + 34px（期間の下）


## Data Models

### Extended CareerEntry Type

既存のCareerEntry型を拡張し、ブランチ構造をサポートします。

```typescript
// 既存の型（src/types/index.ts）
export interface CareerEntry {
  id: string;
  year: string;
  organization: string;
  role: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

// 拡張型（新規追加）
export interface ExtendedCareerEntry extends CareerEntry {
  parentId?: string | null;  // 親エントリーのID
  branchColor?: string;       // ブランチの色（計算時に設定）
  branchLevel?: number;       // 階層レベル（計算時に設定）
}
```

### JSON Data Structure

career.jsonのデータ構造を拡張します。

```json
{
  "entries": [
    {
      "id": "career-001",
      "year": "2025",
      "organization": "名古屋大学大学院 情報学研究科",
      "role": "大学院生（松原研究室）",
      "startDate": "2025-04-01",
      "endDate": null,
      "parentId": null,
      "description": "大学院での研究活動"
    },
    {
      "id": "career-002",
      "year": "2024-2025",
      "organization": "名古屋大学 情報学部",
      "role": "学部学生（松原研究室）",
      "startDate": "2024-04-01",
      "endDate": "2025-03-31",
      "parentId": "career-004",
      "description": "研究室配属後の活動"
    }
  ]
}
```

**フィールド説明**:
- `parentId`: 親エントリーのID。nullの場合はmainブランチから分岐
- `description`: 経歴の詳細説明（オプション）


### Branch Tree Structure

ブランチツリーの構築アルゴリズム:

```typescript
interface BranchTree {
  mainBranch: BranchNode;
  allBranches: Map<string, BranchNode>;
}

interface BranchNode {
  entry: ExtendedCareerEntry;
  parent: BranchNode | null;
  children: BranchNode[];
  level: number;
  color: string;
}

function buildBranchTree(entries: ExtendedCareerEntry[]): BranchTree {
  // 1. エントリーをIDでマップ化
  // 2. 親子関係を解析
  // 3. 循環参照をチェック
  // 4. ツリー構造を構築
  // 5. 各ブランチに色を割り当て
  // 6. 階層レベルを計算
}
```


## Layout and Positioning

### Coordinate System

SVGキャンバスを使用した座標系:

```
(0, 0) ← 左上
  │
  ├─ X軸: 横方向（ブランチの位置）
  │   - Main: x = 70
  │   - Branch 1: x = 160 (70 + 90)
  │   - Branch 2: x = 250 (70 + 90*2)
  │   - Sub-branch: x = 340 (70 + 90*3)
  │
  └─ Y軸: 縦方向（時間軸）
      - 実際の年数に基づいて計算
      - 分岐点: 開始日に対応するY座標
      - マージ点: 終了日に対応するY座標
```

### Branch Positioning

ブランチの横方向配置ルール:

1. **Main Branch**: 常に x = 70px に配置
2. **Primary Branches**: mainから分岐するブランチは x = 160px (70 + 90)
3. **Sub-branches**: 親ブランチから +90px オフセット
4. **最大幅**: 画面幅に応じて動的に調整

```typescript
function calculateXOffset(level: number): number {
  const MAIN_LINE_X = 70;       // mainブランチの位置
  const LANE_WIDTH = 90;        // ブランチ間の間隔
  
  return MAIN_LINE_X + (level * LANE_WIDTH);
}
```

### Time-based Y Positioning

**重要な変更点**: 時間軸に基づく正確な縦方向配置

各経歴エントリーの開始日と終了日を実際の年数に基づいて配置します。これにより、ブランチの分岐点とマージ点がmainブランチ上の年数目盛りと正確に一致します。

```typescript
// 日付から年数の差分を計算
function getYearsDiff(date1: Date, date2: Date): number {
  return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

// 開始日に対応するY座標を計算
function calculateStartY(startDate: string, minDate: Date, pixelsPerYear: number): number {
  const entryDate = new Date(startDate);
  const yearsDiff = getYearsDiff(entryDate, minDate);
  return TOP_PADDING + (yearsDiff * pixelsPerYear);
}

// 終了日に対応するY座標を計算
function calculateEndY(endDate: string | null, minDate: Date, maxDate: Date, pixelsPerYear: number): number {
  if (!endDate) {
    // 終了日がない場合は現在（maxDate）まで
    const yearsDiff = getYearsDiff(maxDate, minDate);
    return TOP_PADDING + (yearsDiff * pixelsPerYear);
  }
  
  const entryDate = new Date(endDate);
  const yearsDiff = getYearsDiff(entryDate, minDate);
  return TOP_PADDING + (yearsDiff * pixelsPerYear);
}
```

### Main Branch Year Labels

mainブランチに年数の目盛りを表示します。

```typescript
// マージポイントの年ラベルを収集
const mainMergeLabels: Array<{ y: number; label: string }> = [];

nodes.forEach(node => {
  node.mergeTargets?.forEach(target => {
    if (target.type === 'main') {
      const mergeY = target.at === 'start' ? node.startY : node.endY;
      const label = getYearLabel(node.entry, target.at ?? 'end');
      if (label) {
        mainMergeLabels.push({ y: mergeY, label });
      }
    }
  });
});

// SVGでラベルを描画
{mainMergeLabels.map(({ y, label }, index) => (
  <text
    key={`main-label-${label}-${index}`}
    x={MAIN_LINE_X - 16}
    y={y + 4}
    textAnchor="end"
    className="text-xs font-medium fill-slate-500"
  >
    {label}年
  </text>
))}
```

### Label Positioning

ノードの右側にすべての情報を縦に配置します:

```typescript
// ラベルのX座標: ノードの右側
const labelX = node.x + 18;

// ノードの中央位置
const midY = (node.startY + node.endY) / 2;

// SVGでラベルを描画
<g key={`node-${node.entry.id}`}>
  {/* ノード */}
  <circle cx={node.x} cy={midY} r={NODE_RADIUS} fill={node.color} />
  
  {/* 組織名 */}
  <text x={labelX} y={midY - 14} className="text-sm font-semibold fill-slate-900">
    {node.entry.organization}
  </text>
  
  {/* 役職 */}
  <text x={labelX} y={midY + 2} className="text-xs fill-slate-500">
    {node.entry.role}
  </text>
  
  {/* 期間 */}
  <text x={labelX} y={midY + 18} className="text-xs fill-slate-400">
    {formatRange(node.entry)}
  </text>
  
  {/* 説明文（オプション） */}
  {node.entry.description && (
    <text x={labelX} y={midY + 34} className="text-xs fill-slate-600">
      {node.entry.description}
    </text>
  )}
</g>
```


## Color Management

### Branch Color Palette

各ブランチに割り当てる色のパレット（アクセシビリティ対応）:

```typescript
const BRANCH_COLORS = [
  { name: 'blue', value: '#3B82F6', contrast: 'high' },      // 青
  { name: 'green', value: '#10B981', contrast: 'high' },     // 緑
  { name: 'purple', value: '#8B5CF6', contrast: 'high' },    // 紫
  { name: 'orange', value: '#F59E0B', contrast: 'high' },    // オレンジ
  { name: 'red', value: '#EF4444', contrast: 'high' },       // 赤
  { name: 'pink', value: '#EC4899', contrast: 'high' },      // ピンク
  { name: 'teal', value: '#14B8A6', contrast: 'high' },      // ティール
  { name: 'indigo', value: '#6366F1', contrast: 'high' },    // インディゴ
  { name: 'yellow', value: '#EAB308', contrast: 'high' },    // 黄色
  { name: 'cyan', value: '#06B6D4', contrast: 'high' },      // シアン
];

const MAIN_BRANCH_COLOR = '#6B7280';  // グレー（mainブランチ専用）
```

### Color Assignment Algorithm

ブランチへの色割り当てロジック:

```typescript
function assignBranchColors(branches: BranchNode[]): void {
  let colorIndex = 0;
  const usedColors = new Map<string, string>();
  
  // 深さ優先探索でブランチを走査
  function assignColor(branch: BranchNode, adjacentColors: Set<string>): void {
    if (branch.level === 0) {
      branch.color = MAIN_BRANCH_COLOR;
      return;
    }
    
    // 隣接ブランチと異なる色を選択
    let selectedColor = BRANCH_COLORS[colorIndex % BRANCH_COLORS.length];
    while (adjacentColors.has(selectedColor.value)) {
      colorIndex++;
      selectedColor = BRANCH_COLORS[colorIndex % BRANCH_COLORS.length];
    }
    
    branch.color = selectedColor.value;
    usedColors.set(branch.entry.id, selectedColor.value);
    colorIndex++;
    
    // 子ブランチに再帰的に適用
    const childAdjacentColors = new Set([selectedColor.value]);
    branch.children.forEach(child => assignColor(child, childAdjacentColors));
  }
  
  branches.forEach(branch => assignColor(branch, new Set()));
}
```


## SVG Rendering

### Branch Line Rendering

ブランチ線の描画にはSVGパスを使用:

```typescript
// 分岐線（親から子へ）
function createBranchPath(
  parentX: number,
  parentY: number,
  childX: number,
  childY: number
): string {
  const controlPointOffset = Math.abs(childX - parentX) / 2;
  
  return `
    M ${parentX} ${parentY}
    C ${parentX + controlPointOffset} ${parentY},
      ${childX - controlPointOffset} ${childY},
      ${childX} ${childY}
  `;
}

// マージ線（子から親へ）
function createMergePath(
  childX: number,
  childY: number,
  parentX: number,
  parentY: number
): string {
  const controlPointOffset = Math.abs(parentX - childX) / 2;
  
  return `
    M ${childX} ${childY}
    C ${childX - controlPointOffset} ${childY},
      ${parentX + controlPointOffset} ${parentY},
      ${parentX} ${parentY}
  `;
}

// 接続線（ブランチ上の直線）
function createConnectionPath(
  x: number,
  y1: number,
  y2: number
): string {
  return `M ${x} ${y1} L ${x} ${y2}`;
}
```

### SVG Structure

```xml
<svg width="100%" height="auto" viewBox="0 0 800 2000">
  <!-- Main branch line -->
  <path d="M 100 100 L 100 2000" stroke="#6B7280" stroke-width="3" />
  
  <!-- Branch lines -->
  <g class="branch-lines">
    <!-- 分岐線 -->
    <path d="..." stroke="#3B82F6" stroke-width="2" />
    <!-- マージ線 -->
    <path d="..." stroke="#3B82F6" stroke-width="2" />
  </g>
  
  <!-- Nodes -->
  <g class="branch-nodes">
    <circle cx="100" cy="200" r="8" fill="#3B82F6" />
    <circle cx="250" cy="300" r="8" fill="#10B981" />
  </g>
  
  <!-- Labels (HTML overlay) -->
</svg>
```


## Responsive Design

### Breakpoints

```typescript
const BREAKPOINTS = {
  mobile: 0,      // 0-767px
  tablet: 768,    // 768-1023px
  desktop: 1024,  // 1024px+
};
```

### Layout Adjustments

**Mobile (< 768px)**:
- SVG幅: 画面幅の100%
- ブランチ間隔: 100px（デスクトップの150pxから縮小）
- フォントサイズ: 12px
- ノード半径: 6px
- ラベル配置: ノードの右側のみ

**Tablet (768px - 1023px)**:
- SVG幅: 画面幅の90%
- ブランチ間隔: 125px
- フォントサイズ: 14px
- ノード半径: 7px
- ラベル配置: ノードの左右（スペースに応じて）

**Desktop (1024px+)**:
- SVG幅: 最大1200px
- ブランチ間隔: 150px
- フォントサイズ: 16px
- ノード半径: 8px
- ラベル配置: ノードの左右（最適な配置）

### Responsive Implementation

```typescript
function useResponsiveLayout() {
  const [layout, setLayout] = useState({
    branchSpacing: 150,
    fontSize: 16,
    nodeRadius: 8,
  });
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setLayout({ branchSpacing: 100, fontSize: 12, nodeRadius: 6 });
      } else if (width < 1024) {
        setLayout({ branchSpacing: 125, fontSize: 14, nodeRadius: 7 });
      } else {
        setLayout({ branchSpacing: 150, fontSize: 16, nodeRadius: 8 });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return layout;
}
```


## Accessibility

### ARIA Attributes

```typescript
// タイムライン全体
<div role="list" aria-label="経歴タイムライン（Gitブランチスタイル）">
  
  // 各ブランチ
  <div role="listitem" aria-label={`${entry.organization} - ${entry.role}`}>
    
    // ノード
    <circle
      role="img"
      aria-label={`${entry.startDate}に${entry.organization}に入学/入社`}
      tabIndex={0}
    />
    
    // ラベル
    <div aria-describedby={`branch-${entry.id}-details`}>
      <div id={`branch-${entry.id}-details`}>
        {/* 詳細情報 */}
      </div>
    </div>
  </div>
</div>
```

### Keyboard Navigation

```typescript
// キーボード操作のサポート
const handleKeyDown = (e: KeyboardEvent, currentIndex: number) => {
  switch (e.key) {
    case 'ArrowDown':
      // 次のノードにフォーカス
      focusNode(currentIndex + 1);
      break;
    case 'ArrowUp':
      // 前のノードにフォーカス
      focusNode(currentIndex - 1);
      break;
    case 'Enter':
    case ' ':
      // ノードの詳細を表示/非表示
      toggleNodeDetails(currentIndex);
      break;
  }
};
```

### Screen Reader Support

```typescript
// スクリーンリーダー向けの説明文
function generateScreenReaderText(entry: ExtendedCareerEntry): string {
  const start = formatDate(entry.startDate);
  const end = entry.endDate ? formatDate(entry.endDate) : '現在';
  const parent = entry.parentId ? '（サブブランチ）' : '';
  
  return `
    ${entry.organization}、${entry.role}${parent}。
    期間: ${start}から${end}まで。
    ${entry.description || ''}
  `.trim();
}
```

### Color Contrast

すべてのブランチ色はWCAG 2.1 Level AAの基準を満たす:
- テキストと背景のコントラスト比: 最低4.5:1
- 大きなテキスト（18pt以上）: 最低3:1
- 非テキスト要素（ノード、線）: 最低3:1


## Animation and Interaction

### Page Load Animation

タイムラインの段階的な表示アニメーション:

```typescript
// アニメーションの設定
const ANIMATION_CONFIG = {
  duration: 500,           // 各要素のアニメーション時間（ms）
  stagger: 100,            // 要素間の遅延（ms）
  easing: 'ease-out',      // イージング関数
};

// Framer Motionを使用したアニメーション
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: ANIMATION_CONFIG.duration / 1000,
    delay: index * (ANIMATION_CONFIG.stagger / 1000),
    ease: ANIMATION_CONFIG.easing,
  }}
>
  {/* ブランチコンテンツ */}
</motion.div>
```

### Hover Effects

ブランチとノードのホバー効果:

```typescript
// ノードのホバー
<circle
  className="transition-all duration-300"
  onMouseEnter={() => setHoveredNode(entry.id)}
  onMouseLeave={() => setHoveredNode(null)}
  style={{
    r: isHovered ? 12 : 8,
    filter: isHovered ? 'drop-shadow(0 0 8px currentColor)' : 'none',
  }}
/>

// ブランチ線のホバー
<path
  className="transition-all duration-300"
  style={{
    strokeWidth: isHovered ? 4 : 2,
    opacity: isHovered ? 1 : 0.8,
  }}
/>
```

### Focus States

キーボードフォーカス時の視覚的フィードバック:

```css
.branch-node:focus {
  outline: 3px solid #3B82F6;
  outline-offset: 4px;
  border-radius: 50%;
}

.branch-node:focus-visible {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
}
```

### Reduced Motion Support

モーション削減設定への対応:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animationProps = prefersReducedMotion
  ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
  : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    };
```


## Error Handling

### Data Validation

経歴データの検証とエラー処理:

```typescript
interface ValidationError {
  type: 'missing_field' | 'invalid_date' | 'circular_reference' | 'invalid_parent';
  entryId: string;
  message: string;
}

function validateCareerData(entries: ExtendedCareerEntry[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const entryIds = new Set(entries.map(e => e.id));
  
  entries.forEach(entry => {
    // 必須フィールドのチェック
    if (!entry.id || !entry.organization || !entry.role || !entry.startDate) {
      errors.push({
        type: 'missing_field',
        entryId: entry.id || 'unknown',
        message: '必須フィールドが不足しています',
      });
    }
    
    // 日付の妥当性チェック
    if (entry.startDate && entry.endDate) {
      const start = new Date(entry.startDate);
      const end = new Date(entry.endDate);
      if (start > end) {
        errors.push({
          type: 'invalid_date',
          entryId: entry.id,
          message: '開始日が終了日より後になっています',
        });
      }
    }
    
    // 親エントリーの存在チェック
    if (entry.parentId && !entryIds.has(entry.parentId)) {
      errors.push({
        type: 'invalid_parent',
        entryId: entry.id,
        message: `親エントリー ${entry.parentId} が見つかりません`,
      });
    }
  });
  
  // 循環参照のチェック
  const circularRefs = detectCircularReferences(entries);
  circularRefs.forEach(entryId => {
    errors.push({
      type: 'circular_reference',
      entryId,
      message: '循環参照が検出されました',
    });
  });
  
  return errors;
}

function detectCircularReferences(entries: ExtendedCareerEntry[]): string[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const circular: string[] = [];
  
  function dfs(entryId: string): boolean {
    visited.add(entryId);
    recursionStack.add(entryId);
    
    const entry = entries.find(e => e.id === entryId);
    if (entry?.parentId) {
      if (!visited.has(entry.parentId)) {
        if (dfs(entry.parentId)) return true;
      } else if (recursionStack.has(entry.parentId)) {
        circular.push(entryId);
        return true;
      }
    }
    
    recursionStack.delete(entryId);
    return false;
  }
  
  entries.forEach(entry => {
    if (!visited.has(entry.id)) {
      dfs(entry.id);
    }
  });
  
  return circular;
}
```


### Error Display

エラー発生時のユーザーへの表示:

```typescript
function ErrorDisplay({ errors }: { errors: ValidationError[] }) {
  if (errors.length === 0) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <h3 className="text-red-800 font-semibold mb-2">
        経歴データにエラーがあります
      </h3>
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-red-700 text-sm">
            {error.entryId}: {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Fallback Rendering

エラー時のフォールバック表示:

```typescript
function GitBranchTimeline({ entries }: GitBranchTimelineProps) {
  const errors = validateCareerData(entries);
  
  if (errors.length > 0) {
    return (
      <div>
        <ErrorDisplay errors={errors} />
        {/* 従来のタイムライン表示にフォールバック */}
        <Timeline entries={entries} />
      </div>
    );
  }
  
  // 正常なGitブランチタイムラインを表示
  return <GitBranchTimelineContent entries={entries} />;
}
```


## Testing Strategy

### Unit Tests

各コンポーネントとユーティリティ関数の単体テスト:

```typescript
// ブランチツリー構築のテスト
describe('buildBranchTree', () => {
  it('should build a valid branch tree from entries', () => {
    const entries = [
      { id: '1', parentId: null, startDate: '2020-01-01', ... },
      { id: '2', parentId: '1', startDate: '2021-01-01', ... },
    ];
    const tree = buildBranchTree(entries);
    expect(tree.mainBranch).toBeDefined();
    expect(tree.allBranches.size).toBe(2);
  });
  
  it('should detect circular references', () => {
    const entries = [
      { id: '1', parentId: '2', ... },
      { id: '2', parentId: '1', ... },
    ];
    expect(() => buildBranchTree(entries)).toThrow('Circular reference detected');
  });
});

// 色割り当てのテスト
describe('assignBranchColors', () => {
  it('should assign unique colors to adjacent branches', () => {
    const branches = createTestBranches();
    assignBranchColors(branches);
    
    branches.forEach((branch, index) => {
      if (index > 0) {
        expect(branch.color).not.toBe(branches[index - 1].color);
      }
    });
  });
});

// 座標計算のテスト
describe('calculateYPosition', () => {
  it('should calculate correct Y position based on date', () => {
    const minDate = new Date('2020-01-01');
    const testDate = '2021-01-01';
    const y = calculateYPosition(testDate, minDate, 100);
    expect(y).toBeCloseTo(200, 1);
  });
});
```


### Component Tests

Reactコンポーネントのテスト:

```typescript
// GitBranchTimelineコンポーネントのテスト
describe('GitBranchTimeline', () => {
  it('should render timeline with branches', () => {
    const entries = createTestEntries();
    render(<GitBranchTimeline entries={entries} />);
    
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(entries.length);
  });
  
  it('should display error message for invalid data', () => {
    const invalidEntries = [{ id: '1', parentId: 'non-existent', ... }];
    render(<GitBranchTimeline entries={invalidEntries} />);
    
    expect(screen.getByText(/エラーがあります/)).toBeInTheDocument();
  });
  
  it('should highlight branch on hover', async () => {
    const entries = createTestEntries();
    render(<GitBranchTimeline entries={entries} />);
    
    const node = screen.getAllByRole('img')[0];
    await userEvent.hover(node);
    
    expect(node).toHaveStyle({ filter: 'drop-shadow(0 0 8px currentColor)' });
  });
});

// BranchNodeコンポーネントのテスト
describe('BranchNode', () => {
  it('should be keyboard accessible', async () => {
    const onFocus = jest.fn();
    render(<BranchNode {...testProps} onFocus={onFocus} />);
    
    const node = screen.getByRole('img');
    node.focus();
    
    expect(node).toHaveFocus();
    expect(onFocus).toHaveBeenCalled();
  });
});
```

### Integration Tests

E2Eテスト（Playwright）:

```typescript
// e2e/git-branch-timeline.spec.ts
test.describe('Git Branch Timeline', () => {
  test('should display career timeline in git branch style', async ({ page }) => {
    await page.goto('/career');
    
    // タイムラインが表示されることを確認
    await expect(page.getByRole('list', { name: /経歴タイムライン/ })).toBeVisible();
    
    // ブランチが表示されることを確認
    const branches = page.locator('[data-testid^="branch-"]');
    await expect(branches.first()).toBeVisible();
  });
  
  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/career');
    
    // 最初のノードにフォーカス
    await page.keyboard.press('Tab');
    const firstNode = page.locator('[role="img"]').first();
    await expect(firstNode).toBeFocused();
    
    // 下矢印キーで次のノードに移動
    await page.keyboard.press('ArrowDown');
    const secondNode = page.locator('[role="img"]').nth(1);
    await expect(secondNode).toBeFocused();
  });
  
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/career');
    
    // モバイルでもタイムラインが表示されることを確認
    await expect(page.getByRole('list')).toBeVisible();
    
    // ブランチが縮小されて表示されることを確認
    const svg = page.locator('svg').first();
    const box = await svg.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });
});
```

### Accessibility Tests

アクセシビリティテスト:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<GitBranchTimeline entries={testEntries} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have proper ARIA labels', () => {
    render(<GitBranchTimeline entries={testEntries} />);
    
    expect(screen.getByRole('list')).toHaveAttribute('aria-label');
    expect(screen.getAllByRole('listitem')[0]).toHaveAttribute('aria-label');
  });
});
```


## Performance Considerations

### Optimization Strategies

1. **SVG最適化**:
   - 不要なパスポイントの削減
   - viewBoxの最適化
   - transform属性の使用

2. **レンダリング最適化**:
   - React.memoによるコンポーネントのメモ化
   - useMemoによる計算結果のキャッシュ
   - useCallbackによるコールバック関数の最適化

```typescript
const GitBranchTimeline = React.memo(({ entries }: GitBranchTimelineProps) => {
  // ブランチツリーの計算をメモ化
  const branchTree = useMemo(() => buildBranchTree(entries), [entries]);
  
  // レイアウト計算をメモ化
  const layout = useMemo(() => calculateLayout(branchTree), [branchTree]);
  
  return <GitBranchTimelineContent tree={branchTree} layout={layout} />;
});
```

3. **アニメーション最適化**:
   - CSS transformとopacityのみを使用（GPUアクセラレーション）
   - will-changeプロパティの適切な使用
   - requestAnimationFrameの活用

```css
.branch-node {
  will-change: transform, opacity;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}
```

4. **遅延読み込み**:
   - 画面外のブランチの遅延レンダリング
   - Intersection Observer APIの使用

```typescript
function useLazyRender(ref: RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '100px' }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  
  return isVisible;
}
```

### Performance Metrics

目標パフォーマンス指標:
- 初回レンダリング: < 100ms
- インタラクション応答: < 50ms
- アニメーションフレームレート: 60 FPS
- メモリ使用量: < 10MB（100エントリーの場合）


## Migration Strategy

### Backward Compatibility

既存のcareer.jsonとの互換性を維持:

```typescript
// 既存のデータ形式をサポート
function migrateCareerData(entries: CareerEntry[]): ExtendedCareerEntry[] {
  return entries.map(entry => ({
    ...entry,
    parentId: entry.parentId ?? null,  // 既存データにはparentIdがない
    branchColor: undefined,             // 自動計算
    branchLevel: undefined,             // 自動計算
  }));
}

// 段階的な移行をサポート
function GitBranchTimeline({ entries }: { entries: CareerEntry[] | ExtendedCareerEntry[] }) {
  const extendedEntries = useMemo(() => {
    // parentIdフィールドの有無をチェック
    const hasParentId = entries.some(e => 'parentId' in e);
    return hasParentId ? entries as ExtendedCareerEntry[] : migrateCareerData(entries);
  }, [entries]);
  
  return <GitBranchTimelineContent entries={extendedEntries} />;
}
```

### Rollout Plan

1. **Phase 1: 新コンポーネント開発**
   - GitBranchTimelineコンポーネントの実装
   - 既存のTimelineコンポーネントは維持

2. **Phase 2: データ移行**
   - career.jsonにparentIdフィールドを追加
   - 既存データとの互換性を確認

3. **Phase 3: UI切り替え**
   - career/page.tsxでGitBranchTimelineを使用
   - フィーチャーフラグで切り替え可能にする

```typescript
// フィーチャーフラグによる切り替え
const USE_GIT_STYLE_TIMELINE = process.env.NEXT_PUBLIC_USE_GIT_TIMELINE === 'true';

export default function CareerPage() {
  const careerEntries = getCareerEntries();
  
  return (
    <PageLayout title="経歴">
      {USE_GIT_STYLE_TIMELINE ? (
        <GitBranchTimeline entries={careerEntries} />
      ) : (
        <Timeline entries={careerEntries} />
      )}
    </PageLayout>
  );
}
```

4. **Phase 4: テストと検証**
   - E2Eテストの実行
   - アクセシビリティテストの実行
   - パフォーマンステストの実行

5. **Phase 5: 本番デプロイ**
   - フィーチャーフラグを有効化
   - 旧Timelineコンポーネントの削除（オプション）


## Technology Stack

### Core Technologies

- **React 18+**: UIコンポーネントの構築
- **TypeScript**: 型安全性の確保
- **Next.js**: サーバーサイドレンダリングとルーティング
- **Tailwind CSS**: スタイリング

### Additional Libraries

- **framer-motion**: アニメーション効果
  - バージョン: ^10.0.0
  - 用途: ページロードアニメーション、ホバー効果

- **d3-shape** (オプション): SVGパス生成
  - バージョン: ^3.2.0
  - 用途: 複雑な曲線の生成

### Development Tools

- **Vitest**: 単体テスト
- **Playwright**: E2Eテスト
- **jest-axe**: アクセシビリティテスト
- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマット

### Browser Support

- Chrome/Edge: 最新2バージョン
- Firefox: 最新2バージョン
- Safari: 最新2バージョン
- モバイルブラウザ: iOS Safari 14+, Chrome Android 90+


## File Structure

```
src/
├── app/
│   └── career/
│       └── page.tsx                    # 経歴ページ（更新）
│
├── components/
│   └── ui/
│       ├── GitBranchTimeline.tsx       # メインタイムラインコンポーネント（新規）
│       ├── BranchLine.tsx              # ブランチ線コンポーネント（新規）
│       ├── BranchNode.tsx              # ノードコンポーネント（新規）
│       ├── BranchLabel.tsx             # ラベルコンポーネント（新規）
│       ├── Timeline.tsx                # 既存タイムライン（維持）
│       └── __tests__/
│           ├── GitBranchTimeline.test.tsx
│           ├── BranchLine.test.tsx
│           ├── BranchNode.test.tsx
│           └── BranchLabel.test.tsx
│
├── lib/
│   └── career/
│       ├── branchTree.ts               # ブランチツリー構築ロジック（新規）
│       ├── colorAssignment.ts          # 色割り当てロジック（新規）
│       ├── layoutCalculation.ts        # レイアウト計算ロジック（新規）
│       └── validation.ts               # データ検証ロジック（新規）
│
├── types/
│   └── index.ts                        # 型定義（ExtendedCareerEntry追加）
│
├── data/
│   └── career.json                     # 経歴データ（parentId追加）
│
└── e2e/
    └── git-branch-timeline.spec.ts     # E2Eテスト（新規）
```

## Design Decisions and Rationale

### 1. SVG vs Canvas

**決定**: SVGを使用

**理由**:
- アクセシビリティ: SVG要素は個別にフォーカス可能
- スケーラビリティ: 解像度に依存しない
- DOM統合: Reactとの統合が容易
- デバッグ: 開発者ツールで要素を検査可能

### 2. Component Granularity

**決定**: 小さな再利用可能なコンポーネントに分割

**理由**:
- テスト容易性: 各コンポーネントを独立してテスト可能
- 保守性: 変更の影響範囲を限定
- 再利用性: 他の場所でも使用可能
- パフォーマンス: React.memoによる最適化が容易

### 3. Data Structure

**決定**: 既存のCareerEntry型を拡張

**理由**:
- 後方互換性: 既存データとの互換性を維持
- 段階的移行: 徐々に新機能を追加可能
- 最小限の変更: 既存コードへの影響を最小化

### 4. Animation Library

**決定**: Framer Motionを使用

**理由**:
- React統合: Reactコンポーネントとして使用可能
- 宣言的API: コードが読みやすく保守しやすい
- パフォーマンス: GPUアクセラレーションを自動的に使用
- アクセシビリティ: prefers-reduced-motionを自動サポート

