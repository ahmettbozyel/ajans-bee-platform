'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Plus, 
  Server, 
  Globe, 
  Shield, 
  Mail, 
  Calendar,
  Building2,
  MoreVertical,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ServiceType,
  PaymentStatus,
  SERVICE_TYPES,
  PAYMENT_STATUSES,
  PLATFORMS,
  getDaysUntilRenewal,
  getRenewalBadgeColor,
  getPaymentStatusColor,
  getServiceTypeLabel,
  getPaymentStatusLabel
} from '@/lib/technical-service-types'

// Basit customer tipi (sadece liste için)
interface CustomerBasic {
  id: string
  name: string
  customer_type: string
}

// Supabase'den gelen servis tipi
interface ServiceFromDB {
  id: string
  created_at: string
  updated_at: string
  customer_id: string
  user_id: string
  service_type: ServiceType
  name: string
  platform: string | null
  renewal_date: string | null
  payment_status: PaymentStatus
  price: number | null
  notes: string | null
  customer: {
    id: string
    name: string
    customer_type: string
  } | null
}

// Form state tipi
interface FormState {
  customer_id: string
  service_type: ServiceType
  name: string
  platform: string
  renewal_date: string
  payment_status: PaymentStatus
  price: string
  notes: string
}

const initialFormState: FormState = {
  customer_id: '',
  service_type: 'hosting',
  name: '',
  platform: '',
  renewal_date: '',
  payment_status: 'pending',
  price: '',
  notes: ''
}

// Hizmet tipi ikonu
const getServiceIcon = (type: ServiceType) => {
  switch (type) {
    case 'hosting': return Server
    case 'domain': return Globe
    case 'ssl': return Shield
    case 'email': return Mail
    default: return Server
  }
}

// Badge variant helper
const getBadgeVariant = (color: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (color) {
    case 'red': return 'destructive'
    case 'green': return 'default'
    case 'yellow': return 'secondary'
    default: return 'outline'
  }
}

