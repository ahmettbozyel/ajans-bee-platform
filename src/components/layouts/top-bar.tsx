'use client'

import { useState, useEffect } from 'react'
import { Search, Sun, Moon, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function TopBar() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Hydration için mounted state
  useEffect(() => {
    setMounted(true)
    // Mevcut tema durumunu kontrol et
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

  // Hydration mismatch önlemek için
  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 glass border-b border-border/40">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="w-64" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10" />
            <div className="w-10 h-10" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/40 transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Sol: Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Ara..."
            className="pl-10 pr-12 h-10 bg-muted/50 border-border/40 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all top-bar-search"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded font-mono border border-border/40">
            ⌘K
          </kbd>
        </div>
        
        {/* Sağ: Aksiyonlar */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-lg bg-muted/50 border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-all theme-toggle"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-lg bg-muted/50 border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-all relative"
          >
            <Bell className="h-5 w-5" />
            {/* Notification dot */}
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
          </Button>
        </div>
      </div>
    </header>
  )
}
