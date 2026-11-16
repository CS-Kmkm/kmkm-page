# UI品質改善（#144–#149）

対象は `feat/ui-quality-improvements`、比較元は `main` の `7e48da8`。#150 のコンテンツ構成・方向性の検討は対象外です。新しい文章・画像・実績データは要求せず、既存情報を使います。

## 再実行

Windows 11 / Node 22 / pnpm 10.33.0。本番ビルドを `http://localhost:3000` に起動して実行します。pnpmコマンドはこのホストでは昇格したPowerShellが必要です。

```powershell
$env:NEXT_PUBLIC_SITE_URL='http://localhost:3000'
corepack pnpm build
corepack pnpm start
# 別のターミナルで実行
corepack pnpm exec node scripts/audit-ui.mjs after
corepack pnpm exec node scripts/capture-ui-details.mjs after
corepack pnpm exec playwright test e2e/ui-quality.spec.ts e2e/modal-layout.spec.ts e2e/dev-experience.spec.ts e2e/career.spec.ts e2e/performance.spec.ts --project=chromium --workers=2
pwsh -NoProfile -File scripts/measure-lighthouse.ps1 -Phase after -Runs 3
corepack pnpm measure:client
```

`audit-ui.mjs` は日英4ページ×ライト/ダーク×375/1440pxの32条件を確認します。axeのWCAG 2 A/AA、2.1 AA、2.2 AA、HTTP状態、ページ全体の横あふれ、SVGテキストの切れを記録し、画像を保存します。`after` は違反検出時に非ゼロ終了します。`before` は比較元を記録するため違反を許容します。画像・生データ・ログは `.ai/test-results/ui-quality/`、集計はこの文書と同じディレクトリに残します。

## #144 監査手段の区別

