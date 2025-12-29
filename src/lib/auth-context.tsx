'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react'
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
  const initRef = useRef(false)
  
  const supabase = createClient()

  const fetchAppUser = useCallback(async (userId: string): Promise<AppUser | null> => {
    try {
      const { data, error } = await (supabase
        .from('users') as any)
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('[Auth] Users table error:', error.message)
        return null
      }
      
      return data as AppUser
    } catch (err) {
      console.error('[Auth] Exception:', err)
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
    // Prevent double init in strict mode
    if (initRef.current) return
    initRef.current = true

    let isMounted = true

    const initAuth = async () => {
      try {
        // 1. Önce getUser ile direkt kontrol et (en güvenilir yöntem)
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('[Auth] getUser error:', userError.message)
        }
        
        if (user && isMounted) {
          setAuthUser(user)
          
          // AppUser'ı fetch et
          const appUserData = await fetchAppUser(user.id)
          
          if (isMounted) {
            setAppUser(appUserData)
            setLoading(false)
          }
          return
        }
        
        // User yoksa loading'i kapat
        if (isMounted) {
          setLoading(false)
        }
      } catch (error) {
        console.error('[Auth] Init error:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Event:', event)
        
        if (event === 'SIGNED_IN' && session?.user) {
          setAuthUser(session.user)
          const appUserData = await fetchAppUser(session.user.id)
          setAppUser(appUserData)
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setAuthUser(null)
          setAppUser(null)
          setLoading(false)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setAuthUser(session.user)
        } else if (event === 'INITIAL_SESSION') {
          // Initial session event - initAuth zaten handle ediyor
          // Ama session varsa ve henüz user set edilmediyse set et
          if (session?.user && !authUser) {
            setAuthUser(session.user)
            const appUserData = await fetchAppUser(session.user.id)
            setAppUser(appUserData)
            setLoading(false)
          }
        }
      }
    )

    // Init'i başlat
    initAuth()

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, []) // Empty deps - sadece mount'ta çalışsın

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
