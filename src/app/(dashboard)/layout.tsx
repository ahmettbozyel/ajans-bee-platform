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
  Loader2,
  Sun,
  Moon,
  Search,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'

// Ajans Bee Logo SVG Component - UI Kit'ten birebir
function AjansBeeLogoSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 39.9 53.7">
      <polyline points="8.6,21.9 2.8,2.4 2.8,34.5" className="fill-zinc-500 dark:fill-zinc-400"/>
      <path d="M26.6,34.8c0,3.4-2.7,6.1-6.1,6.1s-6.1-2.7-6.1-6.1s2.7-6.1,6.1-6.1C23.9,28.7,26.6,31.4,26.6,34.8" fill="#FFD600"/>
      <path d="M38.3,34.8C38.3,25,30.3,17,20.5,17S2.8,25,2.8,34.8c0,7.2,4.3,13.3,10.4,16.1l2.3-6.7c-3.4-1.8-5.7-5.3-5.7-9.4c0-5.9,4.8-10.7,10.7-10.7s10.7,4.8,10.7,10.7c0,4-2.2,7.5-5.5,9.4l2.3,6.7C34,48.1,38.3,41.9,38.3,34.8" className="fill-zinc-700 dark:fill-zinc-300"/>
    </svg>
  )
}

// Üst Navigation Tabs
const navTabs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Markalar', href: '/musteriler' },
  { label: 'Components', href: '#' },
]

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
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
    
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setUser(user)
        
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

  const toggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const isTabActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0]
    } else if (user?.email) {
      const name = user.email.split('@')[0]
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
    return 'Kullanıcı'
  }

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

  if (!user) return null

  // UI Kit'ten: top-12 = 48px
  const TOP_BAR_HEIGHT = 48

  return (
    <div className="min-h-screen bg-[#09090b]">
      
      {/* ========== TOP NAV - UI Kit'ten birebir ========== */}
      {/* bg-zinc-900/95 backdrop-blur-xl border-b border-white/10 */}
      <header 
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 py-2"
        style={{
          background: 'rgba(24, 24, 27, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Sol: Version + Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">UI Kit v1.0</span>
          <span className="text-zinc-600">|</span>
          <div className="flex gap-1">
            {navTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  isTabActive(tab.href) 
                    ? 'bg-white/10 text-white' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Sağ: Dark Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-mono">
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all hover:rotate-12"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div style={{ height: `${TOP_BAR_HEIGHT}px` }} />

      {/* ========== MAIN LAYOUT ========== */}
      <div className="flex" style={{ minHeight: `calc(100vh - ${TOP_BAR_HEIGHT}px)` }}>
        
        {/* ========== SIDEBAR - UI Kit'ten birebir (w-64 = 256px) ========== */}
        <aside 
          className="hidden lg:flex lg:flex-col fixed left-0 z-50"
          style={{ 
            top: `${TOP_BAR_HEIGHT}px`,
            height: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
            width: '256px',
            background: 'linear-gradient(180deg, rgba(17,17,20,0.98) 0%, rgba(9,9,11,0.99) 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <div className="flex flex-col flex-grow">
            
            {/* ===== LOGO SECTION - UI Kit'ten birebir ===== */}
            <div 
              className="p-5"
              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* Logo Container: h-11 w-11 = 44px */}
                  <div 
                    className="h-11 w-11 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(234, 179, 8, 0.1) 100%)',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    <AjansBeeLogoSVG className="w-7 h-7" />
                  </div>
                  {/* Online Status: pulse-status */}
                  <div 
                    className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500"
                    style={{
                      border: '2px solid #09090b',
                      animation: 'pulse-glow 2s ease-in-out infinite'
                    }}
                  />
                </div>
                <div>
                  <h1 className="font-bold text-base text-white">Ajans Bee</h1>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">AI Platform</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {/* Ana Menü */}
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-2">Ana Menü</p>
              
              {/* Dashboard - menu-active */}
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive('/dashboard') 
                    ? 'text-white' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
                style={isActive('/dashboard') ? {
                  background: 'linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 100%)',
                  borderLeft: '3px solid #6366f1'
                } : {}}
              >
                <LayoutDashboard className={`w-5 h-5 ${isActive('/dashboard') ? 'text-indigo-500' : ''}`} />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>

              {/* Markalar */}
              <Link
                href="/musteriler"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive('/musteriler') 
                    ? 'text-white' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
                style={isActive('/musteriler') ? {
                  background: 'linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 100%)',
                  borderLeft: '3px solid #6366f1'
                } : {}}
              >
                <Building2 className="w-5 h-5" />
                <span className="text-sm font-medium">Markalar</span>
                {counts.customers > 0 && (
                  <span className="ml-auto text-[11px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-mono">{counts.customers}</span>
                )}
              </Link>

              {/* Teknik Hizmetler */}
              <Link
                href="/teknik-hizmetler"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive('/teknik-hizmetler') 
                    ? 'text-white' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
                style={isActive('/teknik-hizmetler') ? {
                  background: 'linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 100%)',
                  borderLeft: '3px solid #6366f1'
                } : {}}
              >
                <Server className="w-5 h-5" />
                <span className="text-sm font-medium">Teknik Hizmetler</span>
                {counts.services > 0 && (
                  <span className="ml-auto text-[11px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-mono">{counts.services}</span>
                )}
              </Link>

              {/* Araçlar */}
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-2 mt-5">Araçlar</p>
              
              {/* İçerik Üret */}
              <Link
                href="/icerik-uret"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive('/icerik-uret') 
                    ? 'text-white' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
                style={isActive('/icerik-uret') ? {
                  background: 'linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 100%)',
                  borderLeft: '3px solid #6366f1'
                } : {}}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">İçerik Üret</span>
                <span 
                  className="ml-auto text-[10px] text-fuchsia-400 px-2 py-0.5 rounded-full font-mono"
                  style={{
                    background: 'rgba(217, 70, 239, 0.2)',
                    border: '1px solid rgba(217, 70, 239, 0.2)'
                  }}
                >
                  AI
                </span>
              </Link>
            </nav>

            {/* User Section */}
            <div 
              className="p-3"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
            >
              <div 
                className="rounded-xl p-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.email?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.user_metadata?.full_name || 'Ahmet Bozyel'}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-mono">Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ========== MAIN CONTENT (ml-64 = 256px) ========== */}
        <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '256px' }}>
          
          {/* Sticky Header - glass class: şeffaf + blur */}
          <header 
            className="sticky z-40 flex items-center justify-between px-6 py-4"
            style={{
              top: `${TOP_BAR_HEIGHT}px`,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Sol: Sayfa Başlığı */}
            <div>
              <h1 className="text-xl font-bold text-white">
                Hoş geldin, {getUserName()} 👋
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">Hemen içerik üretmeye başla</p>
            </div>
            
            {/* Sağ: Search + Notifications */}
            <div className="flex items-center gap-3">
              {/* Search - input-glow */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Ara..." 
                  className="w-56 pl-10 pr-4 py-2 rounded-lg text-sm text-white placeholder-zinc-400 transition-all focus:outline-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
                <kbd 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 px-1.5 py-0.5 rounded font-mono"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  ⌘K
                </kbd>
              </div>
              
              {/* Notifications */}
              <button 
                className="relative p-2.5 rounded-lg text-zinc-500 transition-all hover:text-white"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
              </button>
            </div>
          </header>
          
          {/* Content - content-bg */}
          <div 
            className="flex-1 p-6"
            style={{
              background: 'radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.12) 0%, transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(139,92,246,0.08) 0%, transparent 40%)'
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Pulse Animation for status dot */}
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(16,185,129,0.6); }
          50% { opacity: 0.6; box-shadow: 0 0 12px rgba(16,185,129,0.8); }
        }
      `}</style>
    </div>
  )
}
