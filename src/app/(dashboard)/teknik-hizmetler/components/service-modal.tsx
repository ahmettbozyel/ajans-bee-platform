'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Server, Globe, ShieldCheck, Mail, Calendar, Building2, Check, ChevronsUpDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import type { ServiceType } from '@/lib/service-provider-types'
import { SERVICE_TYPES, SERVICE_TYPE_COLORS } from '@/lib/service-provider-types'
import type { TechnicalServiceWithRelations } from '@/lib/technical-service-types-new'
import { SERVICE_STATUSES } from '@/lib/technical-service-types-new'

interface Brand {
  id: string
  name: string
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
  
  // Popover states
  const [brandPopoverOpen, setBrandPopoverOpen] = useState(false)
  const [providerPopoverOpen, setProviderPopoverOpen] = useState(false)
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false)

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
      const [brandsRes, providersRes] = await Promise.all([
        fetch('/api/customers?minimal=true'),
        fetch('/api/service-providers')
      ])
      
      if (brandsRes.ok) {
        const brandsData = await brandsRes.json()
        setBrands(brandsData)
      }
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

  // Get selected items for display
  const selectedBrand = brands.find(b => b.id === formData.brand_id)
  const selectedProvider = providers.find(p => p.id === formData.provider_id)
  const selectedStatus = SERVICE_STATUSES.find(s => s.value === formData.status)

  // Calculate price
  const calculatedPrice = selectedProvider 
    ? selectedProvider.base_price_usd * formData.quantity * (1 - formData.discount_percent / 100)
    : 0

  async function handleSubmit() {
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

  const colors = SERVICE_TYPE_COLORS[formData.service_type]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-lg border border-zinc-700 rounded-2xl shadow-2xl"
        style={{ backgroundColor: '#18181b' }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <div className={cn("p-2 rounded-lg", colors.bg)}>
              {(() => {
                const Icon = SERVICE_ICONS[formData.service_type]
                return <Icon className={cn("w-5 h-5", colors.text)} />
              })()}
            </div>
            {editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Teknik hizmet bilgilerini gir.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="space-y-5 py-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm">
                {error}
              </div>
            )}

            {/* Service Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">Hizmet Tipi</Label>
              <div className="grid grid-cols-4 gap-2">
                {SERVICE_TYPES.map(({ value, label }) => {
                  const TypeIcon = SERVICE_ICONS[value]
                  const typeColors = SERVICE_TYPE_COLORS[value]
                  const isSelected = formData.service_type === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, service_type: value, provider_id: '' })}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5",
                        isSelected 
                          ? `border-current ${typeColors.bg} ${typeColors.text}` 
                          : "border-zinc-700 hover:border-zinc-600 text-zinc-400"
                      )}
                    >
                      <TypeIcon className="w-5 h-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Customer - Combobox */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">
                <Building2 className="w-4 h-4 inline mr-1" />
                Müşteri <span className="text-rose-500">*</span>
              </Label>
              <Popover open={brandPopoverOpen} onOpenChange={setBrandPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white"
                  >
                    {selectedBrand ? selectedBrand.name : "Müşteri seç..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0 border-zinc-700 shadow-2xl rounded-xl overflow-hidden"
                  align="start"
                  style={{ backgroundColor: '#18181b' }}
                >
                  <Command style={{ backgroundColor: '#18181b' }}>
                    <CommandInput placeholder="Müşteri ara..." className="h-11 border-b border-zinc-700 text-white placeholder:text-zinc-500" />
                    <CommandList className="max-h-64 overflow-auto" style={{ backgroundColor: '#18181b' }}>
                      <CommandEmpty className="py-6 text-center text-sm text-zinc-500">Müşteri bulunamadı.</CommandEmpty>
                      <CommandGroup style={{ backgroundColor: '#18181b' }}>
                        {brands.map((brand) => (
                          <CommandItem
                            key={brand.id}
                            value={brand.name}
                            onSelect={() => {
                              setFormData({ ...formData, brand_id: brand.id })
                              setBrandPopoverOpen(false)
                            }}
                            className="px-3 py-2.5 cursor-pointer text-zinc-300 hover:!bg-zinc-800 aria-selected:!bg-zinc-800"
                          >
                            <Check className={cn("mr-2 h-4 w-4 text-indigo-400", formData.brand_id === brand.id ? "opacity-100" : "opacity-0")} />
                            <span className={cn(formData.brand_id === brand.id && "text-indigo-400 font-medium")}>
                              {brand.name}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Provider - Combobox */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">
                Sağlayıcı <span className="text-rose-500">*</span>
              </Label>
              <Popover open={providerPopoverOpen} onOpenChange={setProviderPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white"
                    disabled={filteredProviders.length === 0}
                  >
                    {selectedProvider 
                      ? `${selectedProvider.name} ($${selectedProvider.base_price_usd}/${selectedProvider.billing_cycle === 'monthly' ? 'ay' : 'yıl'})`
                      : filteredProviders.length === 0 
                        ? "Bu tip için sağlayıcı yok"
                        : "Sağlayıcı seç..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[var(--radix-popover-trigger-width)] p-0 border-zinc-700 shadow-2xl rounded-xl overflow-hidden"
                  align="start"
                  style={{ backgroundColor: '#18181b' }}
                >
                  <Command style={{ backgroundColor: '#18181b' }}>
                    <CommandInput placeholder="Sağlayıcı ara..." className="h-11 border-b border-zinc-700 text-white placeholder:text-zinc-500" />
                    <CommandList className="max-h-64 overflow-auto" style={{ backgroundColor: '#18181b' }}>
                      <CommandEmpty className="py-6 text-center text-sm text-zinc-500">Sağlayıcı bulunamadı.</CommandEmpty>
                      <CommandGroup style={{ backgroundColor: '#18181b' }}>
                        {filteredProviders.map((provider) => (
                          <CommandItem
                            key={provider.id}
                            value={provider.name}
                            onSelect={() => {
                              setFormData({ ...formData, provider_id: provider.id })
                              setProviderPopoverOpen(false)
                            }}
                            className="px-3 py-2.5 cursor-pointer text-zinc-300 hover:!bg-zinc-800 aria-selected:!bg-zinc-800"
                          >
                            <Check className={cn("mr-2 h-4 w-4 text-indigo-400", formData.provider_id === provider.id ? "opacity-100" : "opacity-0")} />
                            <span className={cn(formData.provider_id === provider.id && "text-indigo-400 font-medium")}>
                              {provider.name}
                            </span>
                            <span className="ml-auto text-xs text-zinc-500 font-mono">
                              ${provider.base_price_usd}/{provider.billing_cycle === 'monthly' ? 'ay' : 'yıl'}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Identifier & Renewal Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-300">
                  Tanımlayıcı <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  placeholder={formData.service_type === 'email' ? 'info@ornek.com' : 'ornek.com'}
                  className="input-glow bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-300">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Yenileme Tarihi
                </Label>
                <Input
                  type="date"
                  value={formData.renewal_date}
                  onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
                  className="input-glow bg-zinc-800 border-zinc-700 text-white [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Quantity, Discount, Status */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-300">Miktar</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="input-glow bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-300">İndirim (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) || 0 })}
                  className="input-glow bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-300">Durum</Label>
                <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white text-sm"
                    >
                      {selectedStatus?.label || 'Seç...'}
                      <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-[var(--radix-popover-trigger-width)] p-0 border-zinc-700 shadow-2xl rounded-xl overflow-hidden"
                    align="start"
                    style={{ backgroundColor: '#18181b' }}
                  >
                    <Command style={{ backgroundColor: '#18181b' }}>
                      <CommandList style={{ backgroundColor: '#18181b' }}>
                        <CommandGroup style={{ backgroundColor: '#18181b' }}>
                          {SERVICE_STATUSES.map((status) => (
                            <CommandItem
                              key={status.value}
                              value={status.value}
                              onSelect={() => {
                                setFormData({ ...formData, status: status.value })
                                setStatusPopoverOpen(false)
                              }}
                              className="px-3 py-2 cursor-pointer text-zinc-300 hover:!bg-zinc-800 aria-selected:!bg-zinc-800"
                            >
                              <Check className={cn("mr-2 h-4 w-4 text-indigo-400", formData.status === status.value ? "opacity-100" : "opacity-0")} />
                              {status.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Auto Renew Toggle */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
              <input
                type="checkbox"
                id="auto_renew"
                checked={formData.auto_renew}
                onChange={(e) => setFormData({ ...formData, auto_renew: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
              />
              <label htmlFor="auto_renew" className="text-sm text-zinc-300 cursor-pointer">
                Otomatik yenileme aktif
              </label>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">Notlar</Label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Opsiyonel notlar..."
              />
            </div>

            {/* Price Preview */}
            {selectedProvider && (
              <div className={cn("p-4 rounded-xl", colors.bg, "border", colors.border)}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Hesaplanan Fiyat:</span>
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
                  <p className="text-xs text-zinc-500 mt-1">
                    Orijinal: ${(selectedProvider.base_price_usd * formData.quantity).toFixed(2)} - %{formData.discount_percent} indirim
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-xl border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            İptal
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSaving || !formData.brand_id || !formData.provider_id || !formData.identifier}
            className="btn-press rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {editingService ? 'Güncelle' : 'Kaydet'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
