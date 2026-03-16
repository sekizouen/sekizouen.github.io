# 株式会社 関造園 Webサイト

Hugoで構築された株式会社 関造園のWebサイトです。

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

## GitHub Pagesへのデプロイ（Organization使用）

このサイトはGitHub Organizationを使用し、GitHub Actionsで自動的にデプロイされます。

### 初回セットアップ手順

#### 1. GitHub Organizationの作成

1. GitHubで新しいOrganizationを作成
   - 推奨Organization名: `sekizouen` または `seki-zouen`
   - https://github.com/organizations/plan で作成可能

2. 新しいリポジトリを作成
   - **推奨リポジトリ名**: `<organization名>.github.io`
     - 例: Organization名が`sekizouen`の場合 → `sekizouen.github.io`
     - この名前にすると`https://sekizouen.github.io/`でアクセス可能
   - それ以外の名前でも可能だが、`https://<org名>.github.io/<repo名>/`になる
   - リポジトリはPublicに設定

3. このコードをリポジトリにpush
   ```bash
   git remote add origin https://github.com/<organization名>/<リポジトリ名>.git
   git push -u origin main
   ```

#### 2. GitHub Pagesの有効化

1. リポジトリの **Settings** → **Pages** に移動
2. **Source** を **「GitHub Actions」** に変更
3. これで`main`ブランチへのpush時に自動デプロイされます

#### 3. カスタムドメインの設定

`sekizouen.com`を使用する場合:

1. **GitHub側の設定**
   - Settings > Pages > Custom domain に `sekizouen.com` を入力
   - 「Enforce HTTPS」にチェック（DNS設定後に有効化）

2. **DNS（ドメイン管理サービス）の設定**

   Apexドメイン（sekizouen.com）用:
   ```
   タイプ: A
   ホスト: @
   値:
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
   ```

   wwwサブドメイン用:
   ```
   タイプ: CNAME
   ホスト: www
   値: <organization名>.github.io
   ```

3. **DNS設定の確認**
   ```bash
   # Apexドメインの確認
   dig sekizouen.com +noall +answer

   # wwwサブドメインの確認
   dig www.sekizouen.com +noall +answer
   ```

4. **hugo.tomlのbaseURL確認**
   - カスタムドメイン使用時は`baseURL = 'https://sekizouen.com/'`（現在の設定）
   - GitHub Pages URLを使用する場合は`baseURL = 'https://<organization名>.github.io/'`に変更

5. **CNAMEファイルについて**
   - `static/CNAME`にカスタムドメイン（sekizouen.com）が記載されています
   - カスタムドメインを使わない場合は、このファイルを削除してください
   - カスタムドメインを変更する場合は、ファイル内容を編集してください

#### 4. 自動デプロイの動作確認

- `main`ブランチへのpush時に自動ビルド・デプロイ
- **Actions** タブでデプロイ状況を確認
- 初回デプロイは5-10分程度かかる場合があります

### 手動デプロイ

GitHubリポジトリの「Actions」タブから「Deploy Hugo site to GitHub Pages」を選択し、「Run workflow」ボタンで手動実行できます。

### アクセスURL

- カスタムドメイン使用: `https://sekizouen.com/`
- GitHub Pages URL: `https://<organization名>.github.io/`（リポジトリ名が`<org名>.github.io`の場合）

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
4. Organization設定で「Actions permissions」が有効になっているか確認
   - Organization > Settings > Actions > General
   - 「Allow all actions and reusable workflows」を選択

### 404ページが表示されない場合

- GitHub Pagesの設定が「GitHub Actions」になっているか確認
- `public/404.html`が正しく生成されているか確認（ローカルビルドで確認）
- デプロイ完了後、数分待ってからアクセス

### CSSが適用されない場合

- `hugo.toml`の`baseURL`が正しく設定されているか確認
- カスタムドメイン使用時は、ドメイン名を正しく設定
- GitHub Pages URLを使う場合:
  - `baseURL = 'https://<organization名>.github.io/'`
  - `static/CNAME`ファイルを削除

### カスタムドメインが機能しない場合

1. DNS設定が正しいか確認（dig コマンドで確認）
2. DNS設定の反映には最大48時間かかる場合があります
3. GitHubのSettings > Pagesで「DNS check successful」が表示されるか確認
4. `static/CNAME`ファイルが正しいドメイン名を含んでいるか確認
5. HTTPSの有効化は、DNS設定が完了してから数時間後に可能になります

## ライセンス

© 2016-2026 株式会社 関造園. All rights reserved.
