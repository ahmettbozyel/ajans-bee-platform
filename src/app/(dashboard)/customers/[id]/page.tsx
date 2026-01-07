'use client'

import { useState, useEffect, use, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, Building2, Globe, Users, FileText,
  Sparkles, Loader2, LayoutDashboard, Calendar,
  BarChart3, FolderOpen, Save, Instagram, Megaphone, Mail,
  History, CalendarHeart, ClipboardList, CheckCircle, Circle, CircleDot, Settings, Phone
} from 'lucide-react'
import { CustomerBriefForm } from '@/components/customers/customer-brief-form'
import { CustomerFilesTab } from '@/components/customers/customer-files-tab'
import { CustomerPerformanceTab } from '@/components/customers/customer-performance-tab'
import { CustomerContactTab, type ContactFormData } from '@/components/customers/customer-contact-tab'
import type { Customer, CustomerFormData } from '@/lib/customer-types'
import { BRAND_VOICES, calculateBriefCompletion, CUSTOMER_TYPES } from '@/lib/customer-types'
import { cn } from '@/lib/utils'

interface Sector {
  id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
}

function getBrandVoiceLabel(value: string): string {
  return BRAND_VOICES.find(v => v.value === value)?.label || value
}

function getCustomerTypeLabel(value: string): string {
  return CUSTOMER_TYPES.find(t => t.value === value)?.label || value
}

