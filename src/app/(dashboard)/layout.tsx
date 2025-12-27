import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { 
  LayoutDashboard, 
  Building2,
  Server,
  LogOut,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Karar #15: Sidebar menü yapısı
const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Markalar', href: '/musteriler', icon: Building2 },
  { name: 'Teknik Hizmetler', href: '/teknik-hizmetler', icon: Server },
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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-border/40 glass px-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center">
            <AjansBeeLogoSVG className="w-5 h-5" />
          </div>
          <span className="font-semibold">Ajans Bee</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow sidebar-bg border-r border-border/40">
            {/* Logo Section */}
            <div className="flex h-16 items-center gap-3 px-5 border-b border-border/40">
              <div className="relative">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <AjansBeeLogoSVG className="w-7 h-7" />
                </div>
                {/* Online Status Dot */}
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 pulse-status"></div>
              </div>
              <div>
                <h1 className="font-bold text-lg text-zinc-900 dark:text-white tracking-tight">Ajans Bee</h1>
                <p className="text-[11px] text-zinc-500 font-mono tracking-wider">AI PLATFORM</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              ))}
            </nav>

            {/* User section */}
            <div className="border-t border-border/40 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.user_metadata?.full_name || 'Kullanıcı'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <form action="/api/auth/signout" method="post">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                  Çıkış Yap
                </Button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:pl-64">
          <div className="content-bg min-h-screen">
            <div className="p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
