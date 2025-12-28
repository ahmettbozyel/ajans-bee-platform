'use client'

import { useState, useEffect } from 'react'
import { 
  Server, Globe, ShieldCheck, Mail, Building2, Calendar, AlertTriangle,
  Search, Plus, Loader2, Settings, RefreshCw, Pencil, Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { ServiceType } from '@/lib/service-provider-types'
import { SERVICE_TYPES, SERVICE_TYPE_COLORS } from '@/lib/service-provider-types'
import type { TechnicalServiceWithRelations } from '@/lib/technical-service-types-new'
import { SERVICE_STATUSES } from '@/lib/technical-service-types-new'
import Link from 'next/link'
import { ServiceModal } from './components/service-modal'

// Helper: Gün farkı hesapla
function getDaysDiff(date: string | null): number | null {
  if (!date) return null
  const today = new Date()
  const renewalDate = new Date(date)
  const diffTime = renewalDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Helper: Servis ikon
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

// Helper: Fiyat hesapla
function calculatePrice(service: TechnicalServiceWithRelations): number {
  if (!service.provider?.base_price_usd) return 0
  const basePrice = service.provider.base_price_usd
  const discount = service.discount_percent || 0
  const quantity = service.quantity || 1
  return basePrice * quantity * (1 - discount / 100)
}

export default function TeknikHizmetlerPage() {
  const [services, setServices] = useState<TechnicalServiceWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<ServiceType | 'all'>('all')
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<TechnicalServiceWithRelations | null>(null)

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

  function handleAddNew() {
    setEditingService(null)
    setIsModalOpen(true)
  }

  function handleEdit(service: TechnicalServiceWithRelations) {
    setEditingService(service)
    setIsModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return
    
    try {
      const res = await fetch(`/api/technical-services/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await loadData()
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  function handleModalClose() {
    setIsModalOpen(false)
    setEditingService(null)
  }

  function handleModalSave() {
    loadData()
  }

  // Filtrele
  const filteredServices = services.filter(service => {
    const matchesSearch = searchQuery === '' || 
      service.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === 'all' || service.service_type === activeFilter
    return matchesSearch && matchesFilter
  })

  // Stats hesapla
  const stats = {
    total: services.length,
    brands: new Set(services.map(s => s.brand_id).filter(Boolean)).size,
    upcoming: services.filter(s => {
      const days = getDaysDiff(s.renewal_date)
      return days !== null && days > 0 && days <= 30
    }).length,
    overdue: services.filter(s => {
      const days = getDaysDiff(s.renewal_date)
      return days !== null && days < 0
    }).length
  }

  // Servis type count
  const typeCounts = {
    hosting: services.filter(s => s.service_type === 'hosting').length,
    domain: services.filter(s => s.service_type === 'domain').length,
    ssl: services.filter(s => s.service_type === 'ssl').length,
    email: services.filter(s => s.service_type === 'email').length
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="p-6 content-bg min-h-screen">
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <div className="glass-card rounded-2xl p-5 glow-cyan card-hover">
          <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 w-fit mb-4">
            <Server className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{stats.total}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Toplam Hizmet</p>
        </div>
        <div className="glass-card rounded-2xl p-5 glow-violet card-hover">
          <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 w-fit mb-4">
            <Building2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{stats.brands}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Marka</p>
        </div>
        <div className="glass-card rounded-2xl p-5 glow-amber card-hover">
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 w-fit mb-4">
            <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{stats.upcoming}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">30 Gün İçinde</p>
        </div>
        <div className="glass-card rounded-2xl p-5 glow-rose card-hover">
          <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 w-fit mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{stats.overdue}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Gecikmiş</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="glass-card rounded-xl p-4 border border-zinc-200 dark:border-white/10 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              type="text" 
              placeholder="Hizmet, marka veya sağlayıcı ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-glow pl-10"
            />
          </div>
          <div className="flex gap-2">
            {SERVICE_TYPES.map(({ value, label }) => {
              const isActive = activeFilter === value
              const colors = SERVICE_TYPE_COLORS[value as ServiceType]
              return (
                <button
                  key={value}
                  onClick={() => setActiveFilter(isActive ? 'all' : value as ServiceType)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                    isActive 
                      ? `${colors.bg} ${colors.text} border-current` 
                      : "bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  {label} ({typeCounts[value as ServiceType]})
                </button>
              )
            })}
          </div>
          <Link href="/ayarlar">
            <Button variant="outline" size="sm" className="text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700">
              <Settings className="w-4 h-4 mr-2" />
              Fiyatlar
            </Button>
          </Link>
          <Button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Hizmet
          </Button>
        </div>
      </div>
      
      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="glass-card rounded-2xl p-12 border border-zinc-200 dark:border-white/10 text-center">
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 w-fit mx-auto mb-4">
            <Server className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            {services.length === 0 ? 'Henüz hizmet eklenmedi' : 'Sonuç bulunamadı'}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            {services.length === 0 
              ? 'Hosting, domain, SSL veya e-posta hizmetlerini buradan takip edebilirsin.' 
              : 'Farklı bir arama terimi veya filtre deneyin.'}
          </p>
          {services.length === 0 && (
            <Button 
              onClick={handleAddNew}
              className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              İlk Hizmeti Ekle
            </Button>
          )}
        </div>
      )}
      
      {/* Services List */}
      {filteredServices.length > 0 && (
        <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between">
            <h2 className="font-semibold text-zinc-900 dark:text-white">
              Tüm Hizmetler ({filteredServices.length})
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>Sırala:</span>
              <span className="text-zinc-900 dark:text-white font-medium">Yenileme Tarihi</span>
            </div>
          </div>
          
          {filteredServices.map((service) => {
            const daysDiff = getDaysDiff(service.renewal_date)
            const isOverdue = daysDiff !== null && daysDiff < 0
            const isUpcoming = daysDiff !== null && daysDiff >= 0 && daysDiff <= 30
            const colors = SERVICE_TYPE_COLORS[service.service_type]
            const serviceLabel = SERVICE_TYPES.find(t => t.value === service.service_type)?.label
            const price = calculatePrice(service)
            const statusInfo = SERVICE_STATUSES.find(s => s.value === service.status)
            
            return (
              <div 
                key={service.id}
                className={cn(
                  "p-4 border-b border-zinc-200 dark:border-white/5 transition-colors group",
                  isOverdue && "bg-rose-50/50 dark:bg-rose-950/20",
                  isUpcoming && !isOverdue && "bg-amber-50/30 dark:bg-amber-950/10",
                  !isOverdue && !isUpcoming && "hover:bg-zinc-50 dark:hover:bg-white/[0.02]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center border",
                      colors.bg,
                      "border-zinc-200 dark:border-white/10"
                    )}>
                      <ServiceIcon type={service.service_type} className={cn("w-6 h-6", colors.text)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-zinc-900 dark:text-white">{service.identifier}</p>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          colors.bg, colors.text
                        )}>
                          {serviceLabel}
                        </span>
                        {service.provider && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">{service.provider.name}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {service.brand && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-zinc-400" />
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">{service.brand.name}</span>
                          </div>
                        )}
                        {price > 0 && (
                          <span className="text-xs text-zinc-400 font-mono">
                            ${price.toFixed(2)}/{service.provider?.billing_cycle === 'monthly' ? 'ay' : 'yıl'}
                          </span>
                        )}
                        {service.quantity > 1 && (
                          <span className="text-xs bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded">
                            x{service.quantity}
                          </span>
                        )}
                        {service.auto_renew && (
                          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <RefreshCw className="w-3 h-3" />
                            Otomatik
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isOverdue ? (
                      <>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-semibold border border-rose-200 dark:border-rose-500/30 animate-pulse">
                          {Math.abs(daysDiff!)} gün geçti!
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          Şimdi Yenile
                        </Button>
                      </>
                    ) : isUpcoming ? (
                      <>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-500/30">
                          {daysDiff} gün kaldı
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          Yenile
                        </Button>
                      </>
                    ) : daysDiff !== null ? (
                      <>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{daysDiff} gün</span>
                        <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          {statusInfo?.label || 'Aktif'}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-zinc-400">Tarih yok</span>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Pencil className="w-4 h-4 text-zinc-400" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        editingService={editingService}
      />
      
    </div>
  )
}
