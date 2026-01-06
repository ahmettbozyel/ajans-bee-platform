'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { AppUser, UserRole, canAccess, canEdit, getDefaultRoute, ModuleSlug } from './auth-types'

interface AuthContextType {
  authUser: User | null
  appUser: AppUser | null
  loading: boolean
  role: UserRole | null
  isAdmin: boolean
  isYonetici: boolean
  isOperasyon: boolean
  isPersonel: boolean
  isStajer: boolean
  canAccess: (module: ModuleSlug) => boolean
  canEdit: (module: ModuleSlug) => boolean
  getDefaultRoute: () => string
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAppUser = useCallback(async (userId: string): Promise<AppUser | null> => {
    console.log('[Auth] fetchAppUser starting for:', userId)
    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('[Auth] fetchAppUser result:', data, error?.message)

      if (error) {
        console.error('[Auth] fetchAppUser error:', error.message)
        return null
      }

      return data as AppUser
    } catch (err) {
      console.error('[Auth] fetchAppUser exception:', err)
      return null
    }
  }, [])

  const refreshUser = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setAuthUser(user)
      const appUserData = await fetchAppUser(user.id)
      setAppUser(appUserData)
    }
  }, [fetchAppUser])

  // Basit auth initialization - sadece onAuthStateChange kullan
  useEffect(() => {
    let isMounted = true
    const supabase = createClient()
    console.log('[Auth] Starting simple initialization...')

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('[Auth] Event:', event, 'User:', session?.user?.email || 'none')

        if (!isMounted) return

        if (session?.user) {
          setAuthUser(session.user)
          // appUser yüklenene kadar bekle, sonra loading'i kapat
          const appUserData = await fetchAppUser(session.user.id)
          if (isMounted) {
            setAppUser(appUserData)
            setLoading(false)
            console.log('[Auth] appUser loaded:', appUserData?.role)
          }
        } else {
          setAuthUser(null)
          setAppUser(null)
          if (isMounted) {
            setLoading(false)
          }
        }
      }
    )

    // Fallback: 5 saniye sonra loading'i kapat (event gelmezse)
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.log('[Auth] Timeout - closing loading, no event received')
        setLoading(false)
      }
    }, 5000)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [fetchAppUser])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setAuthUser(null)
    setAppUser(null)
  }, [])

  const role = appUser?.role ?? null

  const value: AuthContextType = {
    authUser,
    appUser,
    loading,
    role,
    isAdmin: role === 'admin',
    isYonetici: role === 'yonetici',
    isOperasyon: role === 'operasyon',
    isPersonel: role === 'personel',
    isStajer: role === 'stajer',
    canAccess: (module: ModuleSlug) => role ? canAccess(role, module) : false,
    canEdit: (module: ModuleSlug) => role ? canEdit(role, module) : false,
    getDefaultRoute: () => role ? getDefaultRoute(role) : '/login',
    signOut,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
