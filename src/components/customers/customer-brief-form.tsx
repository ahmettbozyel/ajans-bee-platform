// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { 
  Building2, Phone, Share2, Sparkles, Users, Package, 
  Target, ShieldCheck, Calendar, ChevronDown, ChevronRight,
  Bot, Plus, X, Check, Globe, Instagram, Facebook, Linkedin,
  Youtube, Twitter, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { 
  Customer, 
  CustomerFormData, 
  SocialMediaData, 
  Competitor,
  SpecialEvent,
  BrandVoice,
  BusinessType,
  PriceSegment
} from '@/lib/customer-types'
import { 
  SECTORS, 
  BRAND_VOICES, 
  BUSINESS_TYPES, 
  PRICE_SEGMENTS,
  BRIEF_SECTIONS,
  calculateBriefCompletion,
  calculateSectionCompletion
} from '@/lib/customer-types'

// =====================================================
// COLLAPSIBLE SECTION COMPONENT
// =====================================================
interface SectionProps {
  id: string
  title: string
  icon: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  completion: number
  children: React.ReactNode
}

function CollapsibleSection({ id, title, icon, isOpen, onToggle, completion, children }: SectionProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">{icon}</div>
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          {completion > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    completion === 100 ? "bg-green-500" : "bg-primary"
                  )}
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8">{completion}%</span>
            </div>
          )}
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t bg-background">
          {children}
        </div>
      )}
    </div>
  )
}

// =====================================================
// PROGRESS INDICATOR
// =====================================================
interface ProgressIndicatorProps {
  percentage: number
}

function ProgressIndicator({ percentage }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Brief Tamamlanma</span>
          <span className="text-sm text-muted-foreground">{percentage}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              percentage < 30 ? "bg-red-500" :
              percentage < 60 ? "bg-yellow-500" :
              percentage < 90 ? "bg-blue-500" : "bg-green-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      {percentage === 100 && (
        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
          <Check className="h-4 w-4 text-green-600" />
        </div>
      )}
    </div>
  )
}

// =====================================================
// TAG INPUT COMPONENT (for arrays)
// =====================================================
interface TagInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()])
      }
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:bg-muted rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Yazın ve Enter'a basın"}
      />
    </div>
  )
}

// =====================================================
// COMPETITOR INPUT COMPONENT
// =====================================================
interface CompetitorInputProps {
  value: Competitor[]
  onChange: (value: Competitor[]) => void
}

