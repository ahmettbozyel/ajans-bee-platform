'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  FileText,
  Server,
  Calendar
} from 'lucide-react'
import { getRecentCustomers, formatRelativeTime, type RecentCustomer } from '@/lib/local-storage'
import type { Customer } from '@/lib/customer-types'
import { calculateBriefCompletion, SECTORS } from '@/lib/customer-types'

function getSectorLabel(value: string): string {
  return SECTORS.find(s => s.value === value)?.label || value
}

export default function DashboardPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers(data || [])
      setRecentCustomers(getRecentCustomers())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const activeCustomers = customers.filter(c => c.status !== 'inactive')
  const avgCompletion = customers.length > 0 
    ? Math.round(customers.reduce((sum, c) => sum + calculateBriefCompletion(c), 0) / customers.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Ajans Bee AI Platform - Genel Bakış
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Toplam Marka */}
        <div 
          className="glass-card rounded-2xl p-5 border-glow-indigo card-hover cursor-pointer" 
          onClick={() => router.push('/musteriler')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Building2 className="h-6 w-6 text-indigo-500" />
            </div>
            {activeCustomers.length > 0 && (
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span className="font-mono text-xs">Aktif</span>
              </div>
            )}
          </div>
          <p className="text-3xl font-bold">{customers.length}</p>
          <p className="text-sm text-muted-foreground">Toplam Marka</p>
        </div>

        {/* Aktif */}
        <div 
          className="glass-card rounded-2xl p-5 border-glow-emerald card-hover cursor-pointer" 
          onClick={() => router.push('/musteriler')}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <FileText className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{activeCustomers.length}</p>
          <p className="text-sm text-muted-foreground">Aktif Marka</p>
        </div>

        {/* Ortalama Brief */}
        <div className="glass-card rounded-2xl p-5 border-glow-violet card-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <FileText className="h-6 w-6 text-violet-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">%{avgCompletion}</p>
          <p className="text-sm text-muted-foreground">Ort. Brief Tamamlama</p>
        </div>

        {/* İçerik */}
        <div className="glass-card rounded-2xl p-5 border-glow-fuchsia card-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20">
              <Sparkles className="h-6 w-6 text-fuchsia-500" />
            </div>
            <Badge className="bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20 text-xs">
              Yakında
            </Badge>
          </div>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-muted-foreground">Üretilen İçerik</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Brands */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl border border-border/40 overflow-hidden">
            <div className="p-5 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold">Son Kullanılan Markalar</h2>
                </div>
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
                <div className="space-y-3">
                  {recentCustomers.slice(0, 5).map((recent) => {
                    const customer = customers.find(c => c.id === recent.id)
                    if (!customer) return null
                    const completion = calculateBriefCompletion(customer)
                    
                    return (
                      <div 
                        key={recent.id}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 cursor-pointer transition-all"
                        onClick={() => router.push(`/customers/${customer.id}`)}
                      >
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {customer.sector ? getSectorLabel(customer.sector) : 'Sektör belirtilmemiş'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
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
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions + AI Insight */}
        <div className="space-y-6">
          {/* AI Insight Box */}
          <div className="glass-card rounded-2xl p-5 border-glow-violet bg-gradient-to-br from-indigo-500/5 to-violet-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h3 className="text-sm font-semibold">AI İçgörüsü</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {customers.length === 0 
                ? "İlk markanızı ekleyerek içerik üretimine başlayabilirsiniz."
                : avgCompletion < 50
                ? `${customers.length} markanız var. Brief tamamlama oranlarınızı artırarak daha kaliteli içerik üretebilirsiniz.`
                : `${activeCustomers.length} aktif markanız hazır. İçerik üretmeye başlayabilirsiniz!`
              }
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
              onClick={() => router.push('/musteriler')}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {customers.length === 0 ? 'Marka Ekle' : 'İçerik Üret'}
            </Button>
          </div>

          {/* Quick Links */}
          <div className="glass-card rounded-2xl border border-border/40 overflow-hidden">
            <div className="p-5 border-b border-border/40">
              <h2 className="font-semibold">Hızlı Erişim</h2>
            </div>
            <div className="p-3">
              <button 
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-all text-left"
                onClick={() => router.push('/musteriler')}
              >
                <div className="p-2 rounded-lg bg-indigo-500/10">
                  <Building2 className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Markalar</p>
                  <p className="text-xs text-muted-foreground">Tüm markaları görüntüle</p>
                </div>
              </button>
              <button 
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-all text-left"
                onClick={() => router.push('/teknik-hizmetler')}
              >
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Server className="h-4 w-4 text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Teknik Hizmetler</p>
                  <p className="text-xs text-muted-foreground">Pasif markalar dahil</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
