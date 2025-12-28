'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { 
  ClipboardList,
  Clock,
  LogOut,
  Loader2,
  Sun,
  Moon,
  Server
} from 'lucide-react'

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

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { appUser, loading, signOut, canAccess } = useAuth()
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
  }, [])

  useEffect(() => {
    if (!loading && !appUser) {
      router.push('/login')
    }
    // Admin ise dashboard'a yönlendir
    if (!loading && appUser?.role === 'admin') {
      router.push('/dashboard')
    }
  }, [loading, appUser, router])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle('dark', newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const isActive = (href: string) => pathname === href

  // Styles
  const styles = {
    bodyBg: isDark ? '#09090b' : '#f8fafc',
    sidebarBg: isDark 
      ? 'linear-gradient(180deg, rgba(17,17,20,0.98) 0%, rgba(9,9,11,0.99) 100%)'
      : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    sidebarBorder: isDark ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0',
    textPrimary: isDark ? '#ffffff' : '#0f172a',
    textSecondary: isDark ? '#a1a1aa' : '#64748b',
    textMuted: isDark ? '#71717a' : '#94a3b8',
    menuActiveBg: isDark 
      ? 'linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 100%)'
      : 'linear-gradient(90deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.02) 100%)',
    userCardBg: isDark 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
      : 'rgba(255, 255, 255, 0.9)',
    userCardBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    logoBg: isDark 
      ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(234, 179, 8, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(234, 179, 8, 0.08) 100%)',
    logoBorder: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.4)',
    statusDotBorder: isDark ? '#09090b' : '#ffffff',
    inputBg: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    contentBg: isDark 
      ? 'radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.12) 0%, transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(139,92,246,0.08) 0%, transparent 40%)'
      : 'radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.06) 0%, transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(139,92,246,0.04) 0%, transparent 40%)',
  }

  if (loading) {
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

  // Menü itemleri (role bazlı)
  const menuItems = [
    { href: '/gunluk-isler', icon: ClipboardList, label: 'Günlük İşler', module: 'gunluk-isler' as const },
    { href: '/giris-cikis', icon: Clock, label: 'Giriş/Çıkış', module: 'giris-cikis' as const },
  ]

  // Operasyon için Teknik Hizmetler
  if (canAccess('teknik-hizmetler')) {
    menuItems.push({ href: '/teknik-hizmetler', icon: Server, label: 'Teknik Hizmetler', module: 'teknik-hizmetler' as const })
  }

  const getRoleBadge = () => {
    switch (appUser.role) {
      case 'operasyon':
        return { text: 'Operasyon', color: 'bg-cyan-500/20 text-cyan-400' }
      case 'personel':
        return { text: 'Personel', color: 'bg-violet-500/20 text-violet-400' }
      default:
        return { text: 'Kullanıcı', color: 'bg-zinc-500/20 text-zinc-400' }
    }
  }

  const roleBadge = getRoleBadge()

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: styles.bodyBg }}>
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <aside 
          className="hidden lg:flex lg:flex-col fixed left-0 top-0 z-50 h-screen transition-colors duration-300"
          style={{ 
            width: '256px',
            background: styles.sidebarBg,
            borderRight: `1px solid ${styles.sidebarBorder}`
          }}
        >
          <div className="flex flex-col flex-grow">
            
            {/* Logo */}
            <div className="p-5" style={{ borderBottom: `1px solid ${styles.sidebarBorder}` }}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div 
                    className="h-11 w-11 rounded-xl flex items-center justify-center"
                    style={{ background: styles.logoBg, border: `1px solid ${styles.logoBorder}` }}
                  >
                    <AjansBeeLogoSVG className="w-7 h-7" isDark={isDark} />
                  </div>
                  <div 
                    className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500"
                    style={{ border: `2px solid ${styles.statusDotBorder}` }}
                  />
                </div>
                <div>
                  <h1 className="font-bold text-base" style={{ color: styles.textPrimary }}>Ajans Bee</h1>
                  <p className="text-[10px] font-mono tracking-widest uppercase" style={{ color: styles.textMuted }}>Staff Panel</p>
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="px-5 py-3" style={{ borderBottom: `1px solid ${styles.sidebarBorder}` }}>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all"
                style={{ background: styles.inputBg, border: `1px solid ${styles.inputBorder}` }}
              >
                <span className="text-xs" style={{ color: styles.textSecondary }}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: styles.textMuted }}>Menü</p>
              
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                  style={{
                    background: isActive(item.href) ? styles.menuActiveBg : 'transparent',
                    borderLeft: isActive(item.href) ? '3px solid #6366f1' : '3px solid transparent',
                    color: isActive(item.href) ? styles.textPrimary : styles.textSecondary
                  }}
                >
                  <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-indigo-500' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Section */}
            <div className="p-3" style={{ borderTop: `1px solid ${styles.sidebarBorder}` }}>
              <div 
                className="rounded-xl p-3"
                style={{ background: styles.userCardBg, border: `1px solid ${styles.userCardBorder}` }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {appUser.full_name?.charAt(0).toUpperCase() || appUser.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: styles.textPrimary }}>
                      {appUser.full_name || appUser.email.split('@')[0]}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${roleBadge.color}`}>
                      {roleBadge.text}
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '256px' }}>
          <div className="flex-1 p-6" style={{ background: styles.contentBg }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
