import { createClient } from '@supabase/supabase-js'

// .env から Supabase の接続情報を読み込む(Vite では VITE_ で始まる変数だけが読める)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase の接続情報が見つかりません。.env.example をもとに .env を作成してください。',
  )
}

// アプリ全体で使い回す Supabase クライアント
export const supabase = createClient(supabaseUrl, supabaseKey)
