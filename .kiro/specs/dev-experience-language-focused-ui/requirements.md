# 要件定義書

## はじめに

DevExperienceページを言語中心のUIに変更し、ユーザーが言語アイコンから段階的に詳細情報にアクセスできるようにする。現在のフィルター・ソート機能を持つグリッド表示から、よりインタラクティブな3段階の情報表示に変更する。

## 用語集

- **System**: DevExperienceページのUIシステム
- **User**: Webサイトの閲覧者
- **Language Icon**: プログラミング言語のロゴアイコン
- **Language Detail View**: 言語の経験年数、説明、プロジェクトリストを表示するビュー
- **Project Detail Modal**: プロジェクトの詳細情報を表示するモーダル
- **Tech Item**: 技術スタック項目（言語、フレームワーク、ツール、データベース）
- **Language Category**: カテゴリーが"language"のTech Item

## 要件

### 要件1: 言語アイコンの初期表示

**ユーザーストーリー:** Webサイト閲覧者として、DevExperienceページにアクセスしたときに、プログラミング言語のアイコンのみが表示されることで、視覚的にシンプルで分かりやすいインターフェースを利用したい

#### 受入基準

1. WHEN THE User がDevExperienceページを開く, THE System SHALL カテゴリーが"language"のTech Itemのアイコンのみを表示する
2. THE System SHALL 各言語アイコンを熟練度順（expert > advanced > intermediate > beginner）にソートして表示する
3. WHILE 同じ熟練度の言語が複数存在する, THE System SHALL 経験年数の降順でソートする
4. THE System SHALL 各言語アイコンをクリック可能な状態で表示する
5. THE System SHALL レスポンシブデザインを適用し、画面サイズに応じてアイコンのグリッドレイアウトを調整する

### 要件2: 言語詳細ビューの表示

**ユーザーストーリー:** Webサイト閲覧者として、言語アイコンをクリックしたときに、その言語の経験年数、説明、関連プロジェクトのリストが表示されることで、その言語に関する概要情報を把握したい

#### 受入基準

1. WHEN THE User が言語アイコンをクリックする, THE System SHALL その言語の詳細ビューを表示する
2. THE System SHALL 詳細ビューに言語名、ロゴ、熟練度レベル、経験年数を表示する
3. THE System SHALL 詳細ビューに言語の説明文を表示する
4. THE System SHALL 詳細ビューにその言語を使用したプロジェクトのリストを表示する
5. THE System SHALL 各プロジェクトリストアイテムにプロジェクト名、期間、役割を表示する
6. THE System SHALL プロジェクトリストアイテムをクリック可能な状態で表示する
7. THE System SHALL 詳細ビューに戻るボタンまたは閉じるボタンを表示する

### 要件3: プロジェクト詳細モーダルの表示

**ユーザーストーリー:** Webサイト閲覧者として、プロジェクトリストアイテムをクリックしたときに、そのプロジェクトの詳細情報がモーダルで表示されることで、具体的な開発経験の内容を理解したい

#### 受入基準

1. WHEN THE User がプロジェクトリストアイテムをクリックする, THE System SHALL そのプロジェクトの詳細モーダルを表示する
2. THE System SHALL モーダルにプロジェクト名、説明、期間、役割を表示する
3. THE System SHALL モーダルにプロジェクトで使用した技術のリストを表示する
4. WHERE プロジェクトにGitHubリンクが存在する, THE System SHALL GitHubリンクを表示する
5. WHERE プロジェクトにURLが存在する, THE System SHALL URLリンクを表示する
6. THE System SHALL モーダルを閉じるボタンを表示する
7. WHEN THE User がモーダル外をクリックする, THE System SHALL モーダルを閉じる
8. WHEN THE User がESCキーを押下する, THE System SHALL モーダルを閉じる

### 要件4: ナビゲーションとアクセシビリティ

**ユーザーストーリー:** Webサイト閲覧者として、キーボード操作やスクリーンリーダーでも快適に操作できることで、アクセシビリティの高いインターフェースを利用したい

#### 受入基準

1. THE System SHALL すべてのインタラクティブ要素にキーボードフォーカスを適用する
2. THE System SHALL 適切なARIAラベルとロールを各要素に設定する
3. THE System SHALL フォーカス可能な要素に視覚的なフォーカスインジケーターを表示する
4. THE System SHALL セマンティックHTMLを使用してコンテンツ構造を定義する
5. WHEN THE User がTabキーを押下する, THE System SHALL 論理的な順序でフォーカスを移動する

### 要件5: パフォーマンスとユーザーエクスペリエンス

**ユーザーストーリー:** Webサイト閲覧者として、ページ遷移やモーダル表示が滑らかに動作することで、快適な閲覧体験を得たい

#### 受入基準

1. THE System SHALL ビュー切り替え時にスムーズなトランジションアニメーションを適用する
2. THE System SHALL モーダル表示時にフェードインアニメーションを適用する
3. THE System SHALL 画像の遅延読み込みを実装する
4. THE System SHALL 初期ページロード時間を3秒以内に保つ
5. THE System SHALL インタラクション応答時間を100ミリ秒以内に保つ
