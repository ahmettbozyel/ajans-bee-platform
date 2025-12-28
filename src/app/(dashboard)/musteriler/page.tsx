// @ts-nocheck
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
import { SECTORS, calculateBriefCompletion, getCustomerTypeLabel } from '@/lib/customer-types'
import { cn } from '@/lib/utils'

function getSectorLabel(value: string): string {
  return SECTORS.find(s => s.value === value)?.label || value
}

// Progress bar rengi
function getProgressColor(value: number): { bar: string; text: string } {
  if (value >= 100) return { bar: 'from-emerald-500 to-teal-500', text: 'text-emerald-600 dark:text-emerald-400' }
  if (value >= 71) return { bar: 'from-cyan-500 to-blue-500', text: 'text-cyan-600 dark:text-cyan-400' }
  if (value >= 31) return { bar: 'from-amber-500 to-orange-500', text: 'text-amber-600 dark:text-amber-400' }
  return { bar: 'from-rose-500 to-pink-500', text: 'text-rose-600 dark:text-rose-400' }
}

// Marka kartı için gradient renk paletleri
const cardGradients = [
  { bg: 'from-violet-100 to-purple-100 dark:from-violet-500/20 dark:to-purple-500/20', border: 'border-violet-200 dark:border-violet-500/20', icon: 'text-violet-600 dark:text-violet-400' },
  { bg: 'from-amber-100 to-yellow-100 dark:from-amber-500/20 dark:to-yellow-500/20', border: 'border-amber-200 dark:border-amber-500/20', icon: 'text-amber-600 dark:text-amber-400' },
  { bg: 'from-rose-100 to-pink-100 dark:from-rose-500/20 dark:to-pink-500/20', border: 'border-rose-200 dark:border-rose-500/20', icon: 'text-rose-600 dark:text-rose-400' },
  { bg: 'from-cyan-100 to-blue-100 dark:from-cyan-500/20 dark:to-blue-500/20', border: 'border-cyan-200 dark:border-cyan-500/20', icon: 'text-cyan-600 dark:text-cyan-400' },
  { bg: 'from-emerald-100 to-teal-100 dark:from-emerald-500/20 dark:to-teal-500/20', border: 'border-emerald-200 dark:border-emerald-500/20', icon: 'text-emerald-600 dark:text-emerald-400' },
  { bg: 'from-indigo-100 to-violet-100 dark:from-indigo-500/20 dark:to-violet-500/20', border: 'border-indigo-200 dark:border-indigo-500/20', icon: 'text-indigo-600 dark:text-indigo-400' },
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

  const supabase = createClient()

  useEffect(() => {
    fetchCustomers()
    setRecentCustomers(getRecentCustomers())
  }, [])

  async function fetchCustomers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
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

      const { data, error } = await supabase
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
          <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 w-fit mb-4">
            <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{customers.length}</p>
          <p className="text-sm text-zinc-500">Toplam Marka</p>
        </div>

        {/* Aktif */}
        <div className="glass-card rounded-2xl p-5 glow-emerald card-hover">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 w-fit mb-4">
            <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{activeCount}</p>
          <p className="text-sm text-zinc-500">Aktif</p>
        </div>

        {/* Pasif */}
        <div className="glass-card rounded-2xl p-5 glow-amber card-hover">
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 w-fit mb-4">
            <PauseCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{inactiveCount}</p>
          <p className="text-sm text-zinc-500">Pasif</p>
        </div>

        {/* İçerik Üretildi */}
        <div className="glass-card rounded-2xl p-5 glow-violet card-hover">
          <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 w-fit mb-4">
            <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">0</p>
          <p className="text-sm text-zinc-500">İçerik Üretildi</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card rounded-2xl p-4 border border-zinc-200 dark:border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Marka ara..."
              className="pl-10 input-glow bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {inactiveCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
              <Switch
                id="show-inactive"
                checked={showInactive}
                onCheckedChange={setShowInactive}
              />
              <Label htmlFor="show-inactive" className="text-sm cursor-pointer flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                {showInactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                Pasif ({inactiveCount})
              </Label>
            </div>
          )}
        </div>
      </div>

      {/* Section Title */}
      <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
        {showInactive ? 'Tüm Markalar' : 'Aktif Markalar'} ({filteredCustomers.length})
      </h2>

      {/* Customer Cards */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center text-zinc-500">
          <div className="animate-pulse">Yükleniyor...</div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-zinc-200 dark:border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mx-auto mb-4 float-animation">
            <Building2 className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
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
                className={`glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 card-hover cursor-pointer group ${
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
                    <h3 className="font-semibold text-zinc-900 dark:text-white truncate">{customer.name}</h3>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10"
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
                    <span className="text-xs px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 font-medium border border-violet-200 dark:border-violet-500/20">
                      {getCustomerTypeLabel(customer.customer_type)}
                    </span>
                  )}
                  {customer.sector && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {getSectorLabel(customer.sector)}
                    </span>
                  )}
                  {isInactive && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500">
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
                  <div className="h-2 rounded-full bg-zinc-200 dark:bg-white/10">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-500`}
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* New Brand Dialog - Centered Popup */}
      <Dialog open={newBrandDialogOpen} onOpenChange={setNewBrandDialogOpen}>
        <DialogContent className="sm:max-w-md glass-card border border-zinc-200 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-500/20 dark:to-violet-500/20">
                <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              Yeni Marka Ekle
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              Temel bilgileri gir, detayları sonra Brief'ten doldurursun.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Marka Adı */}
            <div className="space-y-2">
              <Label htmlFor="brand-name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Marka Adı <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="brand-name"
                placeholder="Örn: AJANS BEE"
                value={newBrandForm.name}
                onChange={(e) => setNewBrandForm(prev => ({ ...prev, name: e.target.value }))}
                className="input-glow bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Website
              </Label>
              <Input
                id="website"
                placeholder="https://example.com"
                value={newBrandForm.website_url}
                onChange={(e) => setNewBrandForm(prev => ({ ...prev, website_url: e.target.value }))}
                className="input-glow bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white font-mono text-sm"
              />
            </div>

            {/* Müşteri Tipi */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Müşteri Tipi
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewBrandForm(prev => ({ ...prev, customer_type: 'retainer' }))}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    newBrandForm.customer_type === 'retainer'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                      : 'border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20'
                  }`}
                >
                  <span className="text-lg mb-1 block">🤝</span>
                  <span className={`text-sm font-medium ${
                    newBrandForm.customer_type === 'retainer' 
                      ? 'text-emerald-700 dark:text-emerald-400' 
                      : 'text-zinc-700 dark:text-zinc-300'
                  }`}>Retainer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewBrandForm(prev => ({ ...prev, customer_type: 'project' }))}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    newBrandForm.customer_type === 'project'
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                      : 'border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20'
                  }`}
                >
                  <span className="text-lg mb-1 block">📋</span>
                  <span className={`text-sm font-medium ${
                    newBrandForm.customer_type === 'project' 
                      ? 'text-violet-700 dark:text-violet-400' 
                      : 'text-zinc-700 dark:text-zinc-300'
                  }`}>Proje</span>
                </button>
              </div>
            </div>

            {/* Sektör - Combobox with Search */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Sektör
              </Label>
              <Popover open={sectorPopoverOpen} onOpenChange={setSectorPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={sectorPopoverOpen}
                    className="w-full justify-between input-glow bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                  >
                    {newBrandForm.sector
                      ? getSectorLabel(newBrandForm.sector)
                      : "Sektör seç..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[var(--radix-popover-trigger-width)] p-0 !bg-zinc-900 border-zinc-700 shadow-2xl rounded-xl overflow-hidden" 
                  align="start"
                  style={{ backgroundColor: '#18181b' }}
                >
                  <Command className="bg-zinc-900" style={{ backgroundColor: '#18181b' }}>
                    <CommandInput 
                      placeholder="Sektör ara..." 
                      className="h-11 border-b border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500" 
                      style={{ backgroundColor: '#18181b' }}
                    />
                    <CommandList className="max-h-64 overflow-auto bg-zinc-900" style={{ backgroundColor: '#18181b' }}>
                      <CommandEmpty className="py-6 text-center text-sm text-zinc-500">
                        Sektör bulunamadı.
                      </CommandEmpty>
                      <CommandGroup className="bg-zinc-900" style={{ backgroundColor: '#18181b' }}>
                        {SECTORS.map((sector) => (
                          <CommandItem
                            key={sector.value}
                            value={sector.label}
                            onSelect={() => {
                              setNewBrandForm(prev => ({ 
                                ...prev, 
                                sector: prev.sector === sector.value ? '' : sector.value 
                              }))
                              setSectorPopoverOpen(false)
                            }}
                            className="px-3 py-2.5 cursor-pointer text-zinc-300 hover:!bg-zinc-800 aria-selected:!bg-zinc-800 data-[selected=true]:!bg-zinc-800"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 text-indigo-400",
                                newBrandForm.sector === sector.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className={cn(
                              newBrandForm.sector === sector.value && "text-indigo-400 font-medium"
                            )}>
                              {sector.label}
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
              className="rounded-xl"
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
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Markayı Sil</DialogTitle>
            <DialogDescription>
              &quot;{customerToDelete?.name}&quot; markasını silmek istediğinize emin misiniz? 
              Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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
