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
      console.log('[Auth] Fetching app user...')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('[Auth] Users error:', error.message)
        return null
      }
      
      console.log('[Auth] Got user:', data?.email)
      return data as AppUser
    } catch (err: any) {
      console.error('[Auth] Exception:', err?.message)
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

    const init = async () => {
      console.log('[Auth] Init start')
      
      try {
        // Get current user
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.log('[Auth] No user')
          setLoading(false)
          return
        }
        
        console.log('[Auth] User:', user.email)
        setAuthUser(user)
        
        // Fetch app user data
        const appUserData = await fetchAppUser(user.id)
        setAppUser(appUserData)
        
        console.log('[Auth] Done')
        setLoading(false)
        
      } catch (err: any) {
        console.error('[Auth] Error:', err?.message)
        setLoading(false)
      }
    }

    // Listen only for sign out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('[Auth] Event:', event)
      if (event === 'SIGNED_OUT') {
        setAuthUser(null)
        setAppUser(null)
        setLoading(false)
      }
    })

    init()

    return () => subscription.unsubscribe()
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
