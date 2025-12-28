'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TopBar } from '@/components/layouts/top-bar'
import type { User } from '@supabase/supabase-js'

// Karar #18: Sidebar w-64 (256px)
// Karar #15: Sidebar menü yapısı
const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, comingSoon: false },
  { name: 'Markalar', href: '/musteriler', icon: Building2, comingSoon: false },
  { name: 'Teknik Hizmetler', href: '/teknik-hizmetler', icon: Server, comingSoon: false },
]

const tools = [
  { name: 'İçerik Üret', href: '/icerik-uret', icon: Sparkles, badge: 'AI', comingSoon: false },
]

const system = [
  { name: 'Ayarlar', href: '/ayarlar', icon: Settings, comingSoon: true },
]

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setUser(user)
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    
    getUser()
  }, [router, supabase.auth])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
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

  // No user (shouldn't happen as we redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-zinc-200 dark:border-white/5 glass px-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center">
            <AjansBeeLogoSVG className="w-5 h-5" />
          </div>
          <span className="font-semibold text-zinc-900 dark:text-white">Ajans Bee</span>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar - w-64 (256px) - Karar #18 */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col fixed left-0 top-0 h-full z-50">
          <div className="flex flex-col flex-grow sidebar-bg border-r border-zinc-200 dark:border-white/5 transition-colors duration-300">
            {/* Logo Section */}
            <div className="p-5 border-b border-zinc-200 dark:border-white/5 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
                    <AjansBeeLogoSVG className="w-7 h-7" />
                  </div>
                  {/* Online Status Dot */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 pulse-status"></div>
                </div>
                <div>
                  <h1 className="font-bold text-base text-zinc-900 dark:text-white tracking-tight transition-colors">Ajans Bee</h1>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">AI Platform</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {/* Ana Menü */}
              <div className="mb-4">
                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-3 mb-2">Ana Menü</p>
                
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.comingSoon ? '#' : item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      item.comingSoon 
                        ? 'text-zinc-400 dark:text-zinc-500 opacity-50 cursor-not-allowed' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                    onClick={item.comingSoon ? (e) => e.preventDefault() : undefined}
                  >
                    <item.icon className={`h-5 w-5 ${
                      item.comingSoon 
                        ? '' 
                        : 'group-hover:text-indigo-500 dark:group-hover:text-indigo-400'
                    } transition-colors`} />
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.comingSoon && (
                      <span className="ml-auto text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">Yakında</span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Araçlar */}
              <div className="mb-4">
                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-3 mb-2 mt-5">Araçlar</p>
                
                {tools.map((item) => (
                  <Link
                    key={item.name}
                    href={item.comingSoon ? '#' : item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      item.comingSoon 
                        ? 'text-zinc-400 dark:text-zinc-500 opacity-50 cursor-not-allowed' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                    onClick={item.comingSoon ? (e) => e.preventDefault() : undefined}
                  >
                    <item.icon className={`h-5 w-5 ${
                      item.comingSoon 
                        ? '' 
                        : 'group-hover:text-fuchsia-500 dark:group-hover:text-fuchsia-400'
                    } transition-colors`} />
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto text-[10px] bg-fuchsia-500/20 text-fuchsia-400 px-2 py-0.5 rounded border border-fuchsia-500/20">{item.badge}</span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Sistem */}
              <div>
                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-3 mb-2 mt-5">Sistem</p>
                
                {system.map((item) => (
                  <Link
                    key={item.name}
                    href={item.comingSoon ? '#' : item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      item.comingSoon 
                        ? 'text-zinc-400 dark:text-zinc-500 opacity-50 cursor-not-allowed' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                    onClick={item.comingSoon ? (e) => e.preventDefault() : undefined}
                  >
                    <item.icon className={`h-5 w-5 ${
                      item.comingSoon 
                        ? '' 
                        : 'group-hover:text-indigo-500 dark:group-hover:text-indigo-400'
                    } transition-colors`} />
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.comingSoon && (
                      <span className="ml-auto text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">Yakında</span>
                    )}
                  </Link>
                ))}
              </div>
            </nav>

            {/* User Section */}
            <div className="p-3 border-t border-zinc-200 dark:border-white/5 transition-colors duration-300">
              <div className="glass-card rounded-xl p-3 border border-zinc-200 dark:border-white/10 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate transition-colors">
                      {user.user_metadata?.full_name || 'Kullanıcı'}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-mono">Admin</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content - ml-64 */}
        <main className="flex-1 lg:ml-64">
          {/* Top Bar - Desktop only */}
          <div className="hidden lg:block">
            <TopBar />
          </div>
          
          <div className="content-bg min-h-screen transition-colors duration-300">
            <div className="p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
