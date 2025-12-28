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
  const [isDark, setIsDark] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()
    
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    fetchData()
    
    return () => observer.disconnect()
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

  // ==========================================
  // UI KIT EXACT STYLES
  // ==========================================
  
  // Glass card - Light mode: daha opak beyaz, belirgin shadow
  const glassCard = {
    background: isDark 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: isDark ? 'none' : '0 4px 20px -5px rgba(0, 0, 0, 0.1)'
  }

  // Glow borders - UI Kit'ten birebir (light mode'da da renkli!)
  const glow = {
    indigo: {
      border: isDark 
        ? '1px solid rgba(99, 102, 241, 0.3)' 
        : '1px solid rgba(99, 102, 241, 0.35)',  // Light: daha belirgin
      boxShadow: isDark 
        ? '0 0 20px -5px rgba(99, 102, 241, 0.3), inset 0 0 20px -10px rgba(99, 102, 241, 0.1)' 
        : '0 4px 20px -5px rgba(99, 102, 241, 0.2)'
    },
    violet: {
      border: isDark 
        ? '1px solid rgba(139, 92, 246, 0.3)' 
        : '1px solid rgba(139, 92, 246, 0.35)',
      boxShadow: isDark 
        ? '0 0 20px -5px rgba(139, 92, 246, 0.3), inset 0 0 20px -10px rgba(139, 92, 246, 0.1)' 
        : '0 4px 20px -5px rgba(139, 92, 246, 0.2)'
    },
    cyan: {
      border: isDark 
        ? '1px solid rgba(34, 211, 238, 0.3)' 
        : '1px solid rgba(34, 211, 238, 0.35)',
      boxShadow: isDark 
        ? '0 0 20px -5px rgba(34, 211, 238, 0.3), inset 0 0 20px -10px rgba(34, 211, 238, 0.1)' 
        : '0 4px 20px -5px rgba(34, 211, 238, 0.2)'
    }
  }

  // Hover effects
  const getHover = (isHovered: boolean) => {
    if (!isHovered) return {}
    return isDark ? {
      borderColor: 'rgba(139, 92, 246, 0.5)',
      boxShadow: '0 0 30px -5px rgba(139, 92, 246, 0.4), inset 0 0 30px -10px rgba(139, 92, 246, 0.15)',
      transform: 'translateY(-2px)'
    } : {
      borderColor: 'rgba(139, 92, 246, 0.5)',
      boxShadow: '0 8px 30px -5px rgba(139, 92, 246, 0.25)',
      transform: 'translateY(-2px)'
    }
  }

  // Text colors - Light mode'da daha koyu
  const text = {
    primary: isDark ? '#ffffff' : '#18181b',  // white : zinc-900
    secondary: isDark ? '#71717a' : '#52525b', // zinc-500 : zinc-600
  }

  // Icon background
  const iconBg = (r: number, g: number, b: number) => ({
    background: isDark 
      ? `rgba(${r},${g},${b},0.1)` 
      : `rgba(${r},${g},${b},0.12)`,
    border: isDark 
      ? `1px solid rgba(${r},${g},${b},0.2)` 
      : `1px solid rgba(${r},${g},${b},0.25)`
  })

  // Quick Actions
  const quickActions = [
    { id: 'icerik', title: 'İçerik Üret', desc: 'AI ile içerik oluştur', icon: Sparkles, href: '/icerik-uret', rgb: [217, 70, 239], hex: '#d946ef' },
    { id: 'gorseller', title: 'Görseller', desc: 'AI ile görsel oluştur', icon: Image, href: '/gorseller', rgb: [16, 185, 129], hex: '#10b981' },
    { id: 'gecmis', title: 'Geçmiş', desc: 'Önceki içerikler', icon: History, href: '/gecmis', rgb: [59, 130, 246], hex: '#3b82f6' },
    { id: 'musteriler', title: 'Müşteriler', desc: "Brief'leri yönet", icon: Users, href: '/musteriler', rgb: [245, 158, 11], hex: '#f59e0b' }
  ]

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* Toplam İçerik */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{ ...glassCard, ...glow.indigo, ...getHover(hoveredCard === 'content') }}
          onMouseEnter={() => setHoveredCard('content')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="p-3 rounded-xl w-fit mb-4" style={iconBg(99, 102, 241)}>
            <FileText className="w-6 h-6" style={{ color: isDark ? '#818cf8' : '#6366f1' }} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: text.primary }}>0</p>
          <p className="text-sm" style={{ color: text.secondary }}>Toplam İçerik</p>
        </div>

        {/* Müşteri Sayısı */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{ ...glassCard, ...glow.violet, ...getHover(hoveredCard === 'customers') }}
          onMouseEnter={() => setHoveredCard('customers')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => router.push('/musteriler')}
        >
          <div className="p-3 rounded-xl w-fit mb-4" style={iconBg(139, 92, 246)}>
            <Building2 className="w-6 h-6" style={{ color: isDark ? '#a78bfa' : '#8b5cf6' }} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: text.primary }}>
            {loading ? '...' : activeCustomers.length}
          </p>
          <p className="text-sm" style={{ color: text.secondary }}>Müşteri Sayısı</p>
        </div>

        {/* Bu Hafta */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{ ...glassCard, ...glow.cyan, ...getHover(hoveredCard === 'week') }}
          onMouseEnter={() => setHoveredCard('week')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="p-3 rounded-xl w-fit mb-4" style={iconBg(34, 211, 238)}>
            <Calendar className="w-6 h-6" style={{ color: isDark ? '#22d3ee' : '#06b6d4' }} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: text.primary }}>0</p>
          <p className="text-sm" style={{ color: text.secondary }}>Bu Hafta</p>
        </div>
      </div>

      {/* Hızlı İşlemler */}
      <h2 className="text-lg font-semibold mb-4" style={{ color: text.primary }}>Hızlı İşlemler</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl p-5 cursor-pointer transition-all duration-300 group"
            style={{
              ...glassCard,
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              ...getHover(hoveredCard === a.id)
            }}
            onClick={() => router.push(a.href)}
            onMouseEnter={() => setHoveredCard(a.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div 
              className="p-3 rounded-xl w-fit mb-4 transition-transform group-hover:scale-110"
              style={iconBg(a.rgb[0], a.rgb[1], a.rgb[2])}
            >
              <a.icon className="w-6 h-6" style={{ color: a.hex }} />
            </div>
            <h3 className="font-semibold mb-1" style={{ color: text.primary }}>{a.title}</h3>
            <p className="text-sm" style={{ color: text.secondary }}>{a.desc}</p>
          </div>
        ))}
      </div>

      {/* Son Aktiviteler */}
      <div 
        className="rounded-2xl"
        style={{
          ...glassCard,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <div 
          className="px-5 py-4"
          style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.06)' }}
        >
          <h2 className="font-semibold" style={{ color: text.primary }}>Son Aktiviteler</h2>
        </div>
        
        <div className="p-12 flex flex-col items-center text-center">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            <Inbox className="w-8 h-8" style={{ color: text.secondary }} />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: text.primary }}>Henüz aktivite yok</h3>
          <p className="text-sm mb-6" style={{ color: text.secondary }}>İlk içeriği üretmek için bir marka seç! 🚀</p>
          
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

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  )
}
