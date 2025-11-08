# Design Document

## Overview

コンテンツ公開日スケジューリング機能は、既存のポートフォリオサイトに公開日ベースのコンテンツフィルタリング機能を追加します。この機能により、将来のイベントや成果を事前に登録し、指定した日付に自動的に公開することができます。

設計の核心は、既存のデータ構造に`displayDate`フィールドを追加し、データ取得関数レベルでフィルタリングを実装することで、アプリケーション全体で一貫した動作を保証することです。

## Architecture

### Data Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  JSON Data Files (with displayDate)                        │
│  ├── career.json                                           │
│  ├── publications.json                                     │
│  └── tech-experience.json                                  │
├─────────────────────────────────────────────────────────────┤
│  Data Access Functions (with date filtering)               │
│  ├── getCareerEntries()                                    │
│  ├── getPublications()                                     │
│  ├── getProjectDetails()                                   │
│  ├── getEvents()                                           │
│  ├── getUpdates()                                          │
│  └── getTimelineEvents()                                   │
├─────────────────────────────────────────────────────────────┤
│  Utility Functions                                         │
│  ├── filterByDisplayDate()                                │
│  ├── getCurrentDate()                                      │
│  └── isDisplayable()                                       │
└─────────────────────────────────────────────────────────────┘
```

### Component Layer Integration

既存のコンポーネントは変更不要で、データ取得関数レベルでフィルタリングが適用されるため、自動的に表示日フィルタリングが反映されます。

## Components and Interfaces

### 1. Data Structure Extensions

#### CareerEntry Interface Extension
```typescript
interface CareerEntry {
  id: string;
  year: string;
  organization: string;
  role: string;
  description?: string;
  startDate: string;
  endDate?: string;
  displayDate: string; // 新規追加: YYYY-MM-DD形式
}
```

#### PublicationEntry Interface Extension
```typescript
interface PublicationEntry {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  date?: string;
  displayDate: string; // 新規追加: YYYY-MM-DD形式
  // ... 他の既存フィールド
}
```

#### ProjectDetail Interface Extension
```typescript
interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  duration: string;
  role: string;
  displayDate: string; // 新規追加: YYYY-MM-DD形式
  // ... 他の既存フィールド
}
```

#### EventEntry Interface Extension
```typescript
interface EventEntry {
  id: string;
  title: string;
  description: string;
  date: string;              // YYYY-MM-DD format
  year: number;              // Extracted from date
  category: EventCategory;
  displayDate: string;       // 新規追加: YYYY-MM-DD形式
  // ... 他の既存フィールド
}
```

### 2. Utility Functions

#### Date Filtering Utility
```typescript
interface DateFilterOptions {
  referenceDate?: string; // デフォルトは現在日
  includeToday?: boolean; // 当日を含むかどうか
}

function filterByDisplayDate<T extends { displayDate: string }>(
  items: T[],
  options: DateFilterOptions = {}
): T[]

function isDisplayable(displayDate: string, referenceDate?: string): boolean

function getCurrentDate(): string // YYYY-MM-DD形式
```

### 3. Enhanced Data Access Functions

既存の関数を拡張して、公開日フィルタリングを組み込みます：

```typescript
// 内部実装で表示日フィルタリングを適用
export const getCareerEntries = (): CareerEntry[] => {
  const data = loadCareerData();
  const entries = data?.entries || [];
  return filterByDisplayDate(entries);
};

export const getPublications = (): PublicationEntry[] => {
  const data = loadPublicationsData();
  const publications = data?.publications || [];
  return filterByDisplayDate(publications);
};

export const getProjectDetails = (): ProjectDetail[] => {
  const data = loadTechExperienceData();
  const projects = data?.projects || [];
  const filteredProjects = filterByDisplayDate(projects);
  // 既存のソート処理を維持
  return filteredProjects.sort(/* 既存のソート処理 */);
};

