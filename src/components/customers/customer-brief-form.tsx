// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { 
  Fingerprint, Users, Package, Swords, ShieldAlert, CalendarHeart,
  ChevronDown, Bot, Plus, X, Check, Globe, Instagram, Facebook, Linkedin,
  Youtube, Twitter, Loader2, AlertCircle, Save, Info, ListChecks, CheckCircle, Circle, CircleDot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { 
  Customer, 
  CustomerFormData, 
  SocialMediaData, 
  Competitor,
  SpecialEvent,
  BrandVoice,
  BusinessType,
  PriceSegment,
  CustomerType,
  CustomerStatus
} from '@/lib/customer-types'
import { 
  SECTORS, 
  BRAND_VOICES, 
  CUSTOMER_TYPES,
  CUSTOMER_STATUSES,
  calculateBriefCompletion
} from '@/lib/customer-types'

const AI_RESEARCH_ENDPOINT = 'https://n8n.beeswebsite.com/webhook/ai-research'

// 6 Bölüm yapısı - UI Kit v1.0 HTML ile UYUMLU
const BRIEF_SECTIONS_CONFIG = {
  markaKimligi: {
    id: 'marka-kimligi',
    label: 'Marka Kimliği',
    description: 'Logo, slogan, değerler ve marka sesi',
    icon: 'Fingerprint',
    color: 'indigo',
    fields: ['name', 'slogan', 'brand_values', 'brand_voice', 'social_media']
  },
  hedefKitle: {
    id: 'hedef-kitle',
    label: 'Hedef Kitle',
    description: 'Yaş, cinsiyet ve demografik bilgiler',
    icon: 'Users',
    color: 'violet',
    fields: ['target_age_range', 'target_gender', 'target_audience', 'target_geography']
  },
  urunHizmet: {
    id: 'urun-hizmet',
    label: 'Ürün / Hizmet',
    description: 'Ana ürünler, kategoriler ve fiyat aralığı',
    icon: 'Package',
    color: 'cyan',
    fields: ['top_products', 'product_categories', 'price_segment', 'best_sellers']
  },
  rakipler: {
    id: 'rakipler',
    label: 'Rakip Analizi',
    description: 'Rakip markalar ve farklılaşma noktaları',
    icon: 'Swords',
    color: 'amber',
    fields: ['competitors', 'differentiation']
  },
  kurallar: {
    id: 'kurallar',
    label: 'İçerik Kuralları',
    description: 'Yapılmaması gerekenler ve dikkat edilecekler',
    icon: 'ShieldAlert',
    color: 'rose',
    fields: ['do_not_do', 'hashtag_preference', 'emoji_preference', 'must_emphasize']
  },
  ozelGunler: {
    id: 'ozel-gunler',
    label: 'Özel Günler',
    description: 'Marka için önemli tarihler',
    icon: 'CalendarHeart',
    color: 'fuchsia',
    fields: ['general_holidays', 'special_events']
  }
} as const

// Genel Özel Günler listesi
const GENERAL_HOLIDAYS = [
  { id: 'valentines', label: 'Sevgililer Günü', date: '14 Şubat' },
  { id: 'mothers', label: 'Anneler Günü', date: 'Mayıs 2. Pazar' },
  { id: 'fathers', label: 'Babalar Günü', date: 'Haziran 3. Pazar' },
  { id: 'newyear', label: 'Yılbaşı', date: '31 Aralık' },
  { id: 'blackfriday', label: 'Black Friday', date: 'Kasım son Cuma' },
  { id: 'ramadan', label: 'Ramazan', date: 'Değişken' }
]

interface AIResearchState {
  isLoading: boolean
  progress: number
  status: 'idle' | 'researching' | 'analyzing' | 'completing' | 'done' | 'error'
  error: string | null
  filledFields: string[]
}

// Section Header Component - UI Kit HTML ile UYUMLU
interface SectionHeaderProps {
  section: typeof BRIEF_SECTIONS_CONFIG[keyof typeof BRIEF_SECTIONS_CONFIG]
  isOpen: boolean
  onToggle: () => void
  completion: { filled: number; total: number }
}

