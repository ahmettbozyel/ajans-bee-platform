'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  EyeOff,
  Clock, 
  Activity,
  ArrowRight,
  AlertTriangle,
  Calendar
} from 'lucide-react'
import { getRecentCustomers, type RecentCustomer } from '@/lib/local-storage'
import type { Customer } from '@/lib/customer-types'
import { calculateBriefCompletion, SECTORS } from '@/lib/customer-types'
import {
  type TechnicalServiceWithCustomer,
  getDaysUntilRenewal,
  getRenewalBadgeColor,
  getServiceTypeLabel
} from '@/lib/technical-service-types'

function getSectorLabel(value: string): string {
  return SECTORS.find(s => s.value === value)?.label || value
}

export default function DashboardPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([])
  const [services, setServices] = useState<TechnicalServiceWithCustomer[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      // Müşterileri yükle
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (customersError) throw customersError
      setCustomers(customersData || [])
      setRecentCustomers(getRecentCustomers())

      // Teknik hizmetleri yükle
      const { data: servicesData, error: servicesError } = await (supabase
        .from('technical_services')
        .select(`
          *,
          customer:customers(id, name, customer_type)
        `)
        .order('renewal_date', { ascending: true, nullsFirst: false }) as any)

      if (servicesError) throw servicesError
      setServices(servicesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const activeCustomers = customers.filter(c => c.status !== 'inactive')
  const inactiveCustomers = customers.filter(c => c.status === 'inactive')
  
  // Yaklaşan yenilemeler (30 gün içinde)
  const upcomingRenewals = services.filter(s => {
    const days = getDaysUntilRenewal(s.renewal_date)
    return days !== null && days <= 30
  }).sort((a, b) => {
    const daysA = getDaysUntilRenewal(a.renewal_date) || 999
    const daysB = getDaysUntilRenewal(b.renewal_date) || 999
    return daysA - daysB
  })

  // Gecikmiş yenilemeler
  const overdueCount = services.filter(s => {
    const days = getDaysUntilRenewal(s.renewal_date)
    return days !== null && days < 0
  }).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Hoş geldin 👋</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Aktif Marka */}
        <div 
          className="glass-card rounded-2xl p-5 border-glow-indigo card-hover cursor-pointer" 
          onClick={() => router.push('/musteriler')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
              <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-bold">{activeCustomers.length}</p>
          <p className="text-sm text-muted-foreground">Aktif Marka</p>
        </div>

        {/* Pasif Marka */}
        <div 
          className="glass-card rounded-2xl p-5 border-glow-violet card-hover cursor-pointer" 
          onClick={() => router.push('/musteriler')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
              <EyeOff className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
          <p className="text-3xl font-bold">{inactiveCustomers.length}</p>
          <p className="text-sm text-muted-foreground">Pasif Marka</p>
        </div>

        {/* Yaklaşan Yenileme */}
        <div 
          className="glass-card rounded-2xl p-5 border-glow-amber card-hover cursor-pointer" 
          onClick={() => router.push('/teknik-hizmetler')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            {overdueCount > 0 && (
              <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold animate-pulse">
                {overdueCount} ACİL
              </span>
            )}
          </div>
          <p className="text-3xl font-bold">{upcomingRenewals.length}</p>
          <p className="text-sm text-muted-foreground">Yaklaşan Yenileme</p>
        </div>

        {/* Aktivite */}
        <div className="glass-card rounded-2xl p-5 border-glow-emerald card-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold">{services.length}</p>
          <p className="text-sm text-muted-foreground">Teknik Hizmet</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Son Çalışılan Markalar */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl border border-border/40 overflow-hidden">
            <div className="p-5 border-b border-border/40">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Son Çalışılan Markalar</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => router.push('/musteriler')}
                >
                  Tümü
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            
            <div className="p-5">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-pulse">Yükleniyor...</div>
                </div>
              ) : recentCustomers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-4">
                    <Building2 className="h-8 w-8 text-indigo-500/50" />
                  </div>
                  <p className="text-muted-foreground">Henüz marka kullanmadınız</p>
                  <Button 
                    className="mt-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                    onClick={() => router.push('/musteriler')}
                  >
                    Markalara Git
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentCustomers.slice(0, 6).map((recent) => {
                    const customer = customers.find(c => c.id === recent.id)
                    if (!customer) return null
                    const completion = calculateBriefCompletion(customer)
                    
                    return (
                      <div 
                        key={recent.id}
                        className="glass-card rounded-xl p-4 cursor-pointer card-hover border border-border/40"
                        onClick={() => router.push(`/customers/${customer.id}`)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {customer.customer_type === 'retainer' ? 'Retainer' : 'Proje'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                completion < 30 ? 'bg-rose-500' :
                                completion < 60 ? 'bg-amber-500' :
                                completion < 90 ? 'bg-indigo-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">%{completion}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Yaklaşan Yenilemeler */}
        <div>
          <div className="glass-card rounded-2xl border border-border/40 overflow-hidden">
            <div className="p-5 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold">Yaklaşan Yenilemeler</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => router.push('/teknik-hizmetler')}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-3">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-pulse">Yükleniyor...</div>
                </div>
              ) : upcomingRenewals.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mb-3">
                    <Calendar className="h-6 w-6 text-emerald-500/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">Yaklaşan yenileme yok</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingRenewals.slice(0, 5).map((service) => {
                    const daysUntil = getDaysUntilRenewal(service.renewal_date)
                    const color = getRenewalBadgeColor(daysUntil)
                    const isOverdue = daysUntil !== null && daysUntil < 0
                    
                    return (
                      <div 
                        key={service.id}
                        className={`flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 cursor-pointer transition-all ${
                          isOverdue ? 'bg-rose-500/5' : ''
                        }`}
                        onClick={() => router.push('/teknik-hizmetler')}
                      >
                        <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                          color === 'red' ? 'bg-rose-500' :
                          color === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {service.customer?.name || 'Bilinmiyor'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getServiceTypeLabel(service.service_type)} - {service.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium ${
                            color === 'red' ? 'text-rose-500' :
                            color === 'yellow' ? 'text-amber-500' : 'text-emerald-500'
                          }`}>
                            {daysUntil !== null && daysUntil < 0 
                              ? `${Math.abs(daysUntil)} gün geçti`
                              : daysUntil === 0 
                              ? 'Bugün'
                              : `${daysUntil} gün`
                            }
                          </p>
                          {isOverdue && (
                            <Badge variant="destructive" className="text-[10px] mt-1">
                              GECİKMİŞ
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
