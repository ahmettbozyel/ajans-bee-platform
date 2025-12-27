'use client'

import { useState, useEffect } from 'react'
import { Search, Sun, Moon, Bell } from 'lucide-react'

export function TopBar() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

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

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 glass border-b border-zinc-200 dark:border-white/5">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="h-12" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 glass border-b border-zinc-200 dark:border-white/5 transition-colors duration-300">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Sol: Sayfa Başlığı */}
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white transition-colors">Dashboard</h1>
          <p className="text-sm text-zinc-500">Hoş geldin 👋</p>
        </div>
        
        {/* Sağ: Aksiyonlar */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Ara..." 
              className="w-64 pl-10 pr-12 py-2 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 dark:text-zinc-600 bg-zinc-200 dark:bg-white/5 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle p-2.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-all"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          
          {/* Notifications */}
          <button className="relative p-2.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" />
          </button>
        </div>
      </div>
    </header>
  )
}
