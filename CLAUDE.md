# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

- プロジェクト名: real-estate-app
- 内容: Supabase 認証付きの不動産管理 Web アプリ
  - メールアドレス + パスワードでの会員登録・ログイン・ログアウト
  - ログイン後に物件一覧をカード形式で表示し、物件の登録・編集・削除ができる(Supabase の `properties` テーブル)
  - 物件は登録したユーザーにだけ見える(RLS で制御)
  - 未ログインで保護された画面を開くと、ログイン画面へリダイレクト

## 技術スタック

| 区分 | 使用技術 |
| --- | --- |
| UI ライブラリ | React 19(関数コンポーネント + Hooks) |
| ルーティング | React Router 7(`react-router-dom`) |
| 認証 | Supabase Auth(`@supabase/supabase-js`) |
| ビルドツール | Vite 8 |
| 言語 | JavaScript(JSX)。TypeScript は未導入 |
| スタイル | 素の CSS(`src/App.css`) |

### ディレクトリ構成

```
supabase/migrations/
└── 001_create_properties.sql   # properties テーブル・RLS ポリシーの作成
src/
├── main.jsx                    # Router と AuthProvider でアプリを包む
├── App.jsx                     # ルーティング定義
├── App.css                     # スタイル
├── lib/
│   ├── supabase.js             # Supabase クライアント(.env から接続情報を読む)
│   ├── authErrors.js           # 認証エラーを日本語メッセージに変換
│   └── propertiesApi.js        # 物件の CRUD と DB エラーの日本語変換
├── contexts/AuthContext.jsx    # ログイン状態の共有(AuthProvider / useAuth)
├── components/
│   ├── ProtectedRoute.jsx      # 未ログインなら /login へリダイレクト
│   ├── GuestRoute.jsx          # ログイン済みなら /properties へリダイレクト
│   └── PropertyForm.jsx        # 物件の新規登録・編集フォーム(共通)
└── pages/
    ├── LoginPage.jsx           # /login
    ├── SignUpPage.jsx          # /signup
    └── PropertyListPage.jsx    # /properties(要ログイン。一覧・登録・編集・削除)
```

## データベース(Supabase)

- `public.properties`: `id`(uuid)、`user_id`(登録者。初期値は `auth.uid()`)、`name`(物件名)、`rent`(家賃・円)、`area`(エリア名)、`layout`(間取り)、`created_at`、`updated_at`
- RLS を有効にしている。SELECT / INSERT / UPDATE / DELETE のどれも「`auth.uid() = user_id`」の行だけ許可する(ログインしたユーザーのみ)。
- スキーマを変えるときは、`supabase/migrations/` に連番の SQL ファイルを追加し、Supabase の SQL Editor で実行する。すでに実行した SQL ファイルは書き換えない。
- React からテーブルを操作するときは `src/lib/propertiesApi.js` を通す。絞り込みは RLS 任せで、フロント側だけでアクセス制御をしたつもりにならない。

## コーディング規約

- コメント・画面の文言・エラーメッセージは日本語で書く。
- コンポーネント名とファイル名は PascalCase(`.jsx`)。画面は `src/pages/` に、共通の部品は `src/components/` に置く。
- 変数・関数は camelCase。モジュールの一番上に置く定数は UPPER_SNAKE_CASE。CSS のクラス名はケバブケース。
- Supabase へのアクセスは `src/lib/supabase.js` のクライアントを使う。認証の操作は `useAuth()` を通して行う。

## 環境変数

- Supabase の接続情報は `.env` で管理する(`.gitignore` 済み。**コミットしない**)。
- 新しい環境では `.env.example` をコピーして `.env` を作る。
  - `VITE_SUPABASE_URL`: Supabase の Project URL
  - `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase の Publishable key
- `service_role` キーや Secret key は、フロントエンドや `.env`(`VITE_` で始まる変数)に絶対に入れない。`VITE_` で始まる変数はビルド結果に埋め込まれ、誰でも見られるため。
- データベースのテーブルを追加する場合は、必ず RLS(Row Level Security)を有効にする。

## 開発コマンド

```bash
npm install      # 依存パッケージのインストール
npm run dev      # 開発サーバー起動(http://localhost:5173)
npm run build    # 本番ビルド(dist/ に出力)
npm run preview  # ビルド結果の確認
```

- テストは未導入。プッシュ前は最低限 `npm run build` が通ることを確認する。

## デプロイ情報

- 本番URL:https://real-estate-app-psi-lyart.vercel.app
- Supabaseプロジェクト名:real-estate-app

## デプロイ(Vercel)

- `vercel.json` で、すべての URL を `index.html` に書き換える(rewrites)。`/properties` などを直接開いたりリロードしたりしても 404 にならず、React Router が画面を表示する。
  - `dist/assets/` などの実在するファイルは、書き換えより先にそのまま返される。
- 環境変数(`VITE_SUPABASE_URL`、`VITE_SUPABASE_PUBLISHABLE_KEY`)は Vercel ダッシュボードの「Settings → Environment Variables」で設定する。`vercel.json` には書かない。
- 環境変数を追加・変更したら、再デプロイしないと反映されない(ビルドのときに埋め込まれるため)。
- Supabase の「Authentication → URL Configuration」の Site URL と Redirect URLs に、Vercel の URL を追加する。

## Git 運用ルール

- **コードを変更するたびに、コミットして GitHub にプッシュする。**
  - 1つの変更が終わったら、その都度 `git add` → `git commit` → `git push` まで行う。
  - プッシュ前に `npm run build` が通ることを確認する。
- コミットメッセージは日本語で、何を・なぜ変更したかが分かるように書く。
- `main` ブランチへの force push は禁止。プッシュに失敗した場合は、状況をユーザーに報告する。

## 機密情報・個人情報の取り扱い

- 社外秘情報(実際の物件情報・顧客情報・契約情報など)をコードやコミットに含めない。SQL やテスト用のデータにはダミーを使う。
- 個人情報(氏名、メールアドレス、電話番号、住所など)をソースコード、テストデータ、ログ、コミットメッセージに含めない。
- 会員のメールアドレスは個人情報。ログ出力や画面以外への表示はしない。
- コミット前に `git status` で `.env` が含まれていないことを確認する。
