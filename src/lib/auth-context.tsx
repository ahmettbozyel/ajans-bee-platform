'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
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
  
  const supabase = createClient()

  const fetchAppUser = async (userId: string): Promise<AppUser | null> => {
    try {
      const { data, error } = await (supabase
        .from('users') as any)
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('[Auth] Error:', error.message)
        return null
      }
      
      return data as AppUser
    } catch (err) {
      console.error('[Auth] Exception:', err)
      return null
    }
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
    let isMounted = true
    
    // Timeout: 3 saniye sonra loading'i kapat
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        console.log('[Auth] Timeout - forcing load complete')
        setLoading(false)
      }
    }, 3000)

    const initAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user && isMounted) {
          setAuthUser(user)
          const appUserData = await fetchAppUser(user.id)
          if (isMounted) setAppUser(appUserData)
        }
      } catch (error) {
        console.error('[Auth] Init error:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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

    return () => {
      isMounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
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
