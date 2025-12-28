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

// ==========================================
// UI Kit'ten birebir stiller
// ==========================================

// glass-card: background + backdrop-filter
const glassCardStyle = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)'
}

// glow-* stilleri
const glowStyles = {
  indigo: {
    border: '1px solid rgba(99,102,241,0.4)',
    boxShadow: '0 0 20px -5px rgba(99,102,241,0.4)'
  },
  violet: {
    border: '1px solid rgba(139,92,246,0.4)',
    boxShadow: '0 0 20px -5px rgba(139,92,246,0.4)'
  },
  cyan: {
    border: '1px solid rgba(34,211,238,0.4)',
    boxShadow: '0 0 20px -5px rgba(34,211,238,0.4)'
  }
}

// card-hover efekti
const getHoverStyle = (color: 'indigo' | 'violet' | 'cyan', isHovered: boolean) => {
  if (!isHovered) return {}
  const colors = {
    indigo: 'rgba(139,92,246,0.6)',
    violet: 'rgba(139,92,246,0.6)',
    cyan: 'rgba(139,92,246,0.6)'
  }
  return {
    transform: 'translateY(-2px)',
    borderColor: colors[color],
    boxShadow: `0 0 30px -5px ${colors[color]}`
  }
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

  // Hızlı İşlemler - UI Kit'ten birebir
  const quickActions = [
    {
      id: 'icerik',
      title: 'İçerik Üret',
      description: 'AI ile içerik oluştur',
      icon: Sparkles,
      href: '/icerik-uret',
      colors: {
        from: 'rgba(217,70,239,0.1)',
        to: 'rgba(139,92,246,0.1)',
        border: 'rgba(217,70,239,0.2)',
        icon: '#d946ef'
      }
    },
    {
      id: 'gorseller',
      title: 'Görseller',
      description: 'AI ile görsel oluştur',
      icon: Image,
      href: '/gorseller',
      colors: {
        from: 'rgba(16,185,129,0.1)',
        to: 'rgba(20,184,166,0.1)',
        border: 'rgba(16,185,129,0.2)',
        icon: '#10b981'
      }
    },
    {
      id: 'gecmis',
      title: 'Geçmiş',
      description: 'Önceki içerikler',
      icon: History,
      href: '/gecmis',
      colors: {
        from: 'rgba(59,130,246,0.1)',
        to: 'rgba(99,102,241,0.1)',
        border: 'rgba(59,130,246,0.2)',
        icon: '#3b82f6'
      }
    },
    {
      id: 'musteriler',
      title: 'Müşteriler',
      description: "Brief'leri yönet",
      icon: Users,
      href: '/musteriler',
      colors: {
        from: 'rgba(245,158,11,0.1)',
        to: 'rgba(249,115,22,0.1)',
        border: 'rgba(245,158,11,0.2)',
        icon: '#f59e0b'
      }
    }
  ]

  return (
    <>
      {/* Stats Cards - grid grid-cols-3 gap-5 mb-8 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* Toplam İçerik - glow-indigo */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{
            ...glassCardStyle,
            ...glowStyles.indigo,
            ...(hoveredCard === 'content' ? getHoverStyle('indigo', true) : {})
          }}
          onMouseEnter={() => setHoveredCard('content')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div 
            className="p-3 rounded-xl w-fit mb-4"
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)'
            }}
          >
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">0</p>
          <p className="text-sm text-zinc-500">Toplam İçerik</p>
        </div>

        {/* Müşteri Sayısı - glow-violet */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{
            ...glassCardStyle,
            ...glowStyles.violet,
            ...(hoveredCard === 'customers' ? getHoverStyle('violet', true) : {})
          }}
          onMouseEnter={() => setHoveredCard('customers')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => router.push('/musteriler')}
        >
          <div 
            className="p-3 rounded-xl w-fit mb-4"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)'
            }}
          >
            <Building2 className="w-6 h-6 text-violet-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {loading ? '...' : activeCustomers.length}
          </p>
          <p className="text-sm text-zinc-500">Müşteri Sayısı</p>
        </div>

        {/* Bu Hafta - glow-cyan */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{
            ...glassCardStyle,
            ...glowStyles.cyan,
            ...(hoveredCard === 'week' ? getHoverStyle('cyan', true) : {})
          }}
          onMouseEnter={() => setHoveredCard('week')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div 
            className="p-3 rounded-xl w-fit mb-4"
            style={{
              background: 'rgba(34,211,238,0.1)',
              border: '1px solid rgba(34,211,238,0.2)'
            }}
          >
            <Calendar className="w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">0</p>
          <p className="text-sm text-zinc-500">Bu Hafta</p>
        </div>
      </div>

      {/* Hızlı İşlemler - h2 + grid grid-cols-4 gap-4 mb-8 */}
      <h2 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action) => (
          <div
            key={action.id}
            className="rounded-2xl p-5 cursor-pointer transition-all duration-300 group"
            style={{
              ...glassCardStyle,
              border: `1px solid rgba(255,255,255,0.1)`,
              ...(hoveredCard === action.id ? { transform: 'translateY(-2px)', borderColor: 'rgba(139,92,246,0.6)', boxShadow: '0 0 30px -5px rgba(139,92,246,0.5)' } : {})
            }}
            onClick={() => router.push(action.href)}
            onMouseEnter={() => setHoveredCard(action.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div 
              className="p-3 rounded-xl w-fit mb-4 transition-transform group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${action.colors.from} 0%, ${action.colors.to} 100%)`,
                border: `1px solid ${action.colors.border}`
              }}
            >
              <action.icon className="w-6 h-6" style={{ color: action.colors.icon }} />
            </div>
            <h3 className="font-semibold text-white mb-1">{action.title}</h3>
            <p className="text-sm text-zinc-500">{action.description}</p>
          </div>
        ))}
      </div>

      {/* Son Aktiviteler - glass-card + empty state */}
      <div 
        className="rounded-2xl"
        style={{
          ...glassCardStyle,
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Header */}
        <div 
          className="px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <h2 className="font-semibold text-white">Son Aktiviteler</h2>
        </div>
        
        {/* Empty State - p-12 flex flex-col items-center text-center */}
        <div className="p-12 flex flex-col items-center text-center">
          {/* float-animation icon */}
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            <Inbox className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Henüz aktivite yok</h3>
          <p className="text-sm text-zinc-500 mb-6">İlk içeriği üretmek için bir marka seç! 🚀</p>
          
          {/* btn-press gradient button */}
          <button 
            className="px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2 transition-all active:scale-95"
            style={{
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 8px 20px -5px rgba(99, 102, 241, 0.4)'
            }}
            onClick={() => router.push('/icerik-uret')}
          >
            <Sparkles className="w-4 h-4" />
            İçerik Üret
          </button>
        </div>
      </div>

      {/* Float animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  )
}
