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

// Glow style helpers
const glowStyles = {
  indigo: {
    border: '1px solid rgba(99, 102, 241, 0.4)',
    boxShadow: '0 0 20px -5px rgba(99, 102, 241, 0.4), inset 0 0 20px -10px rgba(99, 102, 241, 0.1)'
  },
  violet: {
    border: '1px solid rgba(139, 92, 246, 0.4)',
    boxShadow: '0 0 20px -5px rgba(139, 92, 246, 0.4), inset 0 0 20px -10px rgba(139, 92, 246, 0.1)'
  },
  cyan: {
    border: '1px solid rgba(34, 211, 238, 0.4)',
    boxShadow: '0 0 20px -5px rgba(34, 211, 238, 0.4), inset 0 0 20px -10px rgba(34, 211, 238, 0.1)'
  }
}

const glassCardStyle = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)'
}

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

  // Hızlı İşlemler
  const quickActions = [
    {
      title: 'İçerik Üret',
      description: 'AI ile içerik oluştur',
      icon: Sparkles,
      href: '/icerik-uret',
      gradient: 'linear-gradient(135deg, rgba(217, 70, 239, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
      iconBg: 'linear-gradient(135deg, rgba(217, 70, 239, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
      iconColor: '#d946ef',
      borderColor: 'rgba(217, 70, 239, 0.3)'
    },
    {
      title: 'Görseller',
      description: 'AI ile görsel oluştur',
      icon: Image,
      href: '/gorseller',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(20, 184, 166, 0.05) 100%)',
      iconBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(20, 184, 166, 0.1) 100%)',
      iconColor: '#10b981',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    },
    {
      title: 'Geçmiş',
      description: 'Önceki içerikler',
      icon: History,
      href: '/gecmis',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)',
      iconBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
      iconColor: '#3b82f6',
      borderColor: 'rgba(59, 130, 246, 0.3)'
    },
    {
      title: 'Müşteriler',
      description: "Brief'leri yönet",
      icon: Users,
      href: '/musteriler',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(249, 115, 22, 0.05) 100%)',
      iconBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(249, 115, 22, 0.1) 100%)',
      iconColor: '#f59e0b',
      borderColor: 'rgba(245, 158, 11, 0.3)'
    }
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Stats Cards - 3 kolonlu, glow efektli */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Toplam İçerik - Indigo Glow */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{
            ...glassCardStyle,
            ...glowStyles.indigo,
            transform: hoveredCard === 'content' ? 'translateY(-2px)' : 'none',
            boxShadow: hoveredCard === 'content' 
              ? '0 0 30px -5px rgba(99, 102, 241, 0.5), inset 0 0 30px -10px rgba(99, 102, 241, 0.15)'
              : glowStyles.indigo.boxShadow
          }}
          onMouseEnter={() => setHoveredCard('content')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div 
            className="p-3 rounded-xl w-fit mb-4"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}
          >
            <FileText className="w-6 h-6" style={{ color: '#818cf8' }} />
          </div>
          <p className="text-3xl font-bold text-white mb-1">0</p>
          <p className="text-sm text-zinc-500">Toplam İçerik</p>
        </div>

        {/* Müşteri Sayısı - Violet Glow */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{
            ...glassCardStyle,
            ...glowStyles.violet,
            transform: hoveredCard === 'customers' ? 'translateY(-2px)' : 'none',
            boxShadow: hoveredCard === 'customers' 
              ? '0 0 30px -5px rgba(139, 92, 246, 0.5), inset 0 0 30px -10px rgba(139, 92, 246, 0.15)'
              : glowStyles.violet.boxShadow
          }}
          onMouseEnter={() => setHoveredCard('customers')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => router.push('/musteriler')}
        >
          <div 
            className="p-3 rounded-xl w-fit mb-4"
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}
          >
            <Building2 className="w-6 h-6" style={{ color: '#a78bfa' }} />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {loading ? '...' : activeCustomers.length}
          </p>
          <p className="text-sm text-zinc-500">Müşteri Sayısı</p>
        </div>

        {/* Bu Hafta - Cyan Glow */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{
            ...glassCardStyle,
            ...glowStyles.cyan,
            transform: hoveredCard === 'week' ? 'translateY(-2px)' : 'none',
            boxShadow: hoveredCard === 'week' 
              ? '0 0 30px -5px rgba(34, 211, 238, 0.5), inset 0 0 30px -10px rgba(34, 211, 238, 0.15)'
              : glowStyles.cyan.boxShadow
          }}
          onMouseEnter={() => setHoveredCard('week')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div 
            className="p-3 rounded-xl w-fit mb-4"
            style={{
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.2)'
            }}
          >
            <Calendar className="w-6 h-6" style={{ color: '#22d3ee' }} />
          </div>
          <p className="text-3xl font-bold text-white mb-1">0</p>
          <p className="text-sm text-zinc-500">Bu Hafta</p>
        </div>
      </div>

      {/* Hızlı İşlemler */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <div
              key={action.title}
              className="rounded-2xl p-5 cursor-pointer transition-all duration-300 group"
              style={{
                background: action.gradient,
                border: `1px solid ${action.borderColor}`,
                transform: hoveredCard === action.title ? 'translateY(-2px)' : 'none'
              }}
              onClick={() => router.push(action.href)}
              onMouseEnter={() => setHoveredCard(action.title)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div 
                className="p-3 rounded-xl w-fit mb-4 transition-transform group-hover:scale-110"
                style={{
                  background: action.iconBg,
                  border: `1px solid ${action.borderColor}`
                }}
              >
                <action.icon className="w-6 h-6" style={{ color: action.iconColor }} />
              </div>
              <h3 className="font-semibold text-white mb-1">{action.title}</h3>
              <p className="text-sm text-zinc-500">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Son Aktiviteler - Empty State */}
      <div 
        className="rounded-2xl"
        style={{
          ...glassCardStyle,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div 
          className="px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
        >
          <h2 className="font-semibold text-white">Son Aktiviteler</h2>
        </div>
        <div className="p-12 flex flex-col items-center text-center">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Inbox className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Henüz aktivite yok</h3>
          <p className="text-sm text-zinc-500 mb-6">İlk içeriği üretmek için bir marka seç! 🚀</p>
          <button 
            className="px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 20px -5px rgba(99, 102, 241, 0.5)'
            }}
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
