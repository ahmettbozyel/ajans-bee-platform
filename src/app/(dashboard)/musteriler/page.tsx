// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus, Search, Pencil, Trash2, Building2, Clock, Globe, Eye, EyeOff, Sparkles } from 'lucide-react'
import { getRecentCustomers, addToRecentCustomers, formatRelativeTime, type RecentCustomer } from '@/lib/local-storage'
import { CustomerBriefForm } from '@/components/customers/customer-brief-form'
import type { Customer, CustomerFormData } from '@/lib/customer-types'
import { SECTORS, BRAND_VOICES, calculateBriefCompletion, getCustomerTypeLabel } from '@/lib/customer-types'

function getSectorLabel(value: string): string {
  return SECTORS.find(s => s.value === value)?.label || value
}

function getBrandVoiceLabel(value: string): string {
  return BRAND_VOICES.find(v => v.value === value)?.label || value
}

export default function MusterilerPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [showInactive, setShowInactive] = useState(false)

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

  function handleNewCustomer() {
    setSheetOpen(true)
  }

  async function handleSaveCustomer(formData: CustomerFormData) {
    setFormLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Oturum bulunamadı')

      const customerData = {
        name: formData.name,
        brand_name: formData.brand_name || null,
        website_url: formData.website_url || null,
        sector: formData.sector || null,
        sub_sector: formData.sub_sector || null,
        business_type: formData.business_type || null,
        brand_voice: formData.brand_voice || null,
        customer_type: formData.customer_type || 'project',
        status: formData.status || 'active',
        email: formData.email || null,
        phone: formData.phone || null,
        location: formData.location || null,
        social_media: formData.social_media || {},
        brand_description: formData.brand_description || null,
        mission: formData.mission || null,
        vision: formData.vision || null,
        slogan: formData.slogan || null,
        usp: formData.usp || null,
        target_audience: formData.target_audience || null,
        target_age_range: formData.target_age_range || null,
        target_geography: formData.target_geography || null,
        product_categories: formData.product_categories || [],
        top_products: formData.top_products || [],
        price_segment: formData.price_segment || null,
        competitors: formData.competitors || [],
        do_not_do: formData.do_not_do || [],
        must_emphasize: formData.must_emphasize || [],
        special_events: formData.special_events || [],
        brand_values: formData.brand_values || [],
        buying_motivations: formData.buying_motivations || [],
        content_pillars: formData.content_pillars || [],
        platform_rules: formData.platform_rules || {},
        example_captions: formData.example_captions || {},
        word_mapping: formData.word_mapping || [],
        brand_colors: formData.brand_colors || {},
        brand_fonts: formData.brand_fonts || {},
        brand_assets: formData.brand_assets || {},
        integrations: formData.integrations || {},
        user_id: user.id
      }

      const { data, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single()

      if (error) throw error

      setSheetOpen(false)
      
      if (data) {
        router.push(`/customers/${data.id}`)
      } else {
        fetchCustomers()
      }
    } catch (error) {
      console.error('Error saving customer:', error)
      throw error
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            Markalar
          </h1>
          <p className="text-muted-foreground mt-1">
            Marka brief&apos;lerini yönetin ve içerik üretin
          </p>
        </div>
        
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              onClick={handleNewCustomer}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-lg shadow-indigo-500/25"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Marka
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto glass">
            <SheetHeader>
              <SheetTitle>Yeni Marka Ekle</SheetTitle>
              <SheetDescription>
                Marka brief bilgilerini girin. AI içerik üretirken bu bilgileri kullanacak.
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6">
              <CustomerBriefForm
                customer={null}
                onSave={handleSaveCustomer}
                onCancel={() => setSheetOpen(false)}
                isLoading={formLoading}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 border-glow-indigo">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <Building2 className="h-4 w-4 text-indigo-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{customers.length}</p>
          <p className="text-xs text-muted-foreground">Toplam Marka</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-glow-emerald">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Eye className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{activeCount}</p>
          <p className="text-xs text-muted-foreground">Aktif</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-glow-amber">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{inactiveCount}</p>
          <p className="text-xs text-muted-foreground">Pasif</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-glow-fuchsia">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-fuchsia-500/10">
              <Sparkles className="h-4 w-4 text-fuchsia-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground">İçerik Üretildi</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card rounded-xl p-4 border border-border/40">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Marka ara..."
              className="pl-9 bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {inactiveCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-border/40">
              <Switch
                id="show-inactive"
                checked={showInactive}
                onCheckedChange={setShowInactive}
              />
              <Label htmlFor="show-inactive" className="text-sm cursor-pointer flex items-center gap-1.5">
                {showInactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                Pasif ({inactiveCount})
              </Label>
            </div>
          )}
        </div>
      </div>

      {/* Recent Customers */}
      {recentCustomers.length > 0 && !searchQuery && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Son Kullanılanlar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentCustomers.map((recent) => {
              const customer = customers.find(c => c.id === recent.id)
              if (!customer) return null
              if (customer.status === 'inactive' && !showInactive) return null
              
              return (
                <div 
                  key={recent.id} 
                  className={`glass-card rounded-xl p-4 cursor-pointer card-hover border border-border/40 ${
                    customer.status === 'inactive' ? 'opacity-60' : ''
                  }`}
                  onClick={() => handleCustomerClick(customer)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(recent.lastUsed)}
                        </p>
                      </div>
                    </div>
                    {customer.status === 'inactive' && (
                      <Badge variant="secondary" className="text-xs">Pasif</Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All Customers */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          {showInactive ? 'Tüm Markalar' : 'Aktif Markalar'} ({filteredCustomers.length})
        </h2>
        
        {loading ? (
          <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
            <div className="animate-pulse">Yükleniyor...</div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center border-glow-indigo">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 mb-4">
              <Building2 className="h-8 w-8 text-indigo-500" />
            </div>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Aramanızla eşleşen marka bulunamadı.' : 'Henüz marka eklenmemiş.'}
            </p>
            {!searchQuery && (
              <Button 
                onClick={handleNewCustomer}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Markayı Ekle
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => {
              const completion = calculateBriefCompletion(customer)
              const isInactive = customer.status === 'inactive'
              
              return (
                <div 
                  key={customer.id} 
                  className={`glass-card rounded-xl p-5 cursor-pointer card-hover border border-border/40 group ${
                    isInactive ? 'opacity-60 border-dashed' : ''
                  }`}
                  onClick={() => handleCustomerClick(customer)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{customer.name}</h3>
                        {customer.website_url && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {(() => {
                              try { return new URL(customer.website_url).hostname } 
                              catch { return customer.website_url }
                            })()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
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
                  <div className="flex flex-wrap gap-1.5 mb-4">
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
                    {customer.sector && (
                      <Badge variant="secondary" className="text-xs">
                        {getSectorLabel(customer.sector)}
                      </Badge>
                    )}
                  </div>

                  {/* Completion Bar */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border/40">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          completion < 30 ? 'bg-rose-500' :
                          completion < 60 ? 'bg-amber-500' :
                          completion < 90 ? 'bg-indigo-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      %{completion}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

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
