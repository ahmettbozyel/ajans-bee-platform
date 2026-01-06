'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Server, Globe, ShieldCheck, Mail, Building2, Calendar, AlertTriangle,
  Search, Plus, Loader2, Settings, RefreshCw, Pencil, Trash2, 
  DollarSign, CreditCard, Eye, AlertCircle, Clock, ChevronLeft, ChevronRight, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ServiceType } from '@/lib/service-provider-types'
import { SERVICE_TYPES } from '@/lib/service-provider-types'
import type { TechnicalServiceWithRelations } from '@/lib/technical-service-types-new'
import Link from 'next/link'
import { ServiceModal } from './components/service-modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'

// ==========================================
// HELPERS
// ==========================================

function getDaysDiff(date: string | null): number | null {
  if (!date) return null
  // Parse date as local timezone (not UTC) to avoid 1 day offset
  const [year, month, day] = date.split('-').map(Number)
  const renewalDate = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to compare only dates
  const diffTime = renewalDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function ServiceIcon({ type, className }: { type: ServiceType; className?: string }) {
  const icons = {
    hosting: Server,
    domain: Globe,
    ssl: ShieldCheck,
    email: Mail
  }
  const Icon = icons[type] || Server
  return <Icon className={className} />
}

function calculatePrice(service: TechnicalServiceWithRelations): number {
  if (!service.provider?.base_price_usd) return 0
  const basePrice = service.provider.base_price_usd
  const discount = service.discount_percent || 0
  const quantity = service.quantity || 1
  return basePrice * quantity * (1 - discount / 100)
}

function getNextRenewalDate(currentDate: string | null, billingCycle: 'monthly' | 'yearly' = 'yearly'): string {
  let baseDate: Date
  if (currentDate) {
    // Parse date as local timezone (not UTC) to avoid 1 day offset
    const [year, month, day] = currentDate.split('-').map(Number)
    baseDate = new Date(year, month - 1, day)
  } else {
    baseDate = new Date()
  }

  if (billingCycle === 'monthly') {
    baseDate.setMonth(baseDate.getMonth() + 1)
  } else {
    baseDate.setFullYear(baseDate.getFullYear() + 1)
  }

  // Format as YYYY-MM-DD without timezone conversion
  const year = baseDate.getFullYear()
  const month = String(baseDate.getMonth() + 1).padStart(2, '0')
  const day = String(baseDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  // Parse date as local timezone (not UTC) to avoid 1 day offset
  const [year, month, day] = dateStr.split('-').map(Number)
  // Format as DD.MM.YYYY (Turkish format)
  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`
}

// Provider renkleri
const providerStyles: Record<string, { bg: string; badge: string; text: string; progress: string }> = {
  'siteground': { 
    bg: 'bg-gradient-to-br from-indigo-500 to-violet-600', 
    badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20',
    text: 'text-indigo-400',
    progress: 'bg-gradient-to-r from-indigo-500 to-violet-600'
  },
  'natro': { 
    bg: 'bg-gradient-to-br from-amber-500 to-orange-600', 
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
    text: 'text-amber-400',
    progress: 'bg-gradient-to-r from-amber-500 to-orange-500'
  },
  'veridyen': { 
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-600', 
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
    text: 'text-emerald-400',
    progress: 'bg-gradient-to-r from-emerald-500 to-teal-500'
  },
  'hostinger': { 
    bg: 'bg-gradient-to-br from-violet-500 to-purple-600', 
    badge: 'bg-violet-500/20 text-violet-400 border-violet-500/20',
    text: 'text-violet-400',
    progress: 'bg-gradient-to-r from-violet-500 to-purple-500'
  },
  'default': { 
    bg: 'bg-gradient-to-br from-zinc-600 to-zinc-700', 
    badge: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/20',
    text: 'text-zinc-400',
    progress: 'bg-gradient-to-r from-zinc-500 to-zinc-600'
  }
}

function getProviderStyle(name: string) {
  const key = name?.toLowerCase() || 'default'
  return providerStyles[key] || providerStyles.default
}

// ==========================================
// PAGINATION
// ==========================================
const ITEMS_PER_PAGE = 10

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function TeknikHizmetlerPage() {
  const [services, setServices] = useState<TechnicalServiceWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<ServiceType | 'all'>('all')
  const [renewingId, setRenewingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'renewal' | 'brand' | 'provider' | 'price'>('renewal')
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<TechnicalServiceWithRelations | null>(null)
  
  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    type: 'renew' | 'delete'
    service: TechnicalServiceWithRelations | null
    newDate?: string
  }>({ isOpen: false, type: 'renew', service: null })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/technical-services')
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Stats hesapla
  const stats = useMemo(() => {
    const overdue = services.filter(s => {
      const days = getDaysDiff(s.renewal_date)
      return days !== null && days < 0
    })
    const upcoming = services.filter(s => {
      const days = getDaysDiff(s.renewal_date)
      return days !== null && days >= 0 && days <= 30
    })
    const totalRevenue = services.reduce((acc, s) => acc + calculatePrice(s), 0)
    const brands = new Set(services.map(s => s.brand_id).filter(Boolean)).size

    return {
      total: services.length,
      brands,
      upcoming: upcoming.length,
      overdue: overdue.length,
      overdueServices: overdue,
      totalRevenue
    }
  }, [services])

  // Provider stats
  const providerStats = useMemo(() => {
    const grouped: Record<string, { count: number; revenue: number; name: string; pricePerYear: number }> = {}
    
    services.forEach(s => {
      const name = s.provider?.name || 'Diğer'
      if (!grouped[name]) {
        grouped[name] = { 
          count: 0, 
          revenue: 0, 
          name,
          pricePerYear: s.provider?.base_price_usd || 0
        }
      }
      grouped[name].count++
      grouped[name].revenue += calculatePrice(s)
    })
    
    return Object.values(grouped).sort((a, b) => b.count - a.count)
  }, [services])

  // Type counts
  const typeCounts = useMemo(() => ({
    hosting: services.filter(s => s.service_type === 'hosting').length,
    domain: services.filter(s => s.service_type === 'domain').length,
    ssl: services.filter(s => s.service_type === 'ssl').length,
    email: services.filter(s => s.service_type === 'email').length
  }), [services])

  // Filtrele ve sırala
  const filteredServices = useMemo(() => {
    let result = services.filter(service => {
      const matchesSearch = searchQuery === '' || 
        service.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.provider?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = activeFilter === 'all' || service.service_type === activeFilter
      return matchesSearch && matchesType
    })

    // Sırala
    result.sort((a, b) => {
      switch (sortBy) {
        case 'brand':
          return (a.brand?.name || '').localeCompare(b.brand?.name || '')
        case 'provider':
          return (a.provider?.name || '').localeCompare(b.provider?.name || '')
        case 'price':
          return calculatePrice(b) - calculatePrice(a)
        case 'renewal':
        default:
          const daysA = getDaysDiff(a.renewal_date) ?? Infinity
          const daysB = getDaysDiff(b.renewal_date) ?? Infinity
          return daysA - daysB
      }
    })

    return result
  }, [services, searchQuery, activeFilter, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE)
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter, searchQuery])

  function handleAddNew() {
    setEditingService(null)
    setIsModalOpen(true)
  }

  function handleEdit(service: TechnicalServiceWithRelations) {
    setEditingService(service)
    setIsModalOpen(true)
  }

  function handleDeleteClick(service: TechnicalServiceWithRelations) {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      service
    })
  }

  async function handleDeleteConfirm() {
    if (!confirmModal.service) return
    
    try {
      const res = await fetch(`/api/technical-services/${confirmModal.service.id}`, { method: 'DELETE' })
      if (res.ok) {
        setConfirmModal({ isOpen: false, type: 'delete', service: null })
        await loadData()
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  function handleRenewClick(service: TechnicalServiceWithRelations) {
    const rawCycle = service.provider?.billing_cycle || 'yearly'
    const billingCycle = (rawCycle === 'monthly' ? 'monthly' : 'yearly') as 'monthly' | 'yearly'
    const newDate = getNextRenewalDate(service.renewal_date, billingCycle)
    
    setConfirmModal({
      isOpen: true,
      type: 'renew',
      service,
      newDate
    })
  }

  async function handleRenewConfirm() {
    if (!confirmModal.service || !confirmModal.newDate) return
    
    setRenewingId(confirmModal.service.id)
    try {
      const res = await fetch(`/api/technical-services/${confirmModal.service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ renewal_date: confirmModal.newDate })
      })
      
      if (res.ok) {
        setConfirmModal({ isOpen: false, type: 'renew', service: null })
        await loadData()
      }
    } catch (error) {
      console.error('Error renewing service:', error)
    } finally {
      setRenewingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <p className="text-sm text-zinc-500">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* ========== ALERT BANNER ========== */}
      {stats.overdue > 0 && (
        <div className="glass-card rounded-2xl p-4 glow-rose flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="icon-box icon-box-rose">
              <AlertTriangle className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{stats.overdue} Gecikmiş Yenileme!</h3>
              <p className="text-sm text-zinc-400 mt-0.5">
                {stats.overdueServices.slice(0, 3).map(s => s.identifier).join(', ')}
                {stats.overdue > 3 && ` ve ${stats.overdue - 3} diğer`} - Hemen işlem alın
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveFilter('all')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Görüntüle
          </button>
        </div>
      )}

      {/* ========== STAT CARDS - ROW 1 ========== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {/* Toplam Hizmet */}
        <div className="glass-card rounded-2xl p-5 glow-indigo card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box icon-box-indigo">
              <Server className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="badge badge-emerald">Aktif</span>
          </div>
          <p className="text-3xl font-bold text-white font-mono mb-1">{stats.total}</p>
          <p className="text-sm text-zinc-500">Toplam Hizmet</p>
        </div>

        {/* Marka */}
        <div className="glass-card rounded-2xl p-5 glow-violet card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box icon-box-violet">
              <Building2 className="w-6 h-6 text-violet-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white font-mono mb-1">{stats.brands}</p>
          <p className="text-sm text-zinc-500">Marka</p>
        </div>

        {/* 30 Gün İçinde */}
        <div className="glass-card rounded-2xl p-5 glow-amber card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box icon-box-amber">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
            {stats.upcoming > 0 && (
              <span className="badge badge-amber">Dikkat</span>
            )}
          </div>
          <p className="text-3xl font-bold text-white font-mono mb-1">{stats.upcoming}</p>
          <p className="text-sm text-zinc-500">30 Gün İçinde</p>
        </div>

        {/* Gecikmiş */}
        <div className="glass-card rounded-2xl p-5 glow-rose card-hover cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box icon-box-rose">
              <AlertCircle className="w-6 h-6 text-rose-400" />
            </div>
            {stats.overdue > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500 text-white font-medium animate-pulse">Acil</span>
            )}
          </div>
          <p className={cn("text-3xl font-bold font-mono mb-1", stats.overdue > 0 ? "text-rose-400" : "text-white")}>
            {stats.overdue}
          </p>
          <p className="text-sm text-zinc-500">Gecikmiş</p>
        </div>

        {/* Tahmini Gelir */}
        <div className="glass-card rounded-2xl p-5 glow-emerald card-hover col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box icon-box-emerald">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xs text-zinc-500">Yıllık</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400 font-mono mb-1">
            ${stats.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-sm text-zinc-500">Tahmini Gelir</p>
        </div>
      </div>

      {/* ========== PROVIDER CARDS ========== */}
      {providerStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {providerStats.slice(0, 3).map((provider) => {
            const style = getProviderStyle(provider.name)
            const percentage = stats.total > 0 ? Math.round((provider.count / stats.total) * 100) : 0
            
            return (
              <div key={provider.name} className="glass-card rounded-2xl p-5 border border-white/10 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", style.bg)}>
                    <span className="text-white text-sm font-bold">
                      {provider.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{provider.name}</p>
                    <p className="text-xs text-zinc-500">{provider.pricePerYear}$/yıl</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-white font-mono">{provider.count}</p>
                    <p className="text-xs text-zinc-500">hosting</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400 font-mono">
                      ${provider.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-zinc-500">yıllık</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-zinc-500">Dağılım</span>
                    <span className={cn("text-xs font-mono font-semibold", style.text)}>{percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div 
                      className={cn("h-full rounded-full", style.progress)} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}

          {/* Ödeme Durumu */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 card-hover">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-zinc-400" />
              <p className="font-semibold text-white">Ödeme Durumu</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-sm text-zinc-400">Ödendi</span>
                <span className="text-sm font-mono font-semibold text-emerald-400">
                  {stats.total - stats.overdue - stats.upcoming}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-sm text-zinc-400">Bekliyor</span>
                <span className="text-sm font-mono font-semibold text-amber-400">{stats.upcoming}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-sm text-zinc-400">Gecikmiş</span>
                <span className="text-sm font-mono font-semibold text-rose-400">{stats.overdue}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== FILTER BAR ========== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {SERVICE_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(activeFilter === value ? 'all' : value as ServiceType)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                activeFilter === value 
                  ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400" 
                  : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
              )}
            >
              {label} ({typeCounts[value as ServiceType]})
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/ayarlar">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 text-sm hover:text-white hover:bg-white/10 transition-colors">
              <Settings className="w-4 h-4" />
              Ayarlar
            </button>
          </Link>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Yeni Hizmet
          </button>
        </div>
      </div>

      {/* ========== HİZMET LİSTESİ ========== */}
      {filteredServices.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-white/10 text-center">
          <div className="icon-box icon-box-default w-16 h-16 flex items-center justify-center mx-auto mb-4 animate-float">
            <Server className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="font-semibold text-white mb-2">
            {services.length === 0 ? 'Henüz hizmet eklenmedi' : 'Sonuç bulunamadı'}
          </h3>
          <p className="text-sm text-zinc-500 mb-6">
            {services.length === 0 
              ? 'Hosting, domain, SSL veya e-posta hizmetlerini buradan takip edebilirsin.' 
              : 'Farklı bir filtre deneyin.'}
          </p>
          {services.length === 0 && (
            <button onClick={handleAddNew} className="btn-primary px-5 py-2.5 rounded-xl">
              <Plus className="w-4 h-4 mr-2 inline" />
              İlk Hizmeti Ekle
            </button>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">Tüm Hizmetler</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                {filteredServices.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Sırala:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 text-white cursor-pointer focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="renewal">Yenileme Tarihi</option>
                  <option value="brand">Marka (A-Z)</option>
                  <option value="provider">Sağlayıcı</option>
                  <option value="price">Fiyat</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-white/5">
            {paginatedServices.map((service) => {
              const daysDiff = getDaysDiff(service.renewal_date)
              const isOverdue = daysDiff !== null && daysDiff < 0
              const isUpcoming = daysDiff !== null && daysDiff >= 0 && daysDiff <= 30
              const price = calculatePrice(service)
              const isRenewing = renewingId === service.id
              const providerStyle = getProviderStyle(service.provider?.name || '')
              
              return (
                <div 
                  key={service.id}
                  className={cn(
                    "flex items-center gap-4 p-5 transition-colors group",
                    isOverdue && "bg-rose-500/5 hover:bg-rose-500/10",
                    isUpcoming && !isOverdue && "hover:bg-amber-500/5",
                    !isOverdue && !isUpcoming && "hover:bg-white/[0.02]"
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    "icon-box",
                    isOverdue ? "icon-box-rose" :
                    isUpcoming ? "icon-box-amber" : "icon-box-indigo"
                  )}>
                    <ServiceIcon 
                      type={service.service_type} 
                      className={cn(
                        "w-5 h-5",
                        isOverdue ? "text-rose-400" :
                        isUpcoming ? "text-amber-400" : "text-indigo-400"
                      )} 
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white truncate">{service.identifier}</p>
                      {isOverdue && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500 text-white font-medium">
                          Gecikmiş
                        </span>
                      )}
                      {isUpcoming && !isOverdue && daysDiff !== null && daysDiff <= 14 && (
                        <span className="badge badge-amber font-semibold">{daysDiff} gün</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {service.brand && (
                        <span className="text-xs text-zinc-500">🏢 {service.brand.name}</span>
                      )}
                      {service.provider && (
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded border",
                          providerStyle.badge
                        )}>
                          {service.provider.name}
                        </span>
                      )}
                      {price > 0 && (
                        <span className="text-xs text-zinc-500">
                          {price.toFixed(0)}$/{service.provider?.billing_cycle === 'monthly' ? 'ay' : 'yıl'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Date */}
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-mono",
                      isOverdue ? "text-rose-400" :
                      isUpcoming ? "text-amber-400" : "text-white"
                    )}>
                      {formatDate(service.renewal_date)}
                    </p>
                    {daysDiff !== null && (
                      <p className={cn(
                        "text-xs",
                        isOverdue ? "text-rose-300" : "text-zinc-500"
                      )}>
                        {isOverdue 
                          ? `${Math.abs(daysDiff)} gün gecikmiş` 
                          : `${daysDiff} gün kaldı`}
                      </p>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleRenewClick(service)}
                      disabled={isRenewing}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                        isOverdue 
                          ? "bg-rose-500 text-white hover:bg-rose-600" 
                          : isUpcoming
                            ? "bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10"
                            : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {isRenewing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Yenile
                        </>
                      )}
                    </button>
                    
                    {/* Edit/Delete - hover'da göster */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(service)}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(service)}
                        className="p-2 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between p-5 border-t border-white/10">
            <p className="text-sm text-zinc-500">
              {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredServices.length)} / {filteredServices.length} gösteriliyor
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm border transition-colors",
                    currentPage === 1 
                      ? "bg-white/5 border-white/10 text-zinc-600 cursor-not-allowed"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  Önceki
                </button>
                
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 3) {
                    pageNum = i + 1
                  } else if (currentPage === 1) {
                    pageNum = i + 1
                  } else if (currentPage === totalPages) {
                    pageNum = totalPages - 2 + i
                  } else {
                    pageNum = currentPage - 1 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                        currentPage === pageNum
                          ? "bg-indigo-500 text-white"
                          : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm border transition-colors",
                    currentPage === totalPages 
                      ? "bg-white/5 border-white/10 text-zinc-600 cursor-not-allowed"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  Sonraki
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingService(null); }}
        onSave={loadData}
        editingService={editingService}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'renew', service: null })}
        onConfirm={confirmModal.type === 'renew' ? handleRenewConfirm : handleDeleteConfirm}
        variant={confirmModal.type === 'renew' ? 'renew' : 'danger'}
        title={
          confirmModal.type === 'renew' 
            ? 'Hizmeti Yenile' 
            : 'Hizmeti Sil'
        }
        description={
          confirmModal.type === 'renew'
            ? `"${confirmModal.service?.identifier}" hizmetinin yenileme tarihi ${formatDate(confirmModal.newDate || null)} olarak güncellenecek.`
            : `"${confirmModal.service?.identifier}" hizmetini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`
        }
        confirmText={confirmModal.type === 'renew' ? 'Yenile' : 'Sil'}
        cancelText="İptal"
        isLoading={renewingId === confirmModal.service?.id}
      />
    </div>
  )
}
