'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function createUser(data: {
  email: string
  password: string
  full_name: string
  role: 'admin' | 'operasyon' | 'personel'
}) {
  try {
    // 1. Auth'da kullanıcı oluştur
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Email doğrulamayı atla
      user_metadata: {
        full_name: data.full_name
      }
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    // 2. Public users tablosuna ekle
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        is_active: true
      })

    if (insertError) {
      // Auth'daki kullanıcıyı sil (rollback)
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return { success: false, error: insertError.message }
    }

    return { success: true, user: authData.user }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateUser(
  userId: string, 
  data: {
    full_name?: string
    role?: 'admin' | 'operasyon' | 'personel'
    is_active?: boolean
  }
) {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteUser(userId: string) {
  try {
    // 1. Public tablodan sil
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    // 2. Auth'dan sil
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      return { success: false, error: authError.message }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
