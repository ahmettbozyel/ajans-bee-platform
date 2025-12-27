'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Building2, 
  Server, 
  Search,
  Globe,
  ArrowRight
} from 'lucide-react'
import type { Customer } from '@/lib/customer-types'
import { calculateBriefCompletion, SECTORS, getCustomerTypeLabel } from '@/lib/customer-types'

function getSectorLabel(value: string): string {
  return SECTORS.find(s => s.value === value)?.label || value
}

export default function TeknikHizmetlerPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer => {
    return customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.website_url?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const activeCount = customers.filter(c => c.status !== 'inactive').length
  const inactiveCount = customers.filter(c => c.status === 'inactive').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
          Teknik Hizmetler
        </h1>
        <p className="text-muted-foreground mt-1">
          Tüm markalar (aktif + pasif) - Teknik destek ve bakım için
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 border-glow-cyan">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Server className="h-4 w-4 text-cyan-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{customers.length}</p>
          <p className="text-xs text-muted-foreground">Toplam</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-glow-emerald">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Building2 className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{activeCount}</p>
          <p className="text-xs text-muted-foreground">Aktif</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-glow-amber">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Building2 className="h-4 w-4 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{inactiveCount}</p>
          <p className="text-xs text-muted-foreground">Pasif</p>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card rounded-xl p-4 border border-border/40">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Marka veya website ara..."
            className="pl-9 bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* All Customers List */}
      <div className="glass-card rounded-2xl border border-border/40 overflow-hidden">
        <div className="p-5 border-b border-border/40">
          <h2 className="font-semibold">Tüm Markalar ({filteredCustomers.length})</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="animate-pulse">Yükleniyor...</div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {searchQuery ? 'Sonuç bulunamadı' : 'Henüz marka yok'}
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {filteredCustomers.map((customer) => {
              const completion = calculateBriefCompletion(customer)
              const isInactive = customer.status === 'inactive'
              
              return (
                <div 
                  key={customer.id}
                  className={`flex items-center gap-4 p-4 hover:bg-muted/30 cursor-pointer transition-all ${
                    isInactive ? 'opacity-60' : ''
                  }`}
                  onClick={() => router.push(`/customers/${customer.id}`)}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isInactive 
                      ? 'bg-zinc-500/20 border border-zinc-500/30'
                      : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                  }`}>
                    <Building2 className={`h-5 w-5 ${isInactive ? 'text-zinc-500' : 'text-white'}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{customer.name}</p>
                      {isInactive && (
                        <Badge className="text-xs bg-zinc-500/10 text-zinc-500 border-zinc-500/20">
                          Pasif
                        </Badge>
                      )}
                      {customer.customer_type && (
                        <Badge 
                          className={`text-xs ${
                            customer.customer_type === 'retainer' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {getCustomerTypeLabel(customer.customer_type)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      {customer.website_url && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {(() => {
                            try { return new URL(customer.website_url).hostname } 
                            catch { return customer.website_url }
                          })()}
                        </p>
                      )}
                      {customer.sector && (
                        <p className="text-xs text-muted-foreground">
                          {getSectorLabel(customer.sector)}
                        </p>
                      )}
                    </div>
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
  )
}