// Progress Ring Component
function ProgressRing({ percentage, size = 'default' }: { percentage: number; size?: 'default' | 'large' }) {
  const radius = size === 'large' ? 28 : 20
  const strokeWidth = size === 'large' ? 4 : 3
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const svgSize = size === 'large' ? 64 : 48
  const center = svgSize / 2
  
  let colorClass = 'text-rose-500'
  let textColorClass = 'text-rose-600 dark:text-rose-400'
  if (percentage >= 71) {
    colorClass = 'text-cyan-500'
    textColorClass = 'text-cyan-600 dark:text-cyan-400'
  } else if (percentage >= 31) {
    colorClass = 'text-amber-500'
    textColorClass = 'text-amber-600 dark:text-amber-400'
  }
  if (percentage >= 100) {
    colorClass = 'text-emerald-500'
    textColorClass = 'text-emerald-600 dark:text-emerald-400'
  }
  
  return (
    <div className="relative">
      <svg className={size === 'large' ? 'w-16 h-16' : 'w-12 h-12'} style={{ transform: 'rotate(-90deg)' }}>
        <circle 
          className="text-zinc-200 dark:text-white/10" 
          stroke="currentColor" 
          strokeWidth={strokeWidth} 
          fill="transparent" 
          r={radius} 
          cx={center} 
          cy={center}
        />
        <circle 
          className={cn("transition-all duration-500", colorClass)}
          stroke="currentColor" 
          strokeWidth={strokeWidth} 
          fill="transparent" 
          r={radius} 
          cx={center} 
          cy={center}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span className={cn(
        "absolute inset-0 flex items-center justify-center font-bold",
        size === 'large' ? 'text-sm' : 'text-xs',
        textColorClass
      )}>
        {percentage}%
      </span>
    </div>
  )
}

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [fileCount, setFileCount] = useState(0)

  // Tab state - Default: Dashboard
  const [activeTab, setActiveTab] = useState('dashboard')

  // Sektör label'ı getir
  function getSectorLabel(value: string): string {
    return sectors.find(s => s.slug === value)?.name || value
  }

  // Sektörleri çek
  const fetchSectors = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('sectors')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (data) {
      setSectors(data as Sector[])
    }
  }, [])

  // Fetch customer
  const fetchCustomer = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Create fresh client to avoid cache issues
      const supabase = createClient()
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) throw new Error('Marka bulunamadı')

      setCustomer(data)

      // Fetch file count
      const { count } = await supabase
        .from('customer_files')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', id)

      setFileCount(count || 0)
    } catch {
      setError('Marka yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCustomer()
    fetchSectors()
  }, [fetchCustomer, fetchSectors])

  // Save customer - with proper error handling
  async function handleSaveCustomer(formData: CustomerFormData) {
    if (!customer) return

    // Use ref for race condition protection
    if (savingRef.current) {
      console.log('Save already in progress, skipping...')
      return
    }

    savingRef.current = true
    setSaving(true)
    setSaveError(null)

    try {
      console.log('Starting save operation...')
      
      // Create fresh client for save operation
      const freshSupabase = createClient()

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
        target_gender: formData.target_gender || [],
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
        // Previously missing fields
        pain_points: formData.pain_points || [],
        hook_sentences: formData.hook_sentences || [],
        cta_standards: formData.cta_standards || [],
        forbidden_words: formData.forbidden_words || [],
        seasonal_calendar: formData.seasonal_calendar || [],
        updated_at: new Date().toISOString()
      }

      console.log('Sending update to Supabase...')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (freshSupabase as any)
        .from('customers')
        .update(customerData)
        .eq('id', customer.id)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Save successful!')
      setCustomer(data)
      
    } catch (err) {
      console.error('Save failed:', err)
      const errorMessage = err instanceof Error ? err.message : 'Kaydetme başarısız oldu'
      setSaveError(errorMessage)
      // Don't re-throw, we're handling the error here
    } finally {
      console.log('Save operation finished, resetting state...')
      savingRef.current = false
      setSaving(false)
    }
  }

  // Save contact info
  async function handleSaveContact(contactData: ContactFormData) {
    if (!customer) return

    if (savingRef.current) return

    savingRef.current = true
    setSaving(true)
    setSaveError(null)

    try {
      const freshSupabase = createClient()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (freshSupabase as any)
        .from('customers')
        .update({
          billing_contact_name: contactData.billing_contact_name,
          billing_contact_email: contactData.billing_contact_email,
          billing_contact_phone: contactData.billing_contact_phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id)
        .select()
        .single()

      if (error) throw error

      setCustomer(data)
    } catch (err) {
      console.error('Contact save failed:', err)
      const errorMessage = err instanceof Error ? err.message : 'Kaydetme başarısız oldu'
      setSaveError(errorMessage)
    } finally {
      savingRef.current = false
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
        <div className="glass-card rounded-2xl p-8 text-center border border-zinc-200 dark:border-white/10">
          <p className="text-muted-foreground">{error || 'Marka bulunamadı'}</p>
          <Button className="mt-4" onClick={() => router.push('/musteriler')}>
            Marka Listesine Dön
          </Button>
        </div>
      </div>
    )
  }

  const completion = calculateBriefCompletion(customer)
  
  // Website hostname helper
  const getHostname = (url: string) => {
    try { return new URL(url).hostname } 
    catch { return url }
  }

  // Brief section status helper
  const getBriefSectionStatus = () => {
    return [
      { 
        label: 'Marka Kimliği', 
        complete: !!(customer.name && customer.brand_values?.length && customer.brand_voice)
      },
      { 
        label: 'Hedef Kitle', 
        complete: !!(customer.target_audience && customer.target_age_range)
      },
      { 
        label: 'Ürün/Hizmet', 
        complete: !!(customer.top_products?.length)
      },
      { 
        label: 'Rakip Analizi', 
        complete: !!(customer.competitors?.length)
      },
      { 
        label: 'İçerik Kuralları', 
        complete: !!(customer.do_not_do?.length)
      },
      { 
        label: 'Özel Günler', 
        complete: !!(customer.special_events?.length)
      }
    ]
  }

  return (
    <div className="space-y-0 -m-6">
      
      {/* ==================== HEADER - TEK SATIR ==================== */}
      <header className="sticky top-0 z-40 glass border-b border-zinc-200 dark:border-white/5">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            
            {/* Left: Back + Brand Info */}
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <button 
                onClick={() => router.push('/musteriler')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Markalar</span>
              </button>
              
              <div className="h-6 w-px bg-zinc-200 dark:bg-white/10" />
              
              {/* Brand Info - Compact */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-500/20 dark:to-purple-500/20 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-zinc-900 dark:text-white text-sm">{customer.name}</h1>
                    {customer.customer_type && (
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                        customer.customer_type === 'retainer' 
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                          : "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400"
                      )}>
                        {getCustomerTypeLabel(customer.customer_type)}
                      </span>
                    )}
                  </div>
                  {customer.website_url && (
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {getHostname(customer.website_url)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Center/Right: Tabs */}
            <nav className="flex items-center gap-1">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                  activeTab === 'dashboard' 
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" 
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden lg:inline">Dashboard</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('brief')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                  activeTab === 'brief' 
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" 
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                )}
              >
                <FileText className="w-4 h-4" />
                Brief
              </button>
              
              <button 
                onClick={() => setActiveTab('icerik-uret')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                  activeTab === 'icerik-uret' 
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" 
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                )}
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden lg:inline">İçerik Üret</span>
                <span className="text-[10px] bg-fuchsia-500/20 text-fuchsia-400 px-1.5 py-0.5 rounded border border-fuchsia-500/20">AI</span>
              </button>
              
              <button 
                disabled
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-400 dark:text-zinc-600 cursor-not-allowed rounded-lg"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden lg:inline">Takvim</span>
                <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">Yakında</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('performans')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                  activeTab === 'performans' 
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" 
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                )}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden xl:inline">Performans</span>
              </button>
              
              <button
                onClick={() => setActiveTab('dosyalar')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                  activeTab === 'dosyalar'
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                )}
              >
                <FolderOpen className="w-4 h-4" />
                <span className="hidden lg:inline">Dosyalar</span>
                {fileCount > 0 && (
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full font-mono">{fileCount}</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('iletisim')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                  activeTab === 'iletisim'
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                )}
              >
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">İletişim</span>
              </button>
            </nav>
            
            {/* Right: Settings */}
            <button className="p-2 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-all">
              <Settings className="w-4 h-4" />
            </button>
            
          </div>
        </div>
      </header>
      
      {/* ==================== CONTENT ==================== */}
      <div className="p-6 content-bg min-h-screen">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-3 gap-6">
              
              {/* LEFT (2/3) */}
              <div className="col-span-2 space-y-6">
                
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="glass-card rounded-xl p-4 glow-indigo card-hover">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/10">
                        <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{completion}%</p>
                    <p className="text-xs text-zinc-500">Brief</p>
                  </div>
                  <div className="glass-card rounded-xl p-4 glow-violet card-hover">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-500/10">
                        <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">0</p>
                    <p className="text-xs text-zinc-500">İçerik</p>
                  </div>
                  <div className="glass-card rounded-xl p-4 glow-cyan card-hover">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/10">
                        <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">—</p>
                    <p className="text-xs text-zinc-500">Bu Ay</p>
                  </div>
                  <div 
                    className="glass-card rounded-xl p-4 glow-amber card-hover cursor-pointer"
                    onClick={() => setActiveTab('dosyalar')}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/10">
                        <FolderOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{fileCount || '—'}</p>
                    <p className="text-xs text-zinc-500">Dosya</p>
                  </div>
                </div>
                
                {/* Info Cards */}
                <div className="grid grid-cols-3 gap-4">
                  {customer.website_url && (
                    <a 
                      href={customer.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card rounded-xl p-4 border border-zinc-200 dark:border-white/10 card-hover"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/10">
                          <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <span className="text-xs font-medium text-zinc-500">Website</span>
                      </div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white font-mono">
                        {getHostname(customer.website_url)}
                      </p>
                    </a>
                  )}
                  {customer.target_audience && (
                    <div className="glass-card rounded-xl p-4 border border-zinc-200 dark:border-white/10 card-hover">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-500/10">
                          <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <span className="text-xs font-medium text-zinc-500">Hedef Kitle</span>
                      </div>
                      <p className="text-sm text-zinc-900 dark:text-white truncate">
                        {customer.target_audience.length > 40 
                          ? customer.target_audience.substring(0, 40) + '...' 
                          : customer.target_audience}
                      </p>
                    </div>
                  )}
                  {customer.brand_voice && (
                    <div className="glass-card rounded-xl p-4 border border-zinc-200 dark:border-white/10 card-hover">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-500/10">
                          <FileText className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />
                        </div>
                        <span className="text-xs font-medium text-zinc-500">Marka Sesi</span>
                      </div>
                      <p className="text-sm text-zinc-900 dark:text-white">
                        {getBrandVoiceLabel(customer.brand_voice)}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Hızlı Aksiyonlar */}
                <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Hızlı Aksiyonlar
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    <button 
                      onClick={() => setActiveTab('icerik-uret')}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-fuchsia-50 to-violet-50 dark:from-fuchsia-500/10 dark:to-violet-500/10 border border-fuchsia-200 dark:border-fuchsia-500/20 hover:border-fuchsia-300 dark:hover:border-fuchsia-500/40 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-500/20 group-hover:scale-110 transition-transform">
                        <Instagram className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
                      </div>
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Instagram</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all group">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20 group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Blog</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-200 dark:border-amber-500/20 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all group">
                      <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/20 group-hover:scale-110 transition-transform">
                        <Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Reklam</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all group">
                      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">E-posta</span>
                    </button>
                  </div>
                </div>
                
                {/* Son İçerikler (Empty) */}
                <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-white/5">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                      <History className="w-4 h-4 text-violet-500" />
                      Son Üretilen İçerikler
                    </h3>
                    <a href="#" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1">
                      Tümünü Gör <ArrowLeft className="w-3 h-3 rotate-180" />
                    </a>
                  </div>
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-4 float-animation">
                      <FileText className="w-7 h-7 text-zinc-400" />
                    </div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Henüz içerik yok</h3>
                    <p className="text-sm text-zinc-500 mb-4">İlk içeriği oluşturmak için yukarıdaki butonları kullan 🚀</p>
                  </div>
                </div>
              </div>
              
              {/* RIGHT (1/3) - Dashboard */}
              <div className="space-y-6">
                
                {/* AI Insight */}
                <div className="glass-card rounded-2xl p-5 glow-violet bg-gradient-to-br from-indigo-50/50 dark:from-indigo-950/30 to-violet-50/50 dark:to-violet-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">AI İçgörüsü</h3>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                    {completion < 50 
                      ? "Brief tamamlanma oranı düşük. Daha iyi içerik üretimi için brief'i tamamla."
                      : completion < 80
                      ? "Brief büyük ölçüde hazır. Birkaç alanı daha doldurarak içerik kalitesini artırabilirsin."
                      : "Brief hazır! İçerik üretmeye başlayabilirsin. 🎉"
                    }
                  </p>
                  <Button 
                    onClick={() => setActiveTab('icerik-uret')}
                    className="btn-press w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    İçerik Üret
                  </Button>
                </div>
                
                {/* Yaklaşan Özel Günler */}
                <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                      <CalendarHeart className="w-4 h-4 text-rose-500" />
                      Yaklaşan Özel Günler
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-rose-50 dark:from-rose-500/10 to-pink-50 dark:to-pink-500/10 border border-rose-200 dark:border-rose-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">4 Gün Kaldı</span>
                        <span className="text-xs text-rose-600 dark:text-rose-400 font-mono">31 Ara</span>
                      </div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">Yılbaşı</p>
                      <p className="text-xs text-zinc-500 mt-1">Kampanya içeriği hazırla!</p>
                    </div>
                    <div className="p-3 rounded-xl border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-zinc-500">45 Gün</span>
                        <span className="text-xs text-zinc-400 font-mono">14 Şub</span>
                      </div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">Sevgililer Günü</p>
                    </div>
                  </div>
                </div>
                
                {/* Brief Özeti */}
                <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-cyan-500" />
                      Brief Özeti
                    </h3>
                    <button 
                      onClick={() => setActiveTab('brief')}
                      className="text-xs text-indigo-600 dark:text-indigo-400"
                    >
                      Düzenle
                    </button>
                  </div>
                  <div className="space-y-3">
                    {getBriefSectionStatus().map((section, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-zinc-500">{section.label}</span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          section.complete
                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                        )}>
                          {section.complete ? 'Tamamlandı' : 'Eksik'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}
        
        {/* Brief Tab - 2/3 + 1/3 LAYOUT + STICKY BOTTOM SAVE */}
        {activeTab === 'brief' && (
          <div>
            <div className="grid grid-cols-3 gap-6">
              
              {/* LEFT (2/3) - Brief Form */}
              <div className="col-span-2">
                <CustomerBriefForm
                  customer={customer}
                  onSave={handleSaveCustomer}
                  onCancel={() => router.push('/musteriler')}
                  isLoading={saving}
                />
              </div>
              
              {/* RIGHT (1/3) - Brief Sidebar */}
              <div className="relative">
                {/* Normal Scroll Content */}
                <div className="space-y-6 pb-48">
                  
                  {/* AI Insight for Brief */}
                  <div className="glass-card rounded-2xl p-5 glow-violet bg-gradient-to-br from-indigo-50/50 dark:from-indigo-950/30 to-violet-50/50 dark:to-violet-950/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">AI İçgörüsü</h3>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {completion < 50 
                        ? "Brief tamamlanma oranı düşük. Eksik alanları doldurarak AI'ın daha iyi içerik üretmesini sağla."
                        : completion < 80
                        ? "Güzel ilerleme! Birkaç alan daha doldurup %80 üzerine çıkarsan AI harikalar yaratır."
                        : "Mükemmel! Brief hazır. İçerik Üret sekmesine geçebilirsin. 🚀"
                      }
                    </p>
                  </div>
                  
                  {/* Brief Sections Status */}
                  <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-cyan-500" />
                        Bölüm Durumları
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {getBriefSectionStatus().map((section, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                          {section.complete ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-amber-500" />
                          )}
                          <span className={cn(
                            "text-sm",
                            section.complete ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-500"
                          )}>
                            {section.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quick Tips */}
                  <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">💡 İpucu</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Brief ne kadar detaylı olursa, AI o kadar kaliteli ve markaya uygun içerik üretir. 
                      Özellikle "Marka Sesi" ve "Kullanılmaması Gereken Kelimeler" alanları çok önemli!
                    </p>
                  </div>
                  
                </div>
                
                {/* STICKY BOTTOM - Brief Progress + Save */}
                <div className="fixed bottom-6 right-6 w-[calc(33.333%-3rem)] max-w-[340px]">
                  <div className="glass-card rounded-2xl p-5 glow-cyan bg-gradient-to-br from-cyan-50/95 dark:from-cyan-950/95 to-blue-50/95 dark:to-blue-950/95 backdrop-blur-xl shadow-2xl border border-cyan-200 dark:border-cyan-500/30">
                    <div className="flex items-center gap-4 mb-4">
                      <ProgressRing percentage={completion} size="large" />
                      <div>
                        <p className="text-lg font-bold text-zinc-900 dark:text-white">Brief Durumu</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{Math.round(completion * 0.25)}/25 alan dolu</p>
                      </div>
                    </div>
                    
                    {/* Error Message */}
                    {saveError && (
                      <div className="mb-3 p-2 rounded-lg bg-rose-100 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30">
                        <p className="text-xs text-rose-600 dark:text-rose-400">{saveError}</p>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => {
                        const form = document.querySelector('form')
                        if (form) form.requestSubmit()
                      }}
                      disabled={saving}
                      className="btn-press w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/25"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Kaydet
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}
        
        {/* İçerik Üret Tab */}
        {activeTab === 'icerik-uret' && (
          <div>
            <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-100 to-violet-100 dark:from-fuchsia-500/10 dark:to-violet-500/10 border border-fuchsia-200 dark:border-fuchsia-500/20 flex items-center justify-center mx-auto mb-4 float-animation">
                <Sparkles className="w-8 h-8 text-fuchsia-600 dark:text-fuchsia-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">İçerik Üretimi</h3>
              <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
                Sosyal medya postları, blog yazıları, reklam metinleri ve daha fazlasını AI ile üret.
              </p>
              
              <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto mb-8">
                {[
                  { icon: '📱', label: 'Sosyal Medya' },
                  { icon: '📝', label: 'Blog' },
                  { icon: '📢', label: 'Reklam' },
                  { icon: '📧', label: 'E-posta' },
                  { icon: '🔍', label: 'SEO' },
                ].map((item) => (
                  <button 
                    key={item.label}
                    className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 border border-zinc-200 dark:border-white/10 hover:border-fuchsia-300 dark:hover:border-fuchsia-500/30 transition-all group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                  </button>
                ))}
              </div>
              
              <p className="text-sm text-zinc-400">Sprint 2'de aktif olacak</p>
            </div>
          </div>
        )}
        
        {/* Dosyalar Tab */}
        {activeTab === 'dosyalar' && (
          <div>
            <CustomerFilesTab
              customer={customer}
              onUpdate={fetchCustomer}
            />
          </div>
        )}

        {/* Performans Tab */}
        {activeTab === 'performans' && (
          <div>
            <CustomerPerformanceTab
              customer={customer}
              onUpdate={fetchCustomer}
            />
          </div>
        )}

        {/* İletişim Tab */}
        {activeTab === 'iletisim' && (
          <div>
            <CustomerContactTab
              customer={customer}
              onSave={handleSaveContact}
              isLoading={saving}
            />
          </div>
        )}

      </div>
    </div>
  )
}
