# Windowsの本番ビルドに必要な空き容量

- 日付: 2026-11-14、Windows / このリポジトリ。
- [stated] 症状: Next.jsのコンパイル後、TurbopackのSST書き込みが `os error 112` で失敗。`Get-PSDrive C` の空きは0だった。
- [stated] 原因: Cドライブの空き容量不足。
- [stated] 非原因: TypeScriptやMarkdown構文のコンパイル失敗ではなく、ログは `Compiled successfully` の後にキャッシュ保存失敗を示した。
- [stated] 対処: このリポジトリ内の再生成可能な `.next` のみ、解決済み絶対パスが `C:\Users\Koshi\kmkm-page\.next` であることを確認して削除。約2.6GBを確保し、ビルドが成功した。ソース・研究成果物・他プロジェクトは削除していない。
- [derived] 再発時: `Get-PSDrive C` とビルドログを先に確認する。少なくとも数GBの作業領域を確保し、依存再インストールやコンパイラ変更を先に試さない。
- 検証ログ: `.ai/test-results/build.log`。再実行: `corepack pnpm build`。

## pnpmパッチ適用時の中断復旧

- [stated] 同日、`pnpm patch-commit` がパッチと設定を生成した後、依存更新の進捗がdoneになっても終了せず、`next` の実行シムが一時的に存在しない状態になった。
- [unresolved] 停滞原因は特定していない。ネットワークやファイルロックが原因だとは断定しない。
- [stated] 非原因: Nextパッチの適用失敗ではなく、インストール先のテンプレートには変更が存在した。
- [stated] そのプロセスを停止し、`corepack pnpm install --offline --ignore-scripts` で既存キャッシュとロックに基づくリンク再構成を行い、25.7秒で終了した。依存バージョンの変更はなかった。
- [derived] パッチ更新は完了を待ってからビルドする。中断時は `pnpm-lock.yaml` と実行シムを確認し、インストールを完了させる。ログ: `.ai/test-results/patch.log`、`.ai/test-results/install-patched.log`。