function CompetitorInput({ value, onChange }: CompetitorInputProps) {
  const [newCompetitor, setNewCompetitor] = useState('')

  const addCompetitor = () => {
    if (newCompetitor.trim()) {
      onChange([...value, { name: newCompetitor.trim(), strengths: [] }])
      setNewCompetitor('')
    }
  }

  const removeCompetitor = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateCompetitorStrength = (index: number, strength: string) => {
    const updated = [...value]
    if (!updated[index].strengths.includes(strength)) {
      updated[index].strengths = [...updated[index].strengths, strength]
      onChange(updated)
    }
  }

  return (
    <div className="space-y-3">
      {value.map((competitor, index) => (
        <div key={index} className="p-3 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{competitor.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeCompetitor(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Input
            placeholder="Instagram handle (opsiyonel)"
            value={competitor.instagram_handle || ''}
            onChange={(e) => {
              const updated = [...value]
              updated[index].instagram_handle = e.target.value
              onChange(updated)
            }}
            className="mb-2"
          />
          <TagInput
            value={competitor.strengths}
            onChange={(strengths) => {
              const updated = [...value]
              updated[index].strengths = strengths
              onChange(updated)
            }}
            placeholder="Güçlü yönleri (Enter ile ekle)"
          />
        </div>
      ))}
      
      <div className="flex gap-2">
        <Input
          value={newCompetitor}
          onChange={(e) => setNewCompetitor(e.target.value)}
          placeholder="Rakip adı"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
        />
        <Button type="button" variant="outline" onClick={addCompetitor}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// =====================================================
// SOCIAL MEDIA INPUT COMPONENT
// =====================================================
interface SocialMediaInputProps {
  value: SocialMediaData
  onChange: (value: SocialMediaData) => void
}

function SocialMediaInput({ value, onChange }: SocialMediaInputProps) {
  const platforms = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, prefix: '@' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, prefix: '/' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, prefix: '/' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, prefix: '@' },
    { key: 'tiktok', label: 'TikTok', icon: Globe, prefix: '@' },
    { key: 'twitter', label: 'Twitter/X', icon: Twitter, prefix: '@' }
  ] as const

  return (
    <div className="space-y-3">
      {platforms.map(({ key, label, icon: Icon, prefix }) => (
        <div key={key} className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-28 text-muted-foreground">
            <Icon className="h-4 w-4" />
            <span className="text-sm">{label}</span>
          </div>
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {prefix}
              </span>
              <Input
                value={value[key]?.handle || ''}
                onChange={(e) => onChange({
                  ...value,
                  [key]: { ...value[key], handle: e.target.value }
                })}
                placeholder="kullanici_adi"
                className="pl-7"
              />
            </div>
            <Input
              type="number"
              value={value[key]?.followers || ''}
              onChange={(e) => onChange({
                ...value,
                [key]: { ...value[key], followers: parseInt(e.target.value) || undefined }
              })}
              placeholder="Takipçi"
              className="w-28"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// =====================================================
// SPECIAL EVENT INPUT COMPONENT
// =====================================================
interface SpecialEventInputProps {
  value: SpecialEvent[]
  onChange: (value: SpecialEvent[]) => void
}

function SpecialEventInput({ value, onChange }: SpecialEventInputProps) {
  const [newEvent, setNewEvent] = useState({ date: '', name: '', notes: '' })

  const addEvent = () => {
    if (newEvent.name.trim() && newEvent.date) {
      onChange([...value, { ...newEvent, recurring: false }])
      setNewEvent({ date: '', name: '', notes: '' })
    }
  }

  const removeEvent = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {value.map((event, index) => (
        <div key={index} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/30">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{event.date}</Badge>
              <span className="font-medium">{event.name}</span>
            </div>
            {event.notes && (
              <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeEvent(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />
        <Input
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          placeholder="Etkinlik adı"
        />
        <Button type="button" variant="outline" onClick={addEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Ekle
        </Button>
      </div>
    </div>
  )
}

// =====================================================
// MAIN FORM COMPONENT
// =====================================================
interface CustomerBriefFormProps {
  customer?: Customer | null
  onSave: (data: CustomerFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function CustomerBriefForm({ customer, onSave, onCancel, isLoading }: CustomerBriefFormProps) {
  // Open sections state
  const [openSections, setOpenSections] = useState<string[]>(['temel'])
  
  // Form data
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    brand_name: '',
    website_url: '',
    sector: '',
    sub_sector: '',
    business_type: null,
    brand_voice: 'samimi',
    email: '',
    phone: '',
    location: '',
    social_media: {},
    brand_description: '',
    mission: '',
    vision: '',
    slogan: '',
    usp: '',
    target_audience: '',
    target_age_range: '',
    target_geography: '',
    product_categories: [],
    top_products: [],
    price_segment: null,
    competitors: [],
    do_not_do: [],
    must_emphasize: [],
    special_events: []
  })

  // Initialize form with customer data
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
        special_events: customer.special_events || []
      })
    }
  }, [customer])

  // Toggle section
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  // Calculate completion
  const completion = calculateBriefCompletion(formData)

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  // Section icons mapping
  const sectionIcons: Record<string, React.ReactNode> = {
    temel: <Building2 className="h-4 w-4" />,
    iletisim: <Phone className="h-4 w-4" />,
    sosyal: <Share2 className="h-4 w-4" />,
    marka: <Sparkles className="h-4 w-4" />,
    hedef: <Users className="h-4 w-4" />,
    urun: <Package className="h-4 w-4" />,
    rekabet: <Target className="h-4 w-4" />,
    kurallar: <ShieldCheck className="h-4 w-4" />,
    takvim: <Calendar className="h-4 w-4" />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Progress Indicator */}
      <ProgressIndicator percentage={completion} />

      {/* AI Button (Disabled for now) */}
      <Button
        type="button"
        variant="secondary"
        className="w-full justify-start gap-3 h-auto py-3"
        disabled
      >
        <Bot className="h-5 w-5" />
        <div className="text-left">
          <div className="font-medium">Eksikleri AI ile Tamamla</div>
          <div className="text-xs text-muted-foreground">
            Website varsa önerilir • ~30-60 saniye (Yakında)
          </div>
        </div>
      </Button>

      <Separator />

      {/* SECTION: Temel Bilgiler */}
      <CollapsibleSection
        id="temel"
        title="Temel Bilgiler"
        icon={sectionIcons.temel}
        isOpen={openSections.includes('temel')}
        onToggle={() => toggleSection('temel')}
        completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.temelBilgiler.fields)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Müşteri Adı *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: Karaca Zeytinyağı"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website_url"
                  value={formData.website_url || ''}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Website girerseniz AI otomatik bilgi toplayabilir
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sector">Sektör *</Label>
              <Select
                value={formData.sector || ''}
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
              <Label htmlFor="sub_sector">Alt Sektör</Label>
              <Input
                id="sub_sector"
                value={formData.sub_sector || ''}
                onChange={(e) => setFormData({ ...formData, sub_sector: e.target.value })}
                placeholder="Örn: Zeytinyağı"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>İş Tipi</Label>
            <RadioGroup
              value={formData.business_type || ''}
              onValueChange={(value) => setFormData({ ...formData, business_type: value as BusinessType })}
              className="flex flex-wrap gap-4"
            >
              {BUSINESS_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={`business-${type.value}`} />
                  <Label htmlFor={`business-${type.value}`} className="font-normal cursor-pointer">
                    {type.label}
                    <span className="text-xs text-muted-foreground ml-1">({type.description})</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Marka Sesi</Label>
            <RadioGroup
              value={formData.brand_voice || 'samimi'}
              onValueChange={(value) => setFormData({ ...formData, brand_voice: value as BrandVoice })}
              className="grid grid-cols-2 gap-2"
            >
              {BRAND_VOICES.map((voice) => (
                <div key={voice.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={voice.value} id={`voice-${voice.value}`} />
                  <Label htmlFor={`voice-${voice.value}`} className="font-normal cursor-pointer">
                    {voice.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </CollapsibleSection>

      {/* SECTION: İletişim */}
      <CollapsibleSection
        id="iletisim"
        title="İletişim"
        icon={sectionIcons.iletisim}
        isOpen={openSections.includes('iletisim')}
        onToggle={() => toggleSection('iletisim')}
        completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.iletisim.fields)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="info@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+90 555 123 4567"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="location">Konum</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="İzmir, Türkiye"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* SECTION: Sosyal Medya */}
      <CollapsibleSection
        id="sosyal"
        title="Sosyal Medya"
        icon={sectionIcons.sosyal}
        isOpen={openSections.includes('sosyal')}
        onToggle={() => toggleSection('sosyal')}
        completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.sosyalMedya.fields)}
      >
        <SocialMediaInput
          value={formData.social_media || {}}
          onChange={(social_media) => setFormData({ ...formData, social_media })}
        />
      </CollapsibleSection>

      {/* SECTION: Marka Kimliği */}
      <CollapsibleSection
        id="marka"
        title="Marka Kimliği"
        icon={sectionIcons.marka}
        isOpen={openSections.includes('marka')}
        onToggle={() => toggleSection('marka')}
        completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.markaKimligi.fields)}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand_description">Marka Açıklaması</Label>
            <Textarea
              id="brand_description"
              value={formData.brand_description || ''}
              onChange={(e) => setFormData({ ...formData, brand_description: e.target.value })}
              placeholder="Markanın hikayesi, değerleri, farkı..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mission">Misyon</Label>
              <Textarea
                id="mission"
                value={formData.mission || ''}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                placeholder="Markanın misyonu"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vision">Vizyon</Label>
              <Textarea
                id="vision"
                value={formData.vision || ''}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                placeholder="Markanın vizyonu"
                rows={2}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slogan">Slogan</Label>
              <Input
                id="slogan"
                value={formData.slogan || ''}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                placeholder="Markanın sloganı"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usp">USP (Benzersiz Satış Noktası)</Label>
              <Input
                id="usp"
                value={formData.usp || ''}
                onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
                placeholder="Markayı öne çıkaran şey"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* SECTION: Hedef Kitle */}
      <CollapsibleSection
        id="hedef"
        title="Hedef Kitle"
        icon={sectionIcons.hedef}
        isOpen={openSections.includes('hedef')}
        onToggle={() => toggleSection('hedef')}
        completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.hedefKitle.fields)}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target_audience">Hedef Kitle Tanımı</Label>
            <Textarea
              id="target_audience"
              value={formData.target_audience || ''}
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
              placeholder="Örn: 30-55 yaş arası, sağlıklı beslenmeye önem veren ev hanımları ve gurme yemek meraklıları"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_age_range">Yaş Aralığı</Label>
              <Input
                id="target_age_range"
                value={formData.target_age_range || ''}
                onChange={(e) => setFormData({ ...formData, target_age_range: e.target.value })}
                placeholder="Örn: 25-45"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_geography">Coğrafi Hedef</Label>
              <Input
                id="target_geography"
                value={formData.target_geography || ''}
                onChange={(e) => setFormData({ ...formData, target_geography: e.target.value })}
                placeholder="Örn: Türkiye geneli, İzmir bölgesi"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* SECTION: Ürün Bilgileri */}
      <CollapsibleSection
        id="urun"
        title="Ürün Bilgileri"
        icon={sectionIcons.urun}
        isOpen={openSections.includes('urun')}
        onToggle={() => toggleSection('urun')}
        completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.urunBilgileri.fields)}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Ürün Kategorileri</Label>
            <TagInput
              value={formData.product_categories || []}
              onChange={(product_categories) => setFormData({ ...formData, product_categories })}
              placeholder="Kategori yazın ve Enter'a basın"
            />
          </div>
          <div className="space-y-2">
            <Label>Öne Çıkan Ürünler</Label>
            <TagInput
              value={formData.top_products || []}
              onChange={(top_products) => setFormData({ ...formData, top_products })}
              placeholder="Ürün adı yazın ve Enter'a basın"
            />
          </div>
          <div className="space-y-2">
            <Label>Fiyat Segmenti</Label>
            <Select
              value={formData.price_segment || ''}
              onValueChange={(value) => setFormData({ ...formData, price_segment: value as PriceSegment })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Segment seçin..." />
              </SelectTrigger>
              <SelectContent>
                {PRICE_SEGMENTS.map((segment) => (
                  <SelectItem key={segment.value} value={segment.value}>
                    {segment.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleSection>

      {/* SECTION: Rekabet */}
      <CollapsibleSection
        id="rekabet"
        title="Rekabet Analizi"
        icon={sectionIcons.rekabet}
        isOpen={openSections.includes('rekabet')}
        onToggle={() => toggleSection('rekabet')}
        completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.rekabet.fields)}
      >
        <CompetitorInput
          value={formData.competitors || []}
          onChange={(competitors) => setFormData({ ...formData, competitors })}
        />
      </CollapsibleSection>

      {/* SECTION: Kurallar */}
      <CollapsibleSection
        id="kurallar"
        title="İçerik Kuralları"
        icon={sectionIcons.kurallar}
        isOpen={openSections.includes('kurallar')}
        onToggle={() => toggleSection('kurallar')}
        completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.kurallar.fields)}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-red-600">🚫 Yapılmaması Gerekenler</Label>
            <TagInput
              value={formData.do_not_do || []}
              onChange={(do_not_do) => setFormData({ ...formData, do_not_do })}
              placeholder="Örn: Rakip markalardan bahsetme"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-green-600">✅ Vurgulanması Gerekenler</Label>
            <TagInput
              value={formData.must_emphasize || []}
              onChange={(must_emphasize) => setFormData({ ...formData, must_emphasize })}
              placeholder="Örn: Doğallık, yerli üretim"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* SECTION: Takvim */}
      <CollapsibleSection
        id="takvim"
        title="Özel Günler & Takvim"
        icon={sectionIcons.takvim}
        isOpen={openSections.includes('takvim')}
        onToggle={() => toggleSection('takvim')}
        completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.takvim.fields)}
      >
        <SpecialEventInput
          value={formData.special_events || []}
          onChange={(special_events) => setFormData({ ...formData, special_events })}
        />
      </CollapsibleSection>

      <Separator />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          İptal
        </Button>
        <Button type="submit" disabled={isLoading || !formData.name} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Kaydediliyor...
            </>
          ) : customer ? (
            'Güncelle'
          ) : (
            'Müşteri Ekle'
          )}
        </Button>
      </div>
    </form>
  )
}
