import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { 
  LayoutDashboard, 
  Building2,
  Server,
  Settings,
  LogOut,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TopBar } from '@/components/layouts/top-bar'

// Karar #15: Sidebar menü yapısı
const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, comingSoon: false },
  { name: 'Markalar', href: '/musteriler', icon: Building2, comingSoon: false },
  { name: 'Teknik Hizmetler', href: '/teknik-hizmetler', icon: Server, comingSoon: false },
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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (error) {
    console.error('Auth error:', error)
  }

  if (!user) {
    redirect('/login')
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
        {/* Sidebar - w-72 (288px) */}
        <aside className="hidden lg:flex lg:w-72 lg:flex-col fixed left-0 top-0 h-full z-50">
          <div className="flex flex-col flex-grow sidebar-bg border-r border-zinc-200 dark:border-white/5 transition-colors duration-300">
            {/* Logo Section */}
            <div className="p-6 border-b border-zinc-200 dark:border-white/5 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
                    <AjansBeeLogoSVG className="w-7 h-7" />
                  </div>
                  {/* Online Status Dot */}
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 pulse-status"></div>
                </div>
                <div>
                  <h1 className="font-bold text-lg text-zinc-900 dark:text-white tracking-tight transition-colors">Ajans Bee</h1>
                  <p className="text-[11px] text-zinc-500 font-mono tracking-wider">AI PLATFORM</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {/* Ana Menü */}
              <div className="mb-6">
                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-3 mb-3">Ana Menü</p>
                
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
                      <span className="ml-auto text-[10px] bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full">Yakında</span>
                    )}
                  </Link>
                ))}
              </div>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-zinc-200 dark:border-white/5 transition-colors duration-300">
              <div className="glass-card rounded-xl p-3 border border-zinc-200 dark:border-white/5 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate transition-colors">
                      {user.user_metadata?.full_name || 'Kullanıcı'}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-mono">Admin</p>
                  </div>
                  <form action="/api/auth/signout" method="post">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content - ml-72 */}
        <main className="flex-1 lg:ml-72">
          {/* Top Bar - Desktop only */}
          <div className="hidden lg:block">
            <TopBar />
          </div>
          
          <div className="content-bg min-h-screen transition-colors duration-300">
            <div className="p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
