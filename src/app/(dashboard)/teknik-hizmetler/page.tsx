// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Server, 
  Globe, 
  Shield, 
  Mail, 
  MoreVertical, 
  Pencil, 
  Trash2,
  Calendar,
  Building2,
  AlertTriangle
} from 'lucide-react'
import {
  type ServiceType,
  type PaymentStatus,
  type TechnicalService,
  type TechnicalServiceWithCustomer,
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
  const [services, setServices] = useState<TechnicalServiceWithCustomer[]>([])
  const [customers, setCustomers] = useState<CustomerBasic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<TechnicalService | null>(null)
  const [formData, setFormData] = useState<FormState>(initialFormState)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const supabase = createClient()

  // Verileri yükle
  useEffect(() => {
    loadData()
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
      const { data: servicesData, error: servicesError } = await (supabase
        .from('technical_services')
        .select(`
          *,
          customer:customers(id, name, customer_type)
        `)
        .order('renewal_date', { ascending: true, nullsFirst: false }) as any)

      if (servicesError) throw servicesError
      setServices(servicesData || [])

    } catch (err) {
      console.error('Veri yükleme hatası:', err)
      setError('Veriler yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  // Yeni hizmet ekle veya güncelle
  async function handleSave() {
    if (!formData.customer_id || !formData.name) {
      setError('Marka ve hizmet adı zorunludur.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Oturum bulunamadı')

      const payload = {
        customer_id: formData.customer_id,
        service_type: formData.service_type,
        name: formData.name,
        platform: formData.platform || null,
        renewal_date: formData.renewal_date || null,
        payment_status: formData.payment_status,
        price: formData.price ? parseFloat(formData.price) : null,
        notes: formData.notes || null,
        user_id: user.id
      }

      if (editingService) {
        // Güncelle
        const { error } = await (supabase
          .from('technical_services')
          .update(payload)
          .eq('id', editingService.id) as any)
        
        if (error) throw error
      } else {
        // Yeni ekle
        const { error } = await (supabase
          .from('technical_services')
          .insert(payload) as any)
        
        if (error) throw error
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

  // Hizmet sil
  async function handleDelete(id: string) {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return

    setDeleting(id)
    try {
      const { error } = await (supabase
        .from('technical_services')
        .delete()
        .eq('id', id) as any)
      
      if (error) throw error
      loadData()
    } catch (err) {
      console.error('Silme hatası:', err)
      setError('Silinirken bir hata oluştu.')
    } finally {
      setDeleting(null)
    }
  }

  // Düzenleme modunu aç
  function handleEdit(service: TechnicalService) {
    setEditingService(service)
    setFormData({
      customer_id: service.customer_id,
      service_type: service.service_type,
      name: service.name,
      platform: service.platform || '',
      renewal_date: service.renewal_date || '',
      payment_status: service.payment_status,
      price: service.price?.toString() || '',
      notes: service.notes || ''
    })
    setIsDialogOpen(true)
  }

  // Yaklaşan yenilemeler
  const upcomingRenewals = services.filter(s => {
    const days = getDaysUntilRenewal(s.renewal_date)
    return days !== null && days <= 30 && days >= 0
  })

  // Gecikmiş yenilemeler
  const overdueRenewals = services.filter(s => {
    const days = getDaysUntilRenewal(s.renewal_date)
    return days !== null && days < 0
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Teknik Hizmetler
          </h1>
          <p className="text-muted-foreground mt-1">
            Hosting, domain, SSL ve e-posta hizmetlerini yönetin
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingService(null)
            setFormData(initialFormState)
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Hizmet
            </Button>
          </DialogTrigger>
          <DialogContent className="glass sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}</DialogTitle>
              <DialogDescription>
                Teknik hizmet bilgilerini girin.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Marka Seçimi */}
              <div className="grid gap-2">
                <Label>Marka *</Label>
                <Select
                  value={formData.customer_id}
                  onValueChange={(value) => setFormData({...formData, customer_id: value})}
                >
                  <SelectTrigger className="bg-background/50">
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
                <Label>Hizmet Tipi *</Label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value) => setFormData({...formData, service_type: value as ServiceType})}
                >
                  <SelectTrigger className="bg-background/50">
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
                <Label>Hizmet Adı *</Label>
                <Input
                  placeholder="örn: beeswebsite.com hosting"
                  className="bg-background/50"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Platform */}
              <div className="grid gap-2">
                <Label>Platform</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => setFormData({...formData, platform: value})}
                >
                  <SelectTrigger className="bg-background/50">
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
                <Label>Yenileme Tarihi</Label>
                <Input
                  type="date"
                  className="bg-background/50"
                  value={formData.renewal_date}
                  onChange={(e) => setFormData({...formData, renewal_date: e.target.value})}
                />
              </div>

              {/* Ödeme Durumu */}
              <div className="grid gap-2">
                <Label>Ödeme Durumu</Label>
                <Select
                  value={formData.payment_status}
                  onValueChange={(value) => setFormData({...formData, payment_status: value as PaymentStatus})}
                >
                  <SelectTrigger className="bg-background/50">
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
                <Label>Fiyat (₺)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="bg-background/50"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>

              {/* Notlar */}
              <div className="grid gap-2">
                <Label>Notlar</Label>
                <Textarea
                  placeholder="Ek bilgiler..."
                  className="bg-background/50"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                {saving ? 'Kaydediliyor...' : (editingService ? 'Güncelle' : 'Ekle')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 border-glow-cyan">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Server className="h-4 w-4 text-cyan-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{services.length}</p>
          <p className="text-xs text-muted-foreground">Toplam Hizmet</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-glow-emerald">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Building2 className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{new Set(services.map(s => s.customer_id)).size}</p>
          <p className="text-xs text-muted-foreground">Marka</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-glow-amber">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Calendar className="h-4 w-4 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{upcomingRenewals.length}</p>
          <p className="text-xs text-muted-foreground">30 Gün İçinde</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-glow-rose">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-rose-500/10">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{overdueRenewals.length}</p>
          <p className="text-xs text-muted-foreground">Gecikmiş</p>
        </div>
      </div>

      {/* Services List */}
      <div className="glass-card rounded-2xl border border-border/40 overflow-hidden">
        <div className="p-5 border-b border-border/40">
          <h2 className="font-semibold">Tüm Hizmetler ({services.length})</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="animate-pulse">Yükleniyor...</div>
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-4">
              <Server className="h-8 w-8 text-cyan-500" />
            </div>
            <p className="text-muted-foreground mb-4">Henüz teknik hizmet eklenmemiş.</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              İlk Hizmeti Ekle
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {services.map((service) => {
              const ServiceIcon = getServiceIcon(service.service_type)
              const daysUntil = getDaysUntilRenewal(service.renewal_date)
              const renewalColor = getRenewalBadgeColor(daysUntil)
              const paymentColor = getPaymentStatusColor(service.payment_status)
              
              return (
                <div 
                  key={service.id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <ServiceIcon className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{service.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {getServiceTypeLabel(service.service_type)}
                      </Badge>
                      {service.platform && (
                        <Badge variant="secondary" className="text-xs">
                          {PLATFORMS.find(p => p.value === service.platform)?.label || service.platform}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {service.customer?.name || 'Bilinmiyor'}
                      </p>
                      {service.price && (
                        <p className="text-xs text-muted-foreground">
                          ₺{service.price.toLocaleString('tr-TR')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Yenileme Tarihi Badge */}
                    {daysUntil !== null && (
                      <Badge variant={getBadgeVariant(renewalColor)} className="text-xs">
                        {daysUntil < 0 
                          ? `${Math.abs(daysUntil)} gün geçti`
                          : daysUntil === 0 
                          ? 'Bugün'
                          : `${daysUntil} gün`
                        }
                      </Badge>
                    )}
                    
                    {/* Ödeme Durumu Badge */}
                    <Badge variant={getBadgeVariant(paymentColor)} className="text-xs">
                      {getPaymentStatusLabel(service.payment_status)}
                    </Badge>
                    
                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(service)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(service.id)}
                          className="text-destructive"
                          disabled={deleting === service.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deleting === service.id ? 'Siliniyor...' : 'Sil'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
