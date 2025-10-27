# Requirements Document

## Introduction

このドキュメントは、GitHubのブランチ表示のような視覚的な経歴タイムラインシステムの要件を定義します。ユーザーの人生を「main」ブランチとして表現し、学校や組織への所属を分岐・マージとして視覚化することで、経歴の流れをより直感的に理解できるようにします。

## Glossary

- **System**: Git-Style Career Timeline System（経歴タイムライン表示システム）
- **Main Branch**: ユーザーの人生の主軸となるタイムライン
- **Career Branch**: 学校や組織への所属を表すブランチ
- **Branch Point**: ブランチが分岐する地点（入学・入社など）
- **Merge Point**: ブランチがmainに統合される地点（卒業・退職など）
- **Sub-branch**: 既存のブランチから更に分岐するブランチ（研究室配属など）
- **Career Entry**: 経歴データの1つのエントリー
- **Timeline Visualization**: ブランチ構造を視覚的に表現するコンポーネント
- **Branch Color**: 各ブランチを識別するための固有の色

## Requirements

### Requirement 1

**User Story:** ユーザーとして、自分の経歴をGitのブランチのように視覚的に表示したい。これにより、人生の流れと各所属の関係性を直感的に理解できるようにする。

#### Acceptance Criteria

1. WHEN ユーザーが経歴ページにアクセスしたとき、THE System SHALL 経歴データをGitブランチスタイルのタイムラインとして表示する
2. THE System SHALL mainブランチをユーザーの人生の主軸として縦方向に表示する
3. THE System SHALL 各経歴エントリーを適切なブランチとして表示する
4. THE System SHALL ブランチの分岐とマージを視覚的に表現する線を描画する
5. THE System SHALL 時系列を上から下への縦方向のみで表現する

### Requirement 2

**User Story:** ユーザーとして、学校や組織への入学・入社時にブランチが分岐し、卒業・退職時にmainにマージされる様子を見たい。これにより、各所属期間を明確に把握できるようにする。

#### Acceptance Criteria

1. WHEN 新しい組織への所属が開始されるとき、THE System SHALL mainブランチから新しいCareer Branchを分岐させる
2. WHEN 組織からの所属が終了するとき、THE System SHALL Career BranchをMain Branchにマージする表現を行う
3. THE System SHALL Branch Pointに開始日を表示する
4. THE System SHALL Merge Pointに終了日を表示する
5. WHERE 所属が現在も継続中である場合、THE System SHALL マージポイントを表示せず、ブランチを継続中として表現する

### Requirement 3

**User Story:** ユーザーとして、研究室配属のような所属内での変更を既存ブランチからの分岐として表示したい。これにより、組織内での役割変化を階層的に理解できるようにする。

#### Acceptance Criteria

1. WHEN 既存の所属内で役割が変更されるとき、THE System SHALL 既存のCareer Branchから新しいSub-branchを分岐させる
2. THE System SHALL Sub-branchを既存のCareer Branchから視覚的に分岐した位置に配置する
3. THE System SHALL Sub-branchの親ブランチとの関係性を線で表現する
4. THE System SHALL Sub-branchの終了時に親ブランチまたはMain Branchへのマージを表現する
5. THE System SHALL 最大3階層までのブランチ構造をサポートする

### Requirement 4

**User Story:** ユーザーとして、各ブランチに組織名、役職、期間などの詳細情報を表示したい。これにより、タイムラインを見るだけで経歴の詳細を把握できるようにする。

#### Acceptance Criteria

1. THE System SHALL 各経歴エントリーをブランチライン上に点（ノード）として配置する
2. THE System SHALL ノードの横に組織名を表示する
3. THE System SHALL ノードの横に役職または役割を表示する
4. THE System SHALL ノードの横に開始日と終了日を表示する
5. WHERE Career Entryに説明文が存在する場合、THE System SHALL その説明文をノードの横に表示する
6. THE System SHALL テキストが長い場合でも読みやすいレイアウトを維持する

### Requirement 5

**User Story:** ユーザーとして、モバイルデバイスでも経歴タイムラインを快適に閲覧したい。これにより、どのデバイスからでも自分の経歴を確認できるようにする。

#### Acceptance Criteria

1. THE System SHALL 画面幅が768ピクセル未満のとき、タイムラインの横幅を画面に合わせて最適化する
2. THE System SHALL すべての画面サイズで縦方向レイアウトを使用する
3. THE System SHALL モバイル表示時にブランチ構造を簡略化せず、完全な情報を表示する
4. THE System SHALL タッチ操作に適したサイズのインタラクティブ要素を提供する
5. THE System SHALL 小さい画面でもテキストの可読性を維持する

