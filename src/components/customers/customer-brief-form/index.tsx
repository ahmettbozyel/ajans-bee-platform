'use client'

import { useState, useEffect, useRef } from 'react'
import { Info, Lock, Loader2, Sparkles, Check, X, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { BrandAssetsSection } from '../brand-assets-section'
import { createClient } from '@/lib/supabase/client'
import type {
  Customer,
  CustomerFormData,
  BrandVoice,
  BrandColors,
  BrandFonts,
  BusinessType,
  PriceSegment
} from '@/lib/customer-types'
import { BRAND_VOICES, BUSINESS_TYPES, PRICE_SEGMENTS } from '@/lib/customer-types'

import { BRIEF_SECTIONS_CONFIG, GENERAL_HOLIDAYS } from './config'
import type { AIResearchState } from './types'
import {
  SectionHeader,
  ProgressOverview,
  TagInput,
  OptionCard,
  SocialMediaInput
} from './components'

// Disabled Field Wrapper Component
function DisabledField({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="relative opacity-50 pointer-events-none">
      <div className="absolute -top-1 right-0 z-10">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
          <Lock className="w-2.5 h-2.5" />
          Yakında
        </span>
      </div>
      {children}
    </div>
  )
}


// AI Result type
interface AIResult {
  filled: Record<string, any>
  suggestions: Array<{
    field: string
    current: any
    suggested: any
    reason: string
  }>
}

// Sector type
interface Sector {
  id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
}

// Main Form Props
interface CustomerBriefFormProps {
  customer?: Customer | null
  onSave: (data: CustomerFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function CustomerBriefForm({ customer, onSave, onCancel, isLoading }: CustomerBriefFormProps) {
  const [openSections, setOpenSections] = useState<string[]>(['marka-kimligi'])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [aiResearch, setAIResearch] = useState<AIResearchState>({
    isLoading: false, progress: 0, status: 'idle', error: null, filledFields: []
  })

  // AI Complete states
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState<AIResult | null>(null)
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  // Section refs for scroll
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Form Data
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '', brand_name: '', website_url: '', sector: '', sub_sector: '',
    business_type: null, brand_voice: 'samimi',
    customer_type: 'project', status: 'active',
    email: '', phone: '', location: '', social_media: {},
    brand_description: '', mission: '', vision: '', slogan: '', usp: '',
    target_audience: '', target_age_range: '', target_geography: '',
    target_gender: [],
    product_categories: [], top_products: [], price_segment: null,
    competitors: [], do_not_do: [], must_emphasize: [], special_events: [],
    brand_values: [], buying_motivations: [],
    content_pillars: [], platform_rules: {},
    example_captions: { good_examples: [], bad_examples: [] },
    word_mapping: [],
    brand_colors: {}, brand_fonts: {}, brand_assets: {}, integrations: {},
    pain_points: [], hook_sentences: [],
    cta_standards: [], forbidden_words: [], seasonal_calendar: []
  })

  // Extended form fields for new UI
  const [hashtagPreference, setHashtagPreference] = useState('medium')
  const [emojiPreference, setEmojiPreference] = useState('moderate')
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>([])
  const [differentiation, setDifferentiation] = useState('')
  const [bestSellers, setBestSellers] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        brand_name: customer.brand_name || '',
        website_url: customer.website_url || '',
        sector: customer.sector || '',
        sub_sector: customer.sub_sector || '',
        business_type: customer.business_type || null,
        brand_voice: customer.brand_voice || 'samimi',
        customer_type: customer.customer_type || 'project',
        status: customer.status || 'active',
        email: customer.email || '',
        phone: customer.phone || '',
        location: customer.location || '',
        social_media: customer.social_media || {},
        brand_description: customer.brand_description || '',
        mission: customer.mission || '',
        vision: customer.vision || '',
        slogan: customer.slogan || '',
        usp: customer.usp || '',
        target_audience: customer.target_audience || '',
        target_age_range: customer.target_age_range || '',
        target_geography: customer.target_geography || '',
        target_gender: customer.target_gender || [],
        product_categories: customer.product_categories || [],
        top_products: customer.top_products || [],
        price_segment: customer.price_segment || null,
        competitors: customer.competitors || [],
        do_not_do: customer.do_not_do || [],
        must_emphasize: customer.must_emphasize || [],
        special_events: customer.special_events || [],
        brand_values: customer.brand_values || [],
        buying_motivations: customer.buying_motivations || [],
        content_pillars: customer.content_pillars || [],
        platform_rules: customer.platform_rules || {},
        example_captions: customer.example_captions || { good_examples: [], bad_examples: [] },
        word_mapping: customer.word_mapping || [],
        brand_colors: customer.brand_colors || {},
        brand_fonts: customer.brand_fonts || {},
        brand_assets: customer.brand_assets || {},
        integrations: customer.integrations || {},
        pain_points: customer.pain_points || [],
        hook_sentences: customer.hook_sentences || [],
        cta_standards: customer.cta_standards || [],
        forbidden_words: customer.forbidden_words || [],
        seasonal_calendar: customer.seasonal_calendar || []
      })
    }
  }, [customer])

  // Sektörleri çek
  useEffect(() => {
    async function fetchSectors() {
      const supabase = createClient()
      const { data } = await supabase
        .from('sectors')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (data) {
        setSectors(data)
      }
    }
    fetchSectors()
  }, [])

  const toggleSection = (id: string) => {
    setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  // Section'a scroll et ve aç
  const scrollToSection = (sectionId: string) => {
    if (!openSections.includes(sectionId)) {
      setOpenSections(prev => [...prev, sectionId])
    }
    setTimeout(() => {
      const element = sectionRefs.current[sectionId]
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  // Calculate section completions - FAZ 1 SADECE AKTİF ALANLAR
  const getSectionCompletion = (sectionId: string) => {
    switch (sectionId) {
      case 'marka-kimligi':
        return {
          filled: [
            formData.name,
            formData.slogan,
            formData.brand_values?.length,
            formData.brand_voice,
            Object.keys(formData.social_media || {}).length
          ].filter(Boolean).length,
          total: 5
        }
      case 'hedef-kitle':
        return {
          filled: [
            formData.target_age_range,
            formData.target_gender?.length,
            formData.target_audience
          ].filter(Boolean).length,
          total: 3
        }
      case 'urun-hizmet':
        return {
          filled: [
            formData.top_products?.length
          ].filter(Boolean).length,
          total: 1
        }
      case 'kurallar':
        return {
          filled: [
            formData.do_not_do?.length
          ].filter(Boolean).length,
          total: 1
        }
      case 'rakipler':
        return {
          filled: [
            formData.competitors?.length
          ].filter(Boolean).length,
          total: 1
        }
      case 'ozel-gunler':
        return {
          filled: [
            formData.special_events?.length,
            formData.seasonal_calendar?.length
          ].filter(Boolean).length,
          total: 2
        }
      case 'marka-assets':
        return {
          filled: [
            Object.keys(formData.brand_colors || {}).length,
            Object.keys(formData.brand_fonts || {}).length
          ].filter(Boolean).length,
          total: 2
        }
      default:
        return { filled: 0, total: 0 }
    }
  }

  const allSectionsProgress = [
    { label: 'Marka Kimliği', id: 'marka-kimligi', ...getSectionCompletion('marka-kimligi') },
    { label: 'Hedef Kitle', id: 'hedef-kitle', ...getSectionCompletion('hedef-kitle') },
    { label: 'Ürün/Hizmet', id: 'urun-hizmet', ...getSectionCompletion('urun-hizmet') },
    { label: 'İçerik Kuralları', id: 'kurallar', ...getSectionCompletion('kurallar') },
    { label: 'Rakip Analizi', id: 'rakipler', ...getSectionCompletion('rakipler') },
    { label: 'Özel Günler', id: 'ozel-gunler', ...getSectionCompletion('ozel-gunler') },
    { label: 'Renkler & Fontlar', id: 'marka-assets', ...getSectionCompletion('marka-assets') }
  ]

  const totalFilled = allSectionsProgress.reduce((acc, s) => acc + s.filled, 0)
  const totalFields = allSectionsProgress.reduce((acc, s) => acc + s.total, 0)
  const overallPercentage = totalFields > 0 ? Math.round((totalFilled / totalFields) * 100) : 0

  // ==================== AI COMPLETE HANDLER ====================
  const handleAIComplete = async () => {
    if (!formData.name) {
      setAiError('Marka adı zorunlu')
      return
    }

    setAiLoading(true)
    setAiError(null)

    // Dolu alanları topla
    const filledFields: Record<string, any> = {}
    const emptyFields: string[] = []

    // Faz 1 aktif alanlar
    const fieldsToCheck = [
      { key: 'name', value: formData.name },
      { key: 'slogan', value: formData.slogan },
      { key: 'brand_values', value: formData.brand_values },
      { key: 'brand_voice', value: formData.brand_voice },
      { key: 'social_media', value: formData.social_media },
      { key: 'target_age_range', value: formData.target_age_range },
      { key: 'target_audience', value: formData.target_audience },
      { key: 'top_products', value: formData.top_products },
      { key: 'do_not_do', value: formData.do_not_do },
    ]

    fieldsToCheck.forEach(({ key, value }) => {
      const isEmpty = !value || 
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0)
      
      if (isEmpty) {
        emptyFields.push(key)
      } else {
        filledFields[key] = value
      }
    })

    try {
      const res = await fetch('/api/ai/brief/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filledFields,
          emptyFields,
          websiteUrl: formData.website_url || undefined
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'API hatası')
      }

      const result: AIResult = await res.json()
      setAiResult(result)
      setShowAIModal(true)

    } catch (error) {
      console.error('AI Complete error:', error)
      setAiError(error instanceof Error ? error.message : 'Bir hata oluştu')
    } finally {
      setAiLoading(false)
    }
  }

  // AI sonuçlarını forma uygula
  const applyAIResults = () => {
    if (!aiResult) return

    // Filled değerleri direkt uygula
    setFormData(prev => ({
      ...prev,
      ...aiResult.filled
    }))

    setShowAIModal(false)
    setAiResult(null)
  }

  // Tek bir öneriyi kabul et
  const acceptSuggestion = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Öneriyi listeden çıkar
    if (aiResult) {
      setAiResult({
        ...aiResult,
        suggestions: aiResult.suggestions.filter(s => s.field !== field)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  const handleBrandAssetsChange = (colors: BrandColors, fonts: BrandFonts) => {
    setFormData(prev => ({
      ...prev,
      brand_colors: colors,
      brand_fonts: fonts
    }))
  }

  // Field label mapping
  const fieldLabels: Record<string, string> = {
    name: 'Marka Adı',
    slogan: 'Slogan',
    brand_values: 'Marka Değerleri',
    brand_voice: 'Marka Sesi',
    social_media: 'Sosyal Medya',
    target_age_range: 'Yaş Aralığı',
    target_audience: 'Hedef Kitle',
    top_products: 'Ana Ürünler',
    do_not_do: 'Yasak Kelimeler'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Progress Overview */}
      <ProgressOverview
        sections={allSectionsProgress}
        onSectionClick={scrollToSection}
      />

      {/* ==================== AI İLE TAMAMLA BUTONU ==================== */}
      <div className="glass-card rounded-2xl p-4 border border-violet-200 dark:border-violet-500/20 bg-gradient-to-r from-violet-50 dark:from-violet-500/5 to-fuchsia-50 dark:to-fuchsia-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">AI ile Tamamla</h3>
              <p className="text-xs text-zinc-500">Boş alanları otomatik doldur, öneriler al</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleAIComplete}
            disabled={aiLoading || !formData.name}
            className="btn-press px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-medium shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analiz ediliyor...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Tamamla
              </>
            )}
          </Button>
        </div>
        {aiError && (
          <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{aiError}</p>
        )}
      </div>

      {/* ==================== AI SONUÇ MODAL ==================== */}
      <Dialog open={showAIModal} onOpenChange={setShowAIModal}>
        <DialogContent 
          className="sm:max-w-lg border border-zinc-700 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
          style={{ backgroundColor: '#18181b' }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              AI Analiz Sonuçları
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Aşağıdaki alanlar AI tarafından dolduruldu veya önerildi.
            </DialogDescription>
          </DialogHeader>

          {aiResult && (
            <div className="space-y-6 py-4">
              
              {/* Doldurulan Alanlar */}
              {Object.keys(aiResult.filled).length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Doldurulan Alanlar ({Object.keys(aiResult.filled).length})
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(aiResult.filled).map(([field, value]) => (
                      <div key={field} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-xs font-medium text-emerald-400">{fieldLabels[field] || field}</span>
                        <p className="text-sm text-zinc-300 mt-1">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Öneriler */}
              {aiResult.suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    İyileştirme Önerileri ({aiResult.suggestions.length})
                  </h4>
                  <div className="space-y-3">
                    {aiResult.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className="text-xs font-medium text-amber-400">{fieldLabels[suggestion.field] || suggestion.field}</span>
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-zinc-500">
                                Mevcut: {Array.isArray(suggestion.current) ? suggestion.current.join(', ') : String(suggestion.current || '—')}
                              </p>
                              <p className="text-sm text-zinc-300">
                                Öneri: {Array.isArray(suggestion.suggested) ? suggestion.suggested.join(', ') : String(suggestion.suggested)}
                              </p>
                            </div>
                            <p className="text-xs text-zinc-500 mt-2 italic">{suggestion.reason}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => acceptSuggestion(suggestion.field, suggestion.suggested)}
                              className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setAiResult({
                                  ...aiResult,
                                  suggestions: aiResult.suggestions.filter((_, i) => i !== idx)
                                })
                              }}
                              className="h-8 px-3 rounded-lg text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <div className="flex gap-3 pt-4 border-t border-zinc-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAIModal(false)}
                  className="flex-1 rounded-xl border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  İptal
                </Button>
                <Button
                  type="button"
                  onClick={applyAIResults}
                  className="flex-1 btn-press rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Uygula
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ==================== SECTION 1: MARKA KİMLİĞİ ==================== */}
      <div
        ref={(el) => { sectionRefs.current['marka-kimligi'] = el }}
        className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 scroll-mt-32"
      >
        <SectionHeader
          section={BRIEF_SECTIONS_CONFIG.markaKimligi}
          isOpen={openSections.includes('marka-kimligi')}
          onToggle={() => toggleSection('marka-kimligi')}
          completion={getSectionCompletion('marka-kimligi')}
        />
        {openSections.includes('marka-kimligi') && (
          <div className="px-5 pb-5">
            <div className="pt-4 border-t border-zinc-200 dark:border-white/5 space-y-5">

              {/* ✅ Marka Adı - AKTİF */}
              <div>
                <Label className="flex items-center gap-1 mb-2 text-zinc-700 dark:text-zinc-300">
                  Marka Adı <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: PERDIM Personel Diamonds"
                  className="input-glow text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  required
                />
              </div>

              {/* ✅ Ticari Ünvan / Brand Name - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                  Ticari Ünvan
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Şirketin resmi ticari ünvanı">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>
                <Input
                  value={formData.brand_name || ''}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                  placeholder="Örn: PERDIM Kuyumculuk A.Ş."
                  className="input-glow text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              {/* ✅ Website - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                  Website
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Markanın web sitesi adresi">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>
                <Input
                  value={formData.website_url || ''}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                  className="input-glow font-mono text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              {/* ✅ Müşteri Tipi - AKTİF */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Müşteri Tipi</Label>
                <div className="grid grid-cols-2 gap-3">
                  <OptionCard
                    label="Retainer"
                    emoji="🤝"
                    selected={formData.customer_type === 'retainer'}
                    onChange={() => setFormData({ ...formData, customer_type: 'retainer' })}
                    colorClass="cyan"
                  />
                  <OptionCard
                    label="Proje"
                    emoji="📋"
                    selected={formData.customer_type === 'project'}
                    onChange={() => setFormData({ ...formData, customer_type: 'project' })}
                    colorClass="fuchsia"
                  />
                </div>
              </div>

              {/* ✅ Sektör - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                  Sektör
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Markanın faaliyet gösterdiği sektör">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>
                <Select
                  key={`sector-${sectors.length}-${formData.sector || 'empty'}`}
                  value={formData.sector || undefined}
                  onValueChange={(value) => setFormData({ ...formData, sector: value })}
                >
                  <SelectTrigger className="input-glow text-zinc-900 dark:text-white">
                    <SelectValue placeholder="Sektör seçin...">
                      {formData.sector && sectors.length > 0
                        ? sectors.find(s => s.slug === formData.sector)?.name || formData.sector
                        : undefined
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.slug}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ✅ Alt Sektör - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                  Alt Sektör
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Daha spesifik sektör bilgisi">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>
                <Input
                  value={formData.sub_sector || ''}
                  onChange={(e) => setFormData({ ...formData, sub_sector: e.target.value })}
                  placeholder="Örn: Butik Otel, Pırlanta Takı, Organik Kozmetik"
                  className="input-glow text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              {/* ✅ İş Modeli - AKTİF */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">İş Modeli</Label>
                <div className="grid grid-cols-3 gap-3">
                  {BUSINESS_TYPES.map((type) => (
                    <OptionCard
                      key={type.value}
                      label={type.label}
                      selected={formData.business_type === type.value}
                      onChange={() => setFormData({ ...formData, business_type: type.value as BusinessType })}
                      colorClass="violet"
                    />
                  ))}
                </div>
              </div>

              {/* ✅ Konum - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                  Konum
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Fiziksel mağaza/ofis konumu">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>
                <Input
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Örn: İstanbul, Nişantaşı"
                  className="input-glow text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              {/* ✅ Fiyat Segmenti - AKTİF */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Fiyat Segmenti</Label>
                <div className="grid grid-cols-4 gap-3">
                  {PRICE_SEGMENTS.map((segment) => (
                    <OptionCard
                      key={segment.value}
                      label={segment.label}
                      selected={formData.price_segment === segment.value}
                      onChange={() => setFormData({ ...formData, price_segment: segment.value as PriceSegment })}
                      colorClass="emerald"
                    />
                  ))}
                </div>
              </div>

              {/* ✅ Slogan - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                  Slogan / Tagline
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Markayı özetleyen kısa ve akılda kalıcı cümle">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>
                <Input
                  value={formData.slogan || ''}
                  onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  placeholder="Örn: Elmasın güvenilir adresi"
                  className="input-glow text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              {/* ✅ Marka Değerleri - AKTİF */}
              <div>
                <Label className="flex items-center gap-1 mb-2 text-zinc-700 dark:text-zinc-300">
                  Marka Değerleri <span className="text-rose-500">*</span>
                </Label>
                <TagInput
                  value={formData.brand_values || []}
                  onChange={(v) => setFormData({ ...formData, brand_values: v })}
                  placeholder="+ Yeni değer ekle..."
                  colorClass="indigo"
                />
              </div>

              {/* ✅ Marka Sesi - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                  Marka Sesi <span className="text-rose-500">*</span>
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="İçeriklerin hangi tonda yazılacağını belirler">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {BRAND_VOICES.map((voice) => (
                    <OptionCard
                      key={voice.value}
                      label={voice.label}
                      emoji={voice.emoji}
                      selected={formData.brand_voice === voice.value}
                      onChange={() => setFormData({ ...formData, brand_voice: voice.value as BrandVoice })}
                    />
                  ))}
                </div>
              </div>

              {/* ✅ Misyon - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                  Misyon
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Markanın var oluş amacı, ne için çalıştığı">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>
                <Textarea
                  value={formData.mission || ''}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  placeholder="Örn: Müşterilerimize en kaliteli pırlantaları en güvenilir şekilde sunmak..."
                  className="input-glow resize-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  rows={2}
                />
              </div>

              {/* ✅ Vizyon - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                  Vizyon
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Markanın gelecekte ulaşmak istediği nokta">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>
                <Textarea
                  value={formData.vision || ''}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  placeholder="Örn: Türkiye'nin en güvenilir mücevher markası olmak..."
                  className="input-glow resize-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  rows={2}
                />
              </div>

              {/* ✅ USP - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                  USP (Benzersiz Satış Vaadi)
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Markayı rakiplerinden ayıran en önemli özellik">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>
                <Textarea
                  value={formData.usp || ''}
                  onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
                  placeholder="Örn: Türkiye'nin en güvenilir pırlanta markası, tüm ürünlerde GIA sertifikası garantisi"
                  className="input-glow resize-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  rows={2}
                />
              </div>

              {/* ✅ Sosyal Medya - AKTİF */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Sosyal Medya Hesapları</Label>
                <SocialMediaInput
                  value={formData.social_media || {}}
                  onChange={(v) => setFormData({ ...formData, social_media: v })}
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ==================== SECTION 2: HEDEF KİTLE ==================== */}
      <div
        ref={(el) => { sectionRefs.current['hedef-kitle'] = el }}
        className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 scroll-mt-32"
      >
        <SectionHeader
          section={BRIEF_SECTIONS_CONFIG.hedefKitle}
          isOpen={openSections.includes('hedef-kitle')}
          onToggle={() => toggleSection('hedef-kitle')}
          completion={getSectionCompletion('hedef-kitle')}
        />
        {openSections.includes('hedef-kitle') && (
          <div className="px-5 pb-5">
            <div className="pt-4 border-t border-zinc-200 dark:border-white/5 space-y-5">

              {/* ✅ Yaş Aralığı - AKTİF */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Yaş Aralığı</Label>
                <Input
                  value={formData.target_age_range || ''}
                  onChange={(e) => setFormData({ ...formData, target_age_range: e.target.value })}
                  placeholder="Örn: 25-45"
                  className="input-glow text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              {/* ✅ Cinsiyet - AKTİF */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Cinsiyet</Label>
                <div className="flex gap-3">
                  <label className="flex-1 relative cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={(formData.target_gender || []).includes('female')}
                      onChange={() => {
                        const current = formData.target_gender || []
                        if (current.includes('female')) {
                          setFormData({ ...formData, target_gender: current.filter(g => g !== 'female') })
                        } else {
                          setFormData({ ...formData, target_gender: [...current, 'female'] })
                        }
                      }}
                    />
                    <div className="p-3 rounded-xl border-2 border-zinc-200 dark:border-white/10 peer-checked:border-violet-500 peer-checked:bg-violet-50 dark:peer-checked:bg-violet-500/10 text-center transition-all">
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">Kadın</span>
                    </div>
                  </label>
                  <label className="flex-1 relative cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={(formData.target_gender || []).includes('male')}
                      onChange={() => {
                        const current = formData.target_gender || []
                        if (current.includes('male')) {
                          setFormData({ ...formData, target_gender: current.filter(g => g !== 'male') })
                        } else {
                          setFormData({ ...formData, target_gender: [...current, 'male'] })
                        }
                      }}
                    />
                    <div className="p-3 rounded-xl border-2 border-zinc-200 dark:border-white/10 peer-checked:border-violet-500 peer-checked:bg-violet-50 dark:peer-checked:bg-violet-500/10 text-center transition-all">
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">Erkek</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* ✅ Hedef Kitle Açıklaması - AKTİF */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Hedef Kitle Açıklaması</Label>
                <Textarea
                  value={formData.target_audience || ''}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  placeholder="Örn: Kadınlar ve hediye alma potansiyeli olan erkekler. Orta-üst gelir grubu..."
                  className="input-glow resize-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  rows={3}
                />
              </div>

              {/* ✅ Hedef Coğrafya - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                  Hedef Coğrafya
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Hedef kitlenin bulunduğu bölgeler">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>
                <Input
                  value={formData.target_geography || ''}
                  onChange={(e) => setFormData({ ...formData, target_geography: e.target.value })}
                  placeholder="Örn: Türkiye geneli, özellikle büyükşehirler"
                  className="input-glow text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              {/* ✅ Ağrı Noktaları (Pain Points) - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  Müşteri Ağrı Noktaları
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Hedef kitlenin yaşadığı sorunlar ve bunların çözümleri">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                <div className="space-y-3 mb-4">
                  {(formData.pain_points || []).map((point: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-medium text-violet-600 dark:text-violet-400">Ağrı Noktası #{idx + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...(formData.pain_points || [])]
                            updated.splice(idx, 1)
                            setFormData({ ...formData, pain_points: updated })
                          }}
                          className="text-zinc-400 hover:text-rose-500 h-6 w-6 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Input
                          value={point.problem || ''}
                          onChange={(e) => {
                            const updated = [...(formData.pain_points || [])]
                            updated[idx] = { ...updated[idx], problem: e.target.value }
                            setFormData({ ...formData, pain_points: updated })
                          }}
                          placeholder="Problem/ağrı noktası..."
                          className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        />
                        <Select
                          value={point.intensity || 'medium'}
                          onValueChange={(val: 'low' | 'medium' | 'high') => {
                            const updated = [...(formData.pain_points || [])]
                            updated[idx] = { ...updated[idx], intensity: val }
                            setFormData({ ...formData, pain_points: updated })
                          }}
                        >
                          <SelectTrigger className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                            <SelectValue placeholder="Yoğunluk seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Düşük</SelectItem>
                            <SelectItem value="medium">Orta</SelectItem>
                            <SelectItem value="high">Yüksek</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newPoint = { problem: '', intensity: 'medium' as const }
                    setFormData({ ...formData, pain_points: [...(formData.pain_points || []), newPoint] })
                  }}
                  className="w-full border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  + Ağrı Noktası Ekle
                </Button>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ==================== SECTION 3: ÜRÜN/HİZMET ==================== */}
      <div
        ref={(el) => { sectionRefs.current['urun-hizmet'] = el }}
        className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 scroll-mt-32"
      >
        <SectionHeader
          section={BRIEF_SECTIONS_CONFIG.urunHizmet}
          isOpen={openSections.includes('urun-hizmet')}
          onToggle={() => toggleSection('urun-hizmet')}
          completion={getSectionCompletion('urun-hizmet')}
        />
        {openSections.includes('urun-hizmet') && (
          <div className="px-5 pb-5">
            <div className="pt-4 border-t border-zinc-200 dark:border-white/5 space-y-5">

              {/* ✅ Ana Ürünler - AKTİF */}
              <div>
                <Label className="flex items-center gap-1 mb-2 text-zinc-700 dark:text-zinc-300">
                  Ana Ürün/Hizmetler <span className="text-rose-500">*</span>
                </Label>
                <TagInput
                  value={formData.top_products || []}
                  onChange={(v) => setFormData({ ...formData, top_products: v })}
                  placeholder="+ Yeni ürün ekle..."
                  colorClass="cyan"
                />
              </div>

              {/* 🔒 Fiyat Aralığı - DISABLED */}
              <DisabledField>
                <div>
                  <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Fiyat Aralığı</Label>
                  <div className="flex gap-3 items-center">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">₺</span>
                      <Input
                        value={priceRange.min}
                        disabled
                        placeholder="Min"
                        className="input-glow pl-8 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 cursor-not-allowed"
                      />
                    </div>
                    <span className="text-zinc-400 dark:text-zinc-500">—</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">₺</span>
                      <Input
                        value={priceRange.max}
                        disabled
                        placeholder="Max"
                        className="input-glow pl-8 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </DisabledField>

              {/* 🔒 En Çok Satan - DISABLED */}
              <DisabledField>
                <div>
                  <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">En Çok Satan Ürünler</Label>
                  <Textarea
                    value={bestSellers}
                    disabled
                    placeholder="Hangi ürünler en çok satıyor? İçerik üretiminde öncelik verilebilir."
                    className="input-glow resize-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 cursor-not-allowed"
                    rows={2}
                  />
                </div>
              </DisabledField>

            </div>
          </div>
        )}
      </div>

      {/* ==================== SECTION 4: KURALLAR ==================== */}
      <div
        ref={(el) => { sectionRefs.current['kurallar'] = el }}
        className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 scroll-mt-32"
      >
        <SectionHeader
          section={BRIEF_SECTIONS_CONFIG.kurallar}
          isOpen={openSections.includes('kurallar')}
          onToggle={() => toggleSection('kurallar')}
          completion={getSectionCompletion('kurallar')}
        />
        {openSections.includes('kurallar') && (
          <div className="px-5 pb-5">
            <div className="pt-4 border-t border-zinc-200 dark:border-white/5 space-y-5">

              {/* ✅ Kullanılmaması Gereken Kelimeler - AKTİF */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Kullanılmaması Gereken Kelimeler</Label>
                <TagInput
                  value={formData.do_not_do || []}
                  onChange={(v) => setFormData({ ...formData, do_not_do: v })}
                  placeholder="+ Kelime ekle..."
                  colorClass="rose"
                />
              </div>

              {/* ✅ Vurgulanması Gerekenler - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                  Vurgulanması Gerekenler
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Her içerikte vurgulanması gereken önemli noktalar">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>
                <TagInput
                  value={formData.must_emphasize || []}
                  onChange={(v) => setFormData({ ...formData, must_emphasize: v })}
                  placeholder="+ Vurgulama noktası ekle..."
                  colorClass="emerald"
                />
              </div>

              {/* ✅ Yasaklı Kelimeler (Detaylı) - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  Yasaklı Kelimeler (Detaylı)
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Kullanılmaması gereken kelimeler ve alternatifleri">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                <div className="space-y-3 mb-4">
                  {(formData.forbidden_words || []).map((item: any, idx: number) => {
                    // DB'de string veya object olabilir - normalize et
                    const wordValue = typeof item === 'string' ? item : (item.word || '')
                    const altValue = typeof item === 'string' ? '' : (item.alternative || '')
                    const reasonValue = typeof item === 'string' ? '' : (item.reason || '')

                    return (
                      <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-medium text-rose-600 dark:text-rose-400">Yasaklı Kelime #{idx + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = [...(formData.forbidden_words || [])]
                              updated.splice(idx, 1)
                              setFormData({ ...formData, forbidden_words: updated })
                            }}
                            className="text-zinc-400 hover:text-rose-500 h-6 w-6 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Input
                            value={wordValue}
                            onChange={(e) => {
                              const updated = [...(formData.forbidden_words || [])]
                              updated[idx] = { word: e.target.value, alternative: altValue, reason: reasonValue }
                              setFormData({ ...formData, forbidden_words: updated })
                            }}
                            placeholder="Yasaklı kelime..."
                            className="input-glow text-zinc-900 dark:text-white"
                          />
                          <Input
                            value={altValue}
                            onChange={(e) => {
                              const updated = [...(formData.forbidden_words || [])]
                              updated[idx] = { word: wordValue, alternative: e.target.value, reason: reasonValue }
                              setFormData({ ...formData, forbidden_words: updated })
                            }}
                            placeholder="Alternatif kelime (opsiyonel)..."
                            className="input-glow text-zinc-900 dark:text-white"
                          />
                          <Input
                            value={reasonValue}
                            onChange={(e) => {
                              const updated = [...(formData.forbidden_words || [])]
                              updated[idx] = { word: wordValue, alternative: altValue, reason: e.target.value }
                              setFormData({ ...formData, forbidden_words: updated })
                            }}
                            placeholder="Neden yasaklı? (opsiyonel)..."
                            className="input-glow text-zinc-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newWord = { word: '', reason: '', alternative: '' }
                    setFormData({ ...formData, forbidden_words: [...(formData.forbidden_words || []), newWord] })
                  }}
                  className="w-full border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  + Yasaklı Kelime Ekle
                </Button>
              </div>

              {/* ✅ Hook Cümleleri - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  Hook Cümleleri
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Dikkat çekici açılış cümleleri">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                <div className="space-y-3 mb-4">
                  {(formData.hook_sentences || []).map((item: any, idx: number) => {
                    // DB'de string veya object olabilir - normalize et
                    const hookValue = typeof item === 'string' ? item : (item.hook || '')
                    const typeValue = typeof item === 'string' ? 'emotion' : (item.type || 'emotion')

                    return (
                      <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-medium text-violet-600 dark:text-violet-400">Hook #{idx + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = [...(formData.hook_sentences || [])]
                              updated.splice(idx, 1)
                              setFormData({ ...formData, hook_sentences: updated })
                            }}
                            className="text-zinc-400 hover:text-rose-500 h-6 w-6 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Input
                            value={hookValue}
                            onChange={(e) => {
                              const updated = [...(formData.hook_sentences || [])]
                              updated[idx] = { hook: e.target.value, type: typeValue }
                              setFormData({ ...formData, hook_sentences: updated })
                            }}
                            placeholder="Hook cümlesi yazın..."
                            className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                          />
                          <Select
                            value={typeValue}
                            onValueChange={(val: 'question' | 'statistic' | 'emotion' | 'curiosity' | 'benefit') => {
                              const updated = [...(formData.hook_sentences || [])]
                              updated[idx] = { hook: hookValue, type: val }
                              setFormData({ ...formData, hook_sentences: updated })
                            }}
                          >
                            <SelectTrigger className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                              <SelectValue placeholder="Tür seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="question">Soru</SelectItem>
                              <SelectItem value="statistic">İstatistik</SelectItem>
                              <SelectItem value="emotion">Duygu</SelectItem>
                              <SelectItem value="curiosity">Merak</SelectItem>
                              <SelectItem value="benefit">Fayda</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newHook = { hook: '', type: 'question' as const }
                    setFormData({ ...formData, hook_sentences: [...(formData.hook_sentences || []), newHook] })
                  }}
                  className="w-full border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  + Hook Cümlesi Ekle
                </Button>
              </div>

              {/* ✅ CTA Standartları - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  CTA Standartları
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Call-to-action cümleleri">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                <div className="space-y-3 mb-4">
                  {(formData.cta_standards || []).map((item: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">CTA #{idx + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...(formData.cta_standards || [])]
                            updated.splice(idx, 1)
                            setFormData({ ...formData, cta_standards: updated })
                          }}
                          className="text-zinc-400 hover:text-rose-500 h-6 w-6 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Input
                          value={item.cta || ''}
                          onChange={(e) => {
                            const updated = [...(formData.cta_standards || [])]
                            updated[idx] = { ...updated[idx], cta: e.target.value }
                            setFormData({ ...formData, cta_standards: updated })
                          }}
                          placeholder="CTA metni (örn: Hemen İncele, Detaylar için tıkla)"
                          className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        />
                        <Input
                          value={item.context || ''}
                          onChange={(e) => {
                            const updated = [...(formData.cta_standards || [])]
                            updated[idx] = { ...updated[idx], context: e.target.value }
                            setFormData({ ...formData, cta_standards: updated })
                          }}
                          placeholder="Kullanım bağlamı (örn: Ürün tanıtımlarında)"
                          className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newCta = { cta: '', context: '' }
                    setFormData({ ...formData, cta_standards: [...(formData.cta_standards || []), newCta] })
                  }}
                  className="w-full border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  + CTA Ekle
                </Button>
              </div>

              {/* ✅ Kelime Dönüşümleri - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  Kelime Dönüşümleri
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Yanlış kullanımlar ve doğru karşılıkları">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                <div className="space-y-3 mb-4">
                  {(formData.word_mapping || []).map((item: any, idx: number) => {
                    // DB'de iki farklı yapı olabilir:
                    // Yeni: {avoid, use_instead}
                    // Eski: {wrong, correct}
                    const avoidValue = item.avoid || item.wrong || ''
                    const useInsteadValue = item.use_instead || item.correct || ''

                    return (
                      <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Dönüşüm #{idx + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = [...(formData.word_mapping || [])]
                              updated.splice(idx, 1)
                              setFormData({ ...formData, word_mapping: updated })
                            }}
                            className="text-zinc-400 hover:text-rose-500 h-6 w-6 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <Input
                            value={avoidValue}
                            onChange={(e) => {
                              const updated = [...(formData.word_mapping || [])]
                              updated[idx] = { avoid: e.target.value, use_instead: useInsteadValue }
                              setFormData({ ...formData, word_mapping: updated })
                            }}
                            placeholder="Yanlış/Kaçınılacak"
                            className="flex-1 bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400"
                          />
                          <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                          <Input
                            value={useInsteadValue}
                            onChange={(e) => {
                              const updated = [...(formData.word_mapping || [])]
                              updated[idx] = { avoid: avoidValue, use_instead: e.target.value }
                              setFormData({ ...formData, word_mapping: updated })
                            }}
                            placeholder="Doğru/Kullanılacak"
                            className="flex-1 bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newMapping = { avoid: '', use_instead: '' }
                    setFormData({ ...formData, word_mapping: [...(formData.word_mapping || []), newMapping] })
                  }}
                  className="w-full border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  + Kelime Dönüşümü Ekle
                </Button>
              </div>

              {/* ✅ İçerik Direkleri - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  İçerik Direkleri (Content Pillars)
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Ana içerik kategorileri ve yüzdeleri">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                <div className="space-y-3 mb-4">
                  {(formData.content_pillars || []).map((pillar: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-zinc-900 dark:text-white">{pillar.name || 'İçerik Direği'}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...(formData.content_pillars || [])]
                            updated.splice(idx, 1)
                            setFormData({ ...formData, content_pillars: updated })
                          }}
                          className="text-zinc-400 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {pillar.description && (
                        <p className="text-sm text-zinc-500 mb-2">{pillar.description}</p>
                      )}
                      {pillar.example_topics && pillar.example_topics.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {pillar.example_topics.map((topic: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newPillar = { name: '', description: '', example_topics: [] }
                    setFormData({ ...formData, content_pillars: [...(formData.content_pillars || []), newPillar] })
                  }}
                  className="w-full border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  + İçerik Direği Ekle
                </Button>
              </div>

              {/* ✅ Örnek Caption'lar - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  Örnek Caption'lar
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="İyi ve kötü caption örnekleri">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                {/* İyi Örnekler */}
                <div className="mb-4">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-2">İyi Örnekler</p>
                  <div className="space-y-2 mb-2">
                    {(formData.example_captions?.good_examples || []).map((example: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Textarea
                          value={example}
                          onChange={(e) => {
                            const updated = [...(formData.example_captions?.good_examples || [])]
                            updated[idx] = e.target.value
                            setFormData({ ...formData, example_captions: { ...formData.example_captions, good_examples: updated } })
                          }}
                          placeholder="İyi caption örneği..."
                          rows={2}
                          className="flex-1 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white resize-none"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...(formData.example_captions?.good_examples || [])]
                            updated.splice(idx, 1)
                            setFormData({ ...formData, example_captions: { ...formData.example_captions, good_examples: updated } })
                          }}
                          className="text-zinc-400 hover:text-rose-500 h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updated = [...(formData.example_captions?.good_examples || []), '']
                      setFormData({ ...formData, example_captions: { ...formData.example_captions, good_examples: updated } })
                    }}
                    className="border-dashed border-emerald-300 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400"
                  >
                    + İyi Örnek Ekle
                  </Button>
                </div>

                {/* Kötü Örnekler */}
                <div>
                  <p className="text-sm text-rose-600 dark:text-rose-400 font-medium mb-2">Kötü Örnekler (Kaçınılacak)</p>
                  <div className="space-y-2 mb-2">
                    {(formData.example_captions?.bad_examples || []).map((example: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Textarea
                          value={example}
                          onChange={(e) => {
                            const updated = [...(formData.example_captions?.bad_examples || [])]
                            updated[idx] = e.target.value
                            setFormData({ ...formData, example_captions: { ...formData.example_captions, bad_examples: updated } })
                          }}
                          placeholder="Kötü caption örneği..."
                          rows={2}
                          className="flex-1 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white resize-none"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...(formData.example_captions?.bad_examples || [])]
                            updated.splice(idx, 1)
                            setFormData({ ...formData, example_captions: { ...formData.example_captions, bad_examples: updated } })
                          }}
                          className="text-zinc-400 hover:text-rose-500 h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updated = [...(formData.example_captions?.bad_examples || []), '']
                      setFormData({ ...formData, example_captions: { ...formData.example_captions, bad_examples: updated } })
                    }}
                    className="border-dashed border-rose-300 dark:border-rose-600 text-rose-600 dark:text-rose-400"
                  >
                    + Kötü Örnek Ekle
                  </Button>
                </div>
              </div>

              {/* ✅ Platform Kuralları - AKTİF */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  Platform Kuralları
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Her platform için özel ayarlar">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                {/* Instagram Kuralları */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-purple-500/5 to-pink-500/5 mb-4">
                  <h4 className="font-medium text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="text-lg">📸</span> Instagram
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-zinc-500 mb-1.5 block">Haftalık Post</Label>
                      <Input
                        type="number"
                        value={formData.platform_rules?.instagram?.post_frequency || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          platform_rules: {
                            ...formData.platform_rules,
                            instagram: { ...formData.platform_rules?.instagram, post_frequency: parseInt(e.target.value) || 0 }
                          }
                        })}
                        placeholder="3"
                        className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-500 mb-1.5 block">Haftalık Reels</Label>
                      <Input
                        type="number"
                        value={formData.platform_rules?.instagram?.reels_per_week || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          platform_rules: {
                            ...formData.platform_rules,
                            instagram: { ...formData.platform_rules?.instagram, reels_per_week: parseInt(e.target.value) || 0 }
                          }
                        })}
                        placeholder="2"
                        className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-zinc-500 mb-1.5 block">En İyi Paylaşım Saatleri</Label>
                      <Input
                        value={formData.platform_rules?.instagram?.best_times || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          platform_rules: {
                            ...formData.platform_rules,
                            instagram: { ...formData.platform_rules?.instagram, best_times: e.target.value }
                          }
                        })}
                        placeholder="12:00, 18:00, 21:00"
                        className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-zinc-500 mb-1.5 block">Varsayılan Hashtagler</Label>
                      <Input
                        value={formData.platform_rules?.instagram?.hashtags || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          platform_rules: {
                            ...formData.platform_rules,
                            instagram: { ...formData.platform_rules?.instagram, hashtags: e.target.value }
                          }
                        })}
                        placeholder="#marka #sektör #trend"
                        className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-zinc-500 mb-1.5 block">Ton & Ses</Label>
                      <Select
                        value={formData.platform_rules?.instagram?.tone || ''}
                        onValueChange={(val) => setFormData({
                          ...formData,
                          platform_rules: {
                            ...formData.platform_rules,
                            instagram: { ...formData.platform_rules?.instagram, tone: val }
                          }
                        })}
                      >
                        <SelectTrigger className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                          <SelectValue placeholder="Ton seçin..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="casual">Günlük/Rahat</SelectItem>
                          <SelectItem value="professional">Profesyonel</SelectItem>
                          <SelectItem value="playful">Eğlenceli</SelectItem>
                          <SelectItem value="inspirational">İlham Verici</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Facebook Kuralları */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                  <h4 className="font-medium text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="text-lg">📘</span> Facebook
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-zinc-500 mb-1.5 block">Haftalık Post</Label>
                      <Input
                        type="number"
                        value={formData.platform_rules?.facebook?.post_frequency || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          platform_rules: {
                            ...formData.platform_rules,
                            facebook: { ...formData.platform_rules?.facebook, post_frequency: parseInt(e.target.value) || 0 }
                          }
                        })}
                        placeholder="2"
                        className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-500 mb-1.5 block">Öncelik</Label>
                      <Select
                        value={formData.platform_rules?.facebook?.priority || ''}
                        onValueChange={(val) => setFormData({
                          ...formData,
                          platform_rules: {
                            ...formData.platform_rules,
                            facebook: { ...formData.platform_rules?.facebook, priority: val }
                          }
                        })}
                      >
                        <SelectTrigger className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                          <SelectValue placeholder="Öncelik..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Yüksek</SelectItem>
                          <SelectItem value="medium">Orta</SelectItem>
                          <SelectItem value="low">Düşük</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ==================== SECTION 5: RAKİP ANALİZİ ==================== */}
      <div
        ref={(el) => { sectionRefs.current['rakipler'] = el }}
        className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 scroll-mt-32"
      >
        <SectionHeader
          section={BRIEF_SECTIONS_CONFIG.rakipler}
          isOpen={openSections.includes('rakipler')}
          onToggle={() => toggleSection('rakipler')}
          completion={getSectionCompletion('rakipler')}
        />
        {openSections.includes('rakipler') && (
          <div className="px-5 pb-5">
            <div className="pt-4 border-t border-zinc-200 dark:border-white/5 space-y-5">

              {/* Rakipler Listesi */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  Rakip Markalar
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Rekabet ettiğiniz markalar">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                {/* Mevcut Rakipler */}
                <div className="space-y-3 mb-4">
                  {(formData.competitors || []).map((competitor: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                            <span className="text-lg">🎯</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-zinc-900 dark:text-white">{competitor.name || 'İsimsiz Rakip'}</h4>
                            {competitor.instagram && (
                              <a href={`https://instagram.com/${competitor.instagram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-500 hover:underline">
                                {competitor.instagram.startsWith('@') ? competitor.instagram : `@${competitor.instagram}`}
                              </a>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...(formData.competitors || [])]
                            updated.splice(idx, 1)
                            setFormData({ ...formData, competitors: updated })
                          }}
                          className="text-zinc-400 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {competitor.instagram_followers && (
                        <div className="text-xs text-zinc-500 mb-2">
                          <span className="font-medium">{Number(competitor.instagram_followers).toLocaleString('tr-TR')}</span> takipçi
                        </div>
                      )}

                      {competitor.strengths && competitor.strengths.length > 0 && (
                        <div className="mb-2">
                          <span className="text-xs text-emerald-500 font-medium">Güçlü Yönleri:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {competitor.strengths.map((s: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {competitor.weaknesses && competitor.weaknesses.length > 0 && (
                        <div>
                          <span className="text-xs text-rose-500 font-medium">Zayıf Yönleri:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {competitor.weaknesses.map((w: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Yeni Rakip Ekleme Butonu */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newCompetitor = {
                      name: '',
                      instagram: '',
                      instagram_followers: null,
                      strengths: [],
                      weaknesses: []
                    }
                    setFormData({ ...formData, competitors: [...(formData.competitors || []), newCompetitor] })
                  }}
                  className="w-full border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  + Rakip Ekle
                </Button>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ==================== SECTION 6: ÖZEL GÜNLER & TAKVİM ==================== */}
      <div
        ref={(el) => { sectionRefs.current['ozel-gunler'] = el }}
        className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 scroll-mt-32"
      >
        <SectionHeader
          section={BRIEF_SECTIONS_CONFIG.ozelGunler}
          isOpen={openSections.includes('ozel-gunler')}
          onToggle={() => toggleSection('ozel-gunler')}
          completion={getSectionCompletion('ozel-gunler')}
        />
        {openSections.includes('ozel-gunler') && (
          <div className="px-5 pb-5">
            <div className="pt-4 border-t border-zinc-200 dark:border-white/5 space-y-5">

              {/* Özel Günler */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  Markaya Özel Günler
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Yıldönümü, lansman tarihi gibi özel günler">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                <div className="space-y-3 mb-4">
                  {(formData.special_events || []).map((event: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 flex items-center justify-center">
                          <span className="text-lg">📅</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-zinc-900 dark:text-white">{event.name || 'İsimsiz Etkinlik'}</h4>
                          {event.date && (
                            <span className="text-xs text-zinc-500">{event.date}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = [...(formData.special_events || [])]
                          updated.splice(idx, 1)
                          setFormData({ ...formData, special_events: updated })
                        }}
                        className="text-zinc-400 hover:text-rose-500"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newEvent = { name: '', date: '', description: '' }
                    setFormData({ ...formData, special_events: [...(formData.special_events || []), newEvent] })
                  }}
                  className="w-full border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  + Özel Gün Ekle
                </Button>
              </div>

              {/* Sezonsal Takvim */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  Sezonsal Takvim
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Yıl içindeki önemli dönemler">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                <div className="space-y-3 mb-4">
                  {(formData.seasonal_calendar || []).map((season: any, idx: number) => {
                    // DB'de iki farklı yapı olabilir:
                    // Yeni: {name, date_range, content_ideas}
                    // Eski: {month, season, themes, critical, opportunities}
                    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

                    const nameValue = season.name || (season.month ? `${monthNames[season.month - 1]} - ${season.season || ''}` : '')
                    const dateRangeValue = season.date_range || (season.month ? monthNames[season.month - 1] : '')
                    const ideasValue = season.content_ideas || season.themes || []
                    const notesValue = season.critical || (season.opportunities ? season.opportunities.join(', ') : '')

                    return (
                      <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-medium text-fuchsia-600 dark:text-fuchsia-400">Sezon #{idx + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = [...(formData.seasonal_calendar || [])]
                              updated.splice(idx, 1)
                              setFormData({ ...formData, seasonal_calendar: updated })
                            }}
                            className="text-zinc-400 hover:text-rose-500 h-6 w-6 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Input
                            value={nameValue}
                            onChange={(e) => {
                              const updated = [...(formData.seasonal_calendar || [])]
                              updated[idx] = { name: e.target.value, date_range: dateRangeValue, content_ideas: ideasValue }
                              setFormData({ ...formData, seasonal_calendar: updated })
                            }}
                            placeholder="Sezon adı (örn: Yaz Sezonu, Black Friday)"
                            className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                          />
                          <Input
                            value={dateRangeValue}
                            onChange={(e) => {
                              const updated = [...(formData.seasonal_calendar || [])]
                              updated[idx] = { name: nameValue, date_range: e.target.value, content_ideas: ideasValue }
                              setFormData({ ...formData, seasonal_calendar: updated })
                            }}
                            placeholder="Tarih aralığı (örn: Haziran - Ağustos)"
                            className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                          />
                          <Textarea
                            value={Array.isArray(ideasValue) ? ideasValue.join(', ') : ''}
                            onChange={(e) => {
                              const updated = [...(formData.seasonal_calendar || [])]
                              const ideas = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                              updated[idx] = { name: nameValue, date_range: dateRangeValue, content_ideas: ideas }
                              setFormData({ ...formData, seasonal_calendar: updated })
                            }}
                            placeholder="İçerik fikirleri (virgülle ayırın)"
                            rows={2}
                            className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white resize-none"
                          />
                          {notesValue && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 rounded-lg">
                              📌 {notesValue}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newSeason = { name: '', date_range: '', content_ideas: [], hashtags: [] }
                    setFormData({ ...formData, seasonal_calendar: [...(formData.seasonal_calendar || []), newSeason] })
                  }}
                  className="w-full border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  + Sezon Ekle
                </Button>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ==================== SECTION 7: RENKLER & FONTLAR ==================== */}
      <div
        ref={(el) => { sectionRefs.current['marka-assets'] = el }}
        className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 scroll-mt-32"
      >
        <SectionHeader
          section={BRIEF_SECTIONS_CONFIG.markaAssets}
          isOpen={openSections.includes('marka-assets')}
          onToggle={() => toggleSection('marka-assets')}
          completion={getSectionCompletion('marka-assets')}
        />
        {openSections.includes('marka-assets') && (
          <div className="px-5 pb-5">
            <div className="pt-4 border-t border-zinc-200 dark:border-white/5 space-y-5">

              {/* Marka Renkleri */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  Marka Renkleri
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Ana ve yardımcı marka renkleri">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Primary Color */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg border border-zinc-300 dark:border-zinc-600"
                        style={{ backgroundColor: (formData.brand_colors as any)?.primary || '#6366f1' }}
                      />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Ana Renk</span>
                    </div>
                    <Input
                      type="color"
                      value={(formData.brand_colors as any)?.primary || '#6366f1'}
                      onChange={(e) => setFormData({
                        ...formData,
                        brand_colors: { ...(formData.brand_colors as any), primary: e.target.value }
                      })}
                      className="w-full h-10 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-500 mt-1 block">
                      {(formData.brand_colors as any)?.primary || '#6366f1'}
                    </span>
                  </div>

                  {/* Secondary Color */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg border border-zinc-300 dark:border-zinc-600"
                        style={{ backgroundColor: (formData.brand_colors as any)?.secondary || '#ec4899' }}
                      />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Yardımcı Renk</span>
                    </div>
                    <Input
                      type="color"
                      value={(formData.brand_colors as any)?.secondary || '#ec4899'}
                      onChange={(e) => setFormData({
                        ...formData,
                        brand_colors: { ...(formData.brand_colors as any), secondary: e.target.value }
                      })}
                      className="w-full h-10 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-500 mt-1 block">
                      {(formData.brand_colors as any)?.secondary || '#ec4899'}
                    </span>
                  </div>

                  {/* Accent Color */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg border border-zinc-300 dark:border-zinc-600"
                        style={{ backgroundColor: (formData.brand_colors as any)?.accent || '#f59e0b' }}
                      />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Vurgu Renk</span>
                    </div>
                    <Input
                      type="color"
                      value={(formData.brand_colors as any)?.accent || '#f59e0b'}
                      onChange={(e) => setFormData({
                        ...formData,
                        brand_colors: { ...(formData.brand_colors as any), accent: e.target.value }
                      })}
                      className="w-full h-10 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-500 mt-1 block">
                      {(formData.brand_colors as any)?.accent || '#f59e0b'}
                    </span>
                  </div>

                  {/* Background Color */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg border border-zinc-300 dark:border-zinc-600"
                        style={{ backgroundColor: (formData.brand_colors as any)?.background || '#ffffff' }}
                      />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Arka Plan</span>
                    </div>
                    <Input
                      type="color"
                      value={(formData.brand_colors as any)?.background || '#ffffff'}
                      onChange={(e) => setFormData({
                        ...formData,
                        brand_colors: { ...(formData.brand_colors as any), background: e.target.value }
                      })}
                      className="w-full h-10 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-500 mt-1 block">
                      {(formData.brand_colors as any)?.background || '#ffffff'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Marka Fontları */}
              <div>
                <Label className="flex items-center gap-2 mb-3 text-zinc-700 dark:text-zinc-300">
                  Marka Fontları
                  <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Başlık ve metin fontları">
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </Label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Heading Font */}
                  <div>
                    <Label className="text-xs text-zinc-500 mb-1 block">Başlık Fontu</Label>
                    <Input
                      value={(formData.brand_fonts as any)?.heading || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        brand_fonts: { ...(formData.brand_fonts as any), heading: e.target.value }
                      })}
                      placeholder="Örn: Montserrat"
                      className="input-glow text-zinc-900 dark:text-white"
                    />
                  </div>

                  {/* Body Font */}
                  <div>
                    <Label className="text-xs text-zinc-500 mb-1 block">Metin Fontu</Label>
                    <Input
                      value={(formData.brand_fonts as any)?.body || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        brand_fonts: { ...(formData.brand_fonts as any), body: e.target.value }
                      })}
                      placeholder="Örn: Open Sans"
                      className="input-glow text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </form>
  )
}
