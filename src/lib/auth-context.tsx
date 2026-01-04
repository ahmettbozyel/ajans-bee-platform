'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'
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
  const initialized = useRef(false)

  const supabase = useMemo(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ),
  [])

  const fetchAppUser = useCallback(async (userId: string): Promise<AppUser | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return null
      }

      return data as AppUser
    } catch {
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
    if (initialized.current) return
    initialized.current = true

    let isMounted = true
    let initialLoadDone = false

    const loadUser = async (user: User) => {
      setAuthUser(user)

      const appUserData = await fetchAppUser(user.id)

      if (isMounted) {
        setAppUser(appUserData)
        setLoading(false)
      }
    }

    // Listen for auth changes - INITIAL_SESSION is the key event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return

      if (event === 'INITIAL_SESSION') {
        // This fires when session is loaded from storage - the reliable event
        initialLoadDone = true
        if (session?.user) {
          await loadUser(session.user)
        } else {
          setLoading(false)
        }
      } else if (event === 'SIGNED_IN' && session?.user && initialLoadDone) {
        // Only handle SIGNED_IN after initial load (for fresh logins)
        await loadUser(session.user)
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