function SectionHeader({ section, isOpen, onToggle, completion }: SectionHeaderProps) {
  const isComplete = completion.filled === completion.total
  const percentage = completion.total > 0 ? Math.round((completion.filled / completion.total) * 100) : 0
  
  // HTML ile uyumlu ikon mapping
  const iconMap = {
    Fingerprint: <Fingerprint className="w-5 h-5" />,
    Users: <Users className="w-5 h-5" />,
    Package: <Package className="w-5 h-5" />,
    Swords: <Swords className="w-5 h-5" />,
    ShieldAlert: <ShieldAlert className="w-5 h-5" />,
    CalendarHeart: <CalendarHeart className="w-5 h-5" />
  }

  // HTML ile uyumlu renk mapping
  const colorClasses = {
    indigo: { 
      bg: 'bg-indigo-100 dark:bg-indigo-500/10', 
      text: 'text-indigo-600 dark:text-indigo-400' 
    },
    violet: { 
      bg: 'bg-violet-100 dark:bg-violet-500/10', 
      text: 'text-violet-600 dark:text-violet-400' 
    },
    cyan: { 
      bg: 'bg-cyan-100 dark:bg-cyan-500/10', 
      text: 'text-cyan-600 dark:text-cyan-400' 
    },
    amber: { 
      bg: 'bg-amber-100 dark:bg-amber-500/10', 
      text: 'text-amber-600 dark:text-amber-400' 
    },
    rose: { 
      bg: 'bg-rose-100 dark:bg-rose-500/10', 
      text: 'text-rose-600 dark:text-rose-400' 
    },
    fuchsia: { 
      bg: 'bg-fuchsia-100 dark:bg-fuchsia-500/10', 
      text: 'text-fuchsia-600 dark:text-fuchsia-400' 
    }
  }

  const colors = colorClasses[section.color as keyof typeof colorClasses]

  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", colors.bg)}>
          <span className={colors.text}>{iconMap[section.icon as keyof typeof iconMap]}</span>
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-zinc-900 dark:text-white">{section.label}</h3>
          <p className="text-xs text-zinc-500">{section.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isComplete ? (
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium">
            Tamamlandı
          </span>
        ) : (
          <span className={cn(
            "text-xs px-2.5 py-1 rounded-full font-medium",
            percentage >= 70 ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400" :
            percentage >= 30 ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" :
            "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          )}>
            {completion.filled}/{completion.total} alan
          </span>
        )}
        <ChevronDown className={cn(
          "w-5 h-5 text-zinc-400 transition-transform",
          isOpen && "rotate-180"
        )} />
      </div>
    </button>
  )
}

// Progress Overview Grid - UI Kit HTML ile UYUMLU
function ProgressOverview({ sections }: { sections: { label: string; filled: number; total: number }[] }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-indigo-500" />
          Brief Bölümleri
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">6 bölüm</span>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {sections.map((section, i) => {
          const isComplete = section.filled === section.total
          const percentage = section.total > 0 ? Math.round((section.filled / section.total) * 100) : 0
          
          // HTML ile UYUMLU renk mantığı
          let colorClass = 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
          let iconColorClass = 'text-amber-600 dark:text-amber-400'
          let textColorClass = 'text-amber-700 dark:text-amber-400'
          let Icon = Circle
          
          if (isComplete) {
            // EMERALD - Tamamlandı
            colorClass = 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
            iconColorClass = 'text-emerald-600 dark:text-emerald-400'
            textColorClass = 'text-emerald-700 dark:text-emerald-400'
            Icon = CheckCircle
          } else if (percentage >= 50) {
            // CYAN - %50+ ama tamamlanmamış
            colorClass = 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20'
            iconColorClass = 'text-cyan-600 dark:text-cyan-400'
            textColorClass = 'text-cyan-700 dark:text-cyan-400'
            Icon = CircleDot
          }
          // Default: AMBER - %50'den az
          
          return (
            <div key={i} className={cn("text-center p-3 rounded-xl border", colorClass)}>
              <Icon className={cn("w-5 h-5 mx-auto mb-1", iconColorClass)} />
              <p className={cn("text-[10px] font-medium", textColorClass)}>{section.label}</p>
              <p className={cn("text-[10px] font-mono", textColorClass.replace('700', '600').replace('400', '500'))}>
                {section.filled}/{section.total}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Tag Input Component
function TagInput({ 
  value, 
  onChange, 
  placeholder,
  colorClass = 'indigo'
}: { 
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  colorClass?: 'indigo' | 'cyan' | 'amber' | 'rose' | 'fuchsia'
}) {
  const [inputValue, setInputValue] = useState('')
  
  const colors = {
    indigo: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
    cyan: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400',
    amber: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
    rose: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400',
    fuchsia: 'bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400'
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()])
      }
      setInputValue('')
    }
  }
  
  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, i) => (
            <span key={i} className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm", colors[colorClass])}>
              {tag}
              <button type="button" onClick={() => onChange(value.filter(t => t !== tag))} className="hover:opacity-70">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
        onKeyDown={handleKeyDown} 
        placeholder={placeholder || "+ Yeni ekle..."} 
        className="input-glow bg-zinc-50 dark:bg-white/[0.02] border-dashed text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
      />
    </div>
  )
}