### Requirement 6

**User Story:** ユーザーとして、経歴データを構造化されたJSON形式で管理したい。これにより、ブランチの親子関係を明確に定義し、システムが正しくタイムラインを生成できるようにする。

#### Acceptance Criteria

1. THE System SHALL 各Career Entryに一意のIDを持たせる
2. THE System SHALL 各Career Entryに親エントリーのIDを参照するフィールドを持たせる
3. WHERE Career Entryが親を持たない場合、THE System SHALL そのエントリーをMain Branchから分岐するものとして扱う
4. THE System SHALL 開始日と終了日をISO 8601形式で保存する
5. THE System SHALL 循環参照や不正な親子関係を検出してエラーを報告する

### Requirement 7

**User Story:** ユーザーとして、アクセシビリティに配慮されたタイムラインを利用したい。これにより、スクリーンリーダーを使用するユーザーも経歴情報を理解できるようにする。

#### Acceptance Criteria

1. THE System SHALL 適切なARIAラベルをタイムライン要素に付与する
2. THE System SHALL キーボードナビゲーションをサポートする
3. THE System SHALL スクリーンリーダー向けに経歴の構造を説明するテキストを提供する
4. THE System SHALL 色だけに依存しない視覚的な区別を提供する
5. THE System SHALL WCAG 2.1 Level AAの基準を満たす

### Requirement 8

**User Story:** ユーザーとして、タイムラインのアニメーションやインタラクションを楽しみたい。これにより、より魅力的で理解しやすい経歴表示を実現する。

#### Acceptance Criteria

1. WHEN ページが読み込まれるとき、THE System SHALL タイムラインを段階的にアニメーション表示する
2. WHEN ユーザーがブランチにホバーまたはフォーカスしたとき、THE System SHALL そのブランチを強調表示する
3. THE System SHALL アニメーションの持続時間を300ミリ秒から600ミリ秒の範囲に制限する
4. WHERE ユーザーがモーション削減を設定している場合、THE System SHALL アニメーションを無効化する
5. THE System SHALL パフォーマンスを維持するため、60FPSでアニメーションを実行する

### Requirement 9

**User Story:** ユーザーとして、各ブランチが異なる色で表示されることで、複数のブランチを視覚的に区別したい。これにより、タイムライン上の各所属を一目で識別できるようにする。

#### Acceptance Criteria

1. WHEN 新しいブランチが作成されるとき、THE System SHALL そのブランチに固有のBranch Colorを割り当てる
2. THE System SHALL 各ブランチの線、ノード、背景に割り当てられたBranch Colorを適用する
3. THE System SHALL 最低8種類の異なるBranch Colorを用意する
4. THE System SHALL Branch Colorが重複する場合でも、隣接するブランチが同じ色にならないように配置する
5. THE System SHALL すべてのBranch Colorが十分なコントラスト比を持ち、アクセシビリティ基準を満たす

### Requirement 10

**User Story:** ユーザーとして、各経歴の説明文を組織名・役職・期間と同じ場所（ノードの右側）に表示したい。これにより、すべての経歴情報を一箇所で確認できるようにする。

#### Acceptance Criteria

1. WHERE Career Entryに説明文が存在する場合、THE System SHALL その説明文をノードの右側に配置する
2. THE System SHALL 説明文を組織名・役職・期間の下（4行目）に配置する
3. THE System SHALL 説明文と期間の間に適切な余白を設ける
4. THE System SHALL 説明文のフォントサイズと色を読みやすく設定する
5. THE System SHALL 説明文が長い場合でも、レイアウトが崩れないように配置する

### Requirement 11

**User Story:** ユーザーとして、ブランチの分岐点とマージ点がmainブランチ上の実際の年数と一致することを望む。これにより、時間の経過を正確に視覚化し、各所属の開始・終了タイミングを直感的に理解できるようにする。

#### Acceptance Criteria

1. THE System SHALL mainブランチに年数の目盛りを表示する
2. THE System SHALL 各経歴エントリーの開始日に対応するmainブランチ上のY座標を、実際の年数に基づいて計算する
3. THE System SHALL 各経歴エントリーの終了日に対応するmainブランチ上のY座標を、実際の年数に基づいて計算する
4. THE System SHALL ブランチの分岐点を、開始日に対応するmainブランチのY座標に配置する
5. THE System SHALL ブランチのマージ点を、終了日に対応するmainブランチのY座標に配置する
6. THE System SHALL 1年あたりの縦方向のピクセル数を一定に保つ
7. THE System SHALL 所属期間が長い経歴ほど、ブランチの縦方向の長さを長く表示する