export const getEvents = (): EventEntry[] => {
  // 既存のイベント生成処理
  const events = generateEventsFromData();
  return filterByDisplayDate(events);
};
```

## Data Models

### 1. Migration Strategy for Existing Data

既存データの`displayDate`設定ルール：

#### Career Entries
- `displayDate = startDate`
- `startDate`が存在しない場合: `"2021-04-01"`（デフォルト日付）

#### Publications
- `displayDate = date`（既存のdateフィールド）
- `date`が存在しない場合: `"2021-04-01"`

#### Projects
- プロジェクト期間から開始日を抽出
- 抽出できない場合: `"2021-04-01"`

#### Events
- `displayDate = date`（既存のdateフィールド）
- イベントは動的生成されるため、生成時に適切な`displayDate`を設定

### 2. Date Format Standardization

すべての日付は`YYYY-MM-DD`形式（ISO 8601）で統一：
- 例: `"2025-03-15"`
- 時刻情報は含まない（日付のみ）
- タイムゾーンは考慮しない（ローカル日付で比較）

### 3. Data Validation Rules

```typescript
interface ValidationRule {
  field: 'displayDate';
  required: true;
  format: 'YYYY-MM-DD';
  constraints: {
    minDate: '2000-01-01';
    maxDate: '2099-12-31';
  };
}
```

## Error Handling

### 1. Data Loading Errors

```typescript
// 既存のsafeLoadData関数を拡張
function safeLoadDataWithDateValidation<T>(
  loader: () => T,
  fallback: T,
  validator: (data: T) => ValidationResult
): T {
  try {
    const data = loader();
    const validation = validator(data);
    
    if (!validation.isValid) {
      console.warn('Data validation warnings:', validation.warnings);
      // 警告があっても処理を続行（フィルタリングで対応）
    }
    
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    return fallback;
  }
}
```

### 2. Date Parsing Errors

```typescript
function parseDisplayDate(dateStr: string): Date | null {
  try {
    const date = new Date(dateStr + 'T00:00:00'); // ローカルタイムゾーンで解釈
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

function isDisplayable(displayDate: string, referenceDate?: string): boolean {
  const dispDate = parseDisplayDate(displayDate);
  const refDate = parseDisplayDate(referenceDate || getCurrentDate());
  
  // パースエラーの場合は表示可能として扱う（安全側に倒す）
  if (!dispDate || !refDate) {
    console.warn(`Date parsing error: displayDate=${displayDate}, referenceDate=${referenceDate}`);
    return true;
  }
  
  return dispDate <= refDate;
}
```

### 3. Graceful Degradation

- `displayDate`フィールドが存在しない場合: 表示可能として扱う
- 無効な日付形式の場合: 表示可能として扱う
- データ読み込みエラーの場合: 空の配列を返す

## Testing Strategy

### 1. Unit Tests

#### Date Filtering Logic
```typescript
describe('filterByDisplayDate', () => {
  test('filters out future dates', () => {
    const items = [
      { id: '1', displayDate: '2024-01-01' },
      { id: '2', displayDate: '2026-01-01' }
    ];
    const result = filterByDisplayDate(items, { referenceDate: '2025-01-01' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  test('includes current date when includeToday is true', () => {
    const items = [{ id: '1', displayDate: '2025-01-01' }];
    const result = filterByDisplayDate(items, { 
      referenceDate: '2025-01-01',
      includeToday: true 
    });
    expect(result).toHaveLength(1);
  });

  test('handles invalid dates gracefully', () => {
    const items = [
      { id: '1', displayDate: 'invalid-date' },
      { id: '2', displayDate: '2024-01-01' }
    ];
    const result = filterByDisplayDate(items, { referenceDate: '2025-01-01' });
    expect(result).toHaveLength(2); // 無効な日付は表示可能として扱う
  });
});
```

#### Data Access Functions
```typescript
describe('getCareerEntries', () => {
  test('returns only displayable career entries', () => {
    // モックデータでテスト
  });
});

describe('getPublications', () => {
  test('returns only displayable publications', () => {
    // モックデータでテスト
  });
});

describe('getEvents', () => {
  test('returns only displayable events', () => {
    // モックデータでテスト
  });
});
```

### 2. Integration Tests

#### Page Rendering Tests
```typescript
describe('Career Page', () => {
  test('displays only displayable career entries', () => {
    // 将来の日付のエントリが表示されないことを確認
  });
});

describe('Publications Page', () => {
  test('displays only displayable publications', () => {
    // 将来の日付の論文が表示されないことを確認
  });
});

describe('Events Page', () => {
  test('displays only displayable events', () => {
    // 将来の日付のイベントが表示されないことを確認
  });
});

describe('Home Page', () => {
  test('displays only displayable updates and events', () => {
    // 将来の日付のアップデートやイベントが表示されないことを確認
  });
});
```

### 3. Data Migration Tests

```typescript
describe('Data Migration', () => {
  test('sets correct displayDate for career entries', () => {
    // startDateがdisplayDateに正しく設定されることを確認
  });

  test('sets correct displayDate for publications', () => {
    // dateフィールドがdisplayDateに正しく設定されることを確認
  });

  test('sets correct displayDate for projects', () => {
    // プロジェクト期間からdisplayDateが正しく設定されることを確認
  });

  test('handles missing date fields', () => {
    // デフォルト日付が正しく設定されることを確認
  });
});
```

### 4. End-to-End Tests

```typescript
describe('Display Date Feature E2E', () => {
  test('future content is not visible to users', () => {
    // 将来の日付のコンテンツがページに表示されないことを確認
  });

  test('content becomes visible on display date', () => {
    // 表示日になったコンテンツが表示されることを確認（日付を変更してテスト）
  });

  test('all page types respect display date filtering', () => {
    // トップページ、経歴ページ、イベントページ、出版物ページすべてで表示日フィルタリングが動作することを確認
  });
});
```

## Implementation Phases

### Phase 1: Data Structure Update
1. 既存JSONファイルに`displayDate`フィールドを追加
2. 型定義の更新
3. データ検証の実装

### Phase 2: Filtering Logic Implementation
1. ユーティリティ関数の実装
2. データアクセス関数の更新
3. エラーハンドリングの実装

### Phase 3: Testing and Validation
1. ユニットテストの実装
2. インテグレーションテストの実装
3. データマイグレーションの検証

### Phase 4: Deployment and Monitoring
1. 本番環境でのテスト
2. パフォーマンス監視
3. エラーログの監視

## Performance Considerations

### 1. Filtering Performance
- データ量が少ないため、クライアントサイドフィルタリングで十分
- 将来的にデータ量が増加した場合は、サーバーサイドフィルタリングを検討

### 2. Caching Strategy
- 既存のデータローディング戦略を維持
- 日付フィルタリングはメモリ内で実行

### 3. Bundle Size Impact
- 新規追加コードは最小限
- 既存のバンドルサイズへの影響は無視できるレベル

## Security Considerations

### 1. Data Exposure
- 将来の日付のデータがクライアントサイドに送信されるが、表示されない
- 機密性の高いデータの場合は、サーバーサイドフィルタリングを検討

### 2. Date Manipulation
- クライアントサイドの日付操作による回避は可能だが、静的サイトのため影響は限定的
- 重要な機密情報は含まれていないため、現在の実装で十分

## Monitoring and Maintenance

### 1. Error Monitoring
- 日付パースエラーのログ監視
- データ検証エラーの監視

### 2. Performance Monitoring
- ページロード時間への影響監視
- フィルタリング処理時間の監視

### 3. Data Quality Monitoring
- 無効な日付形式の検出
- 表示日設定の妥当性チェック