# AIエージェント向け配信と検証

対象: issues #140–#143。通常のHTML表示と既存データを保ちながら、公開情報を低ノイズで取得できるようにする。

## 配信仕様

`/ja`・`/en` と各言語の `/career`・`/publications`・`/dev-experience` は、`Accept: text/markdown` を明示したGET/HEADでMarkdownを返す。品質値 `q` を比較し、HTMLが優先される場合やワイルドカードだけの場合はHTMLを返す。同率はMarkdownを選ぶ。

明示URLは `/ja/.md`、`/en/.md`、`/ja/publications.md` など。HTMLレスポンスの `Link` ヘッダーから発見できる。両形式に `Vary: Accept` を付け、Markdownは `Cache-Control: private, no-store` として共有キャッシュへの保存を避ける。HTMLの既存RSC用Varyも維持する。RSC・prefetch通信はMarkdown交渉から除外する。

[stated] Next.js 16.4.4の `dist/{esm/,}build/templates/app-page-runtime.js` は既存VaryをRSC用の値で上書きする。またVercelの静的配信は `generate-routes-manifest.js` が生成する `rsc.varyHeader` を使用する。ISR再生成ではProxyの応答ヘッダーを引き継がない経路も確認された。[decision] 固定バージョンへのpnpmパッチで、フレームワーク自身の実行時VaryにAcceptを追加して既存値とマージし、静的ルートマニフェストにもAcceptを追加する。静的生成を無効化したりHTMLを再取得するプロキシを設けたりせず、キャッシュとRSCの区別を維持するため。Next更新時にはこのパッチの要否と `e2e/agent-ready.spec.ts` のVary検査を再確認する。

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

[stated] 変更前の本番ではcanonicalとOG画像URLがなく、サイトマップは空のurlset、robotsにSitemap参照がなかった。Vercelの環境変数一覧は空だった。[stated] オーナー承認後、Productionのみ `NEXT_PUBLIC_SITE_URL=https://kmkm-page.vercel.app` を設定した。mainの復元後の本番でも正しい公開URLのcanonicalを確認した。アクセス制御は変更していない。

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
corepack pnpm exec playwright test e2e/agent-ready.spec.ts e2e/document-head.spec.ts e2e/localized-routes.spec.ts e2e/security.spec.ts --project=chromium --workers=2
```

[stated] PR #151とISR補修のPR #153を、各CI成功後にマージした。最終実装のProductionデプロイは `dpl_DLZKwNK5AkNaQiA2vbZRQxr58NQq`、コミット `49f1f8c5797cdb22da5682a7a9f927e84e696e84`、READY。2026-11-15 21:20–21:22 JSTに以下を本番で確認した。Productionの公開URL環境変数は設定済み、Previewの認証設定は維持している。

- [stated] 日英8ページでHTML/Markdownを交互にGETし、32リクエストすべてでHTTP 200・適切なContent-Type・Vary・Link・canonicalを確認した。日英Markdown 404、robotsのSitemap参照、サイトマップの12 URLも確認した。ログ: `.ai/test-results/production-http.json`、`.ai/test-results/production-verify-final.log`。
- [stated] 60秒の再生成期間を越えた日英の経歴・開発経験4ページでも、追加12リクエストが成功した。HTMLのキャッシュが `STALE` から `HIT`・Age 0に変化した後も `Accept, rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch` を保持した。ログ: `.ai/test-results/production-isr-final.json`。
- [stated] 本番URLを対象にChromium E2E 33件成功、開発専用1件スキップ。JS無効時の主要本文・主要リンク、HEADの空本文、RSCの形式、日英HTML/Markdown 404、旧URLリダイレクト、SEOと安全ヘッダーを確認した。ログ: `.ai/test-results/e2e-production-final.log`。
- [stated] 日英8ページで相互hreflang、OGP/Twitter画像、Person JSON-LDを確認し、日英の論文ページでScholarlyArticleも確認した。保護されたPreviewの匿名GETは引き続き302でVercel SSOに遷移した。ログ: `.ai/test-results/production-seo-final.json`。

本番E2Eの再現コマンド:

```powershell
$env:CI='1'
$env:PLAYWRIGHT_TEST_BASE_URL='https://kmkm-page.vercel.app'
corepack pnpm exec playwright test e2e/agent-ready.spec.ts e2e/document-head.spec.ts e2e/localized-routes.spec.ts e2e/security.spec.ts --project=chromium --workers=2 --retries=0 --timeout=60000
```

ISRの手動再確認は、`/ja/career`・`/en/career`・`/ja/dev-experience`・`/en/dev-experience` を一度取得してから60秒以上経過後に、次の取得を繰り返す。`Age`・`X-Vercel-Cache` とVaryを併せて確認する。

```powershell
curl.exe -sS -D - -H 'Accept: text/html' https://kmkm-page.vercel.app/ja/career -o NUL
curl.exe -sS -D - -H 'Accept: text/markdown' https://kmkm-page.vercel.app/ja/career -o NUL
```

[stated] ローカルの最終ビルドで、ユニットテスト201件、Chromiumの回帰テスト33件が成功（安全ヘッダーの開発専用テスト1件はスキップ）。E2Eでは `Accept-Encoding` と `Accept` を区別してVaryを検査し、HEADの空本文、HTML/RSC、Markdownの交互取得、日英404、JS無効時の本文・主要リンク、既存メタデータを確認した。検証ログは `.ai/test-results/unit-final.log` と `.ai/test-results/e2e-final.log`。

[stated] 1440×1000のスクリーンショットで、本番とローカルの日英8ページを比較し、通常表示の差分は確認されなかった。比較画像は `.ai/test-results/visual-comparison.png`。[stated] ユーザーの明示指示でOpusの独立監査は停止し、監査結果は利用していない。

### Preview検証の環境制約

- [stated] 2026-11-14、保護されたPreviewを取得するコネクターは、一時共有リンクを作成・再利用する可能性を理由に自動承認審査が拒否した。共有リンクは作成していない。
- [stated] `vercel --version` は通常実行・権限付き再試行の両方でコマンド未認識だった。既存の認証CLIを用いた取得はできていない。
- [stated] 匿名の既存Previewは302でVercel SSOへ遷移し、保護を維持している。ローカル検証とCI/Previewビルド成功を、認証付きPreviewの実HTTP検証と同一視しない。
- [stated] 最終パッチの実配信でのVaryは、上記Productionの初期配信・ISR再生成後の両方で確認できた。Previewの保護解除や新規共有リンク作成は行っていない。

## スキャナーの最終比較

日時・対象URL・指摘一覧の保存先は [agent-ready-results.json](agent-ready-results.json)。スキャナーの生ログは `.ai/test-results/` に保存し、JSONには比較に必要な項目を抜き出した。

| スキャナー | 変更前（JST） | 変更後（JST） | 結果 |
| --- | --- | --- | --- |
| Cloudflare Content Site | 2026-11-14 16:26:39 | 2026-11-15 21:20:48 | Level 1 → Level 1。MarkdownとLinkがfail → pass |
| Is Agentic公開API | 2026-11-14 16:33:13 | 2026-11-15 21:20:58 | 66/100 → 80/100 |

[stated] Cloudflareは両回とも `https://kmkm-page.vercel.app/ja`、同じ7チェック。最終結果はrobots・sitemap・Link・Markdown・AI bot rulesがpass、DNS-AIDとContent Signalsがfail。Level 2の前提となるContent Signalsは今回の対象外のため追加していない。

