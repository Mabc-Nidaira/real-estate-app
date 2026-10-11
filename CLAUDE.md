# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

- プロジェクト名: real-estate-app
- 内容: Supabase 認証付きの不動産管理 Web アプリ
  - メールアドレス + パスワードでの会員登録・ログイン・ログアウト
  - ログイン後に物件一覧(現在はダミーデータ)をカード形式で表示
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
src/
├── main.jsx                    # Router と AuthProvider でアプリを包む
├── App.jsx                     # ルーティング定義
├── App.css                     # スタイル
├── lib/
│   ├── supabase.js             # Supabase クライアント(.env から接続情報を読む)
│   └── authErrors.js           # 認証エラーを日本語メッセージに変換
├── contexts/AuthContext.jsx    # ログイン状態の共有(AuthProvider / useAuth)
├── components/
│   ├── ProtectedRoute.jsx      # 未ログインなら /login へリダイレクト
│   └── GuestRoute.jsx          # ログイン済みなら /properties へリダイレクト
├── pages/
│   ├── LoginPage.jsx           # /login
│   ├── SignUpPage.jsx          # /signup
│   └── PropertyListPage.jsx    # /properties(要ログイン)
└── data/properties.js          # 物件のダミーデータ
```

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

## Git 運用ルール

- **コードを変更するたびに、コミットして GitHub にプッシュする。**
  - 1つの変更が終わったら、その都度 `git add` → `git commit` → `git push` まで行う。
  - プッシュ前に `npm run build` が通ることを確認する。
- コミットメッセージは日本語で、何を・なぜ変更したかが分かるように書く。
- `main` ブランチへの force push は禁止。プッシュに失敗した場合は、状況をユーザーに報告する。

## 機密情報・個人情報の取り扱い

- 社外秘情報(実際の物件情報・顧客情報・契約情報など)をコードやコミットに含めない。物件データはダミーを使う。
- 個人情報(氏名、メールアドレス、電話番号、住所など)をソースコード、テストデータ、ログ、コミットメッセージに含めない。
- 会員のメールアドレスは個人情報。ログ出力や画面以外への表示はしない。
- コミット前に `git status` で `.env` が含まれていないことを確認する。
