import { supabase } from './supabaseClient'

// ログインユーザーが登録した物件を全件取得する（新しい順）
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 物件を新規登録する（user_id は Supabase が RLS で自動付与するため不要）
export async function insertProperty({ name, rent, area, floor_plan }) {
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('properties')
    .insert({ name, rent: Number(rent), area, floor_plan, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

// 指定した物件を更新する（自分の物件のみ RLS で許可される）
export async function updateProperty(id, { name, rent, area, floor_plan }) {
  const { data, error } = await supabase
    .from('properties')
    .update({ name, rent: Number(rent), area, floor_plan })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// 指定した物件を削除する（自分の物件のみ RLS で許可される）
export async function deleteProperty(id) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw error
}
