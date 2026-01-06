'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
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

  const supabase = createClient()

  const fetchAppUser = useCallback(async (userId: string): Promise<AppUser | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[Auth] fetchAppUser error:', error.message)
        return null
      }

      return data as AppUser
    } catch (err) {
      console.error('[Auth] fetchAppUser exception:', err)
      return null
    }
  }, [supabase])

  const refreshUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setAuthUser(user)
      const appUserData = await fetchAppUser(user.id)
      setAppUser(appUserData)
    }
  }, [supabase, fetchAppUser])

  // Initialize auth - direkt getSession kullan, event beklemeden
  useEffect(() => {
    let isMounted = true
    console.log('[Auth] Starting initialization...')

    const initAuth = async () => {
      try {
        // Direkt session'ı al - event bekleme
        const { data: { session }, error } = await supabase.auth.getSession()

        console.log('[Auth] getSession result:', session?.user?.email || 'no session', error?.message || 'no error')

        if (!isMounted) return

        if (session?.user) {
          setAuthUser(session.user)
          const appUserData = await fetchAppUser(session.user.id)
          console.log('[Auth] appUser loaded:', appUserData?.email, 'role:', appUserData?.role)
          if (isMounted) {
            setAppUser(appUserData)
          }
        }

        if (isMounted) {
          setLoading(false)
          console.log('[Auth] Loading complete')
        }
      } catch (err) {
        console.error('[Auth] Init error:', err)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    // Auth değişikliklerini dinle (login/logout için)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] Event:', event, 'User:', session?.user?.email)

      if (!isMounted) return

      if (event === 'SIGNED_IN' && session?.user) {
        setAuthUser(session.user)
        const appUserData = await fetchAppUser(session.user.id)
        if (isMounted) {
          setAppUser(appUserData)
          setLoading(false)
        }
      } else if (event === 'SIGNED_OUT') {
        setAuthUser(null)
        setAppUser(null)
        setLoading(false)
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setAuthUser(session.user)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase, fetchAppUser])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setAuthUser(null)
    setAppUser(null)
  }, [supabase])

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
