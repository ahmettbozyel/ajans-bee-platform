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
  Sparkles, X, Loader2, LayoutDashboard, Calendar, 
  BarChart3, FolderOpen, Settings
} from 'lucide-react'
import { CustomerBriefForm } from '@/components/customers/customer-brief-form'
import { CustomerViewMode } from '@/components/customers/customer-view-mode'
import type { Customer, CustomerFormData } from '@/lib/customer-types'
import { SECTORS, BRAND_VOICES, calculateBriefCompletion, CUSTOMER_TYPES, CUSTOMER_STATUSES } from '@/lib/customer-types'

// Helper functions
function getSectorLabel(value: string): string {
  return SECTORS.find(s => s.value === value)?.label || value
}

function getBrandVoiceLabel(value: string): string {
  return BRAND_VOICES.find(v => v.value === value)?.label || value
}

function getCustomerTypeLabel(value: string): string {
  return CUSTOMER_TYPES.find(t => t.value === value)?.label || value
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
  
  // Karar #14: Yeni tab yapisi - Marka Workspace
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Brief modu (view/edit)
  const [briefMode, setBriefMode] = useState<'view' | 'edit'>('view')

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
        if (!data) throw new Error('Marka bulunamadı')
        
        setCustomer(data)
      } catch (err) {
        console.error('Error fetching customer:', err)
        setError('Marka yüklenirken bir hata oluştu')
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
      setBriefMode('view')
    } catch (err) {
      console.error('Error saving customer:', err)
      throw err
    } finally {
      setSaving(false)
    }
  }

  // Delete customer handler
  async function handleDeleteCustomer() {
    if (!customer) return
    
    const confirmed = window.confirm('Bu markayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')
    if (!confirmed) return

    try {
      const { data: files } = await supabase.storage
        .from('brand-assets')
        .list(customer.id)

      if (files && files.length > 0) {
        const filesToDelete = files.map(f => `${customer.id}/${f.name}`)
        await supabase.storage
          .from('brand-assets')
          .remove(filesToDelete)
      }

      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customer.id)

      if (error) throw error

      router.push('/musteriler')
    } catch (err) {
      console.error('Error deleting customer:', err)
      alert('Marka silinirken bir hata oluştu')
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
        <Card className="glass-card border-glow-rose">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">{error || 'Marka bulunamadı'}</p>
            <Button className="mt-4" onClick={() => router.push('/musteriler')}>
              Marka Listesine Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completion = calculateBriefCompletion(customer)

  return (
    <div className="space-y-0">
      {/* Workspace Header */}
      <div className="glass-card rounded-2xl p-4 mb-4 border border-border/40">
        <div className="flex items-center justify-between">
          {/* Left: Back + Brand Info */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push('/musteriler')} 
              className="h-9 w-9 rounded-lg hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            
            <div>
              <h1 className="text-lg font-semibold">{customer.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                {customer.customer_type && (
                  <Badge 
                    variant="outline" 
                    className={customer.customer_type === 'retainer' 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }
                  >
                    {getCustomerTypeLabel(customer.customer_type)}
                  </Badge>
                )}
                {customer.sector && (
                  <Badge variant="secondary" className="text-xs">
                    {getSectorLabel(customer.sector)}
                  </Badge>
                )}
                {customer.status === 'inactive' && (
                  <Badge variant="outline" className="bg-zinc-500/10 text-zinc-500">
                    Pasif
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right: Progress + Actions */}
          <div className="flex items-center gap-4">
            {/* Brief Completion */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <span className="text-xs text-muted-foreground">Brief</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      completion < 30 ? 'bg-rose-500' :
                      completion < 60 ? 'bg-amber-500' :
                      completion < 90 ? 'bg-indigo-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <span className="text-sm font-mono font-medium">%{completion}</span>
              </div>
            </div>
            
            {/* Settings */}
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Workspace Tabs - Karar #14 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="glass-card rounded-t-2xl border border-border/40 border-b-0">
          <TabsList className="w-full justify-start gap-0 bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-500/5 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="brief" 
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-500/5 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 transition-all"
            >
              <FileText className="h-4 w-4" />
              Brief
            </TabsTrigger>
            <TabsTrigger 
              value="icerik-uret" 
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-fuchsia-500 data-[state=active]:bg-fuchsia-500/5 data-[state=active]:text-fuchsia-600 dark:data-[state=active]:text-fuchsia-400 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              İçerik Üret
            </TabsTrigger>
            <TabsTrigger 
              value="takvim" 
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-500/5 transition-all"
              disabled
            >
              <Calendar className="h-4 w-4" />
              Takvim
              <Badge className="text-[10px] px-1.5 py-0 bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400">Yakında</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="performans" 
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-500/5 transition-all"
              disabled
            >
              <BarChart3 className="h-4 w-4" />
              Performans
              <Badge className="text-[10px] px-1.5 py-0 bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400">Yakında</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="dosyalar" 
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-500/5 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 transition-all"
            >
              <FolderOpen className="h-4 w-4" />
              Dosyalar
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <div className="glass-card rounded-b-2xl rounded-t-none border border-border/40 border-t-0 p-6">
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-card rounded-xl p-4 border-glow-indigo card-hover cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <FileText className="h-4 w-4 text-indigo-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{completion}%</p>
                  <p className="text-xs text-muted-foreground">Brief Tamamlanma</p>
                </div>
                <div className="glass-card rounded-xl p-4 border-glow-fuchsia card-hover cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-fuchsia-500/10">
                      <Sparkles className="h-4 w-4 text-fuchsia-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Toplam İçerik</p>
                </div>
                <div className="glass-card rounded-xl p-4 border-glow-emerald card-hover cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <Calendar className="h-4 w-4 text-emerald-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-xs text-muted-foreground">Bu Ay Planlanan</p>
                </div>
                <div className="glass-card rounded-xl p-4 border-glow-amber card-hover cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <FolderOpen className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">-</p>
                  <p className="text-xs text-muted-foreground">Dosya Sayısı</p>
                </div>
              </div>
              
              {/* AI Insight Box */}
              <div className="glass-card rounded-xl p-5 border-glow-violet bg-gradient-to-br from-indigo-500/5 to-violet-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-sm font-semibold">AI İçgörüsü</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {completion < 50 
                    ? "Brief tamamlanma oranı düşük. Daha iyi içerik üretimi için brief'i tamamlayın."
                    : completion < 80
                    ? "Brief büyük ölçüde hazır. Birkaç alanı daha doldurarak kaliteyi artırabilirsiniz."
                    : "Brief hazır! İçerik üretmeye başlayabilirsiniz."
                  }
                </p>
                <Button 
                  className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
                  onClick={() => setActiveTab('icerik-uret')}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  İçerik Üret
                </Button>
              </div>
            </div>
            
            {/* Quick Info */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {customer.website_url && (
                <a 
                  href={customer.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-card rounded-xl p-4 flex items-center gap-3 hover:border-indigo-500/30 transition-all"
                >
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <Globe className="h-4 w-4 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Website</p>
                    <p className="text-sm font-medium truncate">
                      {(() => {
                        try { return new URL(customer.website_url).hostname } 
                        catch { return customer.website_url }
                      })()}
                    </p>
                  </div>
                </a>
              )}
              {customer.target_audience && (
                <div className="glass-card rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Users className="h-4 w-4 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hedef Kitle</p>
                    <p className="text-sm font-medium truncate">
                      {customer.target_audience.length > 40 
                        ? customer.target_audience.substring(0, 40) + '...' 
                        : customer.target_audience
                      }
                    </p>
                  </div>
                </div>
              )}
              {customer.brand_voice && (
                <div className="glass-card rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <FileText className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Marka Sesi</p>
                    <p className="text-sm font-medium">{getBrandVoiceLabel(customer.brand_voice)}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Brief Tab */}
          <TabsContent value="brief" className="mt-0">
            {briefMode === 'view' ? (
              <CustomerViewMode
                customer={customer}
                onEdit={() => setBriefMode('edit')}
                onDelete={handleDeleteCustomer}
              />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Brief Düzenleme</h2>
                    <p className="text-sm text-muted-foreground">Marka hakkında detaylı bilgileri düzenleyin</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setBriefMode('view')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    İptal
                  </Button>
                </div>
                <CustomerBriefForm
                  customer={customer}
                  onSave={handleSaveCustomer}
                  onCancel={() => setBriefMode('view')}
                  isLoading={saving}
                />
              </div>
            )}
          </TabsContent>

          {/* İçerik Üret Tab */}
          <TabsContent value="icerik-uret" className="mt-0">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/20 mb-4">
                <Sparkles className="h-8 w-8 text-fuchsia-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">İçerik Üretimi</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Sosyal medya postları, blog yazıları, reklam metinleri ve daha fazlasını AI ile üretin.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-2xl mx-auto mb-8">
                {[
                  { icon: '📱', label: 'Sosyal Medya', color: 'fuchsia' },
                  { icon: '📝', label: 'Blog', color: 'indigo' },
                  { icon: '📢', label: 'Reklam', color: 'amber' },
                  { icon: '📧', label: 'E-posta', color: 'cyan' },
                  { icon: '🔍', label: 'SEO', color: 'emerald' },
                ].map((item) => (
                  <button 
                    key={item.label}
                    className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:border-fuchsia-500/30 transition-all group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground">
                Sprint 2'de aktif olacak
              </p>
            </div>
          </TabsContent>

          {/* Dosyalar Tab */}
          <TabsContent value="dosyalar" className="mt-0">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-4">
                <FolderOpen className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Marka Dosyaları</h3>
              <p className="text-muted-foreground mb-6">
                Logolar, görseller, brand guide ve diğer dosyalar
              </p>
              <Button variant="outline">
                Dosya Yükle
              </Button>
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  )
}
