// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Pencil, Trash2, Building2, ArrowRight, Clock } from 'lucide-react'
import { SECTORS, BRAND_VOICES, getSectorLabel, getBrandVoiceLabel } from '@/lib/constants'
import { getRecentCustomers, addToRecentCustomers, formatRelativeTime, type RecentCustomer } from '@/lib/local-storage'
import type { Customer } from '@/lib/types'

export default function MusterilerPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand_name: '',
    sector: '',
    tone_of_voice: 'samimi',
    target_audience: '',
    notes: ''
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

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
    setFormData({
      name: '',
      brand_name: '',
      sector: '',
      tone_of_voice: 'samimi',
      target_audience: '',
      notes: ''
    })
    setFormError(null)
    setSheetOpen(true)
  }

  // Open sheet for editing
  function handleEditCustomer(customer: Customer) {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      brand_name: customer.brand_name || '',
      sector: customer.sector || '',
      tone_of_voice: customer.tone_of_voice || 'samimi',
      target_audience: customer.target_audience || '',
      notes: customer.notes || ''
    })
    setFormError(null)
    setSheetOpen(true)
  }

  // Save customer (create or update)
  async function handleSaveCustomer() {
    if (!formData.name.trim()) {
      setFormError('Müşteri adı zorunludur')
      return
    }
    if (!formData.sector) {
      setFormError('Sektör seçimi zorunludur')
      return
    }

    setFormLoading(true)
    setFormError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Oturum bulunamadı')

      if (editingCustomer) {
        // Update
        const { error } = await supabase
          .from('customers')
          .update({
            name: formData.name.trim(),
            brand_name: formData.brand_name.trim() || null,
            sector: formData.sector,
            tone_of_voice: formData.tone_of_voice,
            target_audience: formData.target_audience.trim() || null,
            notes: formData.notes.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCustomer.id)

        if (error) throw error
      } else {
        // Create
        const { error } = await supabase
          .from('customers')
          .insert({
            name: formData.name.trim(),
            brand_name: formData.brand_name.trim() || null,
            sector: formData.sector,
            tone_of_voice: formData.tone_of_voice,
            target_audience: formData.target_audience.trim() || null,
            notes: formData.notes.trim() || null,
            user_id: user.id
          })

        if (error) throw error
      }

      setSheetOpen(false)
      fetchCustomers()
    } catch (error) {
      console.error('Error saving customer:', error)
      setFormError('Kaydetme sırasında bir hata oluştu')
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
    // Navigate to content creation
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
        
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={handleNewCustomer}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Müşteri
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {editingCustomer ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
              </SheetTitle>
              <SheetDescription>
                Müşteri bilgilerini girin. AI içerik üretirken bu bilgileri kullanacak.
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-4 mt-6">
              {formError && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {formError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Müşteri Adı *</Label>
                <Input
                  id="name"
                  placeholder="Örn: Karaca Zeytinyağı"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_name">Marka Adı</Label>
                <Input
                  id="brand_name"
                  placeholder="Örn: Karaca"
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sektör *</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(value) => setFormData({ ...formData, sector: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sektör seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector.value} value={sector.value}>
                        {sector.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_audience">Hedef Kitle</Label>
                <Textarea
                  id="target_audience"
                  placeholder="Örn: 25-45 yaş arası ev hanımları, sağlıklı beslenmeye önem veren"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <Label>Marka Sesi *</Label>
                <RadioGroup
                  value={formData.tone_of_voice}
                  onValueChange={(value) => setFormData({ ...formData, tone_of_voice: value })}
                  className="grid grid-cols-2 gap-2"
                >
                  {BRAND_VOICES.map((voice) => (
                    <div key={voice.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={voice.value} id={voice.value} />
                      <Label htmlFor={voice.value} className="font-normal cursor-pointer">
                        {voice.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notlar</Label>
                <Textarea
                  id="notes"
                  placeholder="Ek bilgiler, özel talepler..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <Button 
                className="w-full mt-4" 
                onClick={handleSaveCustomer}
                disabled={formLoading}
              >
                {formLoading ? 'Kaydediliyor...' : (editingCustomer ? 'Güncelle' : 'Müşteri Ekle')}
              </Button>
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
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">{customer.name}</CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {customer.sector && (
                          <Badge variant="secondary">
                            {getSectorLabel(customer.sector)}
                          </Badge>
                        )}
                        {customer.tone_of_voice && (
                          <Badge variant="outline">
                            {getBrandVoiceLabel(customer.tone_of_voice)}
                          </Badge>
                        )}
                      </div>
                      {customer.target_audience && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                          &quot;{customer.target_audience}&quot;
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
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
            ))}
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
