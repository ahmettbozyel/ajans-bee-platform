'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Search, Sun, Moon, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Sayfa başlıkları
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Hoş geldin, {name} 👋', subtitle: 'Hemen içerik üretmeye başla' },
  '/dashboard': { title: 'Hoş geldin, {name} 👋', subtitle: 'Hemen içerik üretmeye başla' },
  '/musteriler': { title: 'Markalar', subtitle: "Marka brief'lerini yönetin" },
  '/teknik-hizmetler': { title: 'Teknik Hizmetler', subtitle: 'Hosting, domain ve SSL yönetimi' },
  '/icerik-uret': { title: 'İçerik Üret', subtitle: 'AI ile içerik oluştur' },
  '/gorseller': { title: 'Görseller', subtitle: 'AI ile görsel oluştur' },
  '/gecmis': { title: 'Geçmiş', subtitle: 'Önceki içerikler' },
  '/ayarlar': { title: 'Ayarlar', subtitle: 'Hesap ve uygulama ayarları' },
}

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
    // Dinamik route'lar için (customers/[id])
    if (pathname.startsWith('/customers/')) {
      return { title: 'Marka Detayı', subtitle: "Brief bilgilerini düzenle" }
    }
    return pageTitles[pathname] || { title: 'Dashboard', subtitle: '' }
  }

  const pageInfo = getPageInfo()
  const displayTitle = pageInfo.title.replace('{name}', userName)

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 glass border-b border-zinc-200 dark:border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="h-12" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 glass border-b border-zinc-200 dark:border-white/5 transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Sol: Sayfa Başlığı */}
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white transition-colors">
            {displayTitle}
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">{pageInfo.subtitle}</p>
        </div>
        
        {/* Sağ: Aksiyonlar */}
        <div className="flex items-center gap-3">
          {/* Search with Keyboard Shortcut */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Ara..." 
              className="input-glow w-56 pl-10 pr-12 py-2 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all"
            />
            {/* Keyboard Shortcut - UI Kit */}
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 dark:text-zinc-600 bg-zinc-200 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle p-2.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-all"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-500" />
            )}
          </button>
          
          {/* Notifications with Dot - UI Kit */}
          <button className="relative p-2.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-all">
            <Bell className="h-5 w-5" />
            {/* Notification Dot with ring */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" />
          </button>
        </div>
      </div>
    </header>
  )
}
