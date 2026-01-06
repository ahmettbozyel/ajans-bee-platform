'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react'
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

  // Supabase client'ı useMemo ile cache'le - her renderda yeni instance oluşmasını engelle
  const supabase = useMemo(() => createClient(), [])

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
  }, []) // supabase artık stable, dependency'den çıkarıldı

  const refreshUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setAuthUser(user)
      const appUserData = await fetchAppUser(user.id)
      setAppUser(appUserData)
    }
  }, [fetchAppUser]) // supabase stable

  // Initialize auth - INITIAL_SESSION event'i ile senkronize çalış
  useEffect(() => {
    let isMounted = true
    let initialSessionHandled = false
    console.log('[Auth] Starting initialization...', new Date().toISOString())

    // Auth state change listener - bu INITIAL_SESSION event'ini de yakalar
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] Event:', event, 'User:', session?.user?.email)

      if (!isMounted) return

      // INITIAL_SESSION: Sayfa ilk yüklendiğinde localStorage'dan session okunduğunda
      if (event === 'INITIAL_SESSION') {
        initialSessionHandled = true

        if (session?.user) {
          setAuthUser(session.user)
          const appUserData = await fetchAppUser(session.user.id)
          if (isMounted) {
            setAppUser(appUserData)
          }
        }

        if (isMounted) {
          setLoading(false)
          console.log('[Auth] Initial session handled, loading complete')
        }
      }
      // SIGNED_IN: Yeni login yapıldığında
      else if (event === 'SIGNED_IN' && session?.user) {
        setAuthUser(session.user)
        const appUserData = await fetchAppUser(session.user.id)
        if (isMounted) {
          setAppUser(appUserData)
          setLoading(false)
        }
      }
      // SIGNED_OUT: Logout yapıldığında
      else if (event === 'SIGNED_OUT') {
        setAuthUser(null)
        setAppUser(null)
        setLoading(false)
      }
      // TOKEN_REFRESHED: Token yenilendiğinde
      else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setAuthUser(session.user)
      }
    })

    // Fallback: 2 saniye içinde INITIAL_SESSION gelmezse, manuel kontrol yap
    const fallbackTimeout = setTimeout(async () => {
      if (isMounted && !initialSessionHandled) {
        console.warn('[Auth] INITIAL_SESSION timeout, checking manually...')
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (isMounted && !initialSessionHandled) {
            if (session?.user) {
              setAuthUser(session.user)
              const appUserData = await fetchAppUser(session.user.id)
              if (isMounted) setAppUser(appUserData)
            }
            setLoading(false)
            console.log('[Auth] Manual fallback complete')
          }
        } catch (err) {
          console.error('[Auth] Fallback error:', err)
          if (isMounted) setLoading(false)
        }
      }
    }, 2000)

    return () => {
      isMounted = false
      clearTimeout(fallbackTimeout)
      subscription.unsubscribe()
    }
  }, [fetchAppUser]) // supabase stable

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setAuthUser(null)
    setAppUser(null)
  }, []) // supabase stable

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
