# Implementation Plan

- [x] 1. データ構造とユーティリティ関数の実装


  - ExtendedCareerEntry型を追加し、parentId、branchColor、branchLevelフィールドをサポート
  - ブランチツリー構築ロジック（buildBranchTree）を実装
  - データ検証ロジック（validateCareerData、detectCircularReferences）を実装
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x] 2. 色管理システムの実装


  - ブランチカラーパレット（BRANCH_COLORS）を定義
  - 色割り当てアルゴリズム（assignBranchColors）を実装
  - 隣接ブランチが異なる色になるロジックを実装
  - アクセシビリティ基準を満たすコントラスト比を確保
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 7.4_

- [x] 3. レイアウト計算ロジックの実装


  - 座標系の定義（X軸: ブランチ位置、Y軸: 時間軸）を実装
  - ブランチの横方向配置計算（calculateXOffset）を実装
  - 時間軸に基づく縦方向配置計算（calculateYPosition）を実装
  - レスポンシブレイアウトのフック（useResponsiveLayout）を実装
  - _Requirements: 1.2, 1.5, 5.1, 5.2_

- [x] 4. BranchLineコンポーネントの実装


  - SVGパスを使用したブランチ線の描画を実装
  - 分岐線（createBranchPath）の描画を実装
  - マージ線（createMergePath）の描画を実装
  - 接続線（createConnectionPath）の描画を実装
  - ブランチの色を適用
  - _Requirements: 1.4, 2.1, 2.2, 3.3_

- [x] 5. BranchNodeコンポーネントの実装


  - SVG円要素を使用したノードの描画を実装
  - ノードタイプ（start、end、milestone）のサポートを実装
  - ブランチの色をノードに適用
  - ホバー時の強調表示を実装
  - フォーカス時の強調表示を実装
  - ARIA属性（role、aria-label、tabIndex）を設定
  - _Requirements: 4.1, 8.2, 7.1, 7.2_

- [x] 6. BranchLabelコンポーネントの実装


  - ノードの横にテキスト情報を表示
  - 組織名、役職、期間を表示
  - 説明文の表示（オプション）をサポート
  - レスポンシブなテキストレイアウトを実装
  - 長いテキストの処理を実装
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6_


- [x] 7. GitBranchTimelineメインコンポーネントの実装


  - 経歴データからブランチツリーを構築
  - 各ブランチの色、位置、階層を計算
  - SVGキャンバスの管理を実装
  - BranchLine、BranchNode、BranchLabelコンポーネントを統合
  - エラーハンドリングとフォールバック表示を実装
  - _Requirements: 1.1, 1.3, 2.5, 3.1, 3.2, 3.4, 3.5_

- [x] 8. アニメーション効果の実装


  - Framer Motionを使用したページロードアニメーションを実装
  - 段階的な表示アニメーション（stagger）を実装
  - ホバー時のアニメーション効果を実装
  - prefers-reduced-motionのサポートを実装
  - 60FPSのパフォーマンスを確保
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 9. キーボードナビゲーションの実装


  - 矢印キーによるノード間の移動を実装
  - Enterキー/スペースキーによる詳細表示を実装
  - フォーカス状態の視覚的フィードバックを実装
  - スクリーンリーダー向けの説明文を生成
  - _Requirements: 7.2, 7.3_

- [x] 10. career.jsonデータの更新


  - 既存の経歴エントリーにparentIdフィールドを追加
  - ブランチ構造を反映したデータに更新
  - データの妥当性を検証
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 11. career/page.tsxの更新


  - GitBranchTimelineコンポーネントをインポート
  - 既存のTimelineコンポーネントをGitBranchTimelineに置き換え
  - フィーチャーフラグによる切り替えをサポート（オプション）
  - ページメタデータを更新
  - _Requirements: 1.1_

- [x] 12. レスポンシブデザインの実装

  - モバイル表示の最適化（< 768px）
  - タブレット表示の最適化（768px - 1023px）
  - デスクトップ表示の最適化（1024px+）
  - タッチ操作に適したサイズの要素を実装
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_


- [x] 13. パフォーマンス最適化

  - React.memoによるコンポーネントのメモ化
  - useMemoによる計算結果のキャッシュ
  - useCallbackによるコールバック関数の最適化
  - Intersection Observer APIによる遅延レンダリング（オプション）
  - _Requirements: 8.5_

- [x] 14. 説明文の表示位置を修正



  - GitBranchTimelineコンポーネント内のラベル描画ロジックを修正
  - 説明文を組織名・役職・期間と同じ場所（ノードの右側）に配置
  - 説明文のY座標を期間の下（midY + 34px）に設定
  - 説明文が存在する場合のみ表示するロジックを実装
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_


- [x] 15. 時間軸に基づく正確な配置の実装



  - mainブランチに年数の目盛りを表示するロジックを実装
  - 各経歴エントリーの開始日・終了日から正確なY座標を計算
  - ブランチの分岐点を開始日に対応するY座標に配置
  - ブランチのマージ点を終了日に対応するY座標に配置
  - 1年あたりのピクセル数を一定に保つ
  - 所属期間の長さが視覚的に正確に表現されることを確認
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [ ]* 16. 単体テストの作成
  - buildBranchTree関数のテスト
  - assignBranchColors関数のテスト
  - calculateYPosition関数のテスト
  - validateCareerData関数のテスト
  - _Requirements: 6.5_

- [ ]* 17. コンポーネントテストの作成
  - GitBranchTimelineコンポーネントのテスト
  - BranchNodeコンポーネントのテスト
  - BranchLabelコンポーネントのテスト
  - エラー表示のテスト
  - _Requirements: 7.1, 7.2_

- [ ]* 18. E2Eテストの作成
  - タイムライン表示のテスト
  - キーボードナビゲーションのテスト
  - レスポンシブ表示のテスト
  - アクセシビリティテスト（jest-axe）
  - _Requirements: 7.1, 7.2, 7.5_

- [ ]* 19. ドキュメントの作成
  - コンポーネントのJSDocコメントを追加
  - README.mdに新機能の説明を追加
  - データ構造の変更をドキュメント化
