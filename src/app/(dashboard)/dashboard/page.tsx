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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

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

  // Quick Actions
  const quickActions = [
    { id: 'icerik', title: 'İçerik Üret', desc: 'AI ile içerik oluştur', icon: Sparkles, href: '/icerik-uret', iconClass: 'icon-box-fuchsia' },
    { id: 'gorseller', title: 'Görseller', desc: 'AI ile görsel oluştur', icon: Image, href: '/gorseller', iconClass: 'icon-box-emerald' },
    { id: 'gecmis', title: 'Geçmiş', desc: 'Önceki içerikler', icon: History, href: '/gecmis', iconClass: 'icon-box-cyan' },
    { id: 'musteriler', title: 'Müşteriler', desc: "Brief'leri yönet", icon: Users, href: '/musteriler', iconClass: 'icon-box-amber' }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Toplam İçerik */}
        <div 
          className="glass-card rounded-2xl p-5 glow-indigo card-hover cursor-pointer"
          onMouseEnter={() => setHoveredCard('content')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="icon-box icon-box-indigo mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">0</p>
          <p className="text-sm text-zinc-500">Toplam İçerik</p>
        </div>

        {/* Müşteri Sayısı */}
        <div 
          className="glass-card rounded-2xl p-5 glow-violet card-hover cursor-pointer"
          onClick={() => router.push('/musteriler')}
          onMouseEnter={() => setHoveredCard('customers')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="icon-box icon-box-violet mb-4">
            <Building2 className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {loading ? '...' : activeCustomers.length}
          </p>
          <p className="text-sm text-zinc-500">Müşteri Sayısı</p>
        </div>

        {/* Bu Hafta */}
        <div 
          className="glass-card rounded-2xl p-5 glow-cyan card-hover cursor-pointer sm:col-span-2 lg:col-span-1"
          onMouseEnter={() => setHoveredCard('week')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="icon-box icon-box-cyan mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">0</p>
          <p className="text-sm text-zinc-500">Bu Hafta</p>
        </div>
      </div>

      {/* Hızlı İşlemler */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className="glass-card rounded-2xl p-5 cursor-pointer card-hover group border border-white/10"
              onClick={() => router.push(action.href)}
            >
              <div className={`icon-box ${action.iconClass} mb-4 transition-transform group-hover:scale-110`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white mb-1">{action.title}</h3>
              <p className="text-sm text-zinc-500">{action.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Son Aktiviteler */}
      <div className="glass-card rounded-2xl border border-white/10">
        <div className="px-5 py-4 section-divider">
          <h2 className="font-semibold text-white">Son Aktiviteler</h2>
        </div>
        
        <div className="p-12 flex flex-col items-center text-center">
          <div className="icon-box icon-box-default w-16 h-16 flex items-center justify-center mb-4 animate-float">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="font-semibold text-white mb-2">Henüz aktivite yok</h3>
          <p className="text-sm text-zinc-500 mb-6">İlk içeriği üretmek için bir marka seç! 🚀</p>
          
          <button 
            className="btn-primary flex items-center gap-2"
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
