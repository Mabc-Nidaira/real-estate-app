import { supabase } from './supabase'

// 物件テーブル(properties)への CRUD 操作をまとめたモジュール
// どの物件が見えるか・操作できるかは Supabase 側の RLS で制御している
// (ここで user_id を絞り込まなくても、自分の物件しか返ってこない)

const TABLE = 'properties'
const COLUMNS = 'id, name, rent, area, layout, created_at, updated_at'

// 一覧取得(SELECT): 新しく登録した順
export async function fetchProperties() {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 新規登録(INSERT): user_id はテーブルの初期値(auth.uid())で自動的に入る
export async function createProperty(property) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(property)
    .select(COLUMNS)
    .single()

  if (error) throw error
  return data
}

// 更新(UPDATE)
export async function updateProperty(id, property) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(property)
    .eq('id', id)
    .select(COLUMNS)
    .single()

  if (error) throw error
  return data
}

// 削除(DELETE)
export async function deleteProperty(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}

// データベースのエラーを、画面に表示する日本語に変換する
export function toJapaneseDbError(error) {
  // テーブルがまだ作られていない場合
  if (error?.code === '42P01' || error?.code === 'PGRST205') {
    return '物件テーブルが見つかりません。supabase/migrations の SQL を実行してください。'
  }
  // 1件も該当しなかった場合(他人の物件・削除済みなど)
  if (error?.code === 'PGRST116') {
    return '対象の物件が見つかりません。すでに削除された可能性があります。'
  }
  // RLS で拒否された場合
  if (error?.code === '42501') {
    return 'この操作を行う権限がありません。'
  }
  // 制約違反(文字数・金額の範囲など)
  if (error?.code === '23514') {
    return '入力内容が正しくありません。各項目の値を確認してください。'
  }
  return '通信エラーが発生しました。時間をおいてもう一度お試しください。'
}
