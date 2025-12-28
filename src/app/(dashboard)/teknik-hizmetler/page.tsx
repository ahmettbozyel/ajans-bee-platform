'use client'

import { useState, useEffect } from 'react'
import { 
  Server, Globe, ShieldCheck, Mail, Building2, Calendar, AlertTriangle,
  Search, Plus, Loader2, Settings, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { ServiceType } from '@/lib/service-provider-types'
import { SERVICE_TYPES, SERVICE_TYPE_COLORS } from '@/lib/service-provider-types'
import type { TechnicalServiceWithRelations } from '@/lib/technical-service-types-new'
import { SERVICE_STATUSES } from '@/lib/technical-service-types-new'
import Link from 'next/link'

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
  return &lt;Icon className={className} /&gt;
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
  const [services, setServices] = useState&lt;TechnicalServiceWithRelations[]&gt;([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState&lt;ServiceType | 'all'&gt;('all')

  useEffect(() =&gt; {
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

  // Filtrele
  const filteredServices = services.filter(service =&gt; {
    const matchesSearch = searchQuery === '' || 
      service.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === 'all' || service.service_type === activeFilter
    return matchesSearch &amp;&amp; matchesFilter
  })

  // Stats hesapla
  const stats = {
    total: services.length,
    brands: new Set(services.map(s =&gt; s.brand_id).filter(Boolean)).size,
    upcoming: services.filter(s =&gt; {
      const days = getDaysDiff(s.renewal_date)
      return days !== null &amp;&amp; days &gt; 0 &amp;&amp; days &lt;= 30
    }).length,
    overdue: services.filter(s =&gt; {
      const days = getDaysDiff(s.renewal_date)
      return days !== null &amp;&amp; days &lt; 0
    }).length
  }

  // Servis type count
  const typeCounts = {
    hosting: services.filter(s =&gt; s.service_type === 'hosting').length,
    domain: services.filter(s =&gt; s.service_type === 'domain').length,
    ssl: services.filter(s =&gt; s.service_type === 'ssl').length,
    email: services.filter(s =&gt; s.service_type === 'email').length
  }

  if (isLoading) {
    return (
      &lt;div className="flex items-center justify-center min-h-[60vh]"&gt;
        &lt;Loader2 className="h-8 w-8 animate-spin text-cyan-500" /&gt;
      &lt;/div&gt;
    )
  }

  return (
    &lt;div className="p-6 content-bg min-h-screen"&gt;
      
      {/* Stats */}
      &lt;div className="grid grid-cols-4 gap-5 mb-6"&gt;
        &lt;div className="glass-card rounded-2xl p-5 glow-cyan card-hover"&gt;
          &lt;div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 w-fit mb-4"&gt;
            &lt;Server className="w-6 h-6 text-cyan-600 dark:text-cyan-400" /&gt;
          &lt;/div&gt;
          &lt;p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1"&gt;{stats.total}&lt;/p&gt;
          &lt;p className="text-sm text-zinc-500"&gt;Toplam Hizmet&lt;/p&gt;
        &lt;/div&gt;
        &lt;div className="glass-card rounded-2xl p-5 glow-violet card-hover"&gt;
          &lt;div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 w-fit mb-4"&gt;
            &lt;Building2 className="w-6 h-6 text-violet-600 dark:text-violet-400" /&gt;
          &lt;/div&gt;
          &lt;p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1"&gt;{stats.brands}&lt;/p&gt;
          &lt;p className="text-sm text-zinc-500"&gt;Marka&lt;/p&gt;
        &lt;/div&gt;
        &lt;div className="glass-card rounded-2xl p-5 glow-amber card-hover"&gt;
          &lt;div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 w-fit mb-4"&gt;
            &lt;Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" /&gt;
          &lt;/div&gt;
          &lt;p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1"&gt;{stats.upcoming}&lt;/p&gt;
          &lt;p className="text-sm text-zinc-500"&gt;30 Gün İçinde&lt;/p&gt;
        &lt;/div&gt;
        &lt;div className="glass-card rounded-2xl p-5 glow-rose card-hover"&gt;
          &lt;div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 w-fit mb-4"&gt;
            &lt;AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" /&gt;
          &lt;/div&gt;
          &lt;p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1"&gt;{stats.overdue}&lt;/p&gt;
          &lt;p className="text-sm text-zinc-500"&gt;Gecikmiş&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      
      {/* Filters */}
      &lt;div className="glass-card rounded-xl p-4 border border-zinc-200 dark:border-white/10 mb-6"&gt;
        &lt;div className="flex items-center gap-4"&gt;
          &lt;div className="relative flex-1"&gt;
            &lt;Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" /&gt;
            &lt;Input 
              type="text" 
              placeholder="Hizmet, marka veya sağlayıcı ara..." 
              value={searchQuery}
              onChange={(e) =&gt; setSearchQuery(e.target.value)}
              className="input-glow pl-10"
            /&gt;
          &lt;/div&gt;
          &lt;div className="flex gap-2"&gt;
            {SERVICE_TYPES.map(({ value, label }) =&gt; {
              const isActive = activeFilter === value
              const colors = SERVICE_TYPE_COLORS[value as ServiceType]
              return (
                &lt;button
                  key={value}
                  onClick={() =&gt; setActiveFilter(isActive ? 'all' : value as ServiceType)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                    isActive 
                      ? `${colors.bg} ${colors.text} border-current` 
                      : "bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400"
                  )}
                &gt;
                  {label} ({typeCounts[value as ServiceType]})
                &lt;/button&gt;
              )
            })}
          &lt;/div&gt;
          &lt;Link href="/ayarlar"&gt;
            &lt;Button variant="outline" size="sm"&gt;
              &lt;Settings className="w-4 h-4 mr-2" /&gt;
              Fiyatlar
            &lt;/Button&gt;
          &lt;/Link&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      
      {/* Empty State */}
      {filteredServices.length === 0 &amp;&amp; (
        &lt;div className="glass-card rounded-2xl p-12 border border-zinc-200 dark:border-white/10 text-center"&gt;
          &lt;div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 w-fit mx-auto mb-4"&gt;
            &lt;Server className="w-8 h-8 text-zinc-400" /&gt;
          &lt;/div&gt;
          &lt;h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2"&gt;
            {services.length === 0 ? 'Henüz hizmet eklenmedi' : 'Sonuç bulunamadı'}
          &lt;/h3&gt;
          &lt;p className="text-sm text-zinc-500 mb-4"&gt;
            {services.length === 0 
              ? 'Hosting, domain, SSL veya e-posta hizmetlerini buradan takip edebilirsin.' 
              : 'Farklı bir arama terimi veya filtre deneyin.'}
          &lt;/p&gt;
          {services.length === 0 &amp;&amp; (
            &lt;Button className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white"&gt;
              &lt;Plus className="w-4 h-4 mr-2" /&gt;
              İlk Hizmeti Ekle
            &lt;/Button&gt;
          )}
        &lt;/div&gt;
      )}
      
      {/* Services List */}
      {filteredServices.length &gt; 0 &amp;&amp; (
        &lt;div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden"&gt;
          &lt;div className="px-5 py-4 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between"&gt;
            &lt;h2 className="font-semibold text-zinc-900 dark:text-white"&gt;
              Tüm Hizmetler ({filteredServices.length})
            &lt;/h2&gt;
            &lt;div className="flex items-center gap-2 text-xs text-zinc-500"&gt;
              &lt;span&gt;Sırala:&lt;/span&gt;
              &lt;span className="text-zinc-900 dark:text-white font-medium"&gt;Yenileme Tarihi&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
          
          {filteredServices.map((service) =&gt; {
            const daysDiff = getDaysDiff(service.renewal_date)
            const isOverdue = daysDiff !== null &amp;&amp; daysDiff &lt; 0
            const isUpcoming = daysDiff !== null &amp;&amp; daysDiff &gt;= 0 &amp;&amp; daysDiff &lt;= 30
            const colors = SERVICE_TYPE_COLORS[service.service_type]
            const serviceLabel = SERVICE_TYPES.find(t =&gt; t.value === service.service_type)?.label
            const price = calculatePrice(service)
            const statusInfo = SERVICE_STATUSES.find(s =&gt; s.value === service.status)
            
            return (
              &lt;div 
                key={service.id}
                className={cn(
                  "p-4 border-b border-zinc-200 dark:border-white/5 transition-colors",
                  isOverdue &amp;&amp; "bg-rose-50/50 dark:bg-rose-950/20",
                  isUpcoming &amp;&amp; !isOverdue &amp;&amp; "bg-amber-50/30 dark:bg-amber-950/10",
                  !isOverdue &amp;&amp; !isUpcoming &amp;&amp; "hover:bg-zinc-50 dark:hover:bg-white/[0.02]"
                )}
              &gt;
                &lt;div className="flex items-center justify-between"&gt;
                  &lt;div className="flex items-center gap-4"&gt;
                    &lt;div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center border",
                      colors.bg,
                      "border-zinc-200 dark:border-white/10"
                    )}&gt;
                      &lt;ServiceIcon type={service.service_type} className={cn("w-6 h-6", colors.text)} /&gt;
                    &lt;/div&gt;
                    &lt;div&gt;
                      &lt;div className="flex items-center gap-2 mb-1"&gt;
                        &lt;p className="font-medium text-zinc-900 dark:text-white"&gt;{service.identifier}&lt;/p&gt;
                        &lt;span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          colors.bg, colors.text
                        )}&gt;
                          {serviceLabel}
                        &lt;/span&gt;
                        {service.provider &amp;&amp; (
                          &lt;span className="text-xs text-zinc-500"&gt;{service.provider.name}&lt;/span&gt;
                        )}
                      &lt;/div&gt;
                      &lt;div className="flex items-center gap-3"&gt;
                        {service.brand &amp;&amp; (
                          &lt;div className="flex items-center gap-1"&gt;
                            &lt;Building2 className="w-3 h-3 text-zinc-400" /&gt;
                            &lt;span className="text-xs text-zinc-500"&gt;{service.brand.name}&lt;/span&gt;
                          &lt;/div&gt;
                        )}
                        {price &gt; 0 &amp;&amp; (
                          &lt;span className="text-xs text-zinc-400 font-mono"&gt;
                            ${price.toFixed(2)}/{service.provider?.billing_cycle === 'monthly' ? 'ay' : 'yıl'}
                          &lt;/span&gt;
                        )}
                        {service.quantity &gt; 1 &amp;&amp; (
                          &lt;span className="text-xs bg-zinc-100 dark:bg-white/5 text-zinc-500 px-1.5 py-0.5 rounded"&gt;
                            x{service.quantity}
                          &lt;/span&gt;
                        )}
                        {service.auto_renew &amp;&amp; (
                          &lt;div className="flex items-center gap-1 text-xs text-emerald-600"&gt;
                            &lt;RefreshCw className="w-3 h-3" /&gt;
                            Otomatik
                          &lt;/div&gt;
                        )}
                      &lt;/div&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
                  &lt;div className="flex items-center gap-3"&gt;
                    {isOverdue ? (
                      &lt;&gt;
                        &lt;span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-semibold border border-rose-200 dark:border-rose-500/30 animate-pulse"&gt;
                          {Math.abs(daysDiff!)} gün geçti!
                        &lt;/span&gt;
                        &lt;Button size="sm" variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50"&gt;
                          Şimdi Yenile
                        &lt;/Button&gt;
                      &lt;/&gt;
                    ) : isUpcoming ? (
                      &lt;&gt;
                        &lt;span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-500/30"&gt;
                          {daysDiff} gün kaldı
                        &lt;/span&gt;
                        &lt;Button size="sm" variant="outline"&gt;Yenile&lt;/Button&gt;
                      &lt;/&gt;
                    ) : daysDiff !== null ? (
                      &lt;&gt;
                        &lt;span className="text-xs text-zinc-500 font-mono"&gt;{daysDiff} gün&lt;/span&gt;
                        &lt;span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"&gt;
                          &lt;span className="h-1.5 w-1.5 rounded-full bg-emerald-500"&gt;&lt;/span&gt;
                          {statusInfo?.label || 'Aktif'}
                        &lt;/span&gt;
                      &lt;/&gt;
                    ) : (
                      &lt;span className="text-xs text-zinc-400"&gt;Tarih yok&lt;/span&gt;
                    )}
                  &lt;/div&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            )
          })}
        &lt;/div&gt;
      )}
      
    &lt;/div&gt;
  )
}
