import { createClient } from '@supabase/supabase-js'

// .env から Supabase の接続情報を読み込む(Vite では VITE_ で始まる変数だけが読める)
// 前後の空白・改行は取り除く
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

// 接続情報の設定ミスを調べる。問題がなければ null
function checkConfig() {
  if (!supabaseUrl || !supabaseKey) {
    return 'Supabase の接続情報が見つかりません。環境変数 VITE_SUPABASE_URL と VITE_SUPABASE_PUBLISHABLE_KEY を設定してください(ローカルでは .env.example をもとに .env を作成)。'
  }
  // 値の途中に空白・改行が入っている(貼り付けミスなど)と、通信エラーになるため事前に検出する
  if (!/^https:\/\/\S+$/.test(supabaseUrl) || /\s/.test(supabaseKey)) {
    return 'Supabase の接続情報の形式が正しくありません。VITE_SUPABASE_URL と VITE_SUPABASE_PUBLISHABLE_KEY に、余分な文字や改行が入っていないか確認してください。'
  }
  return null
}

// 設定ミスがある場合のエラーメッセージ(main.jsx で画面に表示する)
export const supabaseConfigError = checkConfig()

// アプリ全体で使い回す Supabase クライアント(設定ミスがある場合は作らない)
export const supabase = supabaseConfigError ? null : createClient(supabaseUrl, supabaseKey)
