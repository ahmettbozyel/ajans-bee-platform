'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
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
  Bell,
  ClipboardList,
  Clock,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'

// Ajans Bee Logo SVG Component
function AjansBeeLogoSVG({ className, isDark }: { className?: string, isDark: boolean }) {
  return (
    <svg className={className} viewBox="0 0 39.9 53.7">
      <polyline points="8.6,21.9 2.8,2.4 2.8,34.5" fill={isDark ? '#a1a1aa' : '#71717a'}/>
      <path d="M26.6,34.8c0,3.4-2.7,6.1-6.1,6.1s-6.1-2.7-6.1-6.1s2.7-6.1,6.1-6.1C23.9,28.7,26.6,31.4,26.6,34.8" fill="#FFD600"/>
      <path d="M38.3,34.8C38.3,25,30.3,17,20.5,17S2.8,25,2.8,34.8c0,7.2,4.3,13.3,10.4,16.1l2.3-6.7c-3.4-1.8-5.7-5.3-5.7-9.4c0-5.9,4.8-10.7,10.7-10.7s10.7,4.8,10.7,10.7c0,4-2.2,7.5-5.5,9.4l2.3,6.7C34,48.1,38.3,41.9,38.3,34.8" fill={isDark ? '#d4d4d8' : '#3f3f46'}/>
    </svg>
  )
}

// Üst Navigation Tabs
const navTabs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Markalar', href: '/musteriler' },
  { label: 'Components', href: '#' },
]

