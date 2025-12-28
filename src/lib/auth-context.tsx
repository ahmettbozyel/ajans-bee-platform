'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { AppUser, UserRole, canAccess, canEdit, getDefaultRoute, ModuleSlug } from './auth-types'

interface AuthContextType {
  // Supabase auth user
  authUser: User | null
  // App user (public.users)
  appUser: AppUser | null
  // Loading state
  loading: boolean
  // Role shortcuts
  role: UserRole | null
  isAdmin: boolean
  isOperasyon: boolean
  isPersonel: boolean
  // Access functions
  canAccess: (module: ModuleSlug) => boolean
  canEdit: (module: ModuleSlug) => boolean
  getDefaultRoute: () => string
  // Actions
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  const fetchAppUser = async (userId: string) => {
    console.log('[AuthContext] Fetching app user for:', userId)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('[AuthContext] Error fetching app user:', error)
      return null
    }
    
    console.log('[AuthContext] App user fetched:', data)
    return data as AppUser
  }

  const refreshUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setAuthUser(user)
      const appUserData = await fetchAppUser(user.id)
      setAppUser(appUserData)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('[AuthContext] Initializing auth...')
        const { data: { user }, error } = await supabase.auth.getUser()
        
        console.log('[AuthContext] Auth user:', user?.email, 'Error:', error)
        
        if (user) {
          setAuthUser(user)
          const appUserData = await fetchAppUser(user.id)
          setAppUser(appUserData)
        }
      } catch (error) {
        console.error('[AuthContext] Auth init error:', error)
      } finally {
        console.log('[AuthContext] Loading complete')
        setLoading(false)
      }
    }

    initAuth()

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] Auth state changed:', event, session?.user?.email)
        if (event === 'SIGNED_IN' && session?.user) {
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

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setAuthUser(null)
    setAppUser(null)
  }

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

  // Debug log
  console.log('[AuthContext] State:', { loading, authUser: authUser?.email, appUser: appUser?.email, role })

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
