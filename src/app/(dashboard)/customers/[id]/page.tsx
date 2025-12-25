// @ts-nocheck
'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, Building2, Globe, Users, FileText, Clock, 
  Sparkles, Pencil, Check, X, Loader2
} from 'lucide-react'
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

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('brief')

  // Fetch customer
  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true)
      setError(null)
      
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        if (!data) throw new Error('Müşteri bulunamadı')
        
        setCustomer(data)
      } catch (err) {
        console.error('Error fetching customer:', err)
        setError('Müşteri yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [id, supabase])

  // Save customer
  async function handleSaveCustomer(formData: CustomerFormData) {
    if (!customer) return
    setSaving(true)

    try {
      const customerData = {
        name: formData.name,
        brand_name: formData.brand_name || null,
        website_url: formData.website_url || null,
        sector: formData.sector || null,
        sub_sector: formData.sub_sector || null,
        business_type: formData.business_type || null,
        brand_voice: formData.brand_voice || null,
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
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', customer.id)
        .select()
        .single()

      if (error) throw error
      
      setCustomer(data)
    } catch (err) {
      console.error('Error saving customer:', err)
      throw err
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Error state
  if (error || !customer) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/musteriler')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri
        </Button>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">{error || 'Müşteri bulunamadı'}</p>
            <Button className="mt-4" onClick={() => router.push('/musteriler')}>
              Müşteri Listesine Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completion = calculateBriefCompletion(customer)

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push('/musteriler')} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Müşteriler
      </Button>

      {/* Customer Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-muted-foreground" />
                <CardTitle className="text-2xl">{customer.name}</CardTitle>
              </div>
              <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
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
              </CardDescription>
            </div>
            
            {/* Brief Completion */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm text-muted-foreground">Brief Tamamlanma</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      completion < 30 ? 'bg-red-500' :
                      completion < 60 ? 'bg-yellow-500' :
                      completion < 90 ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <span className="text-lg font-semibold">%{completion}</span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
            {customer.website_url && (
              <a 
                href={customer.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Globe className="h-4 w-4" />
                {(() => {
                  try {
                    return new URL(customer.website_url).hostname
                  } catch {
                    return customer.website_url
                  }
                })()}
              </a>
            )}
            {customer.target_audience && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {customer.target_audience.length > 50 
                  ? customer.target_audience.substring(0, 50) + '...' 
                  : customer.target_audience
                }
              </span>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="brief" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Brief
          </TabsTrigger>
          <TabsTrigger value="gecmis" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Geçmiş
          </TabsTrigger>
          <TabsTrigger value="icerikler" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            İçerikler
          </TabsTrigger>
        </TabsList>

        {/* Brief Tab */}
        <TabsContent value="brief" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Müşteri Brief</CardTitle>
              <CardDescription>
                Müşteri hakkında detaylı bilgileri düzenleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerBriefForm
                customer={customer}
                onSave={handleSaveCustomer}
                onCancel={() => router.push('/musteriler')}
                isLoading={saving}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geçmiş Tab */}
        <TabsContent value="gecmis" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">İşlem Geçmişi</CardTitle>
              <CardDescription>
                Bu müşteri için yapılan tüm işlemler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Henüz işlem yok</p>
                <p className="text-sm text-muted-foreground mt-1">
                  İçerik ürettiğinizde burada görünecek
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* İçerikler Tab */}
        <TabsContent value="icerikler" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Üretilen İçerikler</CardTitle>
              <CardDescription>
                Bu müşteri için üretilen tüm içerikler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Henüz içerik yok</p>
                <p className="text-sm text-muted-foreground mt-1">
                  İçerik üretmek için İçerik Üret sayfasını kullanın
                </p>
                <Button className="mt-4" onClick={() => router.push(`/icerik-uret?customer=${customer.id}`)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  İçerik Üret
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