// Personel sayfaları - admin olmayanlar sadece bunlara erişebilir
const STAFF_PAGES = ['/gunluk-isler', '/giris-cikis']

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { appUser, loading: authLoading, isAdmin, signOut } = useAuth()
  const [counts, setCounts] = useState({ customers: 0, services: 0 })
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  const supabase = createClient()

  // Marka detay sayfasında mı kontrol et
  const isCustomerDetailPage = pathname.startsWith('/customers/') || pathname.startsWith('/musteriler/')
  const isDetailPage = pathname.includes('/customers/') && pathname.split('/').length > 2
  
  // Personel sayfasında mı?
  const isStaffPage = STAFF_PAGES.some(page => pathname.startsWith(page))

  useEffect(() => {
    setMounted(true)
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    }
  }, [])

  useEffect(() => {
    // Auth loading bitmeden bekle
    if (authLoading) return
    
    // Kullanıcı yoksa login'e yönlendir
    if (!appUser) {
      router.push('/login')
      return
    }
    
    // Admin değilse VE personel sayfasında DEĞİLSE → personel sayfasına yönlendir
    if (!isAdmin && !isStaffPage) {
      router.push('/gunluk-isler')
      return
    }
    
    // Verileri çek (arka planda, loading bekletmeden)
    async function fetchData() {
      try {
        // Admin için tüm verileri çek
        if (isAdmin) {
          const [customersRes, servicesRes] = await Promise.all([
            supabase.from('customers').select('id', { count: 'exact', head: true }),
            supabase.from('technical_services').select('id', { count: 'exact', head: true })
          ])
          setCounts({
            customers: customersRes.count || 0,
            services: servicesRes.count || 0
          })
        }
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }
    
    fetchData()
  }, [authLoading, appUser, isAdmin, isStaffPage, router, supabase, pathname])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle('dark', newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  async function handleSignOut() {
    await signOut()
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
    if (appUser?.full_name) {
      return appUser.full_name.split(' ')[0]
    } else if (appUser?.email) {
      const name = appUser.email.split('@')[0]
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
    return 'Kullanıcı'
  }
  
  const getRoleBadge = () => {
    if (isAdmin) return { label: 'Admin', color: 'emerald' }
    if (appUser?.role === 'operasyon') return { label: 'Operasyon', color: 'violet' }
    return { label: 'Personel', color: 'blue' }
  }

  // ==========================================
  // THEME-AWARE STYLES
  // ==========================================
  const styles = {
    // Body background
    bodyBg: isDark ? '#09090b' : '#f8fafc',
    
    // Top nav
    topNavBg: isDark ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    topNavBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    
    // Sidebar
    sidebarBg: isDark 
      ? 'linear-gradient(180deg, rgba(17,17,20,0.98) 0%, rgba(9,9,11,0.99) 100%)'
      : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    sidebarBorder: isDark ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0',
    
    // Glass header
    glassBg: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.8)',
    glassBorder: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    
    // Content background
    contentBg: isDark 
      ? 'radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.12) 0%, transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(139,92,246,0.08) 0%, transparent 40%)'
      : 'radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.06) 0%, transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(139,92,246,0.04) 0%, transparent 40%)',
    
    // Text colors
    textPrimary: isDark ? '#ffffff' : '#0f172a',
    textSecondary: isDark ? '#a1a1aa' : '#64748b',
    textMuted: isDark ? '#71717a' : '#94a3b8',
    
    // Input/button backgrounds
    inputBg: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    
    // Menu active
    menuActiveBg: isDark 
      ? 'linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 100%)'
      : 'linear-gradient(90deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.02) 100%)',
    
    // User card
    userCardBg: isDark 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
      : 'rgba(255, 255, 255, 0.9)',
    userCardBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    
    // Status dot border
    statusDotBorder: isDark ? '#09090b' : '#ffffff',
    
    // Logo container
    logoBg: isDark 
      ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(234, 179, 8, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(234, 179, 8, 0.08) 100%)',
    logoBorder: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.4)',
  }

  // Auth loading bekle
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: styles.bodyBg }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm" style={{ color: styles.textMuted }}>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!appUser) return null
  
  // Admin değilse ve personel sayfasında değilse hiçbir şey gösterme (yönlendirme yapılıyor)
  if (!isAdmin && !isStaffPage) return null

  const TOP_BAR_HEIGHT = 48
  const roleBadge = getRoleBadge()

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: styles.bodyBg }}>
      
      {/* ========== TOP NAV ========== */}
      <header 
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 py-2 transition-colors duration-300"
        style={{
          background: styles.topNavBg,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${styles.topNavBorder}`
        }}
      >
        {/* Sol: Version + Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: styles.textMuted }}>UI Kit v1.0</span>
          {isAdmin && (
            <>
              <span style={{ color: styles.textMuted }}>|</span>
              <div className="flex gap-1">
                {navTabs.map((tab) => (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
                    style={{
                      background: isTabActive(tab.href) ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)') : 'transparent',
                      color: isTabActive(tab.href) ? styles.textPrimary : styles.textSecondary
                    }}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Sağ: Dark Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: styles.textMuted }}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all hover:rotate-12"
            style={{
              background: styles.inputBg,
              border: `1px solid ${styles.inputBorder}`
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

      {/* Spacer */}
      <div style={{ height: `${TOP_BAR_HEIGHT}px` }} />

      {/* ========== MAIN LAYOUT ========== */}
      <div className="flex" style={{ minHeight: `calc(100vh - ${TOP_BAR_HEIGHT}px)` }}>
        
        {/* ========== SIDEBAR ========== */}
        <aside 
          className="hidden lg:flex lg:flex-col fixed left-0 z-50 transition-colors duration-300"
          style={{ 
            top: `${TOP_BAR_HEIGHT}px`,
            height: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
            width: '256px',
            background: styles.sidebarBg,
            borderRight: `1px solid ${styles.sidebarBorder}`
          }}
        >
          <div className="flex flex-col flex-grow">
            
            {/* Logo Section */}
            <div 
              className="p-5 transition-colors duration-300"
              style={{ borderBottom: `1px solid ${styles.sidebarBorder}` }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div 
                    className="h-11 w-11 rounded-xl flex items-center justify-center transition-colors duration-300"
                    style={{
                      background: styles.logoBg,
                      border: `1px solid ${styles.logoBorder}`
                    }}
                  >
                    <AjansBeeLogoSVG className="w-7 h-7" isDark={isDark} />
                  </div>
                  <div 
                    className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500"
                    style={{
                      border: `2px solid ${styles.statusDotBorder}`,
                      animation: 'pulse-glow 2s ease-in-out infinite'
                    }}
                  />
                </div>
                <div>
                  <h1 className="font-bold text-base transition-colors duration-300" style={{ color: styles.textPrimary }}>Ajans Bee</h1>
                  <p className="text-[10px] font-mono tracking-widest uppercase" style={{ color: styles.textMuted }}>AI Platform</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              
              {/* Admin menüsü */}
              {isAdmin && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: styles.textMuted }}>Ana Menü</p>
                  
                  {/* Dashboard */}
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                    style={{
                      background: isActive('/dashboard') ? styles.menuActiveBg : 'transparent',
                      borderLeft: isActive('/dashboard') ? '3px solid #6366f1' : '3px solid transparent',
                      color: isActive('/dashboard') ? styles.textPrimary : styles.textSecondary
                    }}
                  >
                    <LayoutDashboard className={`w-5 h-5 ${isActive('/dashboard') ? 'text-indigo-500' : ''}`} />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>

                  {/* Markalar */}
                  <Link
                    href="/musteriler"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                    style={{
                      background: isActive('/musteriler') || isActive('/customers') ? styles.menuActiveBg : 'transparent',
                      borderLeft: isActive('/musteriler') || isActive('/customers') ? '3px solid #6366f1' : '3px solid transparent',
                      color: isActive('/musteriler') || isActive('/customers') ? styles.textPrimary : styles.textSecondary
                    }}
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                    style={{
                      background: isActive('/teknik-hizmetler') ? styles.menuActiveBg : 'transparent',
                      borderLeft: isActive('/teknik-hizmetler') ? '3px solid #6366f1' : '3px solid transparent',
                      color: isActive('/teknik-hizmetler') ? styles.textPrimary : styles.textSecondary
                    }}
                  >
                    <Server className="w-5 h-5" />
                    <span className="text-sm font-medium">Teknik Hizmetler</span>
                    {counts.services > 0 && (
                      <span className="ml-auto text-[11px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-mono">{counts.services}</span>
                    )}
                  </Link>

                  <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-5" style={{ color: styles.textMuted }}>Araçlar</p>
                  
                  {/* İçerik Üret */}
                  <Link
                    href="/icerik-uret"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                    style={{
                      background: isActive('/icerik-uret') ? styles.menuActiveBg : 'transparent',
                      borderLeft: isActive('/icerik-uret') ? '3px solid #6366f1' : '3px solid transparent',
                      color: isActive('/icerik-uret') ? styles.textPrimary : styles.textSecondary
                    }}
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
                </>
              )}

              <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-5" style={{ color: styles.textMuted }}>Personel</p>
              
              {/* Günlük İşler */}
              <Link
                href="/gunluk-isler"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                style={{
                  background: isActive('/gunluk-isler') ? styles.menuActiveBg : 'transparent',
                  borderLeft: isActive('/gunluk-isler') ? '3px solid #6366f1' : '3px solid transparent',
                  color: isActive('/gunluk-isler') ? styles.textPrimary : styles.textSecondary
                }}
              >
                <ClipboardList className="w-5 h-5" />
                <span className="text-sm font-medium">Günlük İşler</span>
              </Link>

              {/* Giriş/Çıkış */}
              <Link
                href="/giris-cikis"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                style={{
                  background: isActive('/giris-cikis') ? styles.menuActiveBg : 'transparent',
                  borderLeft: isActive('/giris-cikis') ? '3px solid #6366f1' : '3px solid transparent',
                  color: isActive('/giris-cikis') ? styles.textPrimary : styles.textSecondary
                }}
              >
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Giriş/Çıkış</span>
              </Link>

              {/* Ayarlar - sadece admin, ayrı bölüm */}
              {isAdmin && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-5" style={{ color: styles.textMuted }}>Sistem</p>
                  
                  <Link
                    href="/ayarlar"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                    style={{
                      background: isActive('/ayarlar') ? styles.menuActiveBg : 'transparent',
                      borderLeft: isActive('/ayarlar') ? '3px solid #6366f1' : '3px solid transparent',
                      color: isActive('/ayarlar') ? styles.textPrimary : styles.textSecondary
                    }}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Ayarlar</span>
                  </Link>
                </>
              )}
            </nav>

            {/* User Section */}
            <div 
              className="p-3 transition-colors duration-300"
              style={{ borderTop: `1px solid ${styles.sidebarBorder}` }}
            >
              <div 
                className="rounded-xl p-3 transition-colors duration-300"
                style={{
                  background: styles.userCardBg,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${styles.userCardBorder}`
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {appUser.email?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate transition-colors duration-300" style={{ color: styles.textPrimary }}>
                      {appUser.full_name || getUserName()}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium bg-${roleBadge.color}-500/20 text-${roleBadge.color}-400`}>
                      {roleBadge.label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ========== MAIN CONTENT ========== */}
        <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '256px' }}>
          
          {/* Sticky Header - Sadece detay sayfası DEĞİLSE göster */}
          {!isDetailPage && (
            <header 
              className="sticky z-40 flex items-center justify-between px-6 py-4 transition-colors duration-300"
              style={{
                top: `${TOP_BAR_HEIGHT}px`,
                background: styles.glassBg,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${styles.glassBorder}`
              }}
            >
              <div>
                <h1 className="text-xl font-bold transition-colors duration-300" style={{ color: styles.textPrimary }}>
                  Hoş geldin, {getUserName()} 👋
                </h1>
                <p className="text-sm mt-0.5" style={{ color: styles.textMuted }}>
                  {isAdmin ? 'Hemen içerik üretmeye başla' : 'Günlük işlerini kaydet'}
                </p>
              </div>
              
              {isAdmin && (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: styles.textMuted }} />
                    <input 
                      type="text" 
                      placeholder="Ara..." 
                      className="w-56 pl-10 pr-4 py-2 rounded-lg text-sm transition-all focus:outline-none"
                      style={{
                        background: styles.inputBg,
                        border: `1px solid ${styles.inputBorder}`,
                        color: styles.textPrimary
                      }}
                    />
                    <kbd 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded font-mono"
                      style={{ background: styles.inputBg, color: styles.textMuted }}
                    >
                      ⌘K
                    </kbd>
                  </div>
                  
                  <button 
                    className="relative p-2.5 rounded-lg transition-all"
                    style={{
                      background: styles.inputBg,
                      border: `1px solid ${styles.inputBorder}`,
                      color: styles.textMuted
                    }}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
                  </button>
                </div>
              )}
            </header>
          )}
          
          {/* Content */}
          <div 
            className="flex-1 p-6 transition-colors duration-300"
            style={{ background: styles.contentBg }}
          >
            {children}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(16,185,129,0.6); }
          50% { opacity: 0.6; box-shadow: 0 0 12px rgba(16,185,129,0.8); }
        }
      `}</style>
    </div>
  )
}
