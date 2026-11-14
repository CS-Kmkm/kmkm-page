# AIエージェント向け配信と検証

対象: issues #140–#143。通常のHTML表示と既存データを保ちながら、公開情報を低ノイズで取得できるようにする。

## 配信仕様

`/ja`・`/en` と各言語の `/career`・`/publications`・`/dev-experience` は、`Accept: text/markdown` を明示したGET/HEADでMarkdownを返す。品質値 `q` を比較し、HTMLが優先される場合やワイルドカードだけの場合はHTMLを返す。同率はMarkdownを選ぶ。

明示URLは `/ja/.md`、`/en/.md`、`/ja/publications.md` など。HTMLレスポンスの `Link` ヘッダーから発見できる。両形式に `Vary: Accept` を付け、Markdownは `Cache-Control: private, no-store` として共有キャッシュへの保存を避ける。HTMLの既存RSC用Varyも維持する。RSC・prefetch通信はMarkdown交渉から除外する。

[stated] Next.js 16.4.4の `dist/{esm/,}build/templates/app-page-runtime.js` は既存VaryをRSC用の値で上書きする。[decision] 固定バージョンへのpnpmパッチで既存値をマージする。静的生成を無効化したりHTMLを再取得するプロキシを設けたりせず、キャッシュとRSCの区別を維持するため。Next更新時にはこのパッチの要否と `e2e/agent-ready.spec.ts` のVary検査を再確認する。

Privacy/TermsはHTMLのみ。旧URLの恒久リダイレクトは維持する。不明な日英の文書パスには、Markdown要求時に主要ページのリンクを含む同言語の404を返す。アセットの通常リクエストは対象外。

本文は `src/data/localized.ts` の取得処理から生成し、公開日、英語論文の表示対象、未翻訳抄録の除外を共有する。技術の `showOnWeb: false` は出力しない。独立したMarkdown原稿は管理しない。HTMLのSuspense読み込み表示には、JavaScript無効時用の本文とリンクを `noscript` で添える。通常のJavaScript有効時には表示されない。

## クロール用途別ポリシー

- [decision] 検索インデックス: 公開ページの取得を許可する。現行の全User-Agent向けルールを維持する。
- [decision] ユーザー指示に基づくエージェント閲覧: 公開ページの取得を許可する。
- [decision] モデル学習用クロール: 現行の取得許可を維持し、今回新たな学習拒否は追加しない。クロール許可は著作権上の利用許諾を追加するものではない。
- [decision] 全用途で `/api/` と `/_next/` の既存除外を維持する。robots.txtはアクセス認証の代替ではない。Previewや固有デプロイURLの認証は変更しない。

