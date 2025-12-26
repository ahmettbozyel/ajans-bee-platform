import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { 
  LayoutDashboard, 
  PenTool, 
  Image, 
  History, 
  Building2,
  Server,
  LogOut,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'İçerik Üret', href: '/icerik-uret', icon: PenTool },
  { name: 'Görseller', href: '/gorseller', icon: Image },
  { name: 'Geçmiş', href: '/gecmis', icon: History },
  { name: 'Markalar', href: '/musteriler', icon: Building2 },
  { name: 'Teknik Hizmetler', href: '/teknik-hizmetler', icon: Server },
]

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
    <div className="min-h-screen bg-muted/30">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-xl">🐝</span>
          <span className="font-semibold">Ajans Bee</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow border-r bg-background">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 px-6 border-b">
              <span className="text-2xl">🐝</span>
              <span className="font-bold text-lg">Ajans Bee AI</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User section */}
            <div className="border-t p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
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
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <LogOut className="h-4 w-4" />
                  Çıkış Yap
                </Button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:pl-64">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