// Option Card Component - UI Kit HTML ile UYUMLU
function OptionCard({ 
  label, 
  emoji, 
  selected, 
  onChange,
  type = 'radio',
  colorClass = 'indigo'
}: { 
  label: string
  emoji?: string
  selected: boolean
  onChange: () => void
  type?: 'radio' | 'checkbox'
  colorClass?: 'indigo' | 'violet' | 'fuchsia' | 'rose'
}) {
  const borderColor = {
    indigo: 'peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10',
    violet: 'peer-checked:border-violet-500 peer-checked:bg-violet-50 dark:peer-checked:bg-violet-500/10',
    fuchsia: 'peer-checked:border-fuchsia-500 peer-checked:bg-fuchsia-50 dark:peer-checked:bg-fuchsia-500/10',
    rose: 'peer-checked:border-rose-500 peer-checked:bg-rose-50 dark:peer-checked:bg-rose-500/10'
  }
  
  return (
    <label className="relative cursor-pointer">
      <input 
        type={type} 
        className="peer sr-only" 
        checked={selected}
        onChange={onChange}
      />
      <div className={cn(
        "p-3 rounded-xl border-2 border-zinc-200 dark:border-white/10 text-center transition-all",
        borderColor[colorClass]
      )}>
        {emoji && <span className="text-lg mb-1 block">{emoji}</span>}
        <span className="text-sm font-medium text-zinc-900 dark:text-white">{label}</span>
      </div>
    </label>
  )
}

// Social Media Input - UI Kit HTML ile UYUMLU (prefix görünür)
function SocialMediaInput({ value, onChange }: { value: SocialMediaData; onChange: (v: SocialMediaData) => void }) {
  const platforms = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, prefix: '@' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, prefix: '/' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, prefix: '/' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, prefix: '@' },
    { key: 'twitter', label: 'Twitter/X', icon: Twitter, prefix: '@' }
  ] as const
  
  return (
    <div className="space-y-3">
      {platforms.map(({ key, label, icon: Icon, prefix }) => (
        <div key={key} className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-28 text-zinc-500 dark:text-zinc-400">
            <Icon className="h-4 w-4" />
            <span className="text-sm">{label}</span>
          </div>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 text-sm font-medium">{prefix}</span>
            <Input 
              value={value[key]?.handle || ''} 
              onChange={(e) => onChange({ ...value, [key]: { ...value[key], handle: e.target.value } })} 
              placeholder="kullanici_adi" 
              className="input-glow pl-8 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Main Form Props
interface CustomerBriefFormProps {
  customer?: Customer | null
  onSave: (data: CustomerFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function CustomerBriefForm({ customer, onSave, onCancel, isLoading }: CustomerBriefFormProps) {
  const supabase = createClient()
  const [openSections, setOpenSections] = useState<string[]>(['marka-kimligi'])
  const [aiResearch, setAIResearch] = useState<AIResearchState>({ 
    isLoading: false, progress: 0, status: 'idle', error: null, filledFields: [] 
  })
  
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
            Object.keys(formData.social_media || {}).length
          ].filter(Boolean).length,
          total: 5
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
      default:
        return { filled: 0, total: 0 }
    }
  }

  const allSectionsProgress = Object.values(BRIEF_SECTIONS_CONFIG).map(section => ({
    label: section.label,
    ...getSectionCompletion(section.id)
  }))

  const totalFilled = allSectionsProgress.reduce((acc, s) => acc + s.filled, 0)
  const totalFields = allSectionsProgress.reduce((acc, s) => acc + s.total, 0)
  const overallPercentage = totalFields > 0 ? Math.round((totalFilled / totalFields) * 100) : 0

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault()
    await onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Progress Overview */}
      <ProgressOverview sections={allSectionsProgress} />
      
      {/* ==================== SECTION 1: MARKA KİMLİĞİ ==================== */}
      <div className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50">
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
      <div className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50">
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
      <div className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50">
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
      <div className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50">
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
      <div className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50">
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
      <div className="section-card rounded-2xl overflow-hidden transition-all border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50">
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
      
      {/* Form - hidden submit için */}
      {/* Kaydet butonu artık sağ sidebar'da, bu form submit için gerekli */}
      
    </form>
  )
}
