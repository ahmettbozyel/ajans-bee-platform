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

  const TOP_BAR_HEIGHT = 44

  return (
    <div className="min-h-screen bg-background">
      
      {/* ========== GLOBAL TOP BAR - Sadece Navigation ========== */}
      <header 
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5"
        style={{
          height: `${TOP_BAR_HEIGHT}px`,
          background: '#09090b',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        {/* Sol: Version + Tabs */}
        <div className="flex items-center gap-2">
          {/* Version Badge */}
          <span className="text-xs text-zinc-500 font-mono">
            UI Kit v1.0
          </span>
          
          {/* Divider */}
          <div className="h-4 w-px bg-zinc-800 mx-2" />
          
          {/* Navigation Tabs */}
          <nav className="flex items-center">
            {navTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
                  isTabActive(tab.href) 
                    ? 'bg-zinc-800 text-white' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Sağ: Dark Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-500">
            Dark Mode
          </span>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-400" />
            )}
          </button>
        </div>
      </header>

      {/* ========== MAIN LAYOUT ========== */}
      <div className="flex" style={{ paddingTop: `${TOP_BAR_HEIGHT}px` }}>
        
        {/* ========== SIDEBAR - Logo burada! ========== */}
        <aside 
          className="hidden lg:flex lg:w-52 lg:flex-col fixed left-0 z-50"
          style={{ 
            top: `${TOP_BAR_HEIGHT}px`,
            height: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
            background: '#0a0a0b',
            borderRight: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div className="flex flex-col flex-grow">
            
            {/* ===== LOGO SECTION - Sidebar'da ===== */}
            <div className="p-4 pb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div 
                    className="h-10 w-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(234, 179, 8, 0.08) 100%)',
                      border: '1px solid rgba(251, 191, 36, 0.25)'
                    }}
                  >
                    <AjansBeeLogoSVG className="w-6 h-6" />
                  </div>
                  {/* Online Status Dot */}
                  <div 
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500"
                    style={{
                      border: '2px solid #0a0a0b',
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
                    }}
                  />
                </div>
                <div>
                  <h1 className="font-semibold text-white text-sm">Ajans Bee</h1>
                  <p className="text-[10px] text-zinc-600 font-mono tracking-wider uppercase">AI Platform</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
              {/* Ana Menü */}
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-2">Ana Menü</p>
              
              {/* Dashboard */}
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/dashboard') 
                    ? 'bg-zinc-800/80 text-white' 
                    : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
              >
                <LayoutDashboard className={`h-[18px] w-[18px] ${isActive('/dashboard') ? 'text-indigo-400' : ''}`} />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>

              {/* Markalar */}
              <Link
                href="/musteriler"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/musteriler') 
                    ? 'bg-zinc-800/80 text-white' 
                    : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
              >
                <Building2 className={`h-[18px] w-[18px] ${isActive('/musteriler') ? 'text-violet-400' : ''}`} />
                <span className="text-sm font-medium">Markalar</span>
                {counts.customers > 0 && (
                  <span className="ml-auto text-[11px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded-full font-mono">{counts.customers}</span>
                )}
              </Link>

              {/* Teknik Hizmetler */}
              <Link
                href="/teknik-hizmetler"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/teknik-hizmetler') 
                    ? 'bg-zinc-800/80 text-white' 
                    : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
              >
                <Server className={`h-[18px] w-[18px] ${isActive('/teknik-hizmetler') ? 'text-amber-400' : ''}`} />
                <span className="text-sm font-medium">Teknik Hizmetler</span>
                {counts.services > 0 && (
                  <span className="ml-auto text-[11px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-mono">{counts.services}</span>
                )}
              </Link>

              {/* Araçlar */}
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-2 mt-6">Araçlar</p>
              
              {/* İçerik Üret */}
              <Link
                href="/icerik-uret"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/icerik-uret') 
                    ? 'bg-zinc-800/80 text-white' 
                    : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
              >
                <Sparkles className={`h-[18px] w-[18px] ${isActive('/icerik-uret') ? 'text-fuchsia-400' : ''}`} />
                <span className="text-sm font-medium">İçerik Üret</span>
                <span className="ml-auto text-[10px] bg-fuchsia-500/20 text-fuchsia-400 px-1.5 py-0.5 rounded">AI</span>
              </Link>

              {/* Sistem */}
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-2 mt-6">Sistem</p>
              
              {/* Ayarlar */}
              <Link
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-600 opacity-60 cursor-not-allowed"
                onClick={(e) => e.preventDefault()}
              >
                <Settings className="h-[18px] w-[18px]" />
                <span className="text-sm font-medium">Ayarlar</span>
                <span className="ml-auto text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">Yakında</span>
              </Link>
            </nav>

            {/* User Section */}
            <div className="p-3 border-t border-zinc-800/50">
              <div 
                className="rounded-xl p-2.5"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.user_metadata?.full_name || 'Kullanıcı'}
                    </p>
                    <p className="text-[10px] text-zinc-600 font-mono">Admin</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-zinc-600 hover:text-white hover:bg-zinc-800"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ========== MAIN CONTENT ========== */}
        <div className="flex-1 lg:ml-52 flex flex-col min-h-screen">
          
          {/* Secondary Header - Page Title + Search (BLUR EFEKTLİ) */}
          <div 
            className="sticky z-30 hidden lg:flex items-center justify-between px-6 py-4"
            style={{
              top: `${TOP_BAR_HEIGHT}px`,
              background: 'rgba(9, 9, 11, 0.75)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {/* Sol: Sayfa Başlığı */}
            <div>
              <h1 className="text-xl font-semibold text-white">
                Hoş geldin, {getUserName()} 👋
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">Hemen içerik üretmeye başla</p>
            </div>
            
            {/* Sağ: Search + Notifications */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Ara..." 
                  className="w-48 pl-9 pr-10 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-zinc-700"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#ffffff'
                  }}
                />
                <kbd 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded font-mono text-zinc-600 bg-zinc-800"
                >
                  ⌘K
                </kbd>
              </div>
              
              {/* Notifications */}
              <button 
                className="relative p-2 rounded-lg transition-all hover:bg-zinc-800"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <Bell className="h-4 w-4 text-zinc-500" />
                <span 
                  className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500"
                />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div 
            className="flex-1"
            style={{
              background: 'radial-gradient(ellipse at 20% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)'
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
