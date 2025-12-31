// @ts-nocheck
'use client'

import { useState, useEffect, useRef } from 'react'
import { Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BrandAssetsSection } from '../brand-assets-section'
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

// Main Form Props
interface CustomerBriefFormProps {
  customer?: Customer | null
  onSave: (data: CustomerFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function CustomerBriefForm({ customer, onSave, onCancel, isLoading }: CustomerBriefFormProps) {
  const [openSections, setOpenSections] = useState<string[]>(['marka-kimligi'])
  const [aiResearch, setAIResearch] = useState<AIResearchState>({
    isLoading: false, progress: 0, status: 'idle', error: null, filledFields: []
  })

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
  const [targetGender, setTargetGender] = useState<string[]>([])
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

  const toggleSection = (id: string) => {
    setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  // Section'a scroll et ve aç
  const scrollToSection = (sectionId: string) => {
    // Önce section'ı aç (kapalıysa)
    if (!openSections.includes(sectionId)) {
      setOpenSections(prev => [...prev, sectionId])
    }

    // Biraz bekle ki DOM güncellensin, sonra scroll et
    setTimeout(() => {
      const element = sectionRefs.current[sectionId]
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  // Calculate section completions
  const getSectionCompletion = (sectionId: string) => {
    switch (sectionId) {
      case 'marka-kimligi':
        return {
          filled: [
            formData.name,
            formData.slogan,
            formData.brand_values?.length,
            formData.brand_voice,
            Object.keys(formData.social_media || {}).length,
            formData.mission,
            formData.vision,
            formData.usp
          ].filter(Boolean).length,
          total: 8
        }
      case 'hedef-kitle':
        return {
          filled: [
            formData.target_age_range,
            targetGender.length,
            formData.target_audience,
            formData.target_geography
          ].filter(Boolean).length,
          total: 4
        }
      case 'urun-hizmet':
        return {
          filled: [
            formData.top_products?.length,
            formData.product_categories?.length,
            formData.price_segment,
            bestSellers,
            priceRange.min || priceRange.max
          ].filter(Boolean).length,
          total: 5
        }
      case 'rakipler':
        return {
          filled: [
            formData.competitors?.length,
            differentiation
          ].filter(Boolean).length,
          total: 2
        }
      case 'kurallar':
        return {
          filled: [
            formData.do_not_do?.length,
            hashtagPreference !== 'medium',
            emojiPreference !== 'moderate',
            formData.must_emphasize?.length
          ].filter(Boolean).length,
          total: 4
        }
      case 'ozel-gunler':
        return {
          filled: [
            selectedHolidays.length,
            formData.special_events?.length
          ].filter(Boolean).length,
          total: 2
        }
      case 'marka-assets':
        // Renk/Font section completion
        const colors = formData.brand_colors as BrandColors || {}
        const fonts = formData.brand_fonts as BrandFonts || {}
        return {
          filled: [
            colors.primary,
            colors.secondary,
            colors.accent,
            fonts.corporate?.heading || fonts.web?.heading
          ].filter(Boolean).length,
          total: 4
        }
      default:
        return { filled: 0, total: 0 }
    }
  }

  // Include brand assets section in progress
  const allSectionsProgress = [
    ...Object.values(BRIEF_SECTIONS_CONFIG).map(section => ({
      label: section.label,
      id: section.id,
      ...getSectionCompletion(section.id)
    })),
    {
      label: 'Renkler & Fontlar',
      id: 'marka-assets',
      ...getSectionCompletion('marka-assets')
    }
  ]

  const totalFilled = allSectionsProgress.reduce((acc, s) => acc + s.filled, 0)
  const totalFields = allSectionsProgress.reduce((acc, s) => acc + s.total, 0)
  const overallPercentage = totalFields > 0 ? Math.round((totalFilled / totalFields) * 100) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  // Handle brand assets change
  const handleBrandAssetsChange = (colors: BrandColors, fonts: BrandFonts) => {
    setFormData(prev => ({
      ...prev,
      brand_colors: colors,
      brand_fonts: fonts
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Progress Overview - Tıklanabilir */}
      <ProgressOverview
        sections={allSectionsProgress}
        onSectionClick={scrollToSection}
      />

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

              {/* Marka Adı */}
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

              {/* Slogan */}
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

              {/* Marka Değerleri */}
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

              {/* Marka Sesi - UI Kit HTML ile UYUMLU emoji'ler */}
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

              {/* Misyon - YENİ ALAN */}
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

              {/* Vizyon - YENİ ALAN */}
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

              {/* USP - YENİ ALAN */}
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

              {/* Sosyal Medya */}
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

              {/* Yaş Aralığı */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Yaş Aralığı</Label>
                <Input
                  value={formData.target_age_range || ''}
                  onChange={(e) => setFormData({ ...formData, target_age_range: e.target.value })}
                  placeholder="Örn: 25-45"
                  className="input-glow text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              {/* Cinsiyet */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Cinsiyet</Label>
                <div className="flex gap-3">
                  <label className="flex-1 relative cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={targetGender.includes('female')}
                      onChange={() => {
                        if (targetGender.includes('female')) {
                          setTargetGender(targetGender.filter(g => g !== 'female'))
                        } else {
                          setTargetGender([...targetGender, 'female'])
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
                      checked={targetGender.includes('male')}
                      onChange={() => {
                        if (targetGender.includes('male')) {
                          setTargetGender(targetGender.filter(g => g !== 'male'))
                        } else {
                          setTargetGender([...targetGender, 'male'])
                        }
                      }}
                    />
                    <div className="p-3 rounded-xl border-2 border-zinc-200 dark:border-white/10 peer-checked:border-violet-500 peer-checked:bg-violet-50 dark:peer-checked:bg-violet-500/10 text-center transition-all">
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">Erkek</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Hedef Kitle Açıklaması */}
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

              {/* Lokasyon */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Lokasyon</Label>
                <Input
                  value={formData.target_geography || ''}
                  onChange={(e) => setFormData({ ...formData, target_geography: e.target.value })}
                  placeholder="Örn: Türkiye geneli, özellikle büyükşehirler"
                  className="input-glow text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
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

              {/* Ana Ürünler */}
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

              {/* Fiyat Aralığı */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Fiyat Aralığı</Label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">₺</span>
                    <Input
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      placeholder="Min"
                      className="input-glow pl-8 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                  <span className="text-zinc-400 dark:text-zinc-500">—</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">₺</span>
                    <Input
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      placeholder="Max"
                      className="input-glow pl-8 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                </div>
              </div>

              {/* En Çok Satan */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">En Çok Satan Ürünler</Label>
                <Textarea
                  value={bestSellers}
                  onChange={(e) => setBestSellers(e.target.value)}
                  placeholder="Hangi ürünler en çok satıyor? İçerik üretiminde öncelik verilebilir."
                  className="input-glow resize-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  rows={2}
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ==================== SECTION 4: RAKİPLER ==================== */}
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

              {/* Rakipler */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Ana Rakipler</Label>
                <TagInput
                  value={(formData.competitors || []).map(c => typeof c === 'string' ? c : c.name)}
                  onChange={(v) => setFormData({ ...formData, competitors: v.map(name => ({ name, website: '', notes: '' })) })}
                  placeholder="+ Rakip ekle..."
                  colorClass="amber"
                />
              </div>

              {/* Rakiplerden Farkınız */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Rakiplerden Farkınız</Label>
                <Textarea
                  value={differentiation}
                  onChange={(e) => setDifferentiation(e.target.value)}
                  placeholder="Rakiplerinizden sizi ayıran özellikler neler?"
                  className="input-glow resize-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  rows={2}
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ==================== SECTION 5: KURALLAR ==================== */}
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

              {/* Kullanılmaması Gereken Kelimeler */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Kullanılmaması Gereken Kelimeler</Label>
                <TagInput
                  value={formData.do_not_do || []}
                  onChange={(v) => setFormData({ ...formData, do_not_do: v })}
                  placeholder="+ Kelime ekle..."
                  colorClass="rose"
                />
              </div>

              {/* Hashtag Tercihi */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Hashtag Tercihi</Label>
                <Select value={hashtagPreference} onValueChange={setHashtagPreference}>
                  <SelectTrigger className="input-glow text-zinc-900 dark:text-white">
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

              {/* Emoji Tercihi */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Emoji Kullanımı</Label>
                <div className="grid grid-cols-3 gap-3">
                  <OptionCard
                    label="Hiç"
                    selected={emojiPreference === 'none'}
                    onChange={() => setEmojiPreference('none')}
                    colorClass="rose"
                  />
                  <OptionCard
                    label="Az"
                    selected={emojiPreference === 'moderate'}
                    onChange={() => setEmojiPreference('moderate')}
                    colorClass="rose"
                  />
                  <OptionCard
                    label="Çok"
                    selected={emojiPreference === 'many'}
                    onChange={() => setEmojiPreference('many')}
                    colorClass="rose"
                  />
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ==================== SECTION 6: ÖZEL GÜNLER ==================== */}
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

              {/* Genel Özel Günler */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">İçerik Üretilecek Özel Günler</Label>
                <div className="grid grid-cols-3 gap-2">
                  {GENERAL_HOLIDAYS.map((holiday) => (
                    <label key={holiday.id} className="relative cursor-pointer">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={selectedHolidays.includes(holiday.id)}
                        onChange={() => {
                          if (selectedHolidays.includes(holiday.id)) {
                            setSelectedHolidays(selectedHolidays.filter(h => h !== holiday.id))
                          } else {
                            setSelectedHolidays([...selectedHolidays, holiday.id])
                          }
                        }}
                      />
                      <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-white/10 peer-checked:border-fuchsia-500 peer-checked:bg-fuchsia-50 dark:peer-checked:bg-fuchsia-500/10 text-center text-xs font-medium text-zinc-700 dark:text-zinc-300 peer-checked:text-fuchsia-700 dark:peer-checked:text-fuchsia-400 transition-all">
                        {holiday.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Markaya Özel Tarihler */}
              <div>
                <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Markaya Özel Tarihler</Label>
                <Textarea
                  value={(formData.special_events || []).map(e => typeof e === 'string' ? e : e.name).join('\n')}
                  onChange={(e) => setFormData({
                    ...formData,
                    special_events: e.target.value.split('\n').filter(Boolean).map(name => ({ name, date: '', description: '' }))
                  })}
                  placeholder="Örn: Kuruluş yıldönümü (15 Mart), mağaza açılışları..."
                  className="input-glow resize-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  rows={2}
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ==================== SECTION 7: MARKA RENK & FONTLAR ==================== */}
      <div ref={(el) => { sectionRefs.current['marka-assets'] = el }} className="scroll-mt-32">
        <BrandAssetsSection
          colors={(formData.brand_colors as BrandColors) || {}}
          fonts={(formData.brand_fonts as BrandFonts) || {}}
          onChange={handleBrandAssetsChange}
        />
      </div>

      {/* Form - hidden submit için */}
      {/* Kaydet butonu artık sağ sidebar'da, bu form submit için gerekli */}

    </form>
  )
}
