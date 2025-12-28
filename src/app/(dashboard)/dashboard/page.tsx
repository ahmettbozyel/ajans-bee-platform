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
    // Check theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()
    
    // Listen for theme changes
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
  // UI KIT LIGHT MODE STİLLERİ - BİREBİR
  // ==========================================
  
  // Glass card background
  const glassCardBg = isDark 
    ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
    : 'rgba(255, 255, 255, 0.8)'
  
  const glassCardShadow = isDark 
    ? 'none' 
    : '0 4px 20px -5px rgba(0, 0, 0, 0.08)'

  // Glow styles - UI Kit'ten birebir
  const glowStyles = {
    indigo: {
      border: isDark ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(99, 102, 241, 0.25)',
      boxShadow: isDark 
        ? '0 0 20px -5px rgba(99,102,241,0.3), inset 0 0 20px -10px rgba(99,102,241,0.1)' 
        : '0 4px 20px -5px rgba(99, 102, 241, 0.15)'
    },
    violet: {
      border: isDark ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(139, 92, 246, 0.25)',
      boxShadow: isDark 
        ? '0 0 20px -5px rgba(139,92,246,0.3), inset 0 0 20px -10px rgba(139,92,246,0.1)' 
        : '0 4px 20px -5px rgba(139, 92, 246, 0.15)'
    },
    cyan: {
      border: isDark ? '1px solid rgba(34,211,238,0.3)' : '1px solid rgba(34, 211, 238, 0.25)',
      boxShadow: isDark 
        ? '0 0 20px -5px rgba(34,211,238,0.3), inset 0 0 20px -10px rgba(34,211,238,0.1)' 
        : '0 4px 20px -5px rgba(34, 211, 238, 0.15)'
    }
  }

  // Card hover - UI Kit'ten
  const getCardHoverStyle = (color: 'indigo' | 'violet' | 'cyan', isHovered: boolean) => {
    if (!isHovered) return {}
    
    if (isDark) {
      return {
        borderColor: 'rgba(139, 92, 246, 0.5)',
        boxShadow: '0 0 30px -5px rgba(139, 92, 246, 0.4), inset 0 0 30px -10px rgba(139, 92, 246, 0.15)',
        transform: 'translateY(-2px)'
      }
    } else {
      return {
        borderColor: 'rgba(139, 92, 246, 0.4)',
        boxShadow: '0 8px 30px -5px rgba(139, 92, 246, 0.2)',
        transform: 'translateY(-2px)'
      }
    }
  }
  
  // Quick action hover
  const getQuickActionHoverStyle = (isHovered: boolean) => {
    if (!isHovered) return {}
    
    if (isDark) {
      return {
        borderColor: 'rgba(139, 92, 246, 0.5)',
        boxShadow: '0 0 30px -5px rgba(139, 92, 246, 0.4)',
        transform: 'translateY(-2px)'
      }
    } else {
      return {
        borderColor: 'rgba(139, 92, 246, 0.4)',
        boxShadow: '0 8px 30px -5px rgba(139, 92, 246, 0.2)',
        transform: 'translateY(-2px)'
      }
    }
  }

  // Text colors
  const textPrimary = isDark ? '#ffffff' : '#18181b'  // zinc-900
  const textSecondary = isDark ? '#71717a' : '#71717a' // zinc-500

  // Icon container backgrounds
  const getIconBg = (r: number, g: number, b: number) => ({
    background: isDark 
      ? `rgba(${r},${g},${b},0.1)` 
      : `rgba(${r},${g},${b},0.1)`,
    border: isDark 
      ? `1px solid rgba(${r},${g},${b},0.2)` 
      : `1px solid rgba(${r},${g},${b},0.2)`
  })

  // Hızlı İşlemler
  const quickActions = [
    {
      id: 'icerik',
      title: 'İçerik Üret',
      description: 'AI ile içerik oluştur',
      icon: Sparkles,
      href: '/icerik-uret',
      color: { r: 217, g: 70, b: 239, hex: '#d946ef' } // fuchsia
    },
    {
      id: 'gorseller',
      title: 'Görseller',
      description: 'AI ile görsel oluştur',
      icon: Image,
      href: '/gorseller',
      color: { r: 16, g: 185, b: 129, hex: '#10b981' } // emerald
    },
    {
      id: 'gecmis',
      title: 'Geçmiş',
      description: 'Önceki içerikler',
      icon: History,
      href: '/gecmis',
      color: { r: 59, g: 130, b: 246, hex: '#3b82f6' } // blue
    },
    {
      id: 'musteriler',
      title: 'Müşteriler',
      description: "Brief'leri yönet",
      icon: Users,
      href: '/musteriler',
      color: { r: 245, g: 158, b: 11, hex: '#f59e0b' } // amber
    }
  ]

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* Toplam İçerik - Indigo Glow */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{
            background: glassCardBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            ...glowStyles.indigo,
            ...getCardHoverStyle('indigo', hoveredCard === 'content')
          }}
          onMouseEnter={() => setHoveredCard('content')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div 
            className="p-3 rounded-xl w-fit mb-4"
            style={getIconBg(99, 102, 241)}
          >
            <FileText className="w-6 h-6" style={{ color: '#818cf8' }} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: textPrimary }}>0</p>
          <p className="text-sm" style={{ color: textSecondary }}>Toplam İçerik</p>
        </div>

        {/* Müşteri Sayısı - Violet Glow */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{
            background: glassCardBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            ...glowStyles.violet,
            ...getCardHoverStyle('violet', hoveredCard === 'customers')
          }}
          onMouseEnter={() => setHoveredCard('customers')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => router.push('/musteriler')}
        >
          <div 
            className="p-3 rounded-xl w-fit mb-4"
            style={getIconBg(139, 92, 246)}
          >
            <Building2 className="w-6 h-6" style={{ color: '#a78bfa' }} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: textPrimary }}>
            {loading ? '...' : activeCustomers.length}
          </p>
          <p className="text-sm" style={{ color: textSecondary }}>Müşteri Sayısı</p>
        </div>

        {/* Bu Hafta - Cyan Glow */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{
            background: glassCardBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            ...glowStyles.cyan,
            ...getCardHoverStyle('cyan', hoveredCard === 'week')
          }}
          onMouseEnter={() => setHoveredCard('week')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div 
            className="p-3 rounded-xl w-fit mb-4"
            style={getIconBg(34, 211, 238)}
          >
            <Calendar className="w-6 h-6" style={{ color: '#22d3ee' }} />
          </div>
          <p className="text-3xl font-bold mb-1" style={{ color: textPrimary }}>0</p>
          <p className="text-sm" style={{ color: textSecondary }}>Bu Hafta</p>
        </div>
      </div>

      {/* Hızlı İşlemler */}
      <h2 className="text-lg font-semibold mb-4" style={{ color: textPrimary }}>Hızlı İşlemler</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action) => {
          const { r, g, b, hex } = action.color
          return (
            <div
              key={action.id}
              className="rounded-2xl p-5 cursor-pointer transition-all duration-300 group"
              style={{
                background: glassCardBg,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: glassCardShadow,
                ...getQuickActionHoverStyle(hoveredCard === action.id)
              }}
              onClick={() => router.push(action.href)}
              onMouseEnter={() => setHoveredCard(action.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div 
                className="p-3 rounded-xl w-fit mb-4 transition-transform group-hover:scale-110"
                style={getIconBg(r, g, b)}
              >
                <action.icon className="w-6 h-6" style={{ color: hex }} />
              </div>
              <h3 className="font-semibold mb-1" style={{ color: textPrimary }}>{action.title}</h3>
              <p className="text-sm" style={{ color: textSecondary }}>{action.description}</p>
            </div>
          )
        })}
      </div>

      {/* Son Aktiviteler */}
      <div 
        className="rounded-2xl"
        style={{
          background: glassCardBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
          boxShadow: glassCardShadow
        }}
      >
        <div 
          className="px-5 py-4"
          style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}
        >
          <h2 className="font-semibold" style={{ color: textPrimary }}>Son Aktiviteler</h2>
        </div>
        
        <div className="p-12 flex flex-col items-center text-center">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            <Inbox className="w-8 h-8" style={{ color: textSecondary }} />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: textPrimary }}>Henüz aktivite yok</h3>
          <p className="text-sm mb-6" style={{ color: textSecondary }}>İlk içeriği üretmek için bir marka seç! 🚀</p>
          
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