[Modern Web Guidance公式](https://developer.chrome.com/docs/modern-web-guidance)と[公式CLI](https://github.com/GoogleChrome/modern-web-guidance)を確認しました。これはエージェント向けガイダンス集であり、静的スキャナーだけではありません。

```powershell
corepack pnpm --config.minimumReleaseAge=10080 dlx modern-web-guidance@0.0.203 install --agent codex
corepack pnpm --config.minimumReleaseAge=10080 dlx modern-web-guidance@0.0.203 search 'dialog modal focus'
corepack pnpm --config.minimumReleaseAge=10080 dlx modern-web-guidance@0.0.203 retrieve dialog,accessibility,prevent-page-scroll-under-modal-dialog,dark-mode
corepack pnpm --config.minimumReleaseAge=10080 dlx modern-web-guidance@0.0.203 search 'reduce JavaScript loading'
corepack pnpm --config.minimumReleaseAge=10080 dlx modern-web-guidance@0.0.203 retrieve performance
corepack pnpm --config.minimumReleaseAge=10080 dlx modern-web-guidance@0.0.203 legacy-scan src
```

CLI 0.0.203 は2026-11-08公開。2026-11-15時点で7日以上経過した版を使い、アプリの依存には追加していません。導入は成功し、`.agents/skills/modern-web-guidance` と `skills-lock.json` が生成されました。導入評価後、取得したガイド一式とロックを `.ai/test-results/ui-quality/` に移し、アプリ側へ大量のガイドを取り込むことは避けています。導入はGitHubの可変refを取得するため、CLIの固定だけでは将来のガイド本文まで一致しません。評価時のskill versionは `2026_11_09-5bcc021b`、computedHashは `6fe4142007c9b5d8c637161dcb36a4338edecefb8737310c4c734d7b20f07a73` です。

| 手段 | 確認したこと | 限界 |
|---|---|---|
| ガイドを用いたコードレビュー | native dialog、フォーカス、スクロール、テーマ、不要なJS読込 | 提案をそのまま適用せずNext.jsと実ブラウザーで照合 |
| `legacy-scan` | 33ガイドの決定的ルールで1件（`dark-mode`） | ガイド全体の約20%。未検出は問題なしを意味しない |
| Playwright + axe | 32条件の表示とコントラスト、キーボード・モーダル・タブ・導線 | スクリーンリーダー・実機操作の代用ではない |
| Lighthouse | ローカル本番ビルド、日英8 URL、各3回 | ラボ指標。実ユーザーのINPではない |

## 検出と実装の対応

| Issue / 優先度 | 確認した問題と再現 | 対応 |
|---|---|---|
| #145 / P1 | `/ja/publications` 等で詳細を開く。独自divモーダルに呼出元へのフォーカス復帰・背景不活性化がなく、既定ARIA IDも共通 | `<dialog>.showModal()`、`useId()`、標準のフォーカス管理。背景クリックは押下・解放の両方がパネル外の場合だけ閉じる |
| #145 / P1 | 技術詳細からプロジェクトを開きEscape。技術詳細側も同じキーを処理して一覧へ戻る | native dialog表示中は技術側のEscapeを処理しない |
| #145 / P1 | 年別イベント一覧でdocument全体のEnterを監視。閉じるボタンや重なった詳細のEnterもイベント選択に流れる | 矢印キーを一覧内に限定し、実際のボタンにフォーカス。Enter/Spaceはnative buttonに任せる |
| #146 / P1 | `/en/career` を375pxで表示。年・グラフ・日付の固定幅に押され、所属と役割がほぼ見えない | 現行Gitグラフに名前付き横スクロール領域と案内を用意。所属/役割をHTMLボタンから全文・日付・既存説明のモーダルで閲覧 |
| #147 / P1 | Lighthouse対象がリダイレクト元URLのみ。時間制限のE2Eはホストの負荷にも左右される | 日英8実URLと3回のラボ計測。絶対秒数のE2Eを動作確認に変更し、性能比較はLighthouseとバンドル計測に集約 |
| #148 / P2 | プロジェクトの技術名が静的バッジで、技術へ直接移れない | カタログに実在する名前との完全一致だけをボタン化。技術詳細から元のプロジェクトへ戻り、タブとフォーカスを復元 |
| #149 / P2 | ダークテーマのフッターのリンクが3.98:1。タブの高さとフォーカス指定が重複 | フッターの文字色を既存の明るいグレーへ変更。タブの44px最小サイズとoutlineを既存トークンへ共通化。reduced motionを全共通UIへ適用 |

旧 `GitBranchTimeline` / `EventPoint` は現在の経歴ルートでは使われていません。#146の記述をそのまま旧部品に当てはめず、実際の `TimelineView → GitCommitLogTimeline` を修正しました。元のグラフ、年月、表示順、リスト切替は維持します。

プロジェクトと論文の間には、論文ID・DOI・共通の公開URL等による確実な対応がありません。`proj-002` の「研究」という説明だけでは個々の論文との関係を確定できないため、関連を生成していません。技術とプロジェクトは既存のIDおよび技術名を使います。

## 共通UIルールとAstryx比較（#149）

[Astryx公式部品一覧](https://astryx.atmeta.com/components)、[coreのNext.js/Tailwind導入手順](https://github.com/meta/astryx/blob/main/packages/core/README.md)、[Storybook](https://astryx.atmeta.com/storybook/)を参照しました。StorybookはHTMLテキスト取得だけでは状態・キーボード動作を確認できず、その動作検証を行ったとは扱いません。

| 観点 | このサイトの採用方針 |
|---|---|
| Button / Tab List | Native buttonを使い、選択状態と矢印キーを維持。`getTabClasses` にサイズ・色・フォーカスを集約 |
| Dialog | 共通の見出し・閉じる操作とnative dialogのフォーカス/不活性化を利用 |
| Card / Badge | 既存の余白・角丸・セマンティック色を維持。移動できる技術だけを44pxボタンで明示 |
| Theme / focus | 既存トークンを継続し、outlineはライト青600/ダーク青400。OSのテーマと手動テーマをnative UIのcolor-schemeにも反映 |
| 導入費用 | React 19は対応済みだが、AstryxのCSSレイヤー・テーマProvider・StyleXとの重複が増える。今回の限定的修正に対する定量的な導入利益は示せないため依存を追加しない |

モーダルは従来の幅・余白・背景ぼかしを維持し、手動のトラップや遅延フォーカスを削除します。Reactの `autoFocus` は `showModal()` 前にフォーカスを動かすため使わず、native autofocus属性を開く直前に設定します。閉じる際も親のDOM削除前に `dialog.close()` を呼び、ブラウザーによる呼出元への復帰を成立させます。`dialog:modal` と `::backdrop` にスクロール連鎖の抑制を設定し、rootのoverflowは変更しません。非スクロール領域のスクロール抑制はブラウザーによって対応が異なるため、Safariを含む全環境での完全な背景スクロール停止は保証しません。退出アニメーションは追加せず、即時に閉じてフォーカスを返します。

## 計測・確認の範囲

Lighthouse 12.8.2、mobile/simulated throttlingの既定設定、ローカルNext.js本番サーバーで測定します。3回の中央値を比較し、TBTをINPと呼び替えません。`audit-ui.mjs` のPerformanceObserverは別途、無制限ネットワーク下のローカル観測でありLighthouseスコアと混同しません。

本番のRUM/CrUX、実スマートフォン、Safari/Firefox、支援技術利用者による実操作は今回未実施です。比較前後の同じホストでもOS負荷による変動があります。スコアを実ユーザーの体感向上や全ブラウザー適合の保証には使いません。

最終本番ビルドのChromium全体テストは140件成功、開発専用1件スキップ。型検査・本番ビルド・データ検証も成功。lintはエラー0、変更前から存在するEventDetailModalの未使用locale警告1件です。ログは `.ai/test-results/ui-quality/e2e-final.log`、`types-final.log`、`build-final.log`、`data.log`、`lint-final.log`。性能測定の集計は `scripts/summarize-ui-audit.mjs` で `docs/ui-quality-results.json` に生成します。

## 独立監査への対応

Claude Opus 5.5（high指定、回答モデルを確認）の読み取り専用監査を実施しました。重要指摘のfocus-visible outline、親制御での閉鎖、Escapeの既定動作、経歴ボタンの高さを修正。再確認ではその寿命・背景クリック・Escape・サイズに追加の重要指摘はありませんでした。再確認が述べた「package.jsonへのlocalhost固定」「Lighthouseがperformanceだけを収集」は実ファイルと一致せず不採用です。localhostは検証シェルの環境変数だけで指定し、計測はperformance/accessibility/best-practices/seoを収集しています。

日本語の既定閉じるラベルを英語にする既存仕様は、既存回帰テストと合わせて維持しました。ID文字列に依存する復帰処理、古いbackdropヘルパーと退出アニメーション用の遅延、未使用Framer Motion依存は保守上の残課題です。今回の全体再設計・依存整理には広げていません。

## 最終測定結果

| URL | LCP 前→後 (ms) | TBT 前→後 (ms) | 性能スコア 前→後 |
|---|---:|---:|---:|
| /en | 3520 → 3549 | 895 → 1409 | 0.71 → 0.64 |
| /en/career | 3627 → 3415 | 686 → 1034 | 0.74 → 0.69 |
| /en/dev-experience | 3651 → 3340 | 191 → 949 | 0.85 → 0.74 |
| /en/publications | 3118 → 3271 | 209 → 935 | 0.9 → 0.71 |
| /ja | 3671 → 3256 | 1752 → 1794 | 0.62 → 0.65 |
| /ja/career | 3641 → 3141 | 1322 → 640 | 0.64 → 0.77 |
| /ja/dev-experience | 3245 → 3484 | 1087 → 704 | 0.7 → 0.72 |
| /ja/publications | 3451 → 3085 | 758 → 1189 | 0.72 → 0.7 |

各3回の中央値。全8ページで変更後CLS中央値は0。スコアとTBTは改善・悪化が混在しており、一律の高速化は主張しません。前後のホスト負荷と計測時刻が異なるため、一般的な体感性能への外挿はできません。生データは .ai/test-results/ui-quality/lighthouse-before/ と lighthouse-after/、集計は [ui-quality-results.json](ui-quality-results.json)。再集計: corepack pnpm exec node scripts/summarize-ui-audit.mjs。

最終axe監査は32条件すべて違反0・ページ横あふれ0・SVGテキスト切れ0。変更前は32条件中15条件でcolor-contrast違反がありました。ユニット204件成功、Chromium140件成功・開発専用1件スキップ、型検査・ビルド・データ検証成功。画像はbefore/afterに通常画面32枚ずつとモーダル24枚ずつ保存し、代表的な日英・テーマ・幅の画面を比較確認しました。


全体E2Eの再実行は `corepack pnpm exec playwright test --project=chromium --workers=2 --retries=0`（上記5スペック指定は重点確認用）です。最終集計の独立照合でも重要な数値不整合はありませんでした。

比較時のLighthouse benchmarkIndexは前458・後1112で、ホストCPU状態に大きな差があります。このためLCP/TBT/スコアの差をコードだけの効果として解釈できません。集計JSONの `browser` はPlaywright Chromium 147、`lighthouse.hostUserAgent` はLighthouseが起動したChrome 157を示す別の値です。

## EN性能の追試

初回の性能完了判断は撤回し、追加の比較・採用したホーム改善・残る論文ページの低下を [performance-recheck.md](performance-recheck.md) に記録しています。#147の性能判定は未完了です。

非表示一覧の追加削減と、初回表示・タブ切り替えの費用比較は [rendering-performance.md](rendering-performance.md) を参照してください。


## issueクローズの扱い

2026-11-16のユーザー指示により、#147も今回の実装・計測記録を残してクローズする方針です。文中の未完了判定は測定時点の技術的評価で、論文ページの低下原因が解消したことを意味しません。
