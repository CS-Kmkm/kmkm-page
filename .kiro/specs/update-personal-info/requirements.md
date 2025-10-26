# 要件定義書

## はじめに

このドキュメントは、個人ポートフォリオサイトのダミーデータを実際のユーザー情報に更新する機能の要件を定義します。現在、サンプルプログラムには「山田太郎」という架空の人物の情報が含まれており、これを実際のユーザーの情報に置き換える必要があります。

## 用語集

- **System**: 個人ポートフォリオサイトのデータ更新システム
- **User**: サイトの所有者（実際の情報を提供する人）
- **Profile Data**: プロフィール情報（名前、所属、役職、SNSリンクなど）
- **Career Data**: 経歴情報（学歴、職歴）
- **Publication Data**: 研究業績・論文情報
- **Tech Experience Data**: 技術スキルとプロジェクト情報
- **Updates Data**: 最新情報・お知らせ
- **JSON File**: データを格納するJSONフォーマットのファイル

## 要件

### 要件1: プロフィール情報の更新

**ユーザーストーリー:** サイト所有者として、自分の基本プロフィール情報（名前、所属、役職、自己紹介、SNSリンク）をサイトに表示したい

#### 受入基準

1. WHEN Userがプロフィール情報を提供する、THEN THE System SHALL profile.jsonファイルを更新する
2. THE System SHALL 名前（日本語表記と読み仮名）を記録する
3. THE System SHALL 現在の所属組織と役職を記録する
4. THE System SHALL 自己紹介文を記録する
5. THE System SHALL 所在地情報を記録する
6. THE System SHALL SNSリンク（Twitter、GitHub、LinkedIn、ORCID、メール、Webサイト）を記録する

### 要件2: 経歴情報の更新

**ユーザーストーリー:** サイト所有者として、自分の学歴・職歴をページ順に整理して表示したい

#### 受入基準

1. WHEN Userが経歴情報を提供する、THEN THE System SHALL career.jsonファイルを更新する
2. THE System SHALL 各経歴エントリーに一意のIDを割り当てる
3. THE System SHALL 各経歴について年度、組織名、役職、説明、開始日、終了日を記録する
4. THE System SHALL 経歴を新しいものから古いものへと時系列順に並べる
5. WHERE 現在進行中の役職がある場合、THE System SHALL 終了日をnullとして記録する

### 要件3: 研究業績・論文情報の更新

**ユーザーストーリー:** サイト所有者として、自分の研究業績や論文をカテゴリ別に表示したい

#### 受入基準

1. WHEN Userが論文情報を提供する、THEN THE System SHALL publications.jsonファイルを更新する
2. THE System SHALL 各論文に一意のIDを割り当てる
3. THE System SHALL 論文のタイトル、著者リスト、発表先、発表年を記録する
4. THE System SHALL 第一著者かどうかのフラグを記録する
5. THE System SHALL 査読付きかどうかのフラグを記録する
6. THE System SHALL 論文種別（学会発表、ジャーナル、ワークショップ、プレプリント）を記録する
7. WHERE DOIが存在する場合、THE System SHALL DOI情報を記録する

### 要件4: 技術スキルとプロジェクト情報の更新

**ユーザーストーリー:** サイト所有者として、自分の技術スキルと関連プロジェクトを体系的に表示したい

#### 受入基準

1. WHEN Userが技術情報を提供する、THEN THE System SHALL tech-experience.jsonファイルを更新する
2. THE System SHALL 各技術に一意のIDを割り当てる
3. THE System SHALL 技術名、カテゴリ（言語、フレームワーク、データベース、ツール）、習熟度、経験年数を記録する
4. THE System SHALL 各技術に関連するプロジェクトIDのリストを記録する
5. THE System SHALL 各プロジェクトに一意のIDを割り当てる
6. THE System SHALL プロジェクト名、説明、使用技術、期間、役割を記録する
7. WHERE プロジェクトのURLやGitHubリポジトリが存在する場合、THE System SHALL それらを記録する

### 要件5: 最新情報の更新

**ユーザーストーリー:** サイト所有者として、最近の活動や成果を時系列で表示したい

#### 受入基準

1. WHEN Userが最新情報を提供する、THEN THE System SHALL updates.jsonファイルを更新する
2. THE System SHALL 各更新に一意のIDを割り当てる
3. THE System SHALL 日付、タイトル、説明、カテゴリ（開発、論文、経歴、その他）を記録する
4. THE System SHALL 更新を新しいものから古いものへと時系列順に並べる

### 要件6: データ整合性の保持

**ユーザーストーリー:** システム管理者として、更新されたデータが正しい形式で保存され、アプリケーションが正常に動作することを確認したい

#### 受入基準

1. THE System SHALL 各JSONファイルが有効なJSON形式であることを検証する
2. THE System SHALL 必須フィールドがすべて存在することを検証する
3. THE System SHALL 技術とプロジェクト間の参照整合性を検証する
4. THE System SHALL 日付フィールドが有効な日付形式（YYYY-MM-DD）であることを検証する
5. THE System SHALL URLフィールドが有効なURL形式であることを検証する

### 要件7: 段階的な更新プロセス

**ユーザーストーリー:** サイト所有者として、情報を段階的に更新し、各ステップで内容を確認したい

#### 受入基準

1. THE System SHALL ページ順（プロフィール→経歴→論文→技術→最新情報）に更新を進める
2. WHEN 各ファイルの更新が完了する、THEN THE System SHALL Userに確認を求める
3. THE System SHALL 更新前のデータをバックアップとして保持する
4. WHERE Userが変更を承認しない場合、THE System SHALL 前の状態に戻すことができる
