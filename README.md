# 関造園 Webサイト

Hugoで構築された関造園のWebサイトです。

## 開発環境のセットアップ

### 必要なツール

- Hugo Extended v0.139.3以上
- Git

### ローカルでの実行

```bash
# 開発サーバーの起動
hugo server -D

# ブラウザで http://localhost:1313/ にアクセス
```

### ビルド

```bash
# 本番用ビルド
hugo --gc --minify
```

## GitHub Pagesへのデプロイ

このサイトはGitHub Actionsを使用して自動的にデプロイされます。

### 初回セットアップ手順

1. **GitHubリポジトリの設定**
   - リポジトリの Settings > Pages に移動
   - Source を「GitHub Actions」に変更

2. **カスタムドメインの設定（任意）**
   - `sekizouen.com`を使用する場合
   - Settings > Pages > Custom domain に `sekizouen.com` を入力
   - DNSレコードの設定:
     ```
     A レコード:
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153

     CNAME レコード:
     www.sekizouen.com → [GitHubユーザー名].github.io
     ```

3. **自動デプロイ**
   - `main`ブランチへのpush時に自動的にビルド・デプロイされます
   - Actions タブでデプロイ状況を確認できます

### 手動デプロイ

GitHubリポジトリの「Actions」タブから「Deploy Hugo site to GitHub Pages」を選択し、「Run workflow」ボタンで手動実行できます。

## ディレクトリ構成

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actionsの設定
├── content/                 # コンテンツファイル
│   ├── about.md            # 会社概要
│   ├── news/               # お知らせ
│   └── works/              # 施工事例
├── data/
│   └── company.yaml        # 会社情報データ
├── layouts/                # テンプレートファイル
│   ├── _default/
│   ├── partials/
│   ├── shortcodes/         # 再利用可能なコンポーネント
│   ├── 404.html           # 404エラーページ
│   └── index.html         # トップページ
├── static/                 # 静的ファイル
│   ├── css/
│   ├── js/
│   └── images/
├── public/                 # ビルド出力（.gitignoreで除外）
└── hugo.toml              # Hugo設定ファイル
```

## 404ページ

GitHub Pagesでは、存在しないURLにアクセスした際に自動的に`404.html`が表示されます。

このサイトでは`layouts/404.html`で404ページを定義しており、ビルド時に`public/404.html`が生成されます。

## カスタムコンポーネント（Shortcodes）

再利用可能なコンポーネントを`layouts/shortcodes/`に定義しています：

- `greeting-card.html` - 代表挨拶カード
- `company-card.html` - 会社情報カード
- `services-cards.html` - 事業内容カード
- `area-card.html` - 対応エリアカード

使用例:
```markdown
{{< greeting-card >}}
挨拶文の内容...
{{< /greeting-card >}}
```

## トラブルシューティング

### GitHub Actionsのビルドが失敗する場合

1. Actions タブでエラーログを確認
2. Hugoのバージョンが正しいか確認（`.github/workflows/deploy.yml`）
3. `hugo.toml`の設定が正しいか確認

### 404ページが表示されない場合

- GitHub Pagesの設定が「GitHub Actions」になっているか確認
- `public/404.html`が正しく生成されているか確認（ローカルビルドで確認）

### CSSが適用されない場合

- `hugo.toml`の`baseURL`が正しく設定されているか確認
- カスタムドメイン使用時は、ドメイン名を正しく設定

## ライセンス

© 2016-2026 関造園. All rights reserved.
