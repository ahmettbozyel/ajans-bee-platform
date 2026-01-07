'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Sun, Moon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NotificationBell } from '@/components/notification-bell'

// Sayfa başlıkları
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Hoş geldin, {name} 👋', subtitle: 'Hemen içerik üretmeye başla' },
  '/dashboard': { title: 'Hoş geldin, {name} 👋', subtitle: 'Hemen içerik üretmeye başla' },
  '/teknik-hizmetler': { title: 'Teknik Hizmetler', subtitle: 'Hosting, domain ve SSL yönetimi' },
  '/ayarlar': { title: 'Ayarlar', subtitle: 'Hesap ve uygulama ayarları' },
  '/gorevler': { title: 'Görevler', subtitle: 'Günlük görev takibi' },
  '/mesai': { title: 'Mesai', subtitle: 'Mesai takibi' },
}

// Üst Navigation Tabs
const navTabs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Teknik', href: '/teknik-hizmetler' },
]

export function TopBar() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [userName, setUserName] = useState('Kullanıcı')

  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
    fetchUser()
  }, [])

  async function fetchUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name.split(' ')[0])
    } else if (user?.email) {
      const name = user.email.split('@')[0]
      setUserName(name.charAt(0).toUpperCase() + name.slice(1))
    }
  }

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

  // Sayfa başlığını al
  const getPageInfo = () => {
    return pageTitles[pathname] || { title: 'Dashboard', subtitle: '' }
  }

  // Tab aktif mi kontrol et
  const isTabActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const pageInfo = getPageInfo()
  const displayTitle = pageInfo.title.replace('{name}', userName)

  if (!mounted) {
    return (
      <header 
        className="sticky top-0 z-40"
        style={{
          background: 'rgba(9, 9, 11, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div className="h-24" />
      </header>
    )
  }

  return (
    <header 
      className="sticky top-0 z-40"
      style={{
        background: isDark ? 'rgba(9, 9, 11, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* Üst Navigation Bar */}
      <div 
        className="flex items-center justify-between px-6 py-2"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
      >
        {/* Sol: Version + Tabs */}
        <div className="flex items-center gap-1">
          {/* Version Badge */}
          <span 
            className="text-[11px] font-mono px-2 py-1 rounded mr-3"
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}
          >
            v1.0
          </span>
          
          {/* Navigation Tabs */}
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
        </div>
        
        {/* Sağ: Dark Mode Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400">
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all"
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
      </div>

      {/* Alt: Ana Header */}
      <div 
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
      >
        {/* Sol: Sayfa Başlığı */}
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white transition-colors">
            {displayTitle}
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">{pageInfo.subtitle}</p>
        </div>
        
        {/* Sağ: Search + Notifications */}
        <div className="flex items-center gap-3">
          {/* Search with Keyboard Shortcut */}
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
          
          {/* Notifications Bell - Tablo oluşturulunca aktif edilecek */}
          {/* <NotificationBell /> */}
        </div>
      </div>
    </header>
  )
}
