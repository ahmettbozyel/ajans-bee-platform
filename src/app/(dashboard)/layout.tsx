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

// Üst Navigation Tabs
const navTabs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Markalar', href: '/musteriler' },
  { label: 'Teknik', href: '/teknik-hizmetler' },
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

  // Aktif sayfa kontrolü
  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  // Tab aktif mi kontrol et
  const isTabActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  // Kullanıcı adını al
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0]
    } else if (user?.email) {
      const name = user.email.split('@')[0]
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
    return 'Kullanıcı'
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

  if (!user) return null

  // Top bar height
  const TOP_BAR_HEIGHT = 48 // px

  return (
    <div className="min-h-screen bg-background">
      
      {/* ========== GLOBAL TOP BAR - Full Width, Above Everything ========== */}
      <header 
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6"
        style={{
          height: `${TOP_BAR_HEIGHT}px`,
          background: isDark ? 'rgba(9, 9, 11, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        {/* Sol: Logo + Version + Tabs */}
        <div className="flex items-center gap-4">
          {/* Logo - Sadece Mobile için hidden değil */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center">
              <AjansBeeLogoSVG className="w-5 h-5" />
            </div>
            <span className="font-semibold text-white text-sm hidden sm:block">Ajans Bee</span>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Version Badge */}
          <span 
            className="text-[11px] font-mono px-2 py-1 rounded hidden sm:block"
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}
          >
            v1.0
          </span>
          
          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            {navTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                style={{
                  background: isTabActive(tab.href) 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'transparent',
                  color: isTabActive(tab.href) 
                    ? '#ffffff' 
                    : 'rgba(161, 161, 170, 1)'
                }}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Sağ: Dark Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400 hidden sm:block">
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all hover:bg-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-500" />
            )}
          </button>
        </div>
      </header>

      {/* ========== MAIN LAYOUT - Below Top Bar ========== */}
      <div className="flex" style={{ paddingTop: `${TOP_BAR_HEIGHT}px` }}>
        
        {/* Sidebar - Fixed, starts below top bar */}
        <aside 
          className="hidden lg:flex lg:w-64 lg:flex-col fixed left-0 z-50"
          style={{ 
            top: `${TOP_BAR_HEIGHT}px`,
            height: `calc(100vh - ${TOP_BAR_HEIGHT}px)`
          }}
        >
          <div 
            className="flex flex-col flex-grow border-r border-white/5 transition-colors duration-300"
            style={{
              background: 'linear-gradient(180deg, rgba(17, 17, 20, 0.98) 0%, rgba(9, 9, 11, 0.99) 100%)'
            }}
          >
            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {/* Ana Menü */}
              <div className="mb-4">
                <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-2">Ana Menü</p>
                
                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive('/dashboard') 
                      ? 'text-white' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
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
                      ? 'text-white' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
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
                      ? 'text-white' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
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
                <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-2 mt-5">Araçlar</p>
                
                {/* İçerik Üret */}
                <Link
                  href="/icerik-uret"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive('/icerik-uret') 
                      ? 'text-white' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
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
                <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-2 mt-5">Sistem</p>
                
                {/* Ayarlar */}
                <Link
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 opacity-50 cursor-not-allowed"
                  onClick={(e) => e.preventDefault()}
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-sm font-medium">Ayarlar</span>
                  <span className="ml-auto text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">Yakında</span>
                </Link>
              </div>
            </nav>

            {/* User Section */}
            <div className="p-3 border-t border-white/5">
              <div 
                className="rounded-xl p-3 border border-white/10"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.user_metadata?.full_name || 'Kullanıcı'}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-mono">Admin</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-zinc-500 hover:text-white"
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
          
          {/* Secondary Header - Page Title + Search */}
          <div 
            className="sticky z-30 hidden lg:flex items-center justify-between px-6 py-4"
            style={{
              top: `${TOP_BAR_HEIGHT}px`,
              background: isDark ? 'rgba(9, 9, 11, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
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
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Ara..." 
                  className="w-56 pl-10 pr-12 py-2 rounded-lg text-sm transition-all focus:outline-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff'
                  }}
                />
                <kbd 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded font-mono"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(161, 161, 170, 1)'
                  }}
                >
                  ⌘K
                </kbd>
              </div>
              
              {/* Notifications */}
              <button 
                className="relative p-2.5 rounded-lg transition-all hover:bg-white/10"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Bell className="h-5 w-5 text-zinc-400" />
                <span 
                  className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full"
                  style={{
                    background: '#f43f5e',
                    boxShadow: '0 0 0 2px rgba(9, 9, 11, 1)'
                  }}
                />
              </button>
            </div>
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
