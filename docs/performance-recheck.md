# EN性能の再検証と改善（#147）

以前のEN全ページのスコア低下を受けて、#147の性能確認をやり直しました。以前の生データ・報告は保持し、今回の比較結果は別フェーズに保存しています。

## 方法と比較対象

- base（3101）: `7e48da8` を隔離コピーしてビルド。
- current（3102）: 今回の性能最適化前のUI改善済みビルドを固定保存。
- optimized（3103）: 各比較フェーズの候補。最終的な保持版はホームの測定DOM削減のみ。
- 全ビルドで同じNode/pnpm/依存、`NEXT_PUBLIC_SITE_URL=http://localhost:3000`。アプリのbuildスクリプトは変更していません。
- Lighthouse 12.8.2とPlaywright同梱Chromium 147を固定。mobile・simulated throttling（CPU×4）の同じ設定で測定。
- 最初の診断は各ENルート3回。追加候補の比較と保持版の確認は4回ずつで、各ルートの実行順を2回ずつ反転。全試行とbenchmarkIndexを残し、不利な値も除外しません。
- 異なるフェーズのcurrentを混ぜず、各フェーズ内で比較します。3/4回の中央値は有意差検定ではなく、実ユーザーのINPも示しません。固定ブラウザー・交互実行でもホスト負荷の変動は残ります。

`.ai/test-results/perf-recheck/base-source` と `current-source` は比較用の隔離コピーです。既存依存へのnode_modulesディレクトリジャンクションがあり、再帰削除はしていません。

## 確認したことと採用判断

最初の交互比較（`paired-original-current`）はbase→currentでホーム60→53、経歴59→59、開発経験67→61、論文60→72。以前のEN全ページの一様な大幅低下は再現しませんでしたが、ホームと開発経験には懸念が残りました。過去のログでは同じNext.js/React共通スクリプトの時間まで大きく変わっており、コードだけへの帰属には不足があります。

最初の追加候補では、ホームの測定DOM削減と、計測先未設定時のWebVitals監視省略を試しました。`paired-current-optimized-final` の4回比較は、ホーム67.5→88.5、経歴83.5→83.5、開発経験73.5→86、論文82.5→78。論文は4組中3組で低下したため、全ページに及ぶWebVitals変更は不採用とし、RootLayoutの監視処理と設定時の動作を元に戻しました。その候補は最終採用版ではありません。

保持する変更は `UpdatesList` の初期描画削減です。従来は表示数を決めるため、全更新分の非表示カードを描画していました。少数から実測し、全測定カードが収まる場合だけ測定範囲を広げます。固定上限でデータを切り捨てず、大きい画面やリサイズ・フォント読込にも対応します。同じ測定からの重複拡張を防ぎ、拡張中は表示件数を確定しません。並べ替え結果も再利用します。

独立監査が指摘した既存のカード間マージン計算を修正すると、EN小画面等で表示件数が変わりました。今回の性能改善では表示内容を維持するため、このレイアウト修正は採用していません。この既存制約は残課題です。高い画面のCLS検査は `data-update-fit=settled` を待ってから行います。

コンテンツ・文言・デザイン・依存は変更しません。比較用ソースコピーが通常の検査に混ざらないよう、VitestとTypeScriptで `.ai` を除外しています。

## 再実行

各比較ビルドを3101/3102/3103で起動し、PowerShell 7（pwsh）でリポジトリルートから実行します。フェーズ名は既存データを上書きしない新しい名前にしてください。

```powershell
& ./scripts/compare-performance.ps1 -Phase new-base-current -Runs 4 -Variants @('base','current')
& ./scripts/compare-performance.ps1 -Phase new-retained -Runs 4 -Variants @('current','optimized') -Routes @('/en','/en/publications')
corepack pnpm exec node scripts/summarize-performance.mjs new-base-current new-retained
corepack pnpm exec node scripts/capture-performance.mjs
```

今回の記録を再集計する場合:

```powershell
corepack pnpm exec node scripts/summarize-performance.mjs paired-original-current paired-current-optimized-final paired-retained-home-publications
```

生データとログは `.ai/test-results/perf-recheck/`、画像とDOM/JS計測は `visuals/`、集計は `docs/performance-comparison.json`。生レポートは保持し、追跡する集計JSONだけを再生成します。`grouped` はフェーズごとの中央値、`paired` は同じ巡回のペア差と勝敗、`rows` は設定・CPU計測値・出典を含む全試行です。

## 最終保持版の確認

保持版のユニット204件・型検査・本番ビルド・変更箇所のlintは成功。重点Chromium検査は32件成功・開発専用1件スキップ。先行版では全体141件成功・開発専用1件スキップを確認しています。

保持版の同一フェーズ4回比較（`paired-retained-home-publications`）:

