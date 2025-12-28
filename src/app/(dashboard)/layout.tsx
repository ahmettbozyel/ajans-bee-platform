'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  LayoutDashboard, 
  Building2,
  Server,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TopBar } from '@/components/layouts/top-bar'
import type { User } from '@supabase/supabase-js'

// Ajans Bee Logo SVG Component
function AjansBeeLogoSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 39.9 53.7" fill="none">
      <polyline points="8.6,21.9 2.8,2.4 2.8,34.5" className="fill-zinc-400 dark:fill-zinc-500"/>
      <path d="M26.6,34.8c0,3.4-2.7,6.1-6.1,6.1s-6.1-2.7-6.1-6.1s2.7-6.1,6.1-6.1C23.9,28.7,26.6,31.4,26.6,34.8" fill="#FFD600"/>
      <path d="M38.3,34.8C38.3,25,30.3,17,20.5,17S2.8,25,2.8,34.8c0,7.2,4.3,13.3,10.4,16.1l2.3-6.7c-3.4-1.8-5.7-5.3-5.7-9.4c0-5.9,4.8-10.7,10.7-10.7s10.7,4.8,10.7,10.7c0,4-2.2,7.5-5.5,9.4l2.3,6.7C34,48.1,38.3,41.9,38.3,34.8" className="fill-zinc-600 dark:fill-zinc-400"/>
    </svg>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({ customers: 0, services: 0 })
  
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setUser(user)
        
        // Counts yükle
        const [customersRes, servicesRes] = await Promise.all([
          supabase.from('customers').select('id', { count: 'exact', head: true }),
          supabase.from('technical_services').select('id', { count: 'exact', head: true })
        ])
        setCounts({
          customers: customersRes.count || 0,
          services: servicesRes.count || 0
        })
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    
    getUser()
  }, [router, supabase])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Aktif sayfa kontrolü
  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm text-zinc-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // No user (shouldn't happen as we redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-zinc-200 dark:border-white/5 px-4"
        style={{
          background: 'rgba(9, 9, 11, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center">
            <AjansBeeLogoSVG className="w-5 h-5" />
          </div>
          <span className="font-semibold text-zinc-900 dark:text-white">Ajans Bee</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - w-64 (256px) - Fixed */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col fixed left-0 top-0 h-screen z-50">
          <div 
            className="flex flex-col flex-grow border-r border-zinc-200 dark:border-white/5 transition-colors duration-300"
            style={{
              background: 'linear-gradient(180deg, rgba(17, 17, 20, 0.98) 0%, rgba(9, 9, 11, 0.99) 100%)'
            }}
          >
            {/* Logo Section */}
            <div className="p-5 border-b border-zinc-200 dark:border-white/5 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
                    <AjansBeeLogoSVG className="w-7 h-7" />
                  </div>
                  {/* Online Status Dot - Pulse Animation */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-zinc-900"
                    style={{
                      animation: 'pulse-glow 2s ease-in-out infinite',
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
                    }}
                  ></div>
                </div>
                <div>
                  <h1 className="font-bold text-base text-zinc-900 dark:text-white tracking-tight transition-colors">Ajans Bee</h1>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">AI Platform</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {/* Ana Menü */}
              <div className="mb-4">
                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-3 mb-2">Ana Menü</p>
                
                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive('/dashboard') 
                      ? 'text-zinc-900 dark:text-white' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  style={isActive('/dashboard') ? {
                    background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)',
                    borderLeft: '3px solid #6366f1'
                  } : {}}
                >
                  <LayoutDashboard className={`h-5 w-5 ${isActive('/dashboard') ? 'text-indigo-500' : 'group-hover:text-indigo-400'} transition-colors`} />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>

                {/* Markalar */}
                <Link
                  href="/musteriler"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive('/musteriler') 
                      ? 'text-zinc-900 dark:text-white' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  style={isActive('/musteriler') ? {
                    background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.05) 100%)',
                    borderLeft: '3px solid #8b5cf6'
                  } : {}}
                >
                  <Building2 className={`h-5 w-5 ${isActive('/musteriler') ? 'text-violet-500' : 'group-hover:text-violet-400'} transition-colors`} />
                  <span className="text-sm font-medium">Markalar</span>
                  {counts.customers > 0 && (
                    <span className="ml-auto text-[11px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-mono">{counts.customers}</span>
                  )}
                </Link>

                {/* Teknik Hizmetler */}
                <Link
                  href="/teknik-hizmetler"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive('/teknik-hizmetler') 
                      ? 'text-zinc-900 dark:text-white' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  style={isActive('/teknik-hizmetler') ? {
                    background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)',
                    borderLeft: '3px solid #f59e0b'
                  } : {}}
                >
                  <Server className={`h-5 w-5 ${isActive('/teknik-hizmetler') ? 'text-amber-500' : 'group-hover:text-amber-400'} transition-colors`} />
                  <span className="text-sm font-medium">Teknik Hizmetler</span>
                  {counts.services > 0 && (
                    <span className="ml-auto text-[11px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-mono">{counts.services}</span>
                  )}
                </Link>
              </div>

              {/* Araçlar */}
              <div className="mb-4">
                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-3 mb-2 mt-5">Araçlar</p>
                
                {/* İçerik Üret */}
                <Link
                  href="/icerik-uret"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive('/icerik-uret') 
                      ? 'text-zinc-900 dark:text-white' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  style={isActive('/icerik-uret') ? {
                    background: 'linear-gradient(90deg, rgba(217, 70, 239, 0.2) 0%, rgba(217, 70, 239, 0.05) 100%)',
                    borderLeft: '3px solid #d946ef'
                  } : {}}
                >
                  <Sparkles className={`h-5 w-5 ${isActive('/icerik-uret') ? 'text-fuchsia-500' : 'group-hover:text-fuchsia-400'} transition-colors`} />
                  <span className="text-sm font-medium">İçerik Üret</span>
                  <span className="ml-auto text-[10px] bg-fuchsia-500/20 text-fuchsia-400 px-2 py-0.5 rounded border border-fuchsia-500/20">AI</span>
                </Link>
              </div>

              {/* Sistem */}
              <div>
                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-3 mb-2 mt-5">Sistem</p>
                
                {/* Ayarlar */}
                <Link
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 dark:text-zinc-500 opacity-50 cursor-not-allowed"
                  onClick={(e) => e.preventDefault()}
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-sm font-medium">Ayarlar</span>
                  <span className="ml-auto text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">Yakında</span>
                </Link>
              </div>
            </nav>

            {/* User Section */}
            <div className="p-3 border-t border-zinc-200 dark:border-white/5 transition-colors duration-300">
              <div 
                className="rounded-xl p-3 border border-white/10 transition-colors duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate transition-colors">
                      {user.user_metadata?.full_name || 'Kullanıcı'}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-mono">Admin</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          {/* Top Bar - Sticky Header */}
          <div className="hidden lg:block sticky top-0 z-40">
            <TopBar />
          </div>
          
          {/* Content with background gradient */}
          <div 
            className="flex-1 transition-colors duration-300"
            style={{
              background: 'radial-gradient(ellipse at 10% 10%, rgba(99, 102, 241, 0.12) 0%, transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(139, 92, 246, 0.08) 0%, transparent 40%)'
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
