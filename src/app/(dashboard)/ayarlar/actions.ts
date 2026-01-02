'use server'

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { UserRole } from '@/lib/auth-types'

// Admin client for privileged operations
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

// Authorization helper - ensures caller is admin
async function requireAdmin(): Promise<{ userId: string }> {
  const supabase = await createServerClient()

  // Get current user from session
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Oturum açmanız gerekiyor')
  }

  // Check if user has admin role
  const { data: appUser, error: userError } = await (supabase as any)
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userError || !appUser) {
    throw new Error('Kullanıcı bilgileri alınamadı')
  }

  if (appUser.role !== 'admin') {
    throw new Error('Bu işlem için admin yetkisi gerekiyor')
  }

  return { userId: user.id }
}

export async function createUser(data: {
  email: string
  password: string
  full_name: string
  role: UserRole
}) {
  try {
    // Authorization check
    await requireAdmin()

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
    // Authorization check
    await requireAdmin()

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
    // Authorization check
    await requireAdmin()

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
