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

// Module-level flag to prevent duplicate initialization across renders
let authInitialized = false

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Singleton client kullan - tüm app'te aynı instance
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

  useEffect(() => {
    // Check if already initialized (handles strict mode and hot reload)
    if (authInitialized) {
      console.log('[Auth] Already initialized, checking current session...')
      // Still need to check current session state
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          setAuthUser(session.user)
          const appUserData = await fetchAppUser(session.user.id)
          setAppUser(appUserData)
        }
        setLoading(false)
      })
      return
    }

    authInitialized = true
    console.log('[Auth] Initializing auth provider...')

    let isMounted = true
    let initialLoadDone = false

    const loadUser = async (user: User) => {
      console.log('[Auth] loadUser called for:', user.email)
      setAuthUser(user)

      const appUserData = await fetchAppUser(user.id)
      console.log('[Auth] appUser fetched:', appUserData?.email, 'role:', appUserData?.role)

      if (isMounted) {
        setAppUser(appUserData)
        setLoading(false)
        console.log('[Auth] Loading set to false')
      }
    }

    // Timeout: 5 saniye içinde INITIAL_SESSION gelmezse loading'i kapat
    // Bu, bozuk localStorage verileri durumunda sonsuz loading'i önler
    const timeout = setTimeout(() => {
      if (isMounted && !initialLoadDone) {
        console.warn('[Auth] Timeout - clearing potentially corrupted session data')
        // Sadece supabase session key'lerini temizle
        if (typeof window !== 'undefined') {
          const keysToRemove: string[] = []
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
              keysToRemove.push(key)
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key))
          console.log('[Auth] Cleared corrupted keys:', keysToRemove)
        }
        setLoading(false)
      }
    }, 5000)

    // Listen for auth changes - INITIAL_SESSION is the key event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] Event:', event, 'User:', session?.user?.email)
      if (!isMounted) return

      if (event === 'INITIAL_SESSION') {
        // This fires when session is loaded from storage - the reliable event
        clearTimeout(timeout)
        initialLoadDone = true
        if (session?.user) {
          await loadUser(session.user)
        } else {
          console.log('[Auth] No session found, setting loading to false')
          setLoading(false)
        }
      } else if (event === 'SIGNED_IN' && session?.user) {
        // Handle fresh login - clear timeout and load user
        clearTimeout(timeout)
        initialLoadDone = true
        await loadUser(session.user)
      } else if (event === 'SIGNED_OUT') {
        console.log('[Auth] Signed out')
        setAuthUser(null)
        setAppUser(null)
        setLoading(false)
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log('[Auth] Token refreshed')
        setAuthUser(session.user)
      }
    })

    return () => {
      isMounted = false
      clearTimeout(timeout)
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
