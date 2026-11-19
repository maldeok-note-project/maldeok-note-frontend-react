# 📝말덕노트（Maldeok Note）- Frontend

> 韓国語の表現を「誰が・いつ・どこで使ったか」と一緒に集める、トレカ風コレクション型学習アプリの画面（フロントエンド）

- 🌐 公開アプリ：https://maldeok-note.vercel.app
- ⚙️ バックエンドAPI：[maldeok-note-project/maldeok-note-backend-laravel](https://github.com/maldeok-note-project/maldeok-note-backend-laravel)（Laravel 12）

---

## 📖 プロジェクト概要

韓国語を学ぶ中で「推しや友達が実際に使っていた表現を、思い出ごと残したい」という課題から生まれたアプリです。

表現は、**誰が言ったか（話者カテゴリ）**ごとに色分けされた**トレカ風のカード**として並びます。お気に入りやバッジで、集める楽しさも取り入れています。

企画・設計・バックエンド・フロントエンド・デプロイまで、一人で担当しています。

---

## ⚙️ 技術スタック

| 項目 | 内容 |
|------|------|
| UI | React 19 |
| ビルド | Vite |
| ルーティング | React Router |
| API通信 | axios（共通の `apiClient`） |
| デザイン | Bootstrap + 独自CSS（ピンクのテーマ） |
| 公開先 | Vercel |

---

## 🗂 主な機能

- **認証** - 会員登録 / ログイン / ログアウト。未ログインで要ログインページを開くと、ログイン画面へ移動
- **表現の記録** - 登録・一覧・詳細・編集・削除
- **話者カテゴリ** - 「友達」「推し」「先生」などを自由に作成・編集・削除
- **お気に入り** - ON/OFFの切り替えと、お気に入りだけの一覧
- **検索・絞り込み・並び替え** - キーワード検索、カテゴリで絞り込み、登録日・聞いた日で並び替え
- **バッジ** - 登録数に応じて解放されたバッジを一覧で表示
- **レスポンシブ** - スマホではハンバーガーメニューに切り替え

---

## 🖥 画面とURL

| URL | 画面 | ログイン |
|-----|------|----------|
| `/` | トップ | 不要 |
| `/register` | 会員登録 | 不要 |
| `/login` | ログイン | 不要 |
| `/expressions` | 表現の一覧（検索・絞り込み・並び替え） | 必要 |
| `/expressions/create` | 表現の登録 | 必要 |
| `/expressions/:id` | 表現の詳細 | 必要 |
| `/expressions/:id/edit` | 表現の編集 | 必要 |
| `/categories` | 話者カテゴリの一覧 | 必要 |
| `/categories/create` | 話者カテゴリの作成 | 必要 |
| `/categories/:id/edit` | 話者カテゴリの編集 | 必要 |
| `/favorites` | お気に入りの一覧 | 必要 |
| `/badges` | バッジの一覧 | 必要 |

---

## 🎨 デザインのこだわり

- **トレカ風カード** - 表現を1枚のカードとして表示（`ExpressionCard`）。一覧とお気に入りで同じ部品を共有
- **カテゴリごとの自動配色** - カテゴリは利用者が自由に増やせるため、**カテゴリIDから8色のパステル配色を自動で決定**（ID 9 は、また1番の色に戻る）
- **カテゴリ名はカードの上部にタグで表示**
- **ピンクのテーマ** - `#FF6FA5`（メイン）、`#FFE3ED`（淡い色）、`#2E2A2A`（文字・ダーク）
- **見出しはCookieRunフォント**

---

## 🏗 構成

```
src/
├── api/
│   ├── client.js            # axiosの共通設定（JWTを自動でヘッダーに付ける）
│   ├── auth.js              # 認証のAPI呼び出し
│   └── expressionActions.js # お気に入りなど、表現まわりの共通API
├── components/
│   ├── AuthGuard.jsx        # 未ログインの人をログイン画面へ戻す
│   ├── Header.jsx           # ログイン後のメニュー
│   ├── ExpressionCard.jsx   # トレカ風カード
│   ├── ExpressionForm.jsx   # 登録・編集で共有するフォーム
│   ├── BadgeCard.jsx        # バッジの表示
│   └── ConfirmModal.jsx     # 削除前の確認画面
├── pages/                   # 各画面
├── utils/
│   └── cardColor.js         # カテゴリIDからカードの色を決める
└── App.jsx                  # URLと画面の対応
```

### 工夫した点

- **JWTは `apiClient` で一括管理** - ログイン時に保存したトークンを、リクエストごとに自動で付ける。各画面で個別に書かない
- **`AuthGuard` で要ログインページを守る** - トークンがなければログイン画面へ
- **登録・編集でフォームを共通化** - `ExpressionForm` を1つにまとめて、重複を防ぐ
- **確認画面を自作（`ConfirmModal`）** - 一部のiPhone（iOS Safari）では標準の `confirm` が動かなかったため、自作の確認画面に置き換えた

---

## 🚀 ローカル環境セットアップ

### 前提条件

- Node.js（LTS版）がインストール済みであること
- バックエンドAPIが起動していること（[バックエンドのREADME](https://github.com/maldeok-note-project/maldeok-note-backend-laravel) を参照）

### 手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/maldeok-note-project/maldeok-note-frontend-react.git
cd maldeok-note-frontend-react

# 2. 依存パッケージをインストール
npm install

# 3. 環境変数ファイルを作成（接続先のAPIを指定）
echo "VITE_API_BASE_URL=http://localhost/api" > .env

# 4. 開発サーバーを起動
npm run dev
```

起動後、表示されたURL（通常は `http://localhost:5173`）をブラウザで開きます。

### 環境変数

| 名前 | 説明 | 例 |
|------|------|----|
| `VITE_API_BASE_URL` | バックエンドAPIのURL（末尾は `/api`） | `http://localhost/api` |

### コマンド

| コマンド | 内容 |
|----------|------|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用にビルド |
| `npm run preview` | ビルド結果を確認 |
| `npm run lint` | コードの書き方をチェック |

---

## ☁️ デプロイ

| 項目 | 内容 |
|------|------|
| 公開先 | Vercel（Vite を自動で認識） |
| 環境変数 | `VITE_API_BASE_URL` にバックエンド（Azure）のURL（`/api`）を設定 |
| 画面の更新 | `vercel.json` の rewrite 設定で、どの画面URLでも再読み込みできる |

---

## 🔭 今後の予定

- **PWA化** - ホーム画面に追加して、アプリのように使えるようにする
- **トークン期限切れ（401）の処理** - 期限が切れたら、自動でログイン画面へ戻す
- **公開範囲の見直し** - バックエンドのCORSを、このフロントエンドのURLだけに絞る

---

## 📁 ブランチ戦略

`main` ← `develop` ← `feature/xxx`

1機能 = 1ブランチで開発し、PRでマージします。

---

## 📝 ライセンス

このプロジェクトはポートフォリオ目的で開発されています。
