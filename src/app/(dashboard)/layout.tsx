'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { NotificationBell } from '@/components/notification-bell'
import { 
  LayoutDashboard, 
  Building2,
  Server,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
  Search,
  ClipboardList,
  Clock,
  FolderOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BeeBotChat } from '@/components/BeeBot'

// ==========================================
// AJANS BEE LOGO SVG
// ==========================================
function AjansBeeLogoSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 39.9 53.7">
      <polyline points="8.6,21.9 2.8,2.4 2.8,34.5" fill="#a1a1aa"/>
      <path d="M26.6,34.8c0,3.4-2.7,6.1-6.1,6.1s-6.1-2.7-6.1-6.1s2.7-6.1,6.1-6.1C23.9,28.7,26.6,31.4,26.6,34.8" fill="#FFD600"/>
      <path d="M38.3,34.8C38.3,25,30.3,17,20.5,17S2.8,25,2.8,34.8c0,7.2,4.3,13.3,10.4,16.1l2.3-6.7c-3.4-1.8-5.7-5.3-5.7-9.4c0-5.9,4.8-10.7,10.7-10.7s10.7,4.8,10.7,10.7c0,4-2.2,7.5-5.5,9.4l2.3,6.7C34,48.1,38.3,41.9,38.3,34.8" fill="#d4d4d8"/>
    </svg>
  )
}

// ==========================================
// NAVIGATION CONFIG
// ==========================================
const navTabs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Markalar', href: '/musteriler' },
]

// Erişim kontrolü
const ALLOWED_PAGES: Record<string, string[]> = {
  admin: ['*'],
  yonetici: ['/dashboard', '/gorevler', '/mesai', '/teknik-hizmetler', '/ayarlar'],
  operasyon: ['/dashboard', '/gorevler', '/mesai', '/teknik-hizmetler', '/ayarlar'],
  personel: ['/dashboard', '/gorevler', '/mesai', '/ayarlar'],
  stajer: ['/dashboard', '/gorevler', '/mesai', '/ayarlar']
}

