# 技術ロゴ画像の追加方法

このディレクトリには、DevExperienceページで使用する技術スタックのロゴ画像を配置します。

## ファイル命名規則

ファイル名は小文字とハイフンを使用してください：

- ✅ 良い例: `python.svg`, `typescript.svg`, `c-sharp.svg`, `next-js.svg`
- ❌ 悪い例: `Python.svg`, `TypeScript.svg`, `C#.svg`, `Next.js.svg`

## 現在必要なロゴファイル

### 言語 (Languages)
- `python.svg` - Python
- `typescript.svg` - TypeScript
- `javascript.svg` - JavaScript
- `cpp.svg` - C++
- `c-sharp.svg` - C#

### フレームワーク (Frameworks)
- `react.svg` - React
- `next-js.svg` - Next.js
- `fastapi.svg` - FastAPI
- `ruby-on-rails.svg` - Ruby on Rails

### ツール (Tools)
- `docker.svg` - Docker
- `github.svg` - GitHub
- `aws.svg` - AWS

### データベース (Databases)
- `mysql.svg` - MySQL
- `oracle.svg` - Oracle Database

## ロゴ画像の取得方法

### 1. 公式サイトから
各技術の公式サイトから、ブランドガイドラインに従ってロゴをダウンロードしてください。

### 2. Simple Icons
https://simpleicons.org/ から多くの技術ロゴのSVGファイルを取得できます。

### 3. DevIcon
https://devicon.dev/ からも技術ロゴを取得できます。

## 推奨仕様

- **形式**: SVG（ベクター形式）
- **サイズ**: 正方形（1:1の比率）
- **背景**: 透明
- **色**: オリジナルのブランドカラー

## ロゴ追加手順

1. ロゴファイルを取得
2. ファイル名を命名規則に従って変更
3. このディレクトリ（`public/images/tech-logos/`）に配置
4. ブラウザで確認

## 注意事項

- ロゴの使用は各技術のブランドガイドラインに従ってください
- 商用利用の場合は、ライセンスを確認してください
- ロゴを改変しないでください

## フォールバック

ロゴファイルが見つからない場合、カテゴリーに応じた絵文字アイコンが自動的に表示されます：

- 言語: 💻
- フレームワーク: 🔧
- ツール: ⚙️
- データベース: 🗄️
