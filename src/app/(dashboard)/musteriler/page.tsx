// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus, Search, Pencil, Trash2, Building2, Clock, Globe, Users, Eye, EyeOff } from 'lucide-react'
import { getRecentCustomers, addToRecentCustomers, formatRelativeTime, type RecentCustomer } from '@/lib/local-storage'
import { CustomerBriefForm } from '@/components/customers/customer-brief-form'
import type { Customer, CustomerFormData, CustomerType, CustomerStatus } from '@/lib/customer-types'
import { SECTORS, BRAND_VOICES, CUSTOMER_TYPES, calculateBriefCompletion, getCustomerTypeLabel } from '@/lib/customer-types'

// Helper functions
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

  // Fetch customers
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

  // Filter customers by search and status
  const filteredCustomers = customers.filter(customer => {
    // Search filter
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.sector?.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Status filter - show inactive only if toggle is on
    const matchesStatus = showInactive || customer.status !== 'inactive'
    
    return matchesSearch && matchesStatus
  })

  // Count inactive customers
  const inactiveCount = customers.filter(c => c.status === 'inactive').length

  // Navigate to customer detail
  function handleCustomerClick(customer: Customer) {
    addToRecentCustomers({
      id: customer.id,
      name: customer.name,
      sector: customer.sector || ''
    })
    setRecentCustomers(getRecentCustomers())
    router.push(`/customers/${customer.id}`)
  }

  // Open sheet for new customer
  function handleNewCustomer() {
    setSheetOpen(true)
  }

  // Save new customer
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
      
      // Yeni müşteriyi oluşturduktan sonra detay sayfasına git
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

  // Delete customer
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
          <h1 className="text-2xl font-bold">Markalar</h1>
          <p className="text-muted-foreground mt-1">
            Marka brief&apos;lerini yönetin
          </p>
        </div>
        
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={handleNewCustomer}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Marka
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
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

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Marka ara..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Show Inactive Toggle */}
        {inactiveCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
            <Switch
              id="show-inactive"
              checked={showInactive}
              onCheckedChange={setShowInactive}
            />
            <Label htmlFor="show-inactive" className="text-sm cursor-pointer flex items-center gap-1.5">
              {showInactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Pasif markaları göster ({inactiveCount})
            </Label>
          </div>
        )}
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
              // Don't show inactive in recent unless toggle is on
              if (customer.status === 'inactive' && !showInactive) return null
              
              return (
                <Card 
                  key={recent.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    customer.status === 'inactive' ? 'opacity-60' : ''
                  }`}
                  onClick={() => handleCustomerClick(customer)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">
                          {customer.name}
                        </CardTitle>
                        {customer.status === 'inactive' && (
                          <Badge variant="secondary" className="text-xs">Pasif</Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-xs">
                      {getSectorLabel(customer.sector || '')} • {formatRelativeTime(recent.lastUsed)}
                    </CardDescription>
                  </CardHeader>
                </Card>
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
          <div className="text-center py-8 text-muted-foreground">
            Yükleniyor...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'Aramanızla eşleşen marka bulunamadı.' : 'Henüz marka eklenmemiş.'}
              </p>
              {!searchQuery && (
                <Button className="mt-4" onClick={handleNewCustomer}>
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Markayı Ekle
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => {
              const completion = calculateBriefCompletion(customer)
              const isInactive = customer.status === 'inactive'
              
              return (
                <Card 
                  key={customer.id} 
                  className={`cursor-pointer hover:shadow-md transition-all hover:border-primary/50 ${
                    isInactive ? 'opacity-60 border-dashed' : ''
                  }`}
                  onClick={() => handleCustomerClick(customer)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-base">{customer.name}</CardTitle>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
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
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCustomerToDelete(customer)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {/* Status Badge */}
                      {isInactive && (
                        <Badge variant="secondary" className="text-xs">
                          Pasif
                        </Badge>
                      )}
                      {/* Customer Type Badge */}
                      {customer.customer_type && (
                        <Badge variant={customer.customer_type === 'retainer' ? 'default' : 'outline'} className="text-xs">
                          {getCustomerTypeLabel(customer.customer_type)}
                        </Badge>
                      )}
                      {customer.sector && (
                        <Badge variant="secondary" className="text-xs">
                          {getSectorLabel(customer.sector)}
                        </Badge>
                      )}
                      {customer.brand_voice && (
                        <Badge variant="outline" className="text-xs">
                          {getBrandVoiceLabel(customer.brand_voice)}
                        </Badge>
                      )}
                    </div>

                    {/* Info */}
                    {customer.website_url && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        {(() => {
                          try {
                            return new URL(customer.website_url).hostname
                          } catch {
                            return customer.website_url
                          }
                        })()}
                      </div>
                    )}

                    {/* Completion Bar */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            completion < 30 ? 'bg-red-500' :
                            completion < 60 ? 'bg-yellow-500' :
                            completion < 90 ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        %{completion}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Markayı Sil</DialogTitle>
            <DialogDescription>
              &quot;{customerToDelete?.name}&quot; markasını silmek istediğinize emin misiniz? 
              Bu işlem geri alınamaz ve bu markaya ait tüm içerikler de silinecektir.
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