[stated] OpenAIは検索用OAI-SearchBot、学習用GPTBot、ユーザー操作用ChatGPT-Userを区別している（[公式仕様](https://developers.openai.com/api/docs/bots)）。今回は用途による取得許可の差がないため、個別User-Agentルールを追加しない。[decision] Content Signals、llms.txt、DNS-AID、MCPカードは追加しない。スキャナーの点数だけでは導入の根拠にしない。

## 本番アクセスの実測

[stated] 2026-11-14 16:15 JST頃、Cookie・認証ヘッダー・保護回避トークンなしでGETを実行。

| URL（`https://kmkm-page.vercel.app` 以下） | HTTP | Content-Type | 認証画面 |
| --- | --- | --- | --- |
| `/ja` | 200 | text/html; charset=utf-8 | なし |
| `/en` | 200 | text/html; charset=utf-8 | なし |
| `/ja/publications` | 200 | text/html; charset=utf-8 | なし |
| `/robots.txt` | 200 | text/plain; charset=utf-8 | なし |
| `/sitemap.xml` | 200 | application/xml | なし |

[stated] 公開エイリアスはリダイレクトなし。固有URL `https://kmkm-page-1n7emg920-kows-projects-f3108352.vercel.app/ja` は302で `https://vercel.com/sso-api?...` に遷移。プロジェクトのSSO設定は `all_except_custom_domains`、パスワード/IP制限は無効。アクセス制御変更は不要であり、実施していない。Preview設定も変更していない。任意の別Previewの実測は未実施。

[stated] 変更前のrobots実本文:

```text
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
```

[stated] 本番ではcanonicalとOG画像URLがなく、サイトマップは空のurlset、robotsにSitemap参照がない。Vercelの環境変数一覧は空だった。[derived] 本番 `NEXT_PUBLIC_SITE_URL=https://kmkm-page.vercel.app` の設定と再ビルドで既存のSEO生成処理を有効にする必要がある。これは本番反映承認後に行う。

## スキャナーの変更前結果

### Cloudflare: Is Your Site Agent-Ready?

[stated] 2026-11-14 16:26:39 JST、対象 `https://kmkm-page.vercel.app/ja`。Content Siteの7項目で **Level 1 / Basic Web Presence**。点数の100点換算は行わない。

| 項目 | 結果 |
| --- | --- |
| robots.txt | pass |
| sitemap | pass（XMLの構造判定。実際のurlsetは空） |
| Link headers | fail |
| DNS-AID | fail（今回対象外） |
| Markdown negotiation | fail |
| AI bot rules | pass（個別ルールなし、全クローラー共通ルールが適用） |
| Content Signals | fail（今回対象外） |

元レスポンス: `.ai/test-results/cloudflare-baseline.json`（ローカル検証ログ、Git管理対象外）。再現はPowerShellで次を実行する。

```powershell
$body = @{ url='https://kmkm-page.vercel.app/ja'; enabledChecks=@('robotsTxt','sitemap','linkHeaders','dnsAid','markdownNegotiation','robotsTxtAiRules','contentSignals') } | ConvertTo-Json
Invoke-RestMethod https://isitagentready.com/api/scan -Method Post -ContentType application/json -Body $body
```

### Vercel: Is Agentic

[stated] 2026-11-14 16:33:13 JST、対象 `https://kmkm-page.vercel.app`、**66/100**。[レポート](https://is-agentic.com/scan/kmkm-page.vercel.app)。元レスポンス: `.ai/test-results/is-agentic-cli.log`。

| 指摘ID | 結果 | 要点 |
| --- | --- | --- |
| agent-friendly-404 | partial | 404は正しいがMarkdownなし |
| content-no-js | partial | トップの本文比率1.9%、内側ページは未検証 |
| markdown-negotiation-vary | failed | HTMLが返り、VaryにAcceptなし |
| brand-search-accuracy | failed | 指定された検索語の上位10件に不在 |
| agent-instruction | failed | エージェント向け利用説明ファイルなし（対象外） |
| sitemap | failed | サイトマップ検出なし（空urlsetとの実測差を区別） |
| metadata-completeness | partial | canonical / og:imageなし |
| org-schema-completeness | partial | OrganizationのcontactPoint / addressなし（個人サイトに新設しない） |
| trust-anchors | partial | Privacyのみ、About / Contactなし（今回対象外） |
| json-ld | partial | Personのurlなし |

```powershell
corepack pnpm --config.minimumReleaseAge=10080 dlx is-agentic kmkm-page.vercel.app --json
```

[stated] CLI実行直前の公開APIは `report_not_found`（404）だった。CLIでスキャンを開始し、完了結果を取得した。ブラウザー接続ホストはこのセッションでは利用不可で、UIのRescan操作は未実施。API/CLIは直近スナップショットを再利用するため、反映後の比較では必ず `scanned_at` が新しいことを確認する。[公式仕様](https://is-agentic.com/docs)

## 検証と反映後の計測

```powershell
$env:NEXT_PUBLIC_SITE_URL='http://localhost:3000'
corepack pnpm build
corepack pnpm exec playwright test e2e/agent-ready.spec.ts e2e/document-head.spec.ts e2e/localized-routes.spec.ts --project=chromium --workers=2
```

本番反映後は同じURL・同じチェック構成で両スキャナーを再計測し、ここに新しい日時と結果を追記する。現時点では本番反映前であり、改善後の点数を主張しない。HTML/Markdownの交互GETでContent-Type、Vary、Link、canonical、JSON-LD、sitemapと保護URLを再確認する。#141–#143の本番受け入れ確認はこの計測完了まで未完了。

[stated] ローカルの最終ビルドで、ユニットテスト201件、Chromiumの回帰テスト33件が成功（安全ヘッダーの開発専用テスト1件はスキップ）。E2Eでは `Accept-Encoding` と `Accept` を区別してVaryを検査し、HEADの空本文、HTML/RSC、Markdownの交互取得、日英404、JS無効時の本文・主要リンク、既存メタデータを確認した。検証ログは `.ai/test-results/unit-final.log` と `.ai/test-results/e2e-final.log`。

[stated] 1440×1000のスクリーンショットで、本番とローカルの日英8ページを比較し、通常表示の差分は確認されなかった。比較画像は `.ai/test-results/visual-comparison.png`。[stated] ユーザーの明示指示でOpusの独立監査は停止し、監査結果は利用していない。
