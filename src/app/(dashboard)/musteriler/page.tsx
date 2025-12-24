'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Pencil, Trash2, Building2, ArrowRight, Clock, Globe, Users } from 'lucide-react'
import { getRecentCustomers, addToRecentCustomers, formatRelativeTime, type RecentCustomer } from '@/lib/local-storage'
import { CustomerBriefForm } from '@/components/customers/customer-brief-form'
import type { Customer, CustomerFormData } from '@/lib/customer-types'
import { SECTORS, BRAND_VOICES, calculateBriefCompletion } from '@/lib/customer-types'

// Helper functions
function getSectorLabel(value: string): string {
  return SECTORS.find(s => s.value === value)?.label || value
}

function getBrandVoiceLabel(value: string): string {
  return BRAND_VOICES.find(v => v.value === value)?.label || value
}

export default function MusterilerPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formLoading, setFormLoading] = useState(false)

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

  // Filter customers by search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.sector?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Open sheet for new customer
  function handleNewCustomer() {
    setEditingCustomer(null)
    setSheetOpen(true)
  }

  // Open sheet for editing
  function handleEditCustomer(customer: Customer) {
    setEditingCustomer(customer)
    setSheetOpen(true)
  }

  // Save customer (create or update)
  async function handleSaveCustomer(formData: CustomerFormData) {
    setFormLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Oturum bulunamadı')

      // Clean up empty values
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => {
          if (v === null || v === undefined || v === '') return false
          if (Array.isArray(v) && v.length === 0) return false
          if (typeof v === 'object' && Object.keys(v).length === 0) return false
          return true
        })
      )

      if (editingCustomer) {
        // Update
        const { error } = await supabase
          .from('customers')
          // @ts-ignore
          .update({
            ...cleanedData,
            updated_at: new Date().toISOString()
          } as any)
          .eq('id', editingCustomer.id)

        if (error) throw error
      } else {
        // Create
        const { error } = await supabase
          .from('customers')
          // @ts-ignore
          .insert({
            ...cleanedData,
            user_id: user.id
          } as any)

        if (error) throw error
      }

      setSheetOpen(false)
      setEditingCustomer(null)
      fetchCustomers()
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

  // Select customer (for content creation)
  function handleSelectCustomer(customer: Customer) {
    addToRecentCustomers({
      id: customer.id,
      name: customer.name,
      sector: customer.sector || ''
    })
    setRecentCustomers(getRecentCustomers())
    window.location.href = `/icerik-uret?customer=${customer.id}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Müşteriler</h1>
          <p className="text-muted-foreground mt-1">
            Müşteri brief&apos;lerini yönetin
          </p>
        </div>
        
        <Sheet open={sheetOpen} onOpenChange={(open) => {
          setSheetOpen(open)
          if (!open) setEditingCustomer(null)
        }}>
          <SheetTrigger asChild>
            <Button onClick={handleNewCustomer}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Müşteri
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {editingCustomer ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
              </SheetTitle>
              <SheetDescription>
                Müşteri brief bilgilerini girin. AI içerik üretirken bu bilgileri kullanacak.
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6">
              <CustomerBriefForm
                customer={editingCustomer}
                onSave={handleSaveCustomer}
                onCancel={() => {
                  setSheetOpen(false)
                  setEditingCustomer(null)
                }}
                isLoading={formLoading}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Müşteri ara..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
              
              return (
                <Card 
                  key={recent.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">
                          {customer.name}
                        </CardTitle>
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
          Tüm Müşteriler ({filteredCustomers.length})
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
                {searchQuery ? 'Aramanızla eşleşen müşteri bulunamadı.' : 'Henüz müşteri eklenmemiş.'}
              </p>
              {!searchQuery && (
                <Button className="mt-4" onClick={handleNewCustomer}>
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Müşteriyi Ekle
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredCustomers.map((customer) => {
              const completion = calculateBriefCompletion(customer)
              
              return (
                <Card key={customer.id} className="hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <CardTitle className="text-base truncate">{customer.name}</CardTitle>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {customer.sector && (
                            <Badge variant="secondary">
                              {getSectorLabel(customer.sector)}
                            </Badge>
                          )}
                          {customer.brand_voice && (
                            <Badge variant="outline">
                              {getBrandVoiceLabel(customer.brand_voice)}
                            </Badge>
                          )}
                          {customer.business_type && (
                            <Badge variant="outline">
                              {customer.business_type}
                            </Badge>
                          )}
                        </div>

                        {/* Info Row */}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                          {customer.website_url && (
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {new URL(customer.website_url).hostname}
                            </span>
                          )}
                          {customer.target_audience && (
                            <span className="flex items-center gap-1 truncate max-w-48">
                              <Users className="h-3 w-3" />
                              {customer.target_audience}
                            </span>
                          )}
                        </div>

                        {/* Completion Bar */}
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-32">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                completion < 30 ? 'bg-red-500' :
                                completion < 60 ? 'bg-yellow-500' :
                                completion < 90 ? 'bg-blue-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Brief %{completion}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditCustomer(customer)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCustomerToDelete(customer)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          Seç
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
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
            <DialogTitle>Müşteriyi Sil</DialogTitle>
            <DialogDescription>
              &quot;{customerToDelete?.name}&quot; müşterisini silmek istediğinize emin misiniz? 
              Bu işlem geri alınamaz ve bu müşteriye ait tüm içerikler de silinecektir.
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
