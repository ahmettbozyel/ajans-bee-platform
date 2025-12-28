'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  FileText,
  Building2, 
  Calendar,
  Sparkles,
  Image,
  History,
  Users,
  Inbox
} from 'lucide-react'
import type { Customer } from '@/lib/customer-types'

export default function DashboardPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

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

  // Hızlı İşlemler - UI Kit'e göre (gradient bg eklendi)
  const quickActions = [
    {
      title: 'İçerik Üret',
      description: 'AI ile içerik oluştur',
      icon: Sparkles,
      href: '/icerik-uret',
      cardBg: 'bg-gradient-to-br from-fuchsia-50/50 to-violet-50/50 dark:from-fuchsia-500/5 dark:to-violet-500/5',
      iconBg: 'from-fuchsia-100 to-violet-100 dark:from-fuchsia-500/10 dark:to-violet-500/10',
      border: 'border-fuchsia-200 dark:border-fuchsia-500/20',
      iconColor: 'text-fuchsia-600 dark:text-fuchsia-400'
    },
    {
      title: 'Görseller',
      description: 'AI ile görsel oluştur',
      icon: Image,
      href: '/gorseller',
      cardBg: 'bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-500/5 dark:to-teal-500/5',
      iconBg: 'from-emerald-100 to-teal-100 dark:from-emerald-500/10 dark:to-teal-500/10',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Geçmiş',
      description: 'Önceki içerikler',
      icon: History,
      href: '/gecmis',
      cardBg: 'bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-500/5 dark:to-indigo-500/5',
      iconBg: 'from-blue-100 to-indigo-100 dark:from-blue-500/10 dark:to-indigo-500/10',
      border: 'border-blue-200 dark:border-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Müşteriler',
      description: "Brief'leri yönet",
      icon: Users,
      href: '/musteriler',
      cardBg: 'bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-500/5 dark:to-orange-500/5',
      iconBg: 'from-amber-100 to-orange-100 dark:from-amber-500/10 dark:to-orange-500/10',
      border: 'border-amber-200 dark:border-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400'
    }
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Stats Cards - 3 kolonlu, glow efektli */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Toplam İçerik - Indigo Glow */}
        <div className="glass-card rounded-2xl p-5 glow-indigo card-hover cursor-pointer">
          <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 w-fit mb-4">
            <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">0</p>
          <p className="text-sm text-zinc-500">Toplam İçerik</p>
        </div>

        {/* Müşteri Sayısı - Violet Glow */}
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

        {/* Bu Hafta - Cyan Glow */}
        <div className="glass-card rounded-2xl p-5 glow-cyan card-hover cursor-pointer">
          <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 w-fit mb-4">
            <Calendar className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">0</p>
          <p className="text-sm text-zinc-500">Bu Hafta</p>
        </div>
      </div>

      {/* Hızlı İşlemler - Gradient Background eklendi */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <div
              key={action.title}
              className={`glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 card-hover cursor-pointer group ${action.cardBg}`}
              onClick={() => router.push(action.href)}
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${action.iconBg} border ${action.border} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 ${action.iconColor}`} />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{action.title}</h3>
              <p className="text-sm text-zinc-500">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Son Aktiviteler - Empty State with float animation */}
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
          <button 
            className="btn-press px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow flex items-center gap-2"
            onClick={() => router.push('/icerik-uret')}
          >
            <Sparkles className="w-4 h-4" />
            İçerik Üret
          </button>
        </div>
      </div>
    </div>
  )
}
