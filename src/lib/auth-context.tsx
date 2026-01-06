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

  // Initialize auth - getSession ile hemen başla, event'leri dinle
  useEffect(() => {
    let isMounted = true
    console.log('[Auth] Starting initialization...', new Date().toISOString())

    // Hemen getSession çağır - beklemeden
    const initSession = async () => {
      try {
        console.log('[Auth] Calling getSession...')
        const startTime = Date.now()
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('[Auth] getSession completed in', Date.now() - startTime, 'ms')

        if (error) {
          console.error('[Auth] getSession error:', error.message)
        }

        if (!isMounted) return

        if (session?.user) {
          console.log('[Auth] Session found:', session.user.email)
          setAuthUser(session.user)
          const appUserData = await fetchAppUser(session.user.id)
          if (isMounted) {
            setAppUser(appUserData)
            console.log('[Auth] appUser loaded:', appUserData?.role)
          }
        } else {
          console.log('[Auth] No session found')
        }

        if (isMounted) {
          setLoading(false)
          console.log('[Auth] Loading complete')
        }
      } catch (err) {
        console.error('[Auth] Init error:', err)
        if (isMounted) setLoading(false)
      }
    }

    initSession()

    // Auth değişikliklerini dinle (login/logout/token refresh için)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] Event:', event, 'User:', session?.user?.email)

      if (!isMounted) return

      // SIGNED_IN: Yeni login yapıldığında
      if (event === 'SIGNED_IN' && session?.user) {
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

    return () => {
      isMounted = false
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
