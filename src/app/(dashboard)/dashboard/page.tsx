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
  // THEME-AWARE STYLES
  // ==========================================
  const styles = {
    // Glass card
    glassCardBg: isDark 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
      : 'rgba(255,255,255,0.9)',
    glassCardShadow: isDark ? 'none' : '0 4px 20px -5px rgba(0,0,0,0.08)',
    
    // Glow colors - Dark mode has glow, light mode has subtle shadow
    glow: {
      indigo: {
        border: isDark ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(99,102,241,0.3)',
        boxShadow: isDark ? '0 0 20px -5px rgba(99,102,241,0.4)' : '0 4px 20px -5px rgba(99,102,241,0.2)'
      },
      violet: {
        border: isDark ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(139,92,246,0.3)',
        boxShadow: isDark ? '0 0 20px -5px rgba(139,92,246,0.4)' : '0 4px 20px -5px rgba(139,92,246,0.2)'
      },
      cyan: {
        border: isDark ? '1px solid rgba(34,211,238,0.4)' : '1px solid rgba(34,211,238,0.3)',
        boxShadow: isDark ? '0 0 20px -5px rgba(34,211,238,0.4)' : '0 4px 20px -5px rgba(34,211,238,0.2)'
      }
    },
    
    // Text colors
    textPrimary: isDark ? '#ffffff' : '#0f172a',
    textSecondary: isDark ? '#a1a1aa' : '#64748b',
    
    // Card borders
    cardBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    cardDivider: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    
    // Icon backgrounds
    iconBg: (color: string, opacity: number) => isDark 
      ? `rgba(${color},${opacity})`
      : `rgba(${color},${opacity * 0.7})`,
    
    // Empty state bg
    emptyBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    emptyBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
  }
  
  // Hover style
  const getHoverStyle = (isHovered: boolean) => {
    if (!isHovered) return {}
    return {
      transform: 'translateY(-2px)',
      borderColor: isDark ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.5)',
      boxShadow: isDark ? '0 0 30px -5px rgba(139,92,246,0.5)' : '0 8px 30px -5px rgba(139,92,246,0.2)'
    }
  }

  // Hızlı İşlemler
  const quickActions = [
    {
      id: 'icerik',
      title: 'İçerik Üret',
      description: 'AI ile içerik oluştur',
      icon: Sparkles,
      href: '/icerik-uret',
      colors: { r: 217, g: 70, b: 239, icon: '#d946ef' }
    },
    {
      id: 'gorseller',
      title: 'Görseller',
      description: 'AI ile görsel oluştur',
      icon: Image,
      href: '/gorseller',
      colors: { r: 16, g: 185, b: 129, icon: '#10b981' }
    },
    {
      id: 'gecmis',
      title: 'Geçmiş',
      description: 'Önceki içerikler',
      icon: History,
      href: '/gecmis',
      colors: { r: 59, g: 130, b: 246, icon: '#3b82f6' }
    },
    {
      id: 'musteriler',
      title: 'Müşteriler',
      description: "Brief'leri yönet",
      icon: Users,
      href: '/musteriler',
      colors: { r: 245, g: 158, b: 11, icon: '#f59e0b' }
    }
  ]

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* Toplam İçerik - Indigo */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{
            background: styles.glassCardBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            ...styles.glow.indigo,
            ...getHoverStyle(hoveredCard === 'content')
          }}
          onMouseEnter={() => setHoveredCard('content')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div 
            className="p-3 rounded-xl w-fit mb-4"
            style={{
              background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)',
              border: isDark ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(99,102,241,0.15)'
            }}
          >
            <FileText className="w-6 h-6 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold mb-1 transition-colors" style={{ color: styles.textPrimary }}>0</p>
          <p className="text-sm" style={{ color: styles.textSecondary }}>Toplam İçerik</p>
        </div>

        {/* Müşteri Sayısı - Violet */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{
            background: styles.glassCardBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            ...styles.glow.violet,
            ...getHoverStyle(hoveredCard === 'customers')
          }}
          onMouseEnter={() => setHoveredCard('customers')}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => router.push('/musteriler')}
        >
          <div 
            className="p-3 rounded-xl w-fit mb-4"
            style={{
              background: isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.08)',
              border: isDark ? '1px solid rgba(139,92,246,0.2)' : '1px solid rgba(139,92,246,0.15)'
            }}
          >
            <Building2 className="w-6 h-6 text-violet-500" />
          </div>
          <p className="text-3xl font-bold mb-1 transition-colors" style={{ color: styles.textPrimary }}>
            {loading ? '...' : activeCustomers.length}
          </p>
          <p className="text-sm" style={{ color: styles.textSecondary }}>Müşteri Sayısı</p>
        </div>

        {/* Bu Hafta - Cyan */}
        <div 
          className="rounded-2xl p-5 cursor-pointer transition-all duration-300"
          style={{
            background: styles.glassCardBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            ...styles.glow.cyan,
            ...getHoverStyle(hoveredCard === 'week')
          }}
          onMouseEnter={() => setHoveredCard('week')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div 
            className="p-3 rounded-xl w-fit mb-4"
            style={{
              background: isDark ? 'rgba(34,211,238,0.1)' : 'rgba(34,211,238,0.08)',
              border: isDark ? '1px solid rgba(34,211,238,0.2)' : '1px solid rgba(34,211,238,0.15)'
            }}
          >
            <Calendar className="w-6 h-6 text-cyan-500" />
          </div>
          <p className="text-3xl font-bold mb-1 transition-colors" style={{ color: styles.textPrimary }}>0</p>
          <p className="text-sm" style={{ color: styles.textSecondary }}>Bu Hafta</p>
        </div>
      </div>

      {/* Hızlı İşlemler */}
      <h2 className="text-lg font-semibold mb-4 transition-colors" style={{ color: styles.textPrimary }}>Hızlı İşlemler</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action) => {
          const { r, g, b } = action.colors
          return (
            <div
              key={action.id}
              className="rounded-2xl p-5 cursor-pointer transition-all duration-300 group"
              style={{
                background: styles.glassCardBg,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${styles.cardBorder}`,
                boxShadow: styles.glassCardShadow,
                ...getHoverStyle(hoveredCard === action.id)
              }}
              onClick={() => router.push(action.href)}
              onMouseEnter={() => setHoveredCard(action.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div 
                className="p-3 rounded-xl w-fit mb-4 transition-transform group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, rgba(${r},${g},${b},${isDark ? 0.1 : 0.08}) 0%, rgba(${r},${g},${b},${isDark ? 0.05 : 0.04}) 100%)`,
                  border: `1px solid rgba(${r},${g},${b},${isDark ? 0.2 : 0.15})`
                }}
              >
                <action.icon className="w-6 h-6" style={{ color: action.colors.icon }} />
              </div>
              <h3 className="font-semibold mb-1 transition-colors" style={{ color: styles.textPrimary }}>{action.title}</h3>
              <p className="text-sm" style={{ color: styles.textSecondary }}>{action.description}</p>
            </div>
          )
        })}
      </div>

      {/* Son Aktiviteler */}
      <div 
        className="rounded-2xl transition-colors duration-300"
        style={{
          background: styles.glassCardBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${styles.cardBorder}`,
          boxShadow: styles.glassCardShadow
        }}
      >
        <div 
          className="px-5 py-4"
          style={{ borderBottom: `1px solid ${styles.cardDivider}` }}
        >
          <h2 className="font-semibold transition-colors" style={{ color: styles.textPrimary }}>Son Aktiviteler</h2>
        </div>
        
        <div className="p-12 flex flex-col items-center text-center">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: styles.emptyBg,
              border: `1px solid ${styles.emptyBorder}`,
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            <Inbox className="w-8 h-8" style={{ color: styles.textSecondary }} />
          </div>
          <h3 className="font-semibold mb-2 transition-colors" style={{ color: styles.textPrimary }}>Henüz aktivite yok</h3>
          <p className="text-sm mb-6" style={{ color: styles.textSecondary }}>İlk içeriği üretmek için bir marka seç! 🚀</p>
          
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
