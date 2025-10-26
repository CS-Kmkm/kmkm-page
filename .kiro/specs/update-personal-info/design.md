# 設計書

## 概要

本設計書は、個人ポートフォリオサイトのダミーデータを実際のユーザー情報に更新するプロセスの詳細な設計を定義します。更新は5つのJSONファイル（profile.json、career.json、publications.json、tech-experience.json、updates.json）に対して段階的に行われます。

## アーキテクチャ

### システム構成

```
src/data/
├── profile.json          # プロフィール情報
├── career.json           # 経歴情報
├── publications.json     # 論文・研究業績
├── tech-experience.json  # 技術スキルとプロジェクト
└── updates.json          # 最新情報
```

### データフロー

1. ユーザーが実際の情報を提供
2. システムが情報を検証
3. 対応するJSONファイルを更新
4. ユーザーが変更を確認
5. 次のファイルへ進む

### 更新順序

ページの表示順序に従って、以下の順番で更新を行います：

1. **profile.json** - トップページに表示される基本情報
2. **career.json** - 経歴ページの内容
3. **publications.json** - 研究業績ページの内容
4. **tech-experience.json** - 技術・プロジェクトページの内容
5. **updates.json** - 最新情報セクションの内容

## コンポーネントとインターフェース

### 1. profile.json の構造

```typescript
interface ProfileInfo {
  name: string;                    // フルネーム
  nameJa: string;                  // 読み仮名
  currentAffiliation: string;      // 現在の所属
  currentPosition: string;         // 現在の役職
  bio: string;                     // 自己紹介文
  location: string;                // 所在地
  avatarUrl: string | null;        // プロフィール画像URL
  socialLinks: SocialLink[];       // SNSリンク
}

interface SocialLink {
  id: string;                      // 一意のID（例: "social-001"）
  platform: string;                // プラットフォーム名
  url: string;                     // URL
  username: string;                // ユーザー名または表示名
}
```

**更新項目：**
- 名前と読み仮名
- 所属組織と役職
- 自己紹介文（研究分野、興味など）
- 所在地
- SNSリンク（Twitter、GitHub、LinkedIn、ORCID、メール、Webサイト）

### 2. career.json の構造

```typescript
interface CareerData {
  entries: CareerEntry[];
}

interface CareerEntry {
  id: string;                      // 一意のID（例: "career-001"）
  year: string;                    // 表示用の年度（例: "2024" or "2021-2024"）
  organization: string;            // 組織名
  role: string;                    // 役職・役割
  description: string;             // 詳細説明
  startDate: string;               // 開始日（YYYY-MM-DD形式）
  endDate: string | null;          // 終了日（現在進行中の場合はnull）
}
```

**更新項目：**
- 各経歴エントリー（最新から古い順）
- 組織名、役職、期間、説明
- 現在の役職は endDate を null に設定

### 3. publications.json の構造

```typescript
interface PublicationsData {
  publications: PublicationEntry[];
}

interface PublicationEntry {
  id: string;                      // 一意のID（例: "pub-001"）
  title: string;                   // 論文タイトル
  authors: string[];               // 著者リスト
  venue: string;                   // 発表先（学会名、ジャーナル名など）
  year: number;                    // 発表年
  doi?: string;                    // DOI（オプション）
  isFirstAuthor: boolean;          // 第一著者かどうか
  isPeerReviewed: boolean;         // 査読付きかどうか
  publicationType: string;         // 論文種別
}
```

**論文種別（publicationType）：**
- `"conference"` - 学会発表
- `"journal"` - ジャーナル論文
- `"workshop"` - ワークショップ
- `"preprint"` - プレプリント

**更新項目：**
- 各論文の情報
- 著者リスト（自分の名前を含む）
- 発表先と年度
- 第一著者フラグと査読フラグ

### 4. tech-experience.json の構造

```typescript
interface TechExperienceData {
  technologies: TechItem[];
  projects: ProjectDetail[];
}

interface TechItem {
  id: string;                      // 一意のID（例: "tech-001"）
  name: string;                    // 技術名
  category: string;                // カテゴリ
  proficiency: string;             // 習熟度
  experienceYears: number;         // 経験年数
  projects: string[];              // 関連プロジェクトIDのリスト
  description: string;             // 説明
  logoUrl: string;                 // ロゴ画像URL
  logoAlt: string;                 // ロゴの代替テキスト
}

interface ProjectDetail {
  id: string;                      // 一意のID（例: "proj-001"）
  name: string;                    // プロジェクト名
  description: string;             // 説明
  technologies: string[];          // 使用技術のリスト
  duration: string;                // 期間（例: "2024年1月 - 2024年3月"）
  role: string;                    // 役割
  url?: string;                    // プロジェクトURL（オプション）
  githubUrl?: string;              // GitHubリポジトリURL（オプション）
  imageUrl: string | null;         // プロジェクト画像URL
}
```

**技術カテゴリ（category）：**
- `"language"` - プログラミング言語
- `"framework"` - フレームワーク
- `"database"` - データベース
- `"tool"` - ツール

