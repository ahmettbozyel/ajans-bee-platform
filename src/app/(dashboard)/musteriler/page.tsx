'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Plus, Search, Pencil, Trash2, Building2, Eye, EyeOff, Sparkles, PauseCircle, Loader2, ChevronsUpDown, Check } from 'lucide-react'
import { getRecentCustomers, addToRecentCustomers, type RecentCustomer } from '@/lib/local-storage'
import type { Customer } from '@/lib/customer-types'
import { calculateBriefCompletion, getCustomerTypeLabel } from '@/lib/customer-types'
import { cn } from '@/lib/utils'

interface Sector {
  id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
}

// Progress bar rengi (dark mode only)
function getProgressColor(value: number): { bar: string; text: string } {
  if (value >= 100) return { bar: 'progress-emerald', text: 'text-emerald-400' }
  if (value >= 71) return { bar: 'progress-cyan', text: 'text-cyan-400' }
  if (value >= 31) return { bar: 'progress-amber', text: 'text-amber-400' }
  return { bar: 'progress-rose', text: 'text-rose-400' }
}

// Marka kartı için gradient renk paletleri (dark mode only)
const cardGradients = [
  { bg: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/20', icon: 'text-violet-400' },
  { bg: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/20', icon: 'text-amber-400' },
  { bg: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-500/20', icon: 'text-rose-400' },
  { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/20', icon: 'text-cyan-400' },
  { bg: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/20', icon: 'text-emerald-400' },
  { bg: 'from-indigo-500/20 to-violet-500/20', border: 'border-indigo-500/20', icon: 'text-indigo-400' },
]

// Yeni marka formu için initial state
const initialNewBrandForm = {
  name: '',
  website_url: '',
  customer_type: 'project' as 'retainer' | 'project',
  sector: ''
}

export default function MusterilerPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [newBrandDialogOpen, setNewBrandDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [showInactive, setShowInactive] = useState(false)
  const [newBrandForm, setNewBrandForm] = useState(initialNewBrandForm)
  const [sectorPopoverOpen, setSectorPopoverOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  // Sektör label'ı getir
  function getSectorLabel(value: string): string {
    return sectors.find(s => s.slug === value)?.name || value
  }

  // Sektörleri çek
  async function fetchSectors() {
    const { data } = await supabase
      .from('sectors')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (data) {
      setSectors(data as Sector[])
    }
  }

  useEffect(() => {
    fetchCustomers()
    fetchSectors()
    setRecentCustomers(getRecentCustomers())
  }, [])

  async function fetchCustomers() {
    setLoading(true)
    setError(null)
    try {
      // API üzerinden çek (RLS bypass)
      const res = await fetch('/api/customers?all=true')
      if (!res.ok) throw new Error('Failed to fetch customers')
      const data = await res.json()
      setCustomers(data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
      setError('Müşteriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.sector?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = showInactive || customer.status !== 'inactive'
    
    return matchesSearch && matchesStatus
  })

  const inactiveCount = customers.filter(c => c.status === 'inactive').length
  const activeCount = customers.filter(c => c.status !== 'inactive').length

  function handleCustomerClick(customer: Customer) {
    addToRecentCustomers({
      id: customer.id,
      name: customer.name,
      sector: customer.sector || ''
    })
    setRecentCustomers(getRecentCustomers())
    router.push(`/customers/${customer.id}`)
  }

  function handleNewBrandDialogOpen() {
    setNewBrandForm(initialNewBrandForm)
    setNewBrandDialogOpen(true)
  }

  async function handleCreateBrand() {
    if (!newBrandForm.name.trim()) return
    
    setFormLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Oturum bulunamadı')

      const customerData = {
        name: newBrandForm.name.trim(),
        website_url: newBrandForm.website_url.trim() || null,
        customer_type: newBrandForm.customer_type,
        sector: newBrandForm.sector || null,
        status: 'active',
        user_id: user.id,
        // Diğer alanlar boş/default
        brand_name: null,
        sub_sector: null,
        business_type: null,
        brand_voice: null,
        email: null,
        phone: null,
        location: null,
        social_media: {},
        brand_description: null,
        mission: null,
        vision: null,
        slogan: null,
        usp: null,
        target_audience: null,
        target_age_range: null,
        target_geography: null,
        product_categories: [],
        top_products: [],
        price_segment: null,
        competitors: [],
        do_not_do: [],
        must_emphasize: [],
        special_events: [],
        brand_values: [],
        buying_motivations: [],
        content_pillars: [],
        platform_rules: {},
        example_captions: {},
        word_mapping: [],
        brand_colors: {},
        brand_fonts: {},
        brand_assets: {},
        integrations: {}
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('customers')
        .insert(customerData)
        .select()
        .single()

      if (error) throw error

      setNewBrandDialogOpen(false)
      
      if (data) {
        router.push(`/customers/${data.id}`)
      } else {
        fetchCustomers()
      }
    } catch (error) {
      console.error('Error creating brand:', error)
      alert('Marka oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDeleteCustomer() {
    if (!customerToDelete) return

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerToDelete.id)

      if (error) throw error

      setDeleteDialogOpen(false)
      setCustomerToDelete(null)
      fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Marka silinirken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  async function handleToggleStatus(customer: Customer, e: React.MouseEvent) {
    e.stopPropagation()
    const newStatus = customer.status === 'inactive' ? 'active' : 'inactive'

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('customers')
        .update({ status: newStatus })
        .eq('id', customer.id)

      if (error) throw error

      // Update local state
      setCustomers(prev => prev.map(c =>
        c.id === customer.id ? { ...c, status: newStatus } : c
      ))
    } catch (error) {
      console.error('Error toggling status:', error)
      alert('Marka durumu güncellenirken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Bar - Yeni Marka butonu */}
      <div className="flex items-center justify-end">
        <Button 
          onClick={handleNewBrandDialogOpen}
          className="btn-press px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Marka
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {/* Toplam Marka */}
        <div className="glass-card rounded-2xl p-5 glow-indigo card-hover">
          <div className="icon-box icon-box-indigo mb-4">
            <Building2 className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{customers.length}</p>
          <p className="text-sm text-zinc-500">Toplam Marka</p>
        </div>

        {/* Aktif */}
        <div className="glass-card rounded-2xl p-5 glow-emerald card-hover">
          <div className="icon-box icon-box-emerald mb-4">
            <Eye className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{activeCount}</p>
          <p className="text-sm text-zinc-500">Aktif</p>
        </div>

        {/* Pasif */}
        <div className="glass-card rounded-2xl p-5 glow-amber card-hover">
          <div className="icon-box icon-box-amber mb-4">
            <PauseCircle className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{inactiveCount}</p>
          <p className="text-sm text-zinc-500">Pasif</p>
        </div>

        {/* İçerik Üretildi */}
        <div className="glass-card rounded-2xl p-5 glow-violet card-hover">
          <div className="icon-box icon-box-violet mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">0</p>
          <p className="text-sm text-zinc-500">İçerik Üretildi</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card rounded-2xl p-4 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Marka ara..."
              className="pl-10 input-dark"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {inactiveCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Switch
                id="show-inactive"
                checked={showInactive}
                onCheckedChange={setShowInactive}
              />
              <Label htmlFor="show-inactive" className="text-sm cursor-pointer flex items-center gap-1.5 text-zinc-400">
                {showInactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                Pasif ({inactiveCount})
              </Label>
            </div>
          )}
        </div>
      </div>

      {/* Section Title */}
      <h2 className="text-base font-semibold text-white">
        {showInactive ? 'Tüm Markalar' : 'Aktif Markalar'} ({filteredCustomers.length})
      </h2>

      {/* Error Message */}
      {error && (
        <div className="glass-card rounded-2xl p-4 border border-rose-500/30 bg-rose-500/10">
          <p className="text-rose-400 text-sm">{error}</p>
        </div>
      )}

      {/* Customer Cards */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center text-zinc-500">
          <div className="animate-pulse">Yükleniyor...</div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10">
          <div className="icon-box icon-box-default w-16 h-16 flex items-center justify-center mx-auto mb-4 animate-float">
            <Building2 className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">
            {searchQuery ? 'Marka bulunamadı' : 'Henüz marka eklenmedi'}
          </h3>
          <p className="text-sm text-zinc-500 mb-6">
            {searchQuery ? 'Aramanızla eşleşen marka yok.' : 'İlk markayı ekleyerek başla! 🐝'}
          </p>
          {!searchQuery && (
            <Button 
              onClick={handleNewBrandDialogOpen}
              className="btn-press px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25"
            >
              <Plus className="w-4 h-4 mr-2" />
              İlk Markayı Ekle
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map((customer, index) => {
            const completion = calculateBriefCompletion(customer)
            const isInactive = customer.status === 'inactive'
            const colors = getProgressColor(completion)
            const gradient = cardGradients[index % cardGradients.length]
            
            return (
              <div 
                key={customer.id} 
                className={`glass-card rounded-2xl p-5 border border-white/10 card-hover cursor-pointer group ${
                  isInactive ? 'opacity-60' : ''
                }`}
                onClick={() => handleCustomerClick(customer)}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradient.bg} border ${gradient.border} flex items-center justify-center flex-shrink-0`}>
                    <Building2 className={`w-6 h-6 ${gradient.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{customer.name}</h3>
                    {customer.website_url && (
                      <p className="text-xs text-zinc-500 font-mono truncate">
                        {(() => {
                          try { return new URL(customer.website_url).hostname } 
                          catch { return customer.website_url }
                        })()}
                      </p>
                    )}
                  </div>
                  
                  {/* Actions - Hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Toggle Active/Inactive */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-lg ${
                        isInactive
                          ? 'text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10'
                          : 'text-amber-500 hover:text-amber-400 hover:bg-amber-500/10'
                      }`}
                      onClick={(e) => handleToggleStatus(customer, e)}
                      title={isInactive ? 'Aktif Yap' : 'Pasif Yap'}
                    >
                      {isInactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/customers/${customer.id}`)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCustomerToDelete(customer)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {customer.customer_type && (
                    <span className="badge badge-violet">
                      {getCustomerTypeLabel(customer.customer_type)}
                    </span>
                  )}
                  {customer.sector && (
                    <span className="badge badge-neutral">
                      {getSectorLabel(customer.sector)}
                    </span>
                  )}
                  {isInactive && (
                    <span className="badge badge-neutral">
                      Pasif
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-zinc-500">Brief</span>
                    <span className={`text-xs font-mono font-semibold ${colors.text}`}>%{completion}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`h-full rounded-full ${colors.bar} transition-all duration-500`}
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* New Brand Dialog - Solid Background */}
      <Dialog open={newBrandDialogOpen} onOpenChange={setNewBrandDialogOpen}>
        <DialogContent 
          className="sm:max-w-md border border-zinc-700 rounded-2xl shadow-2xl"
          style={{ backgroundColor: '#18181b' }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20">
                <Building2 className="w-5 h-5 text-indigo-400" />
              </div>
              Yeni Marka Ekle
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Temel bilgileri gir, detayları sonra Brief'ten doldurursun.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Marka Adı */}
            <div className="space-y-2">
              <Label htmlFor="brand-name" className="text-sm font-medium text-zinc-300">
                Marka Adı <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="brand-name"
                placeholder="Örn: AJANS BEE"
                value={newBrandForm.name}
                onChange={(e) => setNewBrandForm(prev => ({ ...prev, name: e.target.value }))}
                className="input-glow bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium text-zinc-300">
                Website
              </Label>
              <Input
                id="website"
                placeholder="https://example.com"
                value={newBrandForm.website_url}
                onChange={(e) => setNewBrandForm(prev => ({ ...prev, website_url: e.target.value }))}
                className="input-glow bg-zinc-800 border-zinc-700 text-white font-mono text-sm placeholder:text-zinc-500"
              />
            </div>

            {/* Müşteri Tipi */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">
                Müşteri Tipi
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewBrandForm(prev => ({ ...prev, customer_type: 'retainer' }))}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    newBrandForm.customer_type === 'retainer'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <span className="text-lg mb-1 block">🤝</span>
                  <span className={`text-sm font-medium ${
                    newBrandForm.customer_type === 'retainer' 
                      ? 'text-emerald-400' 
                      : 'text-zinc-300'
                  }`}>Retainer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewBrandForm(prev => ({ ...prev, customer_type: 'project' }))}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    newBrandForm.customer_type === 'project'
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <span className="text-lg mb-1 block">📋</span>
                  <span className={`text-sm font-medium ${
                    newBrandForm.customer_type === 'project' 
                      ? 'text-violet-400' 
                      : 'text-zinc-300'
                  }`}>Proje</span>
                </button>
              </div>
            </div>

            {/* Sektör - Combobox with Search */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">
                Sektör
              </Label>
              <Popover open={sectorPopoverOpen} onOpenChange={setSectorPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={sectorPopoverOpen}
                    className="w-full justify-between bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white"
                  >
                    {newBrandForm.sector
                      ? getSectorLabel(newBrandForm.sector)
                      : "Sektör seç..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[var(--radix-popover-trigger-width)] p-0 border-zinc-700 shadow-2xl rounded-xl overflow-hidden" 
                  align="start"
                  style={{ backgroundColor: '#18181b' }}
                >
                  <Command style={{ backgroundColor: '#18181b' }}>
                    <CommandInput 
                      placeholder="Sektör ara..." 
                      className="h-11 border-b border-zinc-700 text-white placeholder:text-zinc-500" 
                    />
                    <CommandList className="max-h-64 overflow-auto" style={{ backgroundColor: '#18181b' }}>
                      <CommandEmpty className="py-6 text-center text-sm text-zinc-500">
                        Sektör bulunamadı.
                      </CommandEmpty>
                      <CommandGroup style={{ backgroundColor: '#18181b' }}>
                        {sectors.map((sector) => (
                          <CommandItem
                            key={sector.id}
                            value={sector.name}
                            onSelect={() => {
                              setNewBrandForm(prev => ({
                                ...prev,
                                sector: prev.sector === sector.slug ? '' : sector.slug
                              }))
                              setSectorPopoverOpen(false)
                            }}
                            className="px-3 py-2.5 cursor-pointer text-zinc-300 hover:!bg-zinc-800 aria-selected:!bg-zinc-800 data-[selected=true]:!bg-zinc-800"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 text-indigo-400",
                                newBrandForm.sector === sector.slug ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className={cn(
                              newBrandForm.sector === sector.slug && "text-indigo-400 font-medium"
                            )}>
                              {sector.name}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setNewBrandDialogOpen(false)}
              className="rounded-xl border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              İptal
            </Button>
            <Button 
              onClick={handleCreateBrand}
              disabled={!newBrandForm.name.trim() || formLoading}
              className="btn-press rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
            >
              {formLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Oluştur
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent 
          className="border border-zinc-700 rounded-2xl shadow-2xl"
          style={{ backgroundColor: '#18181b' }}
        >
          <DialogHeader>
            <DialogTitle className="text-white">Markayı Sil</DialogTitle>
            <DialogDescription className="text-zinc-400">
              &quot;{customerToDelete?.name}&quot; markasını silmek istediğinize emin misiniz? 
              Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
