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

  // Initialize auth - race condition ile en hızlı yöntemi kullan
  useEffect(() => {
    let isMounted = true
    let resolved = false
    console.log('[Auth] Starting initialization...', new Date().toISOString())

    const handleSession = async (session: { user: User } | null, source: string) => {
      if (resolved || !isMounted) return
      resolved = true

      console.log('[Auth] Session from', source, ':', session?.user?.email || 'none')

      if (session?.user) {
        setAuthUser(session.user)
        const appUserData = await fetchAppUser(session.user.id)
        if (isMounted) {
          setAppUser(appUserData)
          console.log('[Auth] appUser loaded:', appUserData?.role)
        }
      }

      if (isMounted) {
        setLoading(false)
        console.log('[Auth] Loading complete via', source)
      }
    }

    // Method 1: getSession (may be slow)
    console.log('[Auth] Calling getSession...')
    const startTime = Date.now()
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[Auth] getSession returned in', Date.now() - startTime, 'ms')
      handleSession(session, 'getSession')
    }).catch(err => {
      console.error('[Auth] getSession error after', Date.now() - startTime, 'ms:', err)
    })

    // Method 2: Timeout fallback - 1.5 saniye sonra session yok kabul et
    const timeoutId = setTimeout(() => {
      if (!resolved && isMounted) {
        console.warn('[Auth] Timeout - no session assumed')
        handleSession(null, 'timeout')
      }
    }, 1500)

    // Auth değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] Event:', event, 'User:', session?.user?.email)

      if (!isMounted) return

      // İlk yüklemede INITIAL_SESSION gelirse kullan
      if (event === 'INITIAL_SESSION') {
        handleSession(session, 'INITIAL_SESSION')
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

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
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
