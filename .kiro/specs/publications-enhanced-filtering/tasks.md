# Implementation Plan

- [x] 1. 型定義の拡張


  - PublicationEntry型にabstract、imageUrl、imageAltフィールドを追加
  - PublicationFilters、FilterModalProps、PublicationDetailModalProps、PublicationItemProps型を追加
  - _Requirements: 1.1, 3.4, 3.5, 4.2, 4.3, 4.4_

- [x] 2. PublicationItemコンポーネントの作成


  - 個別の論文アイテムを表示するコンポーネントを実装
  - クリック可能な要素として実装（role="button"、tabIndex、onClick）
  - キーボードアクセシビリティ（Enter/Space）を実装
  - ホバー効果とトランジションを追加
  - _Requirements: 4.1, 5.3_

- [x] 3. FilterModalコンポーネントの作成

- [x] 3.1 基本的なモーダル構造を実装


  - モーダルのオーバーレイとコンテンツエリアを作成
  - 開閉状態の管理
  - 背景クリックで閉じる機能
  - _Requirements: 3.2, 3.7_

- [x] 3.2 フィルタUIを実装

  - 主著/共著の選択（ラジオボタン）
  - 論文タイプの複数選択（チェックボックス）
  - Apply/Cancelボタン
  - _Requirements: 3.3, 3.4, 3.5, 3.6_

- [x] 3.3 アクセシビリティ機能を実装

  - ARIA属性（role="dialog"、aria-modal、aria-labelledby）
  - キーボードナビゲーション（Tab、Escape）
  - フォーカストラップとフォーカス管理
  - _Requirements: 5.1, 5.2, 5.5, 5.6_

- [x] 4. PublicationDetailModalコンポーネントの作成

- [x] 4.1 基本的なモーダル構造を実装


  - モーダルのオーバーレイとコンテンツエリアを作成
  - 開閉状態の管理
  - 閉じるボタン
  - 背景クリックとEscapeキーで閉じる機能
  - _Requirements: 4.1, 4.7, 4.8, 4.9_

- [x] 4.2 書誌情報セクションを実装

  - タイトル、著者、会場、年の表示
  - バッジ（論文タイプ、主著者、査読済み）の表示
  - DOI/URLリンクの表示
  - _Requirements: 4.2, 4.5, 4.6_

- [x] 4.3 抄録と画像セクションを実装

  - 抄録の条件付き表示（存在する場合のみ）
  - 画像の条件付き表示（存在する場合のみ）
  - 画像読み込みエラーハンドリング
  - _Requirements: 4.3, 4.4_

- [x] 4.4 アクセシビリティ機能を実装

  - ARIA属性（role="dialog"、aria-modal、aria-labelledby）
  - キーボードナビゲーション（Escape）
  - フォーカストラップとフォーカス管理
  - _Requirements: 5.3, 5.4, 5.5, 5.6_

- [x] 5. PublicationListコンポーネントの修正


- [x] 5.1 フィルタリング機能を統合


  - フィルタ状態の管理（useState）
  - フィルタボタンの追加
  - FilterModalの統合
  - フィルタリングロジックの実装（主著/共著、論文タイプ）
  - アクティブフィルタ数の表示
  - _Requirements: 3.1, 3.2, 3.6, 3.8_

- [x] 5.2 詳細モーダル機能を統合

  - 選択された論文の状態管理
  - PublicationItemコンポーネントの使用
  - PublicationDetailModalの統合
  - クリックハンドラーの実装
  - _Requirements: 4.1_

- [x] 5.3 フィルタクリア機能を実装

  - "Clear Filters"ボタンの追加（フィルタがアクティブな場合のみ表示）
  - フィルタクリアロジックの実装
  - フィルタ結果カウントの表示
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 5.7_

- [x] 5.4 既存のフィルタUIを削除

  - 旧フィルタボタン（All、Journal、Conferenceなど）を削除
  - showFiltersプロップの処理を更新
  - _Requirements: 3.2_

- [x] 6. Publications Pageの修正


  - 統計情報セクション（4つのカード）を削除
  - "About These Publications"セクションを削除
  - ページヘッダーの説明文を簡素化
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 7. ソート機能の確認と修正


  - 年順（降順）ソートがフィルタリング前に適用されることを確認
  - 同じ年の論文のソート順を安定化（IDベース）
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 8. テストの更新
- [ ]* 8.1 PublicationItemコンポーネントのユニットテストを作成
  - クリックイベントのテスト
  - キーボード操作（Enter/Space）のテスト
  - _Requirements: 4.1, 5.3_

- [ ]* 8.2 FilterModalコンポーネントのユニットテストを作成
  - フィルタ選択の状態管理テスト
  - Apply/Cancelボタンの動作テスト
  - キーボードナビゲーションのテスト
  - _Requirements: 3.2, 3.6, 3.7, 5.1, 5.2_

- [ ]* 8.3 PublicationDetailModalコンポーネントのユニットテストを作成
  - 論文情報の表示テスト
  - 抄録/画像の条件付き表示テスト
  - 閉じる操作（ボタン、Escape、背景クリック）のテスト
  - _Requirements: 4.2, 4.3, 4.4, 4.7, 4.8, 4.9_

- [ ]* 8.4 PublicationListコンポーネントのユニットテストを更新
  - フィルタリングロジックのテスト
  - ソート機能のテスト
  - モーダルの開閉制御のテスト
  - フィルタクリア機能のテスト
  - _Requirements: 1.1, 1.2, 3.6, 6.1, 6.2_

- [ ]* 8.5 E2Eテストを更新
  - フィルタリングフローのテスト
  - 詳細表示フローのテスト
  - アクセシビリティテスト（キーボード操作、スクリーンリーダー）
  - _Requirements: 3.2, 3.6, 4.1, 5.1, 5.3, 5.4, 5.5, 5.6_