export default function TeknikHizmetlerPage() {
  const [services, setServices] = useState<ServiceFromDB[]>([])
  const [customers, setCustomers] = useState<CustomerBasic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceFromDB | null>(null)
  const [formData, setFormData] = useState<FormState>(initialFormState)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const supabase = createClient()

  // Verileri yükle
  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)

      // Müşterileri yükle
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('id, name, customer_type')
        .order('name')

      if (customersError) throw customersError
      setCustomers(customersData || [])

      // Teknik hizmetleri yükle (müşteri bilgisiyle)
      const { data: servicesData, error: servicesError } = await supabase
        .from('technical_services')
        .select(`
          *,
          customer:customers(id, name, customer_type)
        `)
        .order('renewal_date', { ascending: true, nullsFirst: false })

      if (servicesError) throw servicesError
      setServices((servicesData || []) as ServiceFromDB[])

    } catch (err) {
      console.error('Veri yükleme hatası:', err)
      setError('Veriler yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  // Form kaydet
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.customer_id || !formData.name || !formData.service_type) {
      setError('Lütfen zorunlu alanları doldurun.')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Oturum bulunamadı')

      if (editingService) {
        // Güncelle - user_id hariç
        const { error: updateError } = await supabase
          .from('technical_services')
          .update({
            customer_id: formData.customer_id,
            service_type: formData.service_type,
            name: formData.name,
            platform: formData.platform || null,
            renewal_date: formData.renewal_date || null,
            payment_status: formData.payment_status,
            price: formData.price ? parseFloat(formData.price) : null,
            notes: formData.notes || null
          })
          .eq('id', editingService.id)

        if (updateError) throw updateError
      } else {
        // Yeni ekle - user_id dahil
        const { error: insertError } = await supabase
          .from('technical_services')
          .insert({
            customer_id: formData.customer_id,
            user_id: user.id,
            service_type: formData.service_type,
            name: formData.name,
            platform: formData.platform || null,
            renewal_date: formData.renewal_date || null,
            payment_status: formData.payment_status,
            price: formData.price ? parseFloat(formData.price) : null,
            notes: formData.notes || null
          })

        if (insertError) throw insertError
      }

      setIsDialogOpen(false)
      setEditingService(null)
      setFormData(initialFormState)
      loadData()

    } catch (err) {
      console.error('Kaydetme hatası:', err)
      setError('Kaydedilirken bir hata oluştu.')
    } finally {
      setSaving(false)
    }
  }

  // Silme
  async function handleDelete(id: string) {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return

    try {
      setDeleting(id)
      
      const { error: deleteError } = await supabase
        .from('technical_services')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      loadData()

    } catch (err) {
      console.error('Silme hatası:', err)
      setError('Silinirken bir hata oluştu.')
    } finally {
      setDeleting(null)
    }
  }

  // Düzenleme modunu aç
  function openEditDialog(service: ServiceFromDB) {
    setEditingService(service)
    setFormData({
      customer_id: service.customer_id,
      service_type: service.service_type,
      name: service.name,
      platform: service.platform || '',
      renewal_date: service.renewal_date || '',
      payment_status: service.payment_status,
      price: service.price ? String(service.price) : '',
      notes: service.notes || ''
    })
    setIsDialogOpen(true)
  }

  // Yeni ekleme modunu aç
  function openNewDialog() {
    setEditingService(null)
    setFormData(initialFormState)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teknik Hizmetler</h1>
          <p className="text-muted-foreground">Hosting, domain, SSL ve e-posta hizmetlerini yönetin.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Hizmet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
                </DialogTitle>
                <DialogDescription>
                  Teknik hizmet bilgilerini girin.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Marka Seçimi */}
                <div className="grid gap-2">
                  <Label htmlFor="customer_id">Marka *</Label>
                  <Select
                    value={formData.customer_id}
                    onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Marka seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Hizmet Tipi */}
                <div className="grid gap-2">
                  <Label htmlFor="service_type">Hizmet Tipi *</Label>
                  <Select
                    value={formData.service_type}
                    onValueChange={(value) => setFormData({ ...formData, service_type: value as ServiceType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Hizmet Adı */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Hizmet Adı *</Label>
                  <Input
                    id="name"
                    placeholder="örn: example.com hosting"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Platform */}
                <div className="grid gap-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => setFormData({ ...formData, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Platform seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Yenileme Tarihi */}
                <div className="grid gap-2">
                  <Label htmlFor="renewal_date">Yenileme Tarihi</Label>
                  <Input
                    id="renewal_date"
                    type="date"
                    value={formData.renewal_date}
                    onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
                  />
                </div>

                {/* Ödeme Durumu */}
                <div className="grid gap-2">
                  <Label htmlFor="payment_status">Ödeme Durumu</Label>
                  <Select
                    value={formData.payment_status}
                    onValueChange={(value) => setFormData({ ...formData, payment_status: value as PaymentStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fiyat */}
                <div className="grid gap-2">
                  <Label htmlFor="price">Fiyat (₺)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                {/* Notlar */}
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notlar</Label>
                  <Textarea
                    id="notes"
                    placeholder="Ek bilgiler..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm mb-4">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingService ? 'Güncelle' : 'Ekle'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hata mesajı */}
      {error && !isDialogOpen && (
        <div className="flex items-center gap-2 text-destructive text-sm p-4 bg-destructive/10 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Hizmet listesi */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Server className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Henüz teknik hizmet yok</h3>
            <p className="text-muted-foreground text-center mb-4">
              Hosting, domain, SSL veya e-posta hizmetlerini ekleyerek başlayın.
            </p>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              İlk Hizmeti Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => {
            const Icon = getServiceIcon(service.service_type)
            const daysUntil = getDaysUntilRenewal(service.renewal_date)
            const renewalColor = getRenewalBadgeColor(daysUntil)
            const paymentColor = getPaymentStatusColor(service.payment_status)

            return (
              <Card key={service.id}>
                <CardContent className="flex items-center gap-4 py-4">
                  {/* İkon */}
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  {/* Bilgiler */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{service.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {getServiceTypeLabel(service.service_type)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {service.customer?.name}
                      </span>
                      {service.platform && (
                        <span>• {PLATFORMS.find(p => p.value === service.platform)?.label || service.platform}</span>
                      )}
                      {service.price && (
                        <span>• ₺{Number(service.price).toLocaleString('tr-TR')}</span>
                      )}
                    </div>
                  </div>

                  {/* Yenileme tarihi */}
                  {service.renewal_date && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Badge variant={getBadgeVariant(renewalColor)}>
                        {daysUntil !== null && daysUntil < 0 
                          ? `${Math.abs(daysUntil)} gün geçti`
                          : daysUntil === 0 
                            ? 'Bugün'
                            : `${daysUntil} gün`
                        }
                      </Badge>
                    </div>
                  )}

                  {/* Ödeme durumu */}
                  <Badge variant={getBadgeVariant(paymentColor)} className="flex-shrink-0">
                    {getPaymentStatusLabel(service.payment_status)}
                  </Badge>

                  {/* Aksiyonlar */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(service)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(service.id)}
                        disabled={deleting === service.id}
                      >
                        {deleting === service.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
