# Requirements Document

## Introduction

このドキュメントは、既存のGit-Style Career Timelineに対して、メインブランチ上にインタラクティブなイベントポイントを追加し、モーダル機能を実装する要件を定義します。各イベントをクリックすることで詳細情報を表示し、同一年に複数のイベントがある場合はリスト表示してから個別の詳細を表示する機能を提供します。

## Glossary

- **System**: Git Timeline Interactive Events System（Gitタイムラインインタラクティブイベントシステム）
- **Event Point**: メインブランチ上に表示されるクリック可能なイベントポイント
- **Event Modal**: イベントの詳細情報を表示するモーダルダイアログ
- **Event List Modal**: 同一年に複数のイベントがある場合に表示されるイベントリストモーダル
- **Event Detail Modal**: 個別のイベントの詳細情報を表示するモーダル
- **Main Branch**: 既存のGitタイムラインのメインブランチ
- **Event Data**: イベントの情報を含むデータ構造
- **Year Group**: 同一年にグループ化されたイベントのコレクション

## Requirements

### Requirement 1

**User Story:** ユーザーとして、メインブランチ上にイベントポイントを表示したい。これにより、経歴の流れの中で重要なイベントを視覚的に識別できるようにする。

#### Acceptance Criteria

1. THE System SHALL メインブランチ上の適切な年の位置にEvent Pointを配置する
2. THE System SHALL Event Pointを他の要素と区別できる視覚的なスタイルで表示する
3. THE System SHALL Event Pointにホバー効果を適用する
4. THE System SHALL Event Pointをクリック可能な要素として実装する
5. THE System SHALL Event Pointの位置を実際の年数に基づいて正確に計算する

### Requirement 2

**User Story:** ユーザーとして、イベントポイントをクリックしたときにモーダルが表示されることを望む。これにより、イベントの詳細情報を確認できるようにする。

#### Acceptance Criteria

1. WHEN ユーザーがEvent Pointをクリックしたとき、THE System SHALL Event Modalを表示する
2. THE System SHALL Event Modalの背景にオーバーレイを表示する
3. THE System SHALL Event Modalを画面中央に配置する
4. THE System SHALL Event Modalにクローズボタンを提供する
5. WHEN ユーザーがオーバーレイまたはクローズボタンをクリックしたとき、THE System SHALL Event Modalを閉じる

### Requirement 3

**User Story:** ユーザーとして、同一年に複数のイベントがある場合は、まずイベントリストを表示してから個別の詳細を確認したい。これにより、年内のすべてのイベントを把握してから詳細を選択できるようにする。

#### Acceptance Criteria

1. WHERE 同一年に複数のEvent Dataが存在する場合、THE System SHALL Event List Modalを表示する
2. THE System SHALL Event List Modal内でイベントを時系列順に表示する
3. THE System SHALL Event List Modal内の各イベントをクリック可能にする
4. WHEN ユーザーがEvent List Modal内のイベントをクリックしたとき、THE System SHALL Event Detail Modalを表示する
5. THE System SHALL Event List ModalからEvent Detail Modalへの遷移を管理する

### Requirement 4

**User Story:** ユーザーとして、イベントの詳細情報を見やすい形式で表示したい。これにより、イベントの内容を理解しやすくする。

#### Acceptance Criteria

1. THE System SHALL Event Detail Modalにイベントのタイトルを表示する
2. THE System SHALL Event Detail Modalにイベントの日付を表示する
3. THE System SHALL Event Detail Modalにイベントの説明文を表示する
4. WHERE イベントにカテゴリが設定されている場合、THE System SHALL カテゴリを表示する
5. THE System SHALL Event Detail Modalの内容を読みやすいレイアウトで配置する

### Requirement 5

**User Story:** ユーザーとして、モーダルをキーボードで操作したい。これにより、アクセシビリティを確保し、すべてのユーザーが機能を利用できるようにする。

#### Acceptance Criteria

1. THE System SHALL Escapeキーでモーダルを閉じる機能を提供する
2. THE System SHALL モーダル内でTabキーによるフォーカス移動をサポートする
3. THE System SHALL モーダル内にフォーカストラップを実装する
4. THE System SHALL モーダルが開いたときに適切な要素にフォーカスを設定する
5. THE System SHALL スクリーンリーダー向けのARIA属性を設定する

### Requirement 6

**User Story:** ユーザーとして、イベントデータを構造化されたJSON形式で管理したい。これにより、イベント情報を効率的に保存・取得できるようにする。

#### Acceptance Criteria

1. THE System SHALL 各Event Dataに一意のIDを持たせる
2. THE System SHALL Event Dataにタイトル、日付、説明文、カテゴリのフィールドを含める
3. THE System SHALL Event Dataの日付をISO 8601形式で保存する
4. THE System SHALL Event Dataの妥当性を検証する機能を提供する
5. THE System SHALL 不正なEvent Dataに対してエラーメッセージを表示する

### Requirement 7

**User Story:** ユーザーとして、モバイルデバイスでもイベントモーダルを快適に利用したい。これにより、どのデバイスからでもイベント詳細を確認できるようにする。

#### Acceptance Criteria

1. THE System SHALL 画面幅が768ピクセル未満のとき、モーダルを画面幅に合わせて最適化する
2. THE System SHALL モバイル表示時にモーダルの余白を適切に調整する
3. THE System SHALL タッチ操作に適したサイズのボタンを提供する
4. THE System SHALL モバイルでのスクロール動作を適切に処理する
5. THE System SHALL 小さい画面でもテキストの可読性を維持する

### Requirement 8

**User Story:** ユーザーとして、モーダルの表示・非表示にスムーズなアニメーションを適用したい。これにより、より良いユーザーエクスペリエンスを提供する。

#### Acceptance Criteria

1. THE System SHALL モーダルの表示時にフェードインアニメーションを適用する
2. THE System SHALL モーダルの非表示時にフェードアウトアニメーションを適用する
3. THE System SHALL アニメーションの持続時間を200ミリ秒から400ミリ秒の範囲に設定する
4. WHERE ユーザーがモーション削減を設定している場合、THE System SHALL アニメーションを無効化する
5. THE System SHALL アニメーション中のユーザー操作を適切に処理する

### Requirement 9

**User Story:** ユーザーとして、イベントポイントが既存のGitタイムラインと調和したデザインで表示されることを望む。これにより、一貫性のあるユーザーインターフェースを提供する。

#### Acceptance Criteria

1. THE System SHALL Event Pointの色を既存のタイムラインの色パレットと調和させる
2. THE System SHALL Event Pointのサイズを既存のノードと区別できるように設定する
3. THE System SHALL Event Pointのスタイルを既存のデザインシステムに合わせる
4. THE System SHALL Event Pointのホバー効果を既存の要素と一貫性を保つ
5. THE System SHALL Event Pointの配置が既存のレイアウトを妨げないようにする

### Requirement 10

**User Story:** ユーザーとして、イベントリストモーダル内でイベントが時系列順に整理されていることを確認したい。これにより、年内のイベントの順序を正確に把握できるようにする。

#### Acceptance Criteria

1. THE System SHALL Event List Modal内でイベントを日付の昇順で表示する
2. THE System SHALL 各イベントエントリーに日付を表示する
3. THE System SHALL 各イベントエントリーにタイトルを表示する
4. THE System SHALL 同じ日付のイベントがある場合、追加の並び順基準を適用する
5. THE System SHALL Event List Modal内の各エントリーを視覚的に区別できるようにする