ペアごとのスコアはホームが3勝1敗、論文が0勝3敗1同点でした。ホームの4巡目は10点低下し、TBTも2873ms増加しています（benchmark比0.64）。改善は全試行で一様ではありません。

| ENページ | スコア中央値 current→保持版 | LCP ms | TBT ms |
| --- | --- | --- | --- |
| ホーム | 59.5→63.5 | 3745→3483 | 3100→1935 |
| 論文 | 68→57 | 3219→3934 | 1448→2820 |

ホームは改善方向ですが、論文は悪化しており、EN全体の性能改善や#147完了とは判定しません。CPU benchmarkの範囲はホームcurrent 981.5–1661.5 / 保持版1067.5–1730、論文current 796.5–1731 / 保持版1253.5–1367.5。環境変動はありますが、それだけが低下の原因とは断定できません。保持版で経歴・開発経験のLighthouse再測定はしていません。

`visuals/results.json` と画像比較では、日英×明暗×375/1440pxの8条件すべてで表示件数・残件数・PNGハッシュが一致しました。EN375pxの全DOM要素数は521→257、非表示測定カードは26→4。EN1440pxではDOM560→344、測定26→8。WebVitals監視は維持し、PerformanceObserver生成数は両版とも5です。

非ホーム3ルートのJS資産も記録しました（`visuals/non-home.json`）。共通の1チャンクにはホーム部品の変更が含まれるため、非ホームでも全JSが同一という比較ではありません。保持版はそのチャンクが約0.5KB増加しています。

### ブラウザー実処理時間の補助検査

Lighthouseとは別にChromiumのCDP Performanceカウンターを各8回、順序反転で取得しました。幅412×高さ823、CPU×4、reduced motion。同一ブラウザープロセス・毎回新しいコンテキストで、networkidle・フォント読込に加え、ホームでは両版で先頭更新のダイアログを開閉してReact操作の完了を確認します。ホームと論文では操作が違うため、ルート間の数値は比較しません。

| ルート | TaskDuration秒 current→保持版 | ScriptDuration秒 | LayoutDuration秒 |
| --- | --- | --- | --- |
| ホーム | 3.077→2.622 | 0.768→0.639 | 0.650→0.515 |
| 論文 | 1.273→1.538 | 0.100→0.119 | 0.484→0.548 |

これはナビゲーション開始から指定操作完了までの累積処理時間の中央値であり、TBTやINPではありません。ホームの削減はこの検査でも改善方向でしたが、論文の低下原因は特定できていません。最初の `runtime/` 試行ではホームのReact操作完了条件が非対称だったため、結論には用いません。改善後の条件と全32試行は `runtime-interactive/results.json` に保存しています。取得中に変更ファイルのlintも実行されたため、専用の無負荷測定環境ではありません。

再実行は `corepack pnpm exec node scripts/measure-runtime.mjs`。既存出力の上書きを拒否するので、新しい測定ではスクリプトのoutputを別のパスに変更してください。

直接カウンターのTaskDurationはホームで8組中6組が短縮、論文で8組中5組が増加しました。論文の保持版3・4巡目ではCDPのNodes値444（他は428）とScriptDuration約0.38秒、ホーム保持版初回ではNodes値364（通常347）という外れ値もありました。取得済みの各試行を確認しましたが、その時点のDOMスナップショットはなく、要因は特定できません。ホスト負荷だけで説明せず、ページ状態の差も含めた未解決事項として残します。

### 独立監査

Claude Opus 5.5による最終の読み取り専用監査で、集計値の一致と採用・不採用の区別を確認しました。完了を妨げる指摘はありません。リサイズ検査の待機競合は件数が小画面用に変わるまで待つよう修正し、測定スクリプトにはPowerShell 7の明示的な起動条件を追加しました。監査が挙げた既存のResizeObserver未対応ブラウザーへのフォールバックは今回変更していません。監査記録は `.ai/test-results/perf-final-audit-response.jsonl`。

テストログは同ディレクトリの `unit-retained.log`、`types-retained.log`、`lint-retained.log`、`retained-build.log`、`e2e-retained.log`。生ログはローカルの無視対象で、追跡する集計と本報告は測定の限界を含めて残します。

監査修正後、接続先を保持版の3103に固定したホーム10件の再検査も成功しました（e2e-fit-audit-fixed.log）。その直前のデフォルト3000接続の再検査はブラウザーの読み込み失敗画面で待機したため中断しており、成功件数には含めていません。

## issueクローズの扱い

2026-11-16のユーザー指示により、#147も今回の実装・計測記録を残してクローズする方針です。文中の未完了判定は測定時点の技術的評価で、論文ページの低下原因が解消したことを意味しません。
