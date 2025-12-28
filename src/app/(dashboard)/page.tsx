'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  FileText,
  Building2, 
  Calendar,
  Sparkles,
  Image,
  History,
  Users,
  Inbox,
  Search,
  Bell
} from 'lucide-react'
import type { Customer } from '@/lib/customer-types'

export default function DashboardPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('Kullanıcı')

  const supabase = createClient()

  useEffect(() => {
    fetchData()
    fetchUser()
  }, [])

  async function fetchUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email) {
      // Email'den isim çıkar (@ öncesi)
      const name = user.email.split('@')[0]
      // İlk harfi büyük yap
      setUserName(name.charAt(0).toUpperCase() + name.slice(1))
    }
  }

  async function fetchData() {
    setLoading(true)
    
    try {
      const { data: customersData } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
      
      setCustomers(customersData || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const activeCustomers = customers.filter(c => c.status !== 'inactive')

  // Hızlı İşlemler
  const quickActions = [
    {
      title: 'İçerik Üret',
      description: 'AI ile içerik oluştur',
      icon: Sparkles,
      href: '/icerik-uret',
      gradient: 'from-fuchsia-100 to-violet-100 dark:from-fuchsia-500/10 dark:to-violet-500/10',
      border: 'border-fuchsia-200 dark:border-fuchsia-500/20',
      iconColor: 'text-fuchsia-600 dark:text-fuchsia-400'
    },
    {
      title: 'Görseller',
      description: 'AI ile görsel oluştur',
      icon: Image,
      href: '/gorseller',
      gradient: 'from-emerald-100 to-teal-100 dark:from-emerald-500/10 dark:to-teal-500/10',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Geçmiş',
      description: 'Önceki içerikler',
      icon: History,
      href: '/gecmis',
      gradient: 'from-blue-100 to-indigo-100 dark:from-blue-500/10 dark:to-indigo-500/10',
      border: 'border-blue-200 dark:border-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Markalar',
      description: "Brief'leri yönet",
      icon: Users,
      href: '/musteriler',
      gradient: 'from-amber-100 to-orange-100 dark:from-amber-500/10 dark:to-orange-500/10',
      border: 'border-amber-200 dark:border-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header - Sticky */}
      <header className="sticky top-0 z-40 glass border-b border-zinc-200 dark:border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
              Hoş geldin, {userName} 👋
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Hemen içerik üretmeye başla
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Ara..." 
                className="input-glow w-56 pl-10 pr-4 py-2 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm text-zinc-900 dark:text-white placeholder-zinc-400"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 bg-zinc-200 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </kbd>
            </div>
            {/* Notifications */}
            <button className="relative p-2.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 content-bg">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Toplam İçerik */}
          <div className="glass-card rounded-2xl p-5 glow-indigo card-hover cursor-pointer">
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 w-fit mb-4">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">0</p>
            <p className="text-sm text-zinc-500">Toplam İçerik</p>
          </div>

          {/* Müşteri Sayısı */}
          <div 
            className="glass-card rounded-2xl p-5 glow-violet card-hover cursor-pointer"
            onClick={() => router.push('/musteriler')}
          >
            <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 w-fit mb-4">
              <Building2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
              {loading ? '...' : activeCustomers.length}
            </p>
            <p className="text-sm text-zinc-500">Müşteri Sayısı</p>
          </div>

          {/* Bu Hafta */}
          <div className="glass-card rounded-2xl p-5 glow-cyan card-hover cursor-pointer">
            <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 w-fit mb-4">
              <Calendar className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">0</p>
            <p className="text-sm text-zinc-500">Bu Hafta</p>
          </div>
        </div>

        {/* Hızlı İşlemler */}
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <div
              key={action.title}
              className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 card-hover cursor-pointer group"
              onClick={() => router.push(action.href)}
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} border ${action.border} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 ${action.iconColor}`} />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{action.title}</h3>
              <p className="text-sm text-zinc-500">{action.description}</p>
            </div>
          ))}
        </div>

        {/* Son Aktiviteler */}
        <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-white/5">
            <h2 className="font-semibold text-zinc-900 dark:text-white">Son Aktiviteler</h2>
          </div>
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-4 float-animation">
              <Inbox className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Henüz aktivite yok</h3>
            <p className="text-sm text-zinc-500 mb-6">İlk içeriği üretmek için bir marka seç! 🚀</p>
            <Button 
              className="btn-press px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
              onClick={() => router.push('/icerik-uret')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              İçerik Üret
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
