'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, Pencil, Trash2, Server, Globe, ShieldCheck, Mail,
  Loader2, Check, X, DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { ServiceProvider, ServiceType, BillingCycle } from '@/lib/service-provider-types'
import { SERVICE_TYPES, BILLING_CYCLES, SERVICE_TYPE_COLORS } from '@/lib/service-provider-types'

// Icons map
const SERVICE_ICONS: Record<ServiceType, React.ElementType> = {
  hosting: Server,
  domain: Globe,
  ssl: ShieldCheck,
  email: Mail
}

export function ServiceProvidersTab() {
  const [providers, setProviders] = useState<ServiceProvider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<ServiceProvider>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadProviders()
  }, [])

  async function loadProviders() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/service-providers')
      if (res.ok) {
        const data = await res.json()
        setProviders(data)
      }
    } catch (error) {
      console.error('Error loading providers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      const url = editingId 
        ? `/api/service-providers/${editingId}`
        : '/api/service-providers'
      
      const method = editingId ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          base_price_usd: Number(formData.base_price_usd) || 0
        })
      })

      if (res.ok) {
        await loadProviders()
        setEditingId(null)
        setIsAdding(false)
        setFormData({})
      }
    } catch (error) {
      console.error('Error saving provider:', error)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu sağlayıcıyı silmek istediğinize emin misiniz?')) return
    
    try {
      const res = await fetch(`/api/service-providers/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await loadProviders()
      } else {
        const data = await res.json()
        alert(data.error || 'Silme işlemi başarısız')
      }
    } catch (error) {
      console.error('Error deleting provider:', error)
    }
  }

  function startEdit(provider: ServiceProvider) {
    setEditingId(provider.id)
    setFormData(provider)
    setIsAdding(false)
  }

  function startAdd() {
    setIsAdding(true)
    setEditingId(null)
    setFormData({
      name: '',
      service_type: 'hosting',
      base_price_usd: 0,
      billing_cycle: 'yearly',
      is_active: true,
      notes: ''
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setIsAdding(false)
    setFormData({})
  }

  // Group by service type
  const groupedProviders = SERVICE_TYPES.reduce((acc, type) => {
    acc[type.value] = providers.filter(p => p.service_type === type.value)
    return acc
  }, {} as Record<ServiceType, ServiceProvider[]>)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Sağlayıcı Fiyatları</h2>
          <p className="text-sm text-zinc-500">Hosting, domain, SSL ve e-posta sağlayıcı fiyatlarını yönetin</p>
        </div>
        <Button 
          onClick={startAdd}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Sağlayıcı
        </Button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="glass-card rounded-xl p-5 border-2 border-indigo-500/50">
          <h3 className="font-medium text-zinc-900 dark:text-white mb-4">Yeni Sağlayıcı Ekle</h3>
          <div className="grid grid-cols-5 gap-4">
            <Input
              placeholder="Sağlayıcı Adı"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <select
              value={formData.service_type || 'hosting'}
              onChange={(e) => setFormData({ ...formData, service_type: e.target.value as ServiceType })}
              className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm"
            >
              {SERVICE_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                type="number"
                step="0.01"
                placeholder="Fiyat (USD)"
                value={formData.base_price_usd || ''}
                onChange={(e) => setFormData({ ...formData, base_price_usd: parseFloat(e.target.value) })}
                className="pl-9"
              />
            </div>
            <select
              value={formData.billing_cycle || 'yearly'}
              onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value as BillingCycle })}
              className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm"
            >
              {BILLING_CYCLES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving} size="sm" className="flex-1">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </Button>
              <Button onClick={cancelEdit} variant="outline" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grouped Lists */}
      {SERVICE_TYPES.map(type => {
        const typeProviders = groupedProviders[type.value]
        if (typeProviders.length === 0 && !isAdding) return null
        
        const Icon = SERVICE_ICONS[type.value]
        const colors = SERVICE_TYPE_COLORS[type.value]
        
        return (
          <div key={type.value} className="glass-card rounded-xl border border-zinc-200 dark:border-white/10 overflow-hidden">
            <div className={cn("px-5 py-3 border-b border-zinc-200 dark:border-white/10 flex items-center gap-3", colors.bg)}>
              <Icon className={cn("w-5 h-5", colors.text)} />
              <h3 className={cn("font-medium", colors.text)}>{type.label}</h3>
              <span className="text-xs text-zinc-500">({typeProviders.length})</span>
            </div>
            
            {typeProviders.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">
                Henüz {type.label.toLowerCase()} sağlayıcısı eklenmedi
              </div>
            ) : (
              <div className="divide-y divide-zinc-200 dark:divide-white/5">
                {typeProviders.map(provider => (
                  <div key={provider.id} className="px-5 py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                    {editingId === provider.id ? (
                      <div className="flex-1 grid grid-cols-5 gap-4">
                        <Input
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <select
                          value={formData.service_type || 'hosting'}
                          onChange={(e) => setFormData({ ...formData, service_type: e.target.value as ServiceType })}
                          className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm"
                        >
                          {SERVICE_TYPES.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.base_price_usd || ''}
                            onChange={(e) => setFormData({ ...formData, base_price_usd: parseFloat(e.target.value) })}
                            className="pl-9"
                          />
                        </div>
                        <select
                          value={formData.billing_cycle || 'yearly'}
                          onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value as BillingCycle })}
                          className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm"
                        >
                          {BILLING_CYCLES.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <Button onClick={handleSave} disabled={isSaving} size="sm" className="flex-1">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          </Button>
                          <Button onClick={cancelEdit} variant="outline" size="sm">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-zinc-900 dark:text-white">{provider.name}</span>
                          {!provider.is_active && (
                            <span className="text-xs bg-zinc-100 dark:bg-white/5 text-zinc-500 px-2 py-0.5 rounded-full">Pasif</span>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <span className="font-mono text-lg font-semibold text-zinc-900 dark:text-white">
                              ${provider.base_price_usd}
                            </span>
                            <span className="text-xs text-zinc-500 ml-1">
                              /{provider.billing_cycle === 'monthly' ? 'ay' : 'yıl'}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button onClick={() => startEdit(provider)} variant="ghost" size="sm">
                              <Pencil className="w-4 h-4 text-zinc-400" />
                            </Button>
                            <Button onClick={() => handleDelete(provider.id)} variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-rose-400" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
