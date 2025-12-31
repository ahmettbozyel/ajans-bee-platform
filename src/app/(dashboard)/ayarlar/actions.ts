'use server'

import { createClient } from '@supabase/supabase-js'
import { UserRole } from '@/lib/auth-types'

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
  role: UserRole
}) {
  try {
    // 1. Auth'da kullanıcı oluştur (trigger otomatik public.users'a ekleyecek)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.full_name
      }
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    // 2. Trigger zaten ekledi, sadece role ve full_name güncelle
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        full_name: data.full_name,
        role: data.role
      })
      .eq('id', authData.user.id)

    if (updateError) {
      return { success: false, error: updateError.message }
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
    role?: UserRole
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