// ==========================================
// SIDEBAR COMPONENT
// ==========================================
function Sidebar({
  isOpen,
  onClose,
  pathname,
  isAdmin,
  isYonetici,
  isOperasyon,
  counts,
  appUser,
  onSignOut
}: {
  isOpen: boolean
  onClose: () => void
  pathname: string
  isAdmin: boolean
  isYonetici: boolean
  isOperasyon: boolean
  counts: { customers: number; services: number }
  appUser: any
  onSignOut: () => void
}) {
  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/' || pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const getUserName = () => {
    if (appUser?.full_name) return appUser.full_name.split(' ')[0]
    if (appUser?.email) {
      const name = appUser.email.split('@')[0]
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
    return 'Kullanıcı'
  }

  const getRoleBadge = () => {
    if (isAdmin) return { label: 'Admin', class: 'badge-emerald' }
    if (appUser?.role === 'yonetici') return { label: 'Yönetici', class: 'badge-amber' }
    if (isOperasyon) return { label: 'Operasyon', class: 'badge-violet' }
    if (appUser?.role === 'stajer') return { label: 'Stajyer', class: 'badge-cyan' }
    return { label: 'Personel', class: 'badge-neutral' }
  }

  const roleBadge = getRoleBadge()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-white/5
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:top-12 lg:h-[calc(100vh-48px)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* Logo Section */}
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-11 w-11 rounded-xl logo-container flex items-center justify-center">
                    <AjansBeeLogoSVG className="w-7 h-7" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#09090b] pulse-status" />
                </div>
                <div>
                  <h1 className="font-bold text-base text-white">Ajans Bee</h1>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">AI Platform</p>
                </div>
              </div>
              
              {/* Mobile Close Button */}
              <button 
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            
            {/* Admin Menü */}
            {isAdmin && (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 text-zinc-500">Ana Menü</p>
                
                <Link href="/dashboard" className={`menu-item ${isActive('/dashboard') ? 'menu-active text-white' : 'text-zinc-400'}`}>
                  <LayoutDashboard className={`w-5 h-5 ${isActive('/dashboard') ? 'text-indigo-400' : ''}`} />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>

                <Link href="/musteriler" className={`menu-item ${isActive('/musteriler') || isActive('/customers') ? 'menu-active text-white' : 'text-zinc-400'}`}>
                  <Building2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Markalar</span>
                  {counts.customers > 0 && (
                    <span className="ml-auto text-[11px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-mono">{counts.customers}</span>
                  )}
                </Link>

                <Link href="/teknik-hizmetler" className={`menu-item ${isActive('/teknik-hizmetler') ? 'menu-active text-white' : 'text-zinc-400'}`}>
                  <Server className="w-5 h-5" />
                  <span className="text-sm font-medium">Teknik Hizmetler</span>
                  {counts.services > 0 && (
                    <span className="ml-auto text-[11px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-mono">{counts.services}</span>
                  )}
                </Link>

                <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-5 text-zinc-500">Araçlar</p>
                
                <Link href="/icerik-uret" className={`menu-item ${isActive('/icerik-uret') ? 'menu-active text-white' : 'text-zinc-400'}`}>
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium">İçerik Üret</span>
                  <span className="ml-auto badge badge-fuchsia font-mono">AI</span>
                </Link>

                <Link href="/gorseller" className={`menu-item ${isActive('/gorseller') ? 'menu-active text-white' : 'text-zinc-400'}`}>
                  <FolderOpen className="w-5 h-5" />
                  <span className="text-sm font-medium">Dosyalar</span>
                </Link>
              </>
            )}

            {/* Yönetici Menü */}
            {isYonetici && (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 text-zinc-500">Ana Menü</p>

                <Link href="/dashboard" className={`menu-item ${isActive('/dashboard') ? 'menu-active text-white' : 'text-zinc-400'}`}>
                  <LayoutDashboard className={`w-5 h-5 ${isActive('/dashboard') ? 'text-indigo-400' : ''}`} />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>

                <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-5 text-zinc-500">Araçlar</p>

                <Link href="/teknik-hizmetler" className={`menu-item ${isActive('/teknik-hizmetler') ? 'menu-active text-white' : 'text-zinc-400'}`}>
                  <Server className="w-5 h-5" />
                  <span className="text-sm font-medium">Teknik Hizmetler</span>
                  {counts.services > 0 && (
                    <span className="ml-auto text-[11px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-mono">{counts.services}</span>
                  )}
                </Link>
              </>
            )}

            {/* Operasyon Menü */}
            {isOperasyon && (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 text-zinc-500">Ana Menü</p>

                <Link href="/dashboard" className={`menu-item ${isActive('/dashboard') ? 'menu-active text-white' : 'text-zinc-400'}`}>
                  <LayoutDashboard className={`w-5 h-5 ${isActive('/dashboard') ? 'text-indigo-400' : ''}`} />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>

                <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-5 text-zinc-500">Araçlar</p>

                <Link href="/teknik-hizmetler" className={`menu-item ${isActive('/teknik-hizmetler') ? 'menu-active text-white' : 'text-zinc-400'}`}>
                  <Server className="w-5 h-5" />
                  <span className="text-sm font-medium">Teknik Hizmetler</span>
                  {counts.services > 0 && (
                    <span className="ml-auto text-[11px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-mono">{counts.services}</span>
                  )}
                </Link>
              </>
            )}

            {/* Personel/Stajyer Menü */}
            {!isAdmin && !isOperasyon && !isYonetici && (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 text-zinc-500">Ana Menü</p>

                <Link href="/dashboard" className={`menu-item ${isActive('/dashboard') ? 'menu-active text-white' : 'text-zinc-400'}`}>
                  <LayoutDashboard className={`w-5 h-5 ${isActive('/dashboard') ? 'text-indigo-400' : ''}`} />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
              </>
            )}

            {/* Personel Menü (herkes için) */}
            <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-5 text-zinc-500">Personel</p>

            <Link href="/gorevler" className={`menu-item ${isActive('/gorevler') ? 'menu-active text-white' : 'text-zinc-400'}`}>
              <ClipboardList className="w-5 h-5" />
              <span className="text-sm font-medium">Görevler</span>
            </Link>

            <Link href="/mesai" className={`menu-item ${isActive('/mesai') ? 'menu-active text-white' : 'text-zinc-400'}`}>
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Mesai</span>
            </Link>

            {/* Ayarlar - Herkes görebilir (Profil için) */}
            <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-5 text-zinc-500">
              {(isAdmin || isYonetici) ? 'Sistem' : 'Hesap'}
            </p>

            <Link href="/ayarlar" className={`menu-item ${isActive('/ayarlar') ? 'menu-active text-white' : 'text-zinc-400'}`}>
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Ayarlar</span>
            </Link>
          </nav>

          {/* User Section */}
          <div className="flex-shrink-0 p-3 border-t border-white/5">
            <div className="user-card rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {appUser?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {appUser?.full_name || getUserName()}
                  </p>
                  <span className={`badge ${roleBadge.class}`}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="group w-full mt-3 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20"
              >
                <LogOut className="w-4 h-4 text-rose-400 transition-transform group-hover:-translate-x-0.5" />
                <span className="text-rose-400">Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// ==========================================
// MAIN LAYOUT
// ==========================================
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { appUser, loading: authLoading, isAdmin, signOut } = useAuth()
  const [counts, setCounts] = useState({ customers: 0, services: 0 })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Marka detay sayfası kontrolü
  const isDetailPage = pathname.includes('/customers/') && pathname.split('/').length > 2

  // Erişim kontrolü
  const hasAccess = (role: string, path: string): boolean => {
    if (role === 'admin') return true
    const allowedPaths = ALLOWED_PAGES[role] || []
    return allowedPaths.some(p => path.startsWith(p))
  }

  // Auth & Data fetch
  useEffect(() => {
    if (authLoading) return

    if (!appUser) {
      window.location.href = '/login'
      return
    }

    const userRole = appUser.role || 'personel'
    if (!hasAccess(userRole, pathname)) {
      router.push('/dashboard')
      return
    }

    async function fetchData() {
      try {
        if (isAdmin || appUser?.role === 'yonetici' || appUser?.role === 'operasyon') {
          const supabase = createClient()
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
  }, [authLoading, appUser, isAdmin, router, pathname])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  const isTabActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/' || pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const getUserName = () => {
    if (appUser?.full_name) return appUser.full_name.split(' ')[0]
    if (appUser?.email) {
      const name = appUser.email.split('@')[0]
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
    return 'Kullanıcı'
  }

  const isYonetici = appUser?.role === 'yonetici'
  const isOperasyon = appUser?.role === 'operasyon'

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-body">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm text-zinc-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!appUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-body">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm text-zinc-500">Giriş sayfasına yönlendiriliyor...</p>
        </div>
      </div>
    )
  }

  const userRole = appUser.role || 'personel'
  // Erişim yoksa loading göster (useEffect redirect yapacak)
  if (!hasAccess(userRole, pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-body">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm text-zinc-500">Yönlendiriliyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-body">
      
      {/* ========== TOP NAV ========== */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-topnav border-b border-white/10 flex items-center justify-between px-4">
        {/* Sol: Hamburger + Version + Tabs */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 text-zinc-400"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <span className="text-xs font-mono text-zinc-500 hidden sm:block">v2.0</span>
          
          {isAdmin && (
            <>
              <span className="text-zinc-600 hidden sm:block">|</span>
              <div className="hidden sm:flex gap-1">
                {navTabs.map((tab) => (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      isTabActive(tab.href) 
                        ? 'bg-white/10 text-white' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Sağ: Search + Notifications */}
        {isAdmin && (
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Ara..." 
                className="w-48 pl-10 pr-4 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded font-mono bg-white/5 text-zinc-500">
                ⌘K
              </kbd>
            </div>
            <NotificationBell />
          </div>
        )}
      </header>

      {/* ========== SIDEBAR ========== */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pathname={pathname}
        isAdmin={isAdmin}
        isYonetici={isYonetici}
        isOperasyon={isOperasyon}
        counts={counts}
        appUser={appUser}
        onSignOut={handleSignOut}
      />

      {/* ========== MAIN CONTENT ========== */}
      <div className="lg:ml-64 pt-12 min-h-screen flex flex-col">
        
        {/* Page Header - Sadece liste sayfalarında göster */}
        {!isDetailPage && (
          <header className="sticky top-12 z-30 bg-topnav border-b border-white/5 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  Hoş geldin, {getUserName()} 👋
                </h1>
                <p className="text-sm text-zinc-500 mt-0.5 hidden sm:block">
                  {isAdmin ? 'Hemen içerik üretmeye başla' : 'Günlük işlerini kaydet'}
                </p>
              </div>
            </div>
          </header>
        )}
        
        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 bg-content">
          {children}
        </main>
      </div>

      {/* ========== MOBILE BOTTOM NAV ========== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-topnav border-t border-white/10 px-2 py-2 safe-area-pb">
        <div className="flex items-center justify-around">
          {isAdmin && (
            <>
              <Link href="/dashboard" className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${isTabActive('/dashboard') ? 'text-indigo-400' : 'text-zinc-500'}`}>
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-[10px] font-medium">Ana Sayfa</span>
              </Link>
              <Link href="/musteriler" className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${isTabActive('/musteriler') ? 'text-indigo-400' : 'text-zinc-500'}`}>
                <Building2 className="w-5 h-5" />
                <span className="text-[10px] font-medium">Markalar</span>
              </Link>
              <Link href="/icerik-uret" className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${isTabActive('/icerik-uret') ? 'text-fuchsia-400' : 'text-zinc-500'}`}>
                <Sparkles className="w-5 h-5" />
                <span className="text-[10px] font-medium">Üret</span>
              </Link>
            </>
          )}
          {!isAdmin && (
            <Link href="/dashboard" className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${isTabActive('/dashboard') ? 'text-indigo-400' : 'text-zinc-500'}`}>
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] font-medium">Dashboard</span>
            </Link>
          )}
          <Link href="/gorevler" className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${isTabActive('/gorevler') ? 'text-indigo-400' : 'text-zinc-500'}`}>
            <ClipboardList className="w-5 h-5" />
            <span className="text-[10px] font-medium">Görevler</span>
          </Link>
          <Link href="/mesai" className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${isTabActive('/mesai') ? 'text-indigo-400' : 'text-zinc-500'}`}>
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-medium">Mesai</span>
          </Link>
        </div>
      </nav>
      
      {/* Bottom nav için boşluk */}
      <div className="lg:hidden h-16" />

      {/* BeeBot Chatbot */}
      <BeeBotChat />
    </div>
  )
}
