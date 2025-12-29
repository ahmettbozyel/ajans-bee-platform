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
  isOperasyon: boolean
  isPersonel: boolean
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
  
  // Stable supabase client
  const supabase = useMemo(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ), 
  [])

  const fetchAppUser = useCallback(async (userId: string): Promise<AppUser | null> => {
    try {
      console.log('[Auth] Fetching app user for:', userId)
      
      // Timeout ile fetch
      const timeoutPromise = new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
      
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      const result = await Promise.race([fetchPromise, timeoutPromise])
      
      if (!result || 'error' in result) {
        const error = (result as any)?.error
        console.error('[Auth] Users table error:', error?.message || 'Unknown error')
        return null
      }
      
      console.log('[Auth] App user fetched:', (result as any).data?.email)
      return (result as any).data as AppUser
    } catch (err: any) {
      console.error('[Auth] Exception:', err?.message || err)
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
    // Prevent double initialization
    if (initialized.current) return
    initialized.current = true

    let isMounted = true

    const initAuth = async () => {
      console.log('[Auth] Initializing...')
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('[Auth] getUser error:', error.message)
          if (isMounted) setLoading(false)
          return
        }
        
        if (user && isMounted) {
          console.log('[Auth] User found:', user.email)
          setAuthUser(user)
          
          const appUserData = await fetchAppUser(user.id)
          
          if (isMounted) {
            setAppUser(appUserData)
            console.log('[Auth] Init complete')
            setLoading(false)
          }
          return
        }
        
        console.log('[Auth] No user found')
        if (isMounted) setLoading(false)
        
      } catch (error: any) {
        console.error('[Auth] Init error:', error?.message || error)
        if (isMounted) setLoading(false)
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Event:', event)
        
        if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
          return
        }
        
        if (event === 'SIGNED_IN' && session?.user && !authUser) {
          setAuthUser(session.user)
          const appUserData = await fetchAppUser(session.user.id)
          setAppUser(appUserData)
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setAuthUser(null)
          setAppUser(null)
          setLoading(false)
        }
      }
    )

    initAuth()

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
    isOperasyon: role === 'operasyon',
    isPersonel: role === 'personel',
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