[stated] Is Agenticは両回とも `https://kmkm-page.vercel.app`。Markdown/Vary、sitemap、canonical/OGP、Personのurlに関する従来の指摘は解消した。残存する6指摘はJSONの `is_agentic.post.issues` に原文で保存した。

- `content-no-js`: 本文比率1.9%と経歴ページの抽出テキスト不足を指摘。実際のJS無効ブラウザーで日英8ページの主要本文・リンクが読めることとは区別し、両方の結果を残した。
- `agent-friendly-404`: スキャナーが調べるロケール外の `/__ora-404-probe-...` は従来のHTML 404。今回の対象である不明な `/ja/...`・`/en/...` はMarkdown 404で確認済み。
- `brand-search-accuracy`、`agent-instruction`、`org-schema-completeness`、`trust-anchors`: 検索順位、エージェント説明ファイル、組織向け項目、About/Contactの追加は今回の対象外。点数のために公開情報やインターフェースを作り足さない。

[stated] 公開APIが古い日時の結果を返すことがあったため、再計測後に `scanned_at` が新しいことを確認した。SSEで得る基盤エンジンの生スコアと、公開APIの0–100スコアは異なるため比較に混在させていない。

再計測時に用いた公開UIと同じストリーム入口（非バージョンAPIのため将来変更され得る）と、比較用の公開API取得:

```powershell
curl.exe -sS -N --max-time 240 'https://is-agentic.com/api/scan/stream?target=kmkm-page.vercel.app&force=1' -o scan-stream.txt
$stamp=[DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
Invoke-RestMethod "https://is-agentic.com/api/v1/report?url=kmkm-page.vercel.app&v=$stamp"
```

[decision] 本作業の受け入れはスキャナーの満点ではなく、上記HTTP・公開情報・no-JS・SEOの検証で判定する。未導入の発見規約や個人サイトに適さない項目は、実益が確認できた時点で別途検討する。
