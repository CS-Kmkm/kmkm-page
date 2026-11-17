# Issue #160–#163 の表示・操作修正

2026年11月16日時点の Open issue から、保留中の #150 を除いた4件を対象にしました。`9ea830e` を基点に issue ごとの worktree を作成し、3担当で実装しました。実装時の統合ブランチは `fix/open-issues-160-163` です。

## 修正内容

| Issue | 原因と変更 | 主なファイル |
| --- | --- | --- |
| [#160 GitBranch表示のバグ](https://github.com/CS-Kmkm/kmkm-page/issues/160) | 上へ移動した文字にカーソルを合わせると、元の親行の `:hover` が有効になっていました。ポインターの座標から実際の行を求め、スクロール・リサイズ時は古いハイライトを解除します。 | `GitCommitLogTimeline.tsx` |
| [#161 経歴ページリスト表示の改善](https://github.com/CS-Kmkm/kmkm-page/issues/161) | 文字の選択ではなく、見出しボタンの `focus:ring` がクリック後に残っていました。`focus-visible` に限定し、キーボード操作時の枠と本文の文字選択を維持します。 | `EventItem.tsx` |
| [#162 モーダル表示の改善](https://github.com/CS-Kmkm/kmkm-page/issues/162) | 即座に表示・削除していた共通モーダルに、180msの表示と140msの終了アニメーションを追加します。終了中もネイティブダイアログの背景操作抑止を保ち、閉じてから呼び出し元へフォーカスを戻します。動きを減らす設定では終了を即時にします。 | `Modal.tsx`, `globals.css` |
| [#163 技術のバッジ](https://github.com/CS-Kmkm/kmkm-page/issues/163) | グリッド全体と各カードのフェードが重なり、遅延開始したカードが一度透明になる挙動でした。各カードの遅延フェードを取り除き、グリッドのフェードとホバー・フォーカス操作を維持します。 | `TechIconGrid.tsx` |

モーダルの終了処理は重複呼び出しを抑止し、アンマウント時はキャンセルします。終了後にアニメーション効果を破棄するため、DOMを保持する経歴モーダルの再表示にも対応します。

## 検証と再実行

ブラウザーの証拠・実行ログは `.ai/test-results/issue-fixes/` に保存しています。これはGit管理外です。変更前は主にルートの本番ビルド、担当者による変更後の比較は各worktreeの開発サーバーを使用しました。#163の暗色テーマの比較は、同じ開発サーバー上で対象コンポーネントだけを変更前へ戻して撮影し、修正を復元して撮影しています。表示・操作の確認であり、速度比較の測定ではありません。統合後は本番ビルドで回帰テストを実行しました。

```powershell
corepack pnpm lint
corepack pnpm type-check
corepack pnpm test
$env:NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
corepack pnpm build
corepack pnpm exec playwright test e2e/career-hover.spec.ts e2e/career-list-focus.spec.ts e2e/modal-transitions.spec.ts e2e/technology-navigation.spec.ts e2e/ui-quality.spec.ts e2e/modal-layout.spec.ts e2e/career.spec.ts e2e/dev-experience.spec.ts --project=chromium --workers=2
```

- #160: `career-hover.spec.ts` で、文字の移動先とハイライトの位置、スクロール時の解除、キーボードフォーカスを確認します。
- #161: `career-list-focus.spec.ts` で、ポインターとキーボードのフォーカス表示、および本文の文字選択を確認します。
- #162: `ModalDismissal.test.tsx` と `modal-transitions.spec.ts` で、終了処理の重複防止・最新コールバック・アンマウント・再表示・reduced motionを確認します。既存のUIテストでフォーカス復帰とダイアログの操作を検証します。
- #163: `technology-navigation.spec.ts` で、同じブラウザー内でホームから開発経験へ2回移動し（途中でホームへ戻り）、それぞれのクライアント遷移後のカード透明度と、技術詳細への移動・復帰を確認します。アニメーションのフレーム証拠は、明色の `163-before.json` / `163-after.json` と暗色の `163-before-dark.json` / `163-after-dark.json` です。通常のbefore/afterファイルに含まれる初回のdarkラベルは設定ミスで明色だったため、暗色の根拠には使用しません。

検証状況: 統合ユニットテスト207件、型検査、本番ビルドが成功。lintはエラー0件で、変更していない `EventDetailModal.tsx` の未使用locale警告1件です。統合Chromium72件が成功し、独立レビューの指摘を受けて再訪ケースを強化した4件も成功しました。出典は同ディレクトリの `unit.log`, `types-repeat.log`, `build-final.log`, `lint.log`, `e2e.log`, `e2e-results.json`, `e2e-repeat.log`, `e2e-repeat-results.json` です。テスト変更後の追加lintも成功しています。

## 範囲と制限

元の4件のUI修正では、#150・掲載内容・依存関係は変更していません。公開前に必要になった依存更新は下記のCI対応として分離しています。モーダルの終了アニメーションは共通の閉じる操作が対象で、親から強制的にアンマウントされた場合は即座に終了します。ブラウザー検証はローカルChromiumで、実機および他エンジンでは確認していません。2026年11月17日の依頼に基づく実装PRは #164〜#167、必要なCI対応は #168・#169 に分離しました。いずれもmainへマージ済みです。削除対象は、コミットがmainに含まれ、worktreeがクリーンな作業ブランチに限定しています。別途の直接デプロイ操作は行っていません。


## 独立レビュー

実装担当外のレビューで、契約準拠、不具合、保守性、検証根拠を確認しました。元のUI修正と、公開前に必要になったCI対応は範囲を分けてレビューしています。

実行時の不具合と保守性の指摘はありませんでした。初回遷移しか検証していないという指摘を採用し、同じブラウザーで別ページへ移動して戻るケースを追加しました。強化した4件の成功後、同じレビュアーが指摘の解消を確認しました。型検査と追加lintの終了コード0は主担当が確認しています。元のUI修正（#160〜#163）について、レビュー指摘による実装変更はありません。CI対応の #169 は製品コードを変更しており、実装担当外のソースレビューで、画面ごとの参照を使う変更が妥当と確認されています。


## CI対応と公開（2026年11月17日）

マージ前のCIで、変更していないNext.js16.4.4に対する [GHSA-mfr8-8qww-v76h](https://github.com/advisories/GHSA-mfr8-8qww-v76h) の監査失敗が見つかりました。修正版16.4.5は11月4日03:01（JST、レジストリ上は11月3日18:01 UTC）公開で、7日間の導入制限を満たします。監査を抑制せず、Next本体と付属env/SWCだけを更新しました。既存のVaryヘッダーパッチは内容を変えず新しい版へ適用し、別途調整済みのESLintプラグイン16.4.4とそのパッチ・overrideは維持しています。ローカルの `pnpm audit --audit-level=moderate` とPRのSecurity Scanは成功しました。

Linux CIで再現した追加の問題も分離して修正しました。

- 経歴ホバーテスト: 横スクロール通知が判定用のマウス移動より後に届く競合を防ぐため、位置測定前に描画2フレームを待ちます。元の判定は維持し、タイムアウト延長やモバイルのスキップは追加していません。日英・PC/モバイル幅の反復20件が成功し、LinuxのE2Eも成功しました。
- 開発経験のタブ: 保持された非表示ページに同じIDがあると、キーボード操作が古いページのボタンを参照していました。画面ごとのボタン参照を使い、テストでも非表示ページの複製を加えて、操作中のページに判定を限定しました。プロジェクトの遅延生成・訪問後の保持・カテゴリの折りたたみ状態の判定は維持しています。既存11件を3回実行した33件が、再試行なしで成功しました。

| PR | 変更範囲 |
| --- | --- |
| [#164 経歴ホバー位置](https://github.com/CS-Kmkm/kmkm-page/pull/164) | #160の実装と回帰テスト・その同期修正 |
| [#165 見出しのフォーカス枠](https://github.com/CS-Kmkm/kmkm-page/pull/165) | #161の実装と回帰テスト |
| [#166 モーダルの開閉](https://github.com/CS-Kmkm/kmkm-page/pull/166) | #162の実装とライフサイクル・ブラウザーテスト |
| [#167 技術バッジの点滅](https://github.com/CS-Kmkm/kmkm-page/pull/167) | #163の実装と再訪テスト |
| [#168 Next.jsのセキュリティ更新](https://github.com/CS-Kmkm/kmkm-page/pull/168) | マージに必要な監査対応を独立 |
| [#169 表示中ページのタブ操作](https://github.com/CS-Kmkm/kmkm-page/pull/169) | 保持ページがある場合のキーボード操作と既存テストの判定範囲 |

検証した統合ツリーはNext.js16.4.5でビルド・型検査・ユニット207件が成功し、公開URLをCI同様に設定したChromium全件実行は156件成功・1件スキップでした。スキップはアクセス解析用の設定がない場合の任意テストで、解析設定を与える専用CIは成功しています。初回のローカル全件実行では公開URLの未指定によりメタ情報2件が失敗しましたが、製品コードやテストの条件を緩めず、ビルド設定を是正して全件を再実行しています。

更新前後の日英×4主要ページ×明暗×375/1440pxの32組を比較し、31組のPNGのSHA-256が一致しました（ファイルのバイト単位の一致）。残る日本語ホーム・暗色・1440pxは最初の見出し1行に局所的な文字描画差があり、比較画像と再撮影を保持しています。文言変更はなく、その他のレイアウト変化は目視で認めませんでした。原因をNext更新に確定した性能・描画改善の主張はしていません。両方の32条件でaxe違反、横方向のはみ出し、SVG文字のクリップはありませんでした。

HTML・Markdown・RSCの24レスポンス（日英×4主要ページ×3形式）では、すべてHTTP200で、`Vary` に `Accept` が1回ずつ含まれることを確認しました。パッチの適用成功だけで、実際のレスポンスが正しいと判断していません。

出典は `.ai/test-results/issue-fixes/` の `next1645-audit.log`, `next1645-unit.log`, `publish-ci-env-build.log`, `publish-ci-env-e2e.log`, `publish-full-e2e-results.json`, `ci-dev-stability-results.json`, `career-ci/repeated-chromium.log`, `next1645-visual-comparison.json`, `next1645-vary.json` です。画面とaxeの元データは `.ai/test-results/ui-quality/next1644-before/` と `next1645-after/` にあります。画面監査は `PLAYWRIGHT_TEST_BASE_URL` を対象ビルドへ向けた `corepack pnpm exec node scripts/audit-ui.mjs <新しいフェーズ名>` で再実行できます。

独立レビューのパッチの追跡漏れ懸念は、コミット40b555eの4ファイルとCIのfrozen installで確認しました。Vary再確認も上記レスポンスで完了しています。対象外の既存課題として、他の詳細復帰処理のグローバルID参照・ARIA IDの重複、および既存Varyパッチの空トークン処理は残しています。このタブ修正やパッチ移植で、それらも解消したとは主張していません。

### 最終検証の対応先と再実行

ローカル検証は未コミットの統合ツリーで行っています。マージ後に [mainの実装コミット78d3893](https://github.com/CS-Kmkm/kmkm-page/commit/78d3893d35e2ed1bfe0986c6937f48b3666cf335) と比較し、追跡ファイルでは既存のAGENTS.mdを除いてCRLF/LF以外の差がなく、公開対象ファイルを反映したindexのGitツリーも同コミットと一致することを確認しました。根拠は `tested-published-tree-final.json` です。ログ実行時のHEADがこのコミットだったという意味ではありません。

156件成功・1件スキップの全件実行は、上段の8 spec限定コマンドとは別です。実測では同じPlaywright設定を継承した一時configで3201を使用しています。CIと同じ公開URL値を指定した標準設定での再実行は次のとおりです。

```powershell
$env:NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
$env:PLAYWRIGHT_TEST_BASE_URL = 'http://localhost:3000'
corepack pnpm build
corepack pnpm exec playwright test --project=chromium --workers=2
corepack pnpm exec playwright test e2e/dev-experience.spec.ts --project=chromium --repeat-each=3 --workers=1
```

実測の全件コマンドは `corepack pnpm exec playwright test --project=chromium --config=.ai/test-results/issue-fixes/playwright.config.ts` で、一時configとログはGit管理外の記録に残しています。33件の反復は同じ11 testを3回実行した結果で、別の33種類の機能を増やした意味ではありません。

Vary検証の条件は、日英のホーム・経歴・論文・開発経験の各URLに、次の3種類のGETを送るものです。値を小文字化してカンマで分割・前後の空白を除去し、`accept` が1個であることを判定します。

| 形式 | Accept | RSC | クエリ |
| --- | --- | --- | --- |
| HTML | `text/html` | なし | なし |
| Markdown | `text/markdown` | なし | なし |
| RSC | `text/markdown` | `1` | `_rsc=verify` |

実行スクリプトは `.ai/test-results/issue-fixes/check-vary.mjs`（Git管理外）です。サーバー起動後、`corepack pnpm exec node .ai/test-results/issue-fixes/check-vary.mjs http://localhost:3201` で再実行できます。通常のVary回帰は追跡済みの `e2e/agent-ready.spec.ts` にも含まれます。

PNG比較は、保存済みの撮影結果に対して次の方法で再実行できます。

```powershell
$beforeDir = '.ai/test-results/ui-quality/next1644-before'
$afterDir = '.ai/test-results/ui-quality/next1645-after'
Get-ChildItem -LiteralPath $beforeDir -Filter *.png | ForEach-Object {
  $afterFile = Join-Path $afterDir $_.Name
  [pscustomobject]@{
    Name = $_.Name
    Identical = (Get-FileHash -LiteralPath $_.FullName).Hash -eq (Get-FileHash -LiteralPath $afterFile).Hash
  }
} | Group-Object Identical | Select-Object Name, Count
```

### マージ・削除記録

実装とCI対応の6 PRはmainにマージ済みで、#160〜#163はClosed、対象外の#150はOpenのままです。各先端コミットがorigin/mainに含まれることを確認してから、`fix/issue-160`〜`163`、`fix/next-security-gate`、`test/active-page-e2e` のローカル・リモートブランチと、対応する6 worktreeを削除しました。

削除前の追跡ファイルはクリーンにし、Nextが自動生成したworktree内のAGENTS差分だけを記録フォルダーに退避しています。ルートの既存AGENTS.mdとCLAUDE.mdはコミットせず、内容を保持しています。Windowsで残ったディレクトリは、解決済みの絶対パスが作業領域内にあることと、node_modulesが共有ジャンクションでないことを確認したうえで、PowerShellのLiteralPathと長いパス対応で削除しました。

この記録は、issue実装用の作業ブランチやworktreeとは分けた文書ブランチで管理しています。ローカルのテスト・画像・ヘッダー検証記録は、削除したworktreeの外に保持しています。
