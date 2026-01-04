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
  BrandFonts
} from '@/lib/customer-types'
import { BRAND_VOICES } from '@/lib/customer-types'

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

// Disabled Section Component
function DisabledSection({ title, icon, description }: { title: string; icon: string; description: string }) {
  return (
    <div className="section-card rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 opacity-60">
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">{title}</h3>
            <p className="text-xs text-zinc-500">{description}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
          <Lock className="w-3 h-3" />
          Faz 2'de Aktif
        </span>
      </div>
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
      case 'ozel-gunler':
      case 'marka-assets':
        return { filled: 0, total: 0 }
      default:
        return { filled: 0, total: 0 }
    }
  }

  const allSectionsProgress = [
    { label: 'Marka Kimliği', id: 'marka-kimligi', ...getSectionCompletion('marka-kimligi') },
    { label: 'Hedef Kitle', id: 'hedef-kitle', ...getSectionCompletion('hedef-kitle') },
    { label: 'Ürün/Hizmet', id: 'urun-hizmet', ...getSectionCompletion('urun-hizmet') },
    { label: 'İçerik Kuralları', id: 'kurallar', ...getSectionCompletion('kurallar') }
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
                  value={formData.sector || ''}
                  onValueChange={(value) => setFormData({ ...formData, sector: value })}
                >
                  <SelectTrigger className="input-glow text-zinc-900 dark:text-white">
                    <SelectValue placeholder="Sektör seçin..." />
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

              {/* 🔒 Misyon - DISABLED */}
              <DisabledField>
                <div>
                  <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                    Misyon
                    <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Markanın var oluş amacı, ne için çalıştığı">
                      <Info className="w-3.5 h-3.5" />
                    </span>
                  </Label>
                  <Textarea
                    value={formData.mission || ''}
                    disabled
                    placeholder="Örn: Müşterilerimize en kaliteli pırlantaları en güvenilir şekilde sunmak..."
                    className="input-glow resize-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 cursor-not-allowed"
                    rows={2}
                  />
                </div>
              </DisabledField>

              {/* 🔒 Vizyon - DISABLED */}
              <DisabledField>
                <div>
                  <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                    Vizyon
                    <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Markanın gelecekte ulaşmak istediği nokta">
                      <Info className="w-3.5 h-3.5" />
                    </span>
                  </Label>
                  <Textarea
                    value={formData.vision || ''}
                    disabled
                    placeholder="Örn: Türkiye'nin en güvenilir mücevher markası olmak..."
                    className="input-glow resize-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 cursor-not-allowed"
                    rows={2}
                  />
                </div>
              </DisabledField>

              {/* 🔒 USP - DISABLED */}
              <DisabledField>
                <div>
                  <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                    USP (Benzersiz Satış Vaadi)
                    <span className="text-zinc-400 dark:text-zinc-500 cursor-help" title="Markayı rakiplerinden ayıran en önemli özellik">
                      <Info className="w-3.5 h-3.5" />
                    </span>
                  </Label>
                  <Textarea
                    value={formData.usp || ''}
                    disabled
                    placeholder="Örn: Türkiye'nin en güvenilir pırlanta markası, tüm ürünlerde GIA sertifikası garantisi"
                    className="input-glow resize-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 cursor-not-allowed"
                    rows={2}
                  />
                </div>
              </DisabledField>

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

              {/* 🔒 Lokasyon - DISABLED */}
              <DisabledField>
                <div>
                  <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Lokasyon</Label>
                  <Input
                    value={formData.target_geography || ''}
                    disabled
                    placeholder="Örn: Türkiye geneli, özellikle büyükşehirler"
                    className="input-glow text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 cursor-not-allowed"
                  />
                </div>
              </DisabledField>

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

              {/* 🔒 Hashtag Tercihi - DISABLED */}
              <DisabledField>
                <div>
                  <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Hashtag Tercihi</Label>
                  <Select value={hashtagPreference} disabled>
                    <SelectTrigger className="input-glow text-zinc-900 dark:text-white cursor-not-allowed">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="few">Az hashtag (3-5 adet)</SelectItem>
                      <SelectItem value="medium">Orta (5-10 adet)</SelectItem>
                      <SelectItem value="many">Çok (10+ adet)</SelectItem>
                      <SelectItem value="none">Hashtag kullanma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DisabledField>

              {/* 🔒 Emoji Tercihi - DISABLED */}
              <DisabledField>
                <div>
                  <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Emoji Kullanımı</Label>
                  <div className="grid grid-cols-3 gap-3 pointer-events-none">
                    <OptionCard
                      label="Hiç"
                      selected={emojiPreference === 'none'}
                      onChange={() => {}}
                      colorClass="rose"
                    />
                    <OptionCard
                      label="Az"
                      selected={emojiPreference === 'moderate'}
                      onChange={() => {}}
                      colorClass="rose"
                    />
                    <OptionCard
                      label="Çok"
                      selected={emojiPreference === 'many'}
                      onChange={() => {}}
                      colorClass="rose"
                    />
                  </div>
                </div>
              </DisabledField>

            </div>
          </div>
        )}
      </div>

      {/* ==================== 🔒 DISABLED SECTIONS ==================== */}
      
      <DisabledSection 
        title="Rakip Analizi" 
        icon="🎯" 
        description="Rakip takibi ve karşılaştırmalı analiz"
      />

      <DisabledSection 
        title="Özel Günler & Takvim" 
        icon="📅" 
        description="İçerik takvimi ve özel gün planlaması"
      />

      <DisabledSection 
        title="Renkler & Fontlar" 
        icon="🎨" 
        description="Marka görsel kimliği"
      />

    </form>
  )
}
