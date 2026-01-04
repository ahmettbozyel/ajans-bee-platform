import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export interface AuthResult {
  success: true
  user: {
    id: string
    email: string
  }
}

export interface AuthError {
  success: false
  response: NextResponse
}

/**
 * API route'ları için authentication kontrolü
 * Başarısız olursa hazır 401 response döner
 */
export async function requireAuth(): Promise<AuthResult | AuthError> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Unauthorized - Giriş yapmanız gerekiyor' },
          { status: 401 }
        )
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email || ''
      }
    }
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}

/**
 * Admin rolü kontrolü (ileride kullanılabilir)
 */
export async function requireAdmin(): Promise<AuthResult | AuthError> {
  const authResult = await requireAuth()

  if (!authResult.success) {
    return authResult
  }

  try {
    const supabase = await createClient()
    const { data: appUser, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', authResult.user.id)
      .single()

    if (error || !appUser || (appUser as { role: string }).role !== 'admin') {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Forbidden - Admin yetkisi gerekiyor' },
          { status: 403 }
        )
      }
    }

    return authResult
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Authorization failed' },
        { status: 403 }
      )
    }
  }
}