**習熟度（proficiency）：**
- `"expert"` - エキスパート
- `"advanced"` - 上級
- `"intermediate"` - 中級
- `"beginner"` - 初級

**更新項目：**
- 技術スキルのリスト
- 各技術の習熟度と経験年数
- プロジェクトのリスト
- 技術とプロジェクトの関連付け

### 5. updates.json の構造

```typescript
interface UpdatesData {
  updates: UpdateItem[];
}

interface UpdateItem {
  id: string;                      // 一意のID（例: "update-001"）
  date: string;                    // 日付（YYYY-MM-DD形式）
  title: string;                   // タイトル
  description: string;             // 説明
  category: string;                // カテゴリ
}
```

**カテゴリ（category）：**
- `"development"` - 開発関連
- `"publication"` - 論文・発表
- `"career"` - 経歴・キャリア
- `"other"` - その他

**更新項目：**
- 最近の活動や成果
- 日付、タイトル、説明
- 適切なカテゴリの設定

## データモデル

### ID命名規則

各エントリーには一意のIDを割り当てます：

- プロフィールのSNSリンク: `social-001`, `social-002`, ...
- 経歴: `career-001`, `career-002`, ...
- 論文: `pub-001`, `pub-002`, ...
- 技術: `tech-001`, `tech-002`, ...
- プロジェクト: `proj-001`, `proj-002`, ...
- 最新情報: `update-001`, `update-002`, ...

### 日付形式

すべての日付は ISO 8601 形式（YYYY-MM-DD）を使用します：
- 例: `"2024-03-15"`

### URL形式

URLは完全な形式で記録します：
- 例: `"https://github.com/username"`
- 例: `"mailto:email@example.com"`

## エラーハンドリング

### データ検証

各JSONファイルの更新時に以下を検証します：

1. **JSON形式の妥当性**
   - 有効なJSON構文であること
   - 必須フィールドが存在すること

2. **データ型の検証**
   - 文字列、数値、配列などの型が正しいこと
   - 日付が YYYY-MM-DD 形式であること
   - URLが有効な形式であること

3. **参照整合性**
   - tech-experience.json において、技術が参照するプロジェクトIDが存在すること
   - プロジェクトが参照する技術名が technologies リストに存在すること

4. **論理的整合性**
   - 経歴の開始日が終了日より前であること
   - 年度の範囲が妥当であること

### エラー処理

- 検証エラーが発生した場合、具体的なエラーメッセージを表示
- ユーザーに修正を促す
- 元のデータを保持し、ロールバック可能にする

## テスト戦略

### 手動テスト

各ファイル更新後に以下を確認：

1. **JSONファイルの妥当性**
   - ファイルが有効なJSON形式であること
   - 必須フィールドがすべて存在すること

2. **データの正確性**
   - 入力した情報が正しく反映されていること
   - 日付、URL、IDなどの形式が正しいこと

3. **アプリケーションの動作**
   - 開発サーバーが正常に起動すること
   - 各ページが正しく表示されること
   - データが適切にレンダリングされること

### 検証手順

1. 各JSONファイルを更新
2. `npm run dev` で開発サーバーを起動
3. ブラウザで各ページを確認：
   - トップページ（プロフィール）
   - 経歴ページ
   - 研究業績ページ
   - 技術・プロジェクトページ
4. コンソールエラーがないことを確認
5. データが正しく表示されることを確認

### データ整合性チェック

既存の `validateDataIntegrity()` 関数を使用して、データの整合性を検証：

```typescript
import { validateDataIntegrity } from '@/data';

const result = validateDataIntegrity();
if (!result.isValid) {
  console.error('Data integrity errors:', result.errors);
}
```

## 実装の考慮事項

### バックアップ

更新前に既存のJSONファイルをバックアップすることを推奨：
- 手動でファイルをコピー、または
- Gitのコミット履歴を利用

### 段階的な更新

一度にすべてのファイルを更新するのではなく、1ファイルずつ更新して確認：
1. profile.json を更新 → 確認
2. career.json を更新 → 確認
3. publications.json を更新 → 確認
4. tech-experience.json を更新 → 確認
5. updates.json を更新 → 確認

### 画像とロゴ

- プロフィール画像やプロジェクト画像が必要な場合は、`public/images/` ディレクトリに配置
- 技術ロゴは `/images/tech-logos/` パスを使用
- 画像がない場合は `null` を設定

### 日本語と英語

- 現在のデータは主に日本語
- 必要に応じて英語版のデータも追加可能
- 名前は日本語表記と読み仮名の両方を記録

## セキュリティとプライバシー

### 個人情報の取り扱い

- 公開したくない情報は含めない
- メールアドレスは `mailto:` 形式で記録
- SNSリンクは公開プロフィールのみ

### 機密情報

- パスワードや認証情報は含めない
- 内部プロジェクトの詳細は公開しない
- 必要に応じて情報を一般化する
