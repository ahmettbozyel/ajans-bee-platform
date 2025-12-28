'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Server, Globe, ShieldCheck, Mail, Calendar, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { ServiceType } from '@/lib/service-provider-types'
import { SERVICE_TYPES, SERVICE_TYPE_COLORS } from '@/lib/service-provider-types'
import type { TechnicalServiceWithRelations } from '@/lib/technical-service-types-new'
import { SERVICE_STATUSES } from '@/lib/technical-service-types-new'

interface Brand {
  id: string
  name: string
  brand_name: string | null
}

interface Provider {
  id: string
  name: string
  service_type: ServiceType
  base_price_usd: number
  billing_cycle: 'monthly' | 'yearly'
}

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  editingService?: TechnicalServiceWithRelations | null
}

const SERVICE_ICONS: Record<ServiceType, React.ElementType> = {
  hosting: Server,
  domain: Globe,
  ssl: ShieldCheck,
  email: Mail
}

export function ServiceModal({ isOpen, onClose, onSave, editingService }: ServiceModalProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    brand_id: '',
    provider_id: '',
    service_type: 'hosting' as ServiceType,
    identifier: '',
    renewal_date: '',
    discount_percent: 0,
    quantity: 1,
    status: 'active',
    auto_renew: false,
    notes: ''
  })

  // Load brands and providers
  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  // Set form data when editing
  useEffect(() => {
    if (editingService) {
      setFormData({
        brand_id: editingService.brand_id || '',
        provider_id: editingService.provider_id || '',
        service_type: editingService.service_type,
        identifier: editingService.identifier,
        renewal_date: editingService.renewal_date || '',
        discount_percent: editingService.discount_percent || 0,
        quantity: editingService.quantity || 1,
        status: editingService.status,
        auto_renew: editingService.auto_renew || false,
        notes: editingService.notes || ''
      })
    } else {
      // Reset form for new service
      setFormData({
        brand_id: '',
        provider_id: '',
        service_type: 'hosting',
        identifier: '',
        renewal_date: '',
        discount_percent: 0,
        quantity: 1,
        status: 'active',
        auto_renew: false,
        notes: ''
      })
    }
  }, [editingService, isOpen])

  async function loadData() {
    setIsLoading(true)
    try {
      // Load brands (customers)
      const brandsRes = await fetch('/api/customers?minimal=true')
      if (brandsRes.ok) {
        const brandsData = await brandsRes.json()
        setBrands(brandsData)
      }

      // Load providers
      const providersRes = await fetch('/api/service-providers')
      if (providersRes.ok) {
        const providersData = await providersRes.json()
        setProviders(providersData)
      }
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter providers by selected service type
  const filteredProviders = providers.filter(p => p.service_type === formData.service_type)

  // Get selected provider for price display
  const selectedProvider = providers.find(p => p.id === formData.provider_id)

  // Calculate price
  const calculatedPrice = selectedProvider 
    ? selectedProvider.base_price_usd * formData.quantity * (1 - formData.discount_percent / 100)
    : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    try {
      const url = editingService 
        ? `/api/technical-services/${editingService.id}`
        : '/api/technical-services'
      
      const method = editingService ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          renewal_date: formData.renewal_date || null,
          discount_percent: Number(formData.discount_percent),
          quantity: Number(formData.quantity)
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Kaydetme başarısız')
      }

      onSave()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  const Icon = SERVICE_ICONS[formData.service_type]
  const colors = SERVICE_TYPE_COLORS[formData.service_type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 glass-card rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={cn("px-6 py-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between", colors.bg)}>
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", colors.bg, "border", colors.border)}>
              <Icon className={cn("w-5 h-5", colors.text)} />
            </div>
            <h2 className={cn("text-lg font-semibold", colors.text)}>
              {editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-sm">
                  {error}
                </div>
              )}

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Hizmet Tipi
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SERVICE_TYPES.map(({ value, label }) => {
                    const TypeIcon = SERVICE_ICONS[value]
                    const typeColors = SERVICE_TYPE_COLORS[value]
                    const isSelected = formData.service_type === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, service_type: value, provider_id: '' })
                        }}
                        className={cn(
                          "p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                          isSelected 
                            ? `${typeColors.bg} ${typeColors.border} ${typeColors.text}` 
                            : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                        )}
                      >
                        <TypeIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Brand & Provider Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Marka
                  </label>
                  <select
                    value={formData.brand_id}
                    onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Marka seçin...</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        {brand.brand_name || brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Sağlayıcı
                  </label>
                  <select
                    value={formData.provider_id}
                    onChange={(e) => setFormData({ ...formData, provider_id: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Sağlayıcı seçin...</option>
                    {filteredProviders.map(provider => (
                      <option key={provider.id} value={provider.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        {provider.name} (${provider.base_price_usd}/{provider.billing_cycle === 'monthly' ? 'ay' : 'yıl'})
                      </option>
                    ))}
                  </select>
                  {filteredProviders.length === 0 && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      Bu tip için sağlayıcı yok. Önce Ayarlar'dan ekleyin.
                    </p>
                  )}
                </div>
              </div>

              {/* Identifier & Renewal Date Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Identifier */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Tanımlayıcı
                    <span className="text-xs text-zinc-400 ml-1">
                      ({formData.service_type === 'domain' ? 'domain adı' : 
                        formData.service_type === 'hosting' ? 'site/hesap adı' :
                        formData.service_type === 'ssl' ? 'domain' : 'e-posta hesabı'})
                    </span>
                  </label>
                  <Input
                    type="text"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    placeholder={
                      formData.service_type === 'domain' ? 'ornek.com' : 
                      formData.service_type === 'hosting' ? 'ornek.com' :
                      formData.service_type === 'ssl' ? 'ornek.com' : 'info@ornek.com'
                    }
                    required
                  />
                </div>

                {/* Renewal Date */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Yenileme Tarihi
                  </label>
                  <Input
                    type="date"
                    value={formData.renewal_date}
                    onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
                  />
                </div>
              </div>

              {/* Quantity, Discount, Auto Renew Row */}
              <div className="grid grid-cols-3 gap-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Miktar
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    İndirim (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percent}
                    onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Durum
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {SERVICE_STATUSES.map(status => (
                      <option key={status.value} value={status.value} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Auto Renew */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="auto_renew"
                  checked={formData.auto_renew}
                  onChange={(e) => setFormData({ ...formData, auto_renew: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="auto_renew" className="text-sm text-zinc-700 dark:text-zinc-300">
                  Otomatik yenileme aktif
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Notlar
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Opsiyonel notlar..."
                />
              </div>

              {/* Price Preview */}
              {selectedProvider && (
                <div className={cn("p-4 rounded-xl", colors.bg, "border", colors.border)}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Hesaplanan Fiyat:</span>
                    <div className="text-right">
                      <span className={cn("text-2xl font-bold", colors.text)}>
                        ${calculatedPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-zinc-500 ml-1">
                        /{selectedProvider.billing_cycle === 'monthly' ? 'ay' : 'yıl'}
                      </span>
                    </div>
                  </div>
                  {formData.discount_percent > 0 && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Orijinal: ${(selectedProvider.base_price_usd * formData.quantity).toFixed(2)} - %{formData.discount_percent} indirim
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-white/10 flex items-center justify-end gap-3 bg-zinc-50 dark:bg-white/[0.02]">
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSaving || !formData.brand_id || !formData.provider_id || !formData.identifier}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              editingService ? 'Güncelle' : 'Kaydet'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
