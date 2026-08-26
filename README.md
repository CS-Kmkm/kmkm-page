# kmkm-page

研究活動、経歴、開発経験、論文の投稿経験を掲載する個人ポートフォリオです。日本語と英語の表示、ライト／ダークテーマ、レスポンシブ表示に対応しています。

## 主な機能

- 経歴のタイムライン／リスト表示とカテゴリーフィルター
- 論文一覧の著者区分・査読有無・発表種別フィルター
- 技術スタックと関連プロジェクトの閲覧
- 日本語ページ（`/ja` 以下）と英語ページ（`/en` 以下）の切り替え
- canonical URL、言語別 URL、サイトマップ、robots.txt の生成
- Google Analytics 4 やカスタムエンドポイントへの Web Vitals 送信（任意）

## 技術構成

- Next.js 16（App Router）
- React 19 / TypeScript 5
- Tailwind CSS 4 / Framer Motion
- Vitest / Testing Library
- Playwright
- Vercel

## セットアップ

### 必要な環境

- Node.js 22.x
- Corepack

pnpm のバージョンは `package.json` で固定されています。依存関係の操作には `corepack pnpm` を使用してください。

### 依存関係のインストール

```powershell
corepack enable
corepack pnpm install
```

### 環境変数

`.env.example` を `.env.local` にコピーし、必要な値を設定します。

```powershell
Copy-Item .env.example .env.local
```

macOS または Linux では `cp .env.example .env.local` を使用します。

| 変数 | 必須 | 用途 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 本番環境では必須 | 公開 URL。canonical URL、言語別 URL、サイトマップ、robots.txt に使用します。末尾の `/` は付けません。 |
| `NEXT_PUBLIC_GA_ID` | 任意 | Google Analytics 4 の測定 ID。設定すると本番環境で計測スクリプトと Web Vitals 送信を有効にします。 |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | 任意 | 本番環境で Web Vitals を JSON の `POST` リクエストにより送信するエンドポイントです。 |

ローカル開発では `.env.example` の値をそのまま利用できます。本番環境で `NEXT_PUBLIC_SITE_URL` を設定しない場合、canonical URL は出力されません。サイトマップ項目と robots.txt のサイトマップ参照も省略されます。

### ローカル起動

```powershell
corepack pnpm dev
```

起動後、[http://localhost:3000](http://localhost:3000) を開いてください。

## ページ構成

| パス | 内容 |
| --- | --- |
| `/ja` | 日本語のプロフィールと更新履歴 |
| `/ja/career` | 日本語の経歴 |
| `/ja/publications` | 日本語の論文 |
| `/ja/dev-experience` | 日本語の開発経験 |
| `/ja/privacy` | プライバシーポリシー |
| `/ja/terms` | 利用条件 |
| `/en` | 英語のプロフィールと更新履歴 |
| `/en/...` | 各主要ページの英語版 |

`/` と従来の日本語ページ URL は、対応する `/ja/...` へ恒久的にリダイレクトされます。

## コンテンツの更新

表示内容は `src/data` 以下の JSON で管理しています。

```text
src/data/
├── profile.json          # プロフィール
├── career.json           # 経歴
├── publications.json     # 論文
├── tech-experience.json  # 技術スタックとプロジェクト
└── en/                   # 英語表示用の差分データ
```

日本語 JSON が基準データで、`src/data/en` の JSON は同じ `id` を持つ項目へ英語表記を重ねるための差分です。日本語の基準データを変更したら、参照関係や日付・URL の形式を検証してください。

```powershell
corepack pnpm validate-data
```

`validate-data` の対象は日本語の基準データ 4 ファイルです。英語の差分データを変更した場合は、ID の対応関係と表示文字列をユニットテストで確認します。

```powershell
corepack pnpm test src/data/__tests__/localized.test.ts
```

技術ロゴの追加方法は [`public/images/tech-logos/README.md`](public/images/tech-logos/README.md) を参照してください。

## 開発コマンド

| コマンド | 内容 |
| --- | --- |
| `corepack pnpm dev` | 開発サーバーを起動 |
| `corepack pnpm build` | 本番ビルドを作成 |
| `corepack pnpm start` | ビルド済みアプリを起動 |
| `corepack pnpm lint` | ESLint を実行 |
| `corepack pnpm type-check` | TypeScript の型検査を実行 |
| `corepack pnpm test` | Vitest のユニット／コンポーネントテストを実行 |
| `corepack pnpm test:watch` | Vitest を監視モードで実行 |
| `corepack pnpm test:e2e` | Chromium で Playwright の E2E テストを実行 |
| `corepack pnpm test:e2e:all` | 設定済みの全 Playwright プロジェクトでテストを実行 |
| `corepack pnpm validate-data` | 日本語の基準 JSON 4 ファイルの整合性を検証 |
| `corepack pnpm analyze` | バンドル解析付きで本番ビルドを作成 |
| `corepack pnpm measure:client` | 本番ビルド済みのクライアントバンドルサイズを計測 |

E2E テストは既存サーバーを再利用します。サーバーが起動していない場合は、本番ビルド後に `http://localhost:3000` で自動起動します。別のサーバーを対象にする場合は `PLAYWRIGHT_TEST_BASE_URL` を設定してください。

初めて E2E テストを実行する前に、Chromium をインストールしてください。

```powershell
corepack pnpm exec playwright install chromium
```

クライアントバンドルを計測する場合は、先に本番ビルドを作成します。

```powershell
corepack pnpm build
corepack pnpm measure:client
```

## デプロイ

Vercel 用のビルド設定は `vercel.json` に定義されています。デプロイ先で `NEXT_PUBLIC_SITE_URL` を公開 URL に設定し、`corepack pnpm build` が成功することを確認してください。
