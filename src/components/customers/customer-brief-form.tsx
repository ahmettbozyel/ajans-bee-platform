// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { 
  Building2, Phone, Share2, Sparkles, Users, Package, 
  Target, ShieldCheck, Calendar, ChevronDown, ChevronRight,
  Bot, Plus, X, Check, Globe, Instagram, Facebook, Linkedin,
  Youtube, Twitter, Loader2, Heart, Layers, Settings, FileText,
  BookOpen, Palette, Link, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  ContentPillar,
  PlatformRules,
  WordMapping,
  CustomerType,
  CustomerStatus
} from '@/lib/customer-types'
import { 
  SECTORS, 
  BRAND_VOICES, 
  BUSINESS_TYPES, 
  PRICE_SEGMENTS,
  CUSTOMER_TYPES,
  CUSTOMER_STATUSES,
  BRIEF_SECTIONS,
  calculateBriefCompletion,
  calculateSectionCompletion
} from '@/lib/customer-types'

const AI_RESEARCH_ENDPOINT = 'https://n8n.beeswebsite.com/webhook/ai-research'

interface AIResearchState {
  isLoading: boolean
  progress: number
  status: 'idle' | 'researching' | 'analyzing' | 'completing' | 'done' | 'error'
  error: string | null
  filledFields: string[]
}

interface SectionProps {
  id: string
  title: string
  icon: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  completion: number
  children: React.ReactNode
  badge?: string
  hasAIContent?: boolean
}

function CollapsibleSection({ id, title, icon, isOpen, onToggle, completion, children, badge, hasAIContent }: SectionProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <button type="button" onClick={onToggle} className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">{icon}</div>
          <span className="font-medium">{title}</span>
          {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
          {hasAIContent && <Bot className="h-4 w-4 text-primary" />}
        </div>
        <div className="flex items-center gap-3">
          {completion > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", completion === 100 ? "bg-green-500" : "bg-primary")} style={{ width: `${completion}%` }} />
              </div>
              <span className="text-xs text-muted-foreground w-8">{completion}%</span>
            </div>
          )}
          {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>
      {isOpen && <div className="px-4 pb-4 pt-2 border-t bg-background">{children}</div>}
    </div>
  )
}

function ProgressIndicator({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Brief Tamamlanma</span>
          <span className="text-sm text-muted-foreground">{percentage}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-500", percentage < 30 ? "bg-red-500" : percentage < 60 ? "bg-yellow-500" : percentage < 90 ? "bg-blue-500" : "bg-green-500")} style={{ width: `${percentage}%` }} />
        </div>
      </div>
      {percentage === 100 && <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full"><Check className="h-4 w-4 text-green-600" /></div>}
    </div>
  )
}

function AIResearchProgress({ state }: { state: AIResearchState }) {
  const statusMessages = { idle: '', researching: '🔍 Web araştırması yapılıyor...', analyzing: '🧠 Veriler analiz ediliyor...', completing: '✍️ Brief tamamlanıyor...', done: '✅ Tamamlandı!', error: '❌ Hata oluştu' }
  return (
    <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium">{statusMessages[state.status]}</p>
          <p className="text-xs text-muted-foreground">Bu işlem 2-3 dakika sürebilir</p>
        </div>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${state.progress}%` }} />
      </div>
    </div>
  )
}

function TagInput({ value, onChange, placeholder, hasAIContent }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; hasAIContent?: boolean }) {
  const [inputValue, setInputValue] = useState('')
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      if (!value.includes(inputValue.trim())) onChange([...value, inputValue.trim()])
      setInputValue('')
    }
  }
  return (
    <div className="space-y-2">
      {hasAIContent && <div className="flex items-center gap-1 text-xs text-primary"><Bot className="h-3 w-3" /><span>AI tarafından önerildi</span></div>}
      <div className="flex flex-wrap gap-2">
        {value.map((tag, i) => (
          <Badge key={i} variant="secondary" className="gap-1 pr-1">{tag}<button type="button" onClick={() => onChange(value.filter(t => t !== tag))} className="ml-1 hover:bg-muted rounded-full p-0.5"><X className="h-3 w-3" /></button></Badge>
        ))}
      </div>
      <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder || "Yazın ve Enter'a basın"} />
    </div>
  )
}

function CompetitorInput({ value, onChange }: { value: Competitor[]; onChange: (v: Competitor[]) => void }) {
  const [newCompetitor, setNewCompetitor] = useState('')
  const addCompetitor = () => { if (newCompetitor.trim()) { onChange([...value, { name: newCompetitor.trim(), strengths: [] }]); setNewCompetitor('') } }
  return (
    <div className="space-y-3">
      {value.map((c, i) => (
        <div key={i} className="p-3 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-2"><span className="font-medium">{c.name}</span><Button type="button" variant="ghost" size="sm" onClick={() => onChange(value.filter((_, idx) => idx !== i))}><X className="h-4 w-4" /></Button></div>
          <Input placeholder="Instagram handle" value={c.instagram_handle || ''} onChange={(e) => { const u = [...value]; u[i].instagram_handle = e.target.value; onChange(u) }} className="mb-2" />
          <TagInput value={c.strengths} onChange={(s) => { const u = [...value]; u[i].strengths = s; onChange(u) }} placeholder="Güçlü yönleri" />
        </div>
      ))}
      <div className="flex gap-2">
        <Input value={newCompetitor} onChange={(e) => setNewCompetitor(e.target.value)} placeholder="Rakip adı" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetitor())} />
        <Button type="button" variant="outline" onClick={addCompetitor}><Plus className="h-4 w-4" /></Button>
      </div>
    </div>
  )
}

function SocialMediaInput({ value, onChange }: { value: SocialMediaData; onChange: (v: SocialMediaData) => void }) {
  const platforms = [{ key: 'instagram', label: 'Instagram', icon: Instagram, prefix: '@' }, { key: 'facebook', label: 'Facebook', icon: Facebook, prefix: '/' }, { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, prefix: '/' }, { key: 'youtube', label: 'YouTube', icon: Youtube, prefix: '@' }, { key: 'tiktok', label: 'TikTok', icon: Globe, prefix: '@' }, { key: 'twitter', label: 'Twitter/X', icon: Twitter, prefix: '@' }] as const
  return (
    <div className="space-y-3">
      {platforms.map(({ key, label, icon: Icon, prefix }) => (
        <div key={key} className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-28 text-muted-foreground"><Icon className="h-4 w-4" /><span className="text-sm">{label}</span></div>
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{prefix}</span><Input value={value[key]?.handle || ''} onChange={(e) => onChange({ ...value, [key]: { ...value[key], handle: e.target.value } })} placeholder="kullanici_adi" className="pl-7" /></div>
            <Input type="number" value={value[key]?.followers || ''} onChange={(e) => onChange({ ...value, [key]: { ...value[key], followers: parseInt(e.target.value) || undefined } })} placeholder="Takipçi" className="w-28" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SpecialEventInput({ value, onChange }: { value: SpecialEvent[]; onChange: (v: SpecialEvent[]) => void }) {
  const [newEvent, setNewEvent] = useState({ date: '', name: '', notes: '' })
  const addEvent = () => { if (newEvent.name.trim() && newEvent.date) { onChange([...value, { ...newEvent, recurring: false }]); setNewEvent({ date: '', name: '', notes: '' }) } }
  return (
    <div className="space-y-3">
      {value.map((e, i) => (
        <div key={i} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/30">
          <div className="flex-1"><div className="flex items-center gap-2"><Badge variant="outline">{e.date}</Badge><span className="font-medium">{e.name}</span></div>{e.notes && <p className="text-sm text-muted-foreground mt-1">{e.notes}</p>}</div>
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(value.filter((_, idx) => idx !== i))}><X className="h-4 w-4" /></Button>
        </div>
      ))}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
        <Input value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} placeholder="Etkinlik adı" />
        <Button type="button" variant="outline" onClick={addEvent}><Plus className="h-4 w-4 mr-2" />Ekle</Button>
      </div>
    </div>
  )
}

function ContentPillarInput({ value, onChange }: { value: ContentPillar[]; onChange: (v: ContentPillar[]) => void }) {
  const [newPillar, setNewPillar] = useState({ name: '', description: '' })
  const addPillar = () => { if (newPillar.name.trim()) { onChange([...value, { ...newPillar, example_topics: [] }]); setNewPillar({ name: '', description: '' }) } }
  return (
    <div className="space-y-3">
      {value.map((p, i) => (
        <div key={i} className="p-3 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-2"><span className="font-medium">{p.name}</span><Button type="button" variant="ghost" size="sm" onClick={() => onChange(value.filter((_, idx) => idx !== i))}><X className="h-4 w-4" /></Button></div>
          <p className="text-sm text-muted-foreground mb-2">{p.description}</p>
          <TagInput value={p.example_topics || []} onChange={(t) => { const u = [...value]; u[i].example_topics = t; onChange(u) }} placeholder="Örnek konular" />
        </div>
      ))}
      <div className="space-y-2 p-3 border rounded-lg border-dashed">
        <Input value={newPillar.name} onChange={(e) => setNewPillar({ ...newPillar, name: e.target.value })} placeholder="Sütun adı" />
        <Textarea value={newPillar.description} onChange={(e) => setNewPillar({ ...newPillar, description: e.target.value })} placeholder="Açıklama" rows={2} />
        <Button type="button" variant="outline" onClick={addPillar} className="w-full"><Plus className="h-4 w-4 mr-2" />İçerik Sütunu Ekle</Button>
      </div>
    </div>
  )
}

function PlatformRulesInput({ value, onChange }: { value: PlatformRules; onChange: (v: PlatformRules) => void }) {
  const platforms = ['instagram', 'linkedin', 'facebook'] as const
  return (
    <div className="space-y-4">
      {platforms.map((p) => (
        <div key={p} className="p-3 border rounded-lg">
          <h4 className="font-medium capitalize mb-3">{p}</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Caption Uzunluğu</Label><Input value={value[p]?.caption_length || ''} onChange={(e) => onChange({ ...value, [p]: { ...value[p], caption_length: e.target.value } })} placeholder="150-300 karakter" /></div>
            <div className="space-y-1"><Label className="text-xs">Emoji Sayısı</Label><Input value={value[p]?.emoji_count || ''} onChange={(e) => onChange({ ...value, [p]: { ...value[p], emoji_count: e.target.value } })} placeholder="3-5" /></div>
            <div className="space-y-1"><Label className="text-xs">Hashtag Sayısı</Label><Input value={value[p]?.hashtag_count || ''} onChange={(e) => onChange({ ...value, [p]: { ...value[p], hashtag_count: e.target.value } })} placeholder="5-10" /></div>
            <div className="space-y-1"><Label className="text-xs">CTA Stili</Label><Input value={value[p]?.cta_style || ''} onChange={(e) => onChange({ ...value, [p]: { ...value[p], cta_style: e.target.value } })} placeholder="Soru sor" /></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function WordMappingInput({ value, onChange }: { value: WordMapping[]; onChange: (v: WordMapping[]) => void }) {
  const [newMapping, setNewMapping] = useState({ avoid: '', use_instead: '' })
  const addMapping = () => { if (newMapping.avoid.trim() && newMapping.use_instead.trim()) { onChange([...value, newMapping]); setNewMapping({ avoid: '', use_instead: '' }) } }
  return (
    <div className="space-y-3">
      {value.map((m, i) => (
        <div key={i} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/30">
          <Badge variant="destructive" className="shrink-0">{m.avoid}</Badge><span className="text-muted-foreground">→</span><Badge variant="default" className="shrink-0">{m.use_instead}</Badge><div className="flex-1" />
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(value.filter((_, idx) => idx !== i))}><X className="h-4 w-4" /></Button>
        </div>
      ))}
      <div className="flex gap-2">
        <Input value={newMapping.avoid} onChange={(e) => setNewMapping({ ...newMapping, avoid: e.target.value })} placeholder="Kullanma" className="flex-1" />
        <Input value={newMapping.use_instead} onChange={(e) => setNewMapping({ ...newMapping, use_instead: e.target.value })} placeholder="Yerine kullan" className="flex-1" />
        <Button type="button" variant="outline" onClick={addMapping}><Plus className="h-4 w-4" /></Button>
      </div>
    </div>
  )
}

interface CustomerBriefFormProps {
  customer?: Customer | null
  onSave: (data: CustomerFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function CustomerBriefForm({ customer, onSave, onCancel, isLoading }: CustomerBriefFormProps) {
  const supabase = createClient()
  const [openSections, setOpenSections] = useState<string[]>(['temel'])
  const [aiResearch, setAIResearch] = useState<AIResearchState>({ isLoading: false, progress: 0, status: 'idle', error: null, filledFields: [] })
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '', brand_name: '', website_url: '', sector: '', sub_sector: '', business_type: null, brand_voice: 'samimi',
    customer_type: 'project', status: 'active',
    email: '', phone: '', location: '', social_media: {}, brand_description: '', mission: '', vision: '', slogan: '', usp: '',
    target_audience: '', target_age_range: '', target_geography: '', product_categories: [], top_products: [], price_segment: null,
    competitors: [], do_not_do: [], must_emphasize: [], special_events: [], brand_values: [], buying_motivations: [],
    content_pillars: [], platform_rules: {}, example_captions: { good_examples: [], bad_examples: [] }, word_mapping: [],
    brand_colors: {}, brand_fonts: {}, brand_assets: {}, integrations: {}, pain_points: [], hook_sentences: [],
    cta_standards: [], forbidden_words: [], seasonal_calendar: []
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '', brand_name: customer.brand_name || '', website_url: customer.website_url || '',
        sector: customer.sector || '', sub_sector: customer.sub_sector || '', business_type: customer.business_type || null,
        brand_voice: customer.brand_voice || 'samimi',
        customer_type: customer.customer_type || 'project', status: customer.status || 'active',
        email: customer.email || '', phone: customer.phone || '',
        location: customer.location || '', social_media: customer.social_media || {}, brand_description: customer.brand_description || '',
        mission: customer.mission || '', vision: customer.vision || '', slogan: customer.slogan || '', usp: customer.usp || '',
        target_audience: customer.target_audience || '', target_age_range: customer.target_age_range || '',
        target_geography: customer.target_geography || '', product_categories: customer.product_categories || [],
        top_products: customer.top_products || [], price_segment: customer.price_segment || null, competitors: customer.competitors || [],
        do_not_do: customer.do_not_do || [], must_emphasize: customer.must_emphasize || [], special_events: customer.special_events || [],
        brand_values: customer.brand_values || [], buying_motivations: customer.buying_motivations || [],
        content_pillars: customer.content_pillars || [], platform_rules: customer.platform_rules || {},
        example_captions: customer.example_captions || { good_examples: [], bad_examples: [] }, word_mapping: customer.word_mapping || [],
        brand_colors: customer.brand_colors || {}, brand_fonts: customer.brand_fonts || {}, brand_assets: customer.brand_assets || {},
        integrations: customer.integrations || {}, pain_points: customer.pain_points || [], hook_sentences: customer.hook_sentences || [],
        cta_standards: customer.cta_standards || [], forbidden_words: customer.forbidden_words || [], seasonal_calendar: customer.seasonal_calendar || []
      })
    }
  }, [customer])

  const toggleSection = (id: string) => setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  const completion = calculateBriefCompletion(formData)
  const hasAIContent = (field: string) => aiResearch.filledFields.includes(field)

  const handleAIResearch = async () => {
    if (!customer?.id) { setAIResearch(prev => ({ ...prev, error: 'Müşteri kaydedilmeli' })); return }
    if (!formData.website_url) { setAIResearch(prev => ({ ...prev, error: 'Website URL gerekli' })); return }
    const initialResearchDate = customer.ai_research_date
    setAIResearch({ isLoading: true, progress: 10, status: 'researching', error: null, filledFields: [] })
    fetch(AI_RESEARCH_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer_id: customer.id, company_name: formData.name, website_url: formData.website_url, sector: formData.sector || 'diger' }) }).catch(() => {})
    let attempts = 0
    const pollInterval = setInterval(async () => {
      attempts++
      const progressValue = Math.min(10 + (attempts * 2.5), 95)
      let statusValue: 'researching' | 'analyzing' | 'completing' = 'researching'
      if (progressValue > 30) statusValue = 'analyzing'
      if (progressValue > 60) statusValue = 'completing'
      setAIResearch(prev => ({ ...prev, progress: progressValue, status: statusValue }))
      const { data: updated } = await supabase.from('customers').select('*').eq('id', customer.id).single()
      if (updated?.ai_research_date && updated.ai_research_date !== initialResearchDate) {
        clearInterval(pollInterval)
        const filledFields: string[] = []
        const updates: Partial<typeof formData> = {}
        if (updated.brand_description) { updates.brand_description = updated.brand_description; filledFields.push('brand_description') }
        if (updated.mission) { updates.mission = updated.mission; filledFields.push('mission') }
        if (updated.vision) { updates.vision = updated.vision; filledFields.push('vision') }
        if (updated.usp) { updates.usp = updated.usp; filledFields.push('usp') }
        if (updated.target_audience) { updates.target_audience = updated.target_audience; filledFields.push('target_audience') }
        if (updated.competitors?.length) { updates.competitors = updated.competitors; filledFields.push('competitors') }
        if (updated.content_pillars?.length) { updates.content_pillars = updated.content_pillars; filledFields.push('content_pillars') }
        setFormData(prev => ({ ...prev, ...updates }))
        setAIResearch({ isLoading: false, progress: 100, status: 'done', error: null, filledFields })
        return
      }
      if (attempts >= 36) { clearInterval(pollInterval); setAIResearch({ isLoading: false, progress: 0, status: 'error', error: 'Zaman aşımı. Sayfayı yenileyin.', filledFields: [] }) }
    }, 10000)
  }

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); await onSave(formData) }

  const sectionIcons: Record<string, React.ReactNode> = {
    temel: <Building2 className="h-4 w-4" />, iletisim: <Phone className="h-4 w-4" />, sosyal: <Share2 className="h-4 w-4" />,
    marka: <Sparkles className="h-4 w-4" />, hedef: <Users className="h-4 w-4" />, urun: <Package className="h-4 w-4" />,
    rekabet: <Target className="h-4 w-4" />, kurallar: <ShieldCheck className="h-4 w-4" />, takvim: <Calendar className="h-4 w-4" />,
    degerler: <Heart className="h-4 w-4" />, strateji: <Layers className="h-4 w-4" />, platform: <Settings className="h-4 w-4" />,
    ornekler: <FileText className="h-4 w-4" />, kelime: <BookOpen className="h-4 w-4" />, gorseller: <Palette className="h-4 w-4" />,
    entegrasyon: <Link className="h-4 w-4" />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProgressIndicator percentage={completion} />
      {aiResearch.isLoading ? <AIResearchProgress state={aiResearch} /> : (
        <Button type="button" variant="secondary" className="w-full justify-start gap-3 h-auto py-3" onClick={handleAIResearch} disabled={!customer?.id || !formData.website_url || isLoading}>
          <Bot className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Eksikleri AI ile Tamamla</div>
            <div className="text-xs text-muted-foreground">{!customer?.id ? 'Önce müşteriyi kaydedin' : !formData.website_url ? 'Website URL gerekli' : 'Website varsa önerilir • ~2-3 dakika'}</div>
          </div>
        </Button>
      )}
      {aiResearch.error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{aiResearch.error}</AlertDescription></Alert>}
      {aiResearch.status === 'done' && aiResearch.filledFields.length > 0 && <Alert><Bot className="h-4 w-4" /><AlertDescription>AI {aiResearch.filledFields.length} alan doldurdu. Kontrol edip kaydedin.</AlertDescription></Alert>}
      <Separator />

      <CollapsibleSection id="temel" title="Temel Bilgiler" icon={sectionIcons.temel} isOpen={openSections.includes('temel')} onToggle={() => toggleSection('temel')} completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.temelBilgiler.fields)}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="name">Marka Adı *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Örn: Karaca Zeytinyağı" required /></div>
            <div className="space-y-2"><Label htmlFor="website_url">Website URL</Label><div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="website_url" value={formData.website_url || ''} onChange={(e) => setFormData({ ...formData, website_url: e.target.value })} placeholder="https://example.com" className="pl-9" /></div><p className="text-xs text-muted-foreground">💡 Website girerseniz AI otomatik bilgi toplayabilir</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Müşteri Tipi *</Label><Select value={formData.customer_type || 'project'} onValueChange={(v) => setFormData({ ...formData, customer_type: v as CustomerType })}><SelectTrigger><SelectValue placeholder="Tip seçin..." /></SelectTrigger><SelectContent>{CUSTOMER_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label} <span className="text-muted-foreground text-xs">({t.description})</span></SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Durum</Label><Select value={formData.status || 'active'} onValueChange={(v) => setFormData({ ...formData, status: v as CustomerStatus })}><SelectTrigger><SelectValue placeholder="Durum seçin..." /></SelectTrigger><SelectContent>{CUSTOMER_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label} <span className="text-muted-foreground text-xs">({s.description})</span></SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Sektör *</Label><Select value={formData.sector || ''} onValueChange={(v) => setFormData({ ...formData, sector: v })}><SelectTrigger><SelectValue placeholder="Sektör seçin..." /></SelectTrigger><SelectContent>{SECTORS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Alt Sektör</Label><Input value={formData.sub_sector || ''} onChange={(e) => setFormData({ ...formData, sub_sector: e.target.value })} placeholder="Örn: Zeytinyağı" /></div>
          </div>
          <div className="space-y-2"><Label>İş Tipi</Label><RadioGroup value={formData.business_type || ''} onValueChange={(v) => setFormData({ ...formData, business_type: v as BusinessType })} className="flex flex-wrap gap-4">{BUSINESS_TYPES.map((t) => <div key={t.value} className="flex items-center space-x-2"><RadioGroupItem value={t.value} id={`business-${t.value}`} /><Label htmlFor={`business-${t.value}`} className="font-normal cursor-pointer">{t.label}<span className="text-xs text-muted-foreground ml-1">({t.description})</span></Label></div>)}</RadioGroup></div>
          <div className="space-y-2"><Label>Marka Sesi</Label><RadioGroup value={formData.brand_voice || 'samimi'} onValueChange={(v) => setFormData({ ...formData, brand_voice: v as BrandVoice })} className="grid grid-cols-2 gap-2">{BRAND_VOICES.map((v) => <div key={v.value} className="flex items-center space-x-2"><RadioGroupItem value={v.value} id={`voice-${v.value}`} /><Label htmlFor={`voice-${v.value}`} className="font-normal cursor-pointer">{v.label}</Label></div>)}</RadioGroup></div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="iletisim" title="İletişim" icon={sectionIcons.iletisim} isOpen={openSections.includes('iletisim')} onToggle={() => toggleSection('iletisim')} completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.iletisim.fields)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>E-posta</Label><Input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="info@example.com" /></div>
          <div className="space-y-2"><Label>Telefon</Label><Input value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+90 555 123 4567" /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Konum</Label><Input value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="İzmir, Türkiye" /></div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="sosyal" title="Sosyal Medya" icon={sectionIcons.sosyal} isOpen={openSections.includes('sosyal')} onToggle={() => toggleSection('sosyal')} completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.sosyalMedya.fields)}>
        <SocialMediaInput value={formData.social_media || {}} onChange={(v) => setFormData({ ...formData, social_media: v })} />
      </CollapsibleSection>

      <CollapsibleSection id="marka" title="Marka Kimliği" icon={sectionIcons.marka} isOpen={openSections.includes('marka')} onToggle={() => toggleSection('marka')} completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.markaKimligi.fields)} hasAIContent={hasAIContent('brand_description') || hasAIContent('mission') || hasAIContent('vision') || hasAIContent('usp')}>
        <div className="space-y-4">
          <div className="space-y-2"><Label className="flex items-center gap-2">Marka Açıklaması{hasAIContent('brand_description') && <Bot className="h-3 w-3 text-primary" />}</Label><Textarea value={formData.brand_description || ''} onChange={(e) => setFormData({ ...formData, brand_description: e.target.value })} placeholder="Markanın hikayesi..." rows={3} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="flex items-center gap-2">Misyon{hasAIContent('mission') && <Bot className="h-3 w-3 text-primary" />}</Label><Textarea value={formData.mission || ''} onChange={(e) => setFormData({ ...formData, mission: e.target.value })} placeholder="Markanın misyonu" rows={2} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2">Vizyon{hasAIContent('vision') && <Bot className="h-3 w-3 text-primary" />}</Label><Textarea value={formData.vision || ''} onChange={(e) => setFormData({ ...formData, vision: e.target.value })} placeholder="Markanın vizyonu" rows={2} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Slogan</Label><Input value={formData.slogan || ''} onChange={(e) => setFormData({ ...formData, slogan: e.target.value })} placeholder="Markanın sloganı" /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2">USP{hasAIContent('usp') && <Bot className="h-3 w-3 text-primary" />}</Label><Input value={formData.usp || ''} onChange={(e) => setFormData({ ...formData, usp: e.target.value })} placeholder="Benzersiz değer önerisi" /></div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="hedef" title="Hedef Kitle" icon={sectionIcons.hedef} isOpen={openSections.includes('hedef')} onToggle={() => toggleSection('hedef')} completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.hedefKitle.fields)} hasAIContent={hasAIContent('target_audience')}>
        <div className="space-y-4">
          <div className="space-y-2"><Label className="flex items-center gap-2">Hedef Kitle Tanımı{hasAIContent('target_audience') && <Bot className="h-3 w-3 text-primary" />}</Label><Textarea value={formData.target_audience || ''} onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })} placeholder="Örn: 30-55 yaş arası, sağlıklı beslenmeye önem veren ev hanımları" rows={3} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Yaş Aralığı</Label><Input value={formData.target_age_range || ''} onChange={(e) => setFormData({ ...formData, target_age_range: e.target.value })} placeholder="Örn: 25-45" /></div>
            <div className="space-y-2"><Label>Coğrafi Hedef</Label><Input value={formData.target_geography || ''} onChange={(e) => setFormData({ ...formData, target_geography: e.target.value })} placeholder="Örn: Türkiye geneli" /></div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="urun" title="Ürün Bilgileri" icon={sectionIcons.urun} isOpen={openSections.includes('urun')} onToggle={() => toggleSection('urun')} completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.urunBilgileri.fields)}>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Ürün Kategorileri</Label><TagInput value={formData.product_categories || []} onChange={(v) => setFormData({ ...formData, product_categories: v })} placeholder="Kategori yazın ve Enter'a basın" /></div>
          <div className="space-y-2"><Label>Öne Çıkan Ürünler</Label><TagInput value={formData.top_products || []} onChange={(v) => setFormData({ ...formData, top_products: v })} placeholder="Ürün adı yazın" /></div>
          <div className="space-y-2"><Label>Fiyat Segmenti</Label><Select value={formData.price_segment || ''} onValueChange={(v) => setFormData({ ...formData, price_segment: v as PriceSegment })}><SelectTrigger><SelectValue placeholder="Segment seçin..." /></SelectTrigger><SelectContent>{PRICE_SEGMENTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select></div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="rekabet" title="Rekabet Analizi" icon={sectionIcons.rekabet} isOpen={openSections.includes('rekabet')} onToggle={() => toggleSection('rekabet')} completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.rekabet.fields)} hasAIContent={hasAIContent('competitors')}>
        <CompetitorInput value={formData.competitors || []} onChange={(v) => setFormData({ ...formData, competitors: v })} />
      </CollapsibleSection>

      <CollapsibleSection id="kurallar" title="İçerik Kuralları" icon={sectionIcons.kurallar} isOpen={openSections.includes('kurallar')} onToggle={() => toggleSection('kurallar')} completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.kurallar.fields)}>
        <div className="space-y-4">
          <div className="space-y-2"><Label className="text-red-600">🚫 Yapılmaması Gerekenler</Label><TagInput value={formData.do_not_do || []} onChange={(v) => setFormData({ ...formData, do_not_do: v })} placeholder="Örn: Rakip markalardan bahsetme" /></div>
          <div className="space-y-2"><Label className="text-green-600">✅ Vurgulanması Gerekenler</Label><TagInput value={formData.must_emphasize || []} onChange={(v) => setFormData({ ...formData, must_emphasize: v })} placeholder="Örn: Doğallık, yerli üretim" /></div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="takvim" title="Özel Günler & Takvim" icon={sectionIcons.takvim} isOpen={openSections.includes('takvim')} onToggle={() => toggleSection('takvim')} completion={calculateSectionCompletion(formData, BRIEF_SECTIONS.takvim.fields)}>
        <SpecialEventInput value={formData.special_events || []} onChange={(v) => setFormData({ ...formData, special_events: v })} />
      </CollapsibleSection>

      <div className="flex items-center gap-3 py-2"><Separator className="flex-1" /><span className="text-xs text-muted-foreground font-medium">GELİŞMİŞ AYARLAR</span><Separator className="flex-1" /></div>

      <CollapsibleSection id="degerler" title="Marka Değerleri" icon={sectionIcons.degerler} isOpen={openSections.includes('degerler')} onToggle={() => toggleSection('degerler')} completion={calculateSectionCompletion(formData, ['brand_values', 'buying_motivations'])} badge="Gelişmiş">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Marka Değerleri</Label><TagInput value={formData.brand_values || []} onChange={(v) => setFormData({ ...formData, brand_values: v })} placeholder="Örn: Sürdürülebilirlik" /></div>
          <div className="space-y-2"><Label>Satın Alma Motivasyonları</Label><TagInput value={formData.buying_motivations || []} onChange={(v) => setFormData({ ...formData, buying_motivations: v })} placeholder="Örn: Maliyet düşürme" /></div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="strateji" title="İçerik Stratejisi" icon={sectionIcons.strateji} isOpen={openSections.includes('strateji')} onToggle={() => toggleSection('strateji')} completion={calculateSectionCompletion(formData, ['content_pillars'])} badge="Gelişmiş" hasAIContent={hasAIContent('content_pillars')}>
        <ContentPillarInput value={formData.content_pillars || []} onChange={(v) => setFormData({ ...formData, content_pillars: v })} />
      </CollapsibleSection>

      <CollapsibleSection id="platform" title="Platform Kuralları" icon={sectionIcons.platform} isOpen={openSections.includes('platform')} onToggle={() => toggleSection('platform')} completion={calculateSectionCompletion(formData, ['platform_rules'])} badge="Gelişmiş">
        <PlatformRulesInput value={formData.platform_rules || {}} onChange={(v) => setFormData({ ...formData, platform_rules: v })} />
      </CollapsibleSection>

      <CollapsibleSection id="ornekler" title="Örnek İçerikler" icon={sectionIcons.ornekler} isOpen={openSections.includes('ornekler')} onToggle={() => toggleSection('ornekler')} completion={calculateSectionCompletion(formData, ['example_captions'])} badge="Gelişmiş">
        <div className="space-y-4">
          <div className="space-y-2"><Label className="text-green-600">✅ İyi Örnekler</Label><TagInput value={formData.example_captions?.good_examples || []} onChange={(v) => setFormData({ ...formData, example_captions: { ...formData.example_captions, good_examples: v } })} placeholder="Beğendiğiniz caption örnekleri" /></div>
          <div className="space-y-2"><Label className="text-red-600">❌ Kötü Örnekler</Label><TagInput value={formData.example_captions?.bad_examples || []} onChange={(v) => setFormData({ ...formData, example_captions: { ...formData.example_captions, bad_examples: v } })} placeholder="İstemediğiniz tarz" /></div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="kelime" title="Kelime Haritası" icon={sectionIcons.kelime} isOpen={openSections.includes('kelime')} onToggle={() => toggleSection('kelime')} completion={calculateSectionCompletion(formData, ['word_mapping'])} badge="Gelişmiş">
        <WordMappingInput value={formData.word_mapping || []} onChange={(v) => setFormData({ ...formData, word_mapping: v })} />
      </CollapsibleSection>

      <CollapsibleSection id="gorseller" title="Marka Görselleri" icon={sectionIcons.gorseller} isOpen={openSections.includes('gorseller')} onToggle={() => toggleSection('gorseller')} completion={calculateSectionCompletion(formData, ['brand_colors', 'brand_fonts', 'brand_assets'])} badge="Gelişmiş">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Marka Renkleri</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1"><Label className="text-xs">Ana Renk</Label><div className="flex gap-2"><Input type="color" value={formData.brand_colors?.primary || '#000000'} onChange={(e) => setFormData({ ...formData, brand_colors: { ...formData.brand_colors, primary: e.target.value } })} className="w-12 h-9 p-1" /><Input value={formData.brand_colors?.primary || ''} onChange={(e) => setFormData({ ...formData, brand_colors: { ...formData.brand_colors, primary: e.target.value } })} placeholder="#1E40AF" /></div></div>
              <div className="space-y-1"><Label className="text-xs">İkincil Renk</Label><div className="flex gap-2"><Input type="color" value={formData.brand_colors?.secondary || '#000000'} onChange={(e) => setFormData({ ...formData, brand_colors: { ...formData.brand_colors, secondary: e.target.value } })} className="w-12 h-9 p-1" /><Input value={formData.brand_colors?.secondary || ''} onChange={(e) => setFormData({ ...formData, brand_colors: { ...formData.brand_colors, secondary: e.target.value } })} placeholder="#64748B" /></div></div>
              <div className="space-y-1"><Label className="text-xs">Vurgu Rengi</Label><div className="flex gap-2"><Input type="color" value={formData.brand_colors?.accent || '#000000'} onChange={(e) => setFormData({ ...formData, brand_colors: { ...formData.brand_colors, accent: e.target.value } })} className="w-12 h-9 p-1" /><Input value={formData.brand_colors?.accent || ''} onChange={(e) => setFormData({ ...formData, brand_colors: { ...formData.brand_colors, accent: e.target.value } })} placeholder="#F59E0B" /></div></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Başlık Fontu</Label><Input value={formData.brand_fonts?.heading || ''} onChange={(e) => setFormData({ ...formData, brand_fonts: { ...formData.brand_fonts, heading: e.target.value } })} placeholder="Örn: Montserrat" /></div>
            <div className="space-y-2"><Label>Gövde Fontu</Label><Input value={formData.brand_fonts?.body || ''} onChange={(e) => setFormData({ ...formData, brand_fonts: { ...formData.brand_fonts, body: e.target.value } })} placeholder="Örn: Open Sans" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Logo URL</Label><Input value={formData.brand_assets?.logo_url || ''} onChange={(e) => setFormData({ ...formData, brand_assets: { ...formData.brand_assets, logo_url: e.target.value } })} placeholder="https://..." /></div>
            <div className="space-y-2"><Label>Marka Rehberi URL</Label><Input value={formData.brand_assets?.guidelines_url || ''} onChange={(e) => setFormData({ ...formData, brand_assets: { ...formData.brand_assets, guidelines_url: e.target.value } })} placeholder="https://..." /></div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection id="entegrasyon" title="Entegrasyonlar" icon={sectionIcons.entegrasyon} isOpen={openSections.includes('entegrasyon')} onToggle={() => toggleSection('entegrasyon')} completion={calculateSectionCompletion(formData, ['integrations'])} badge="Faz 2">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Google Analytics ID</Label><Input value={formData.integrations?.google_analytics_id || ''} onChange={(e) => setFormData({ ...formData, integrations: { ...formData.integrations, google_analytics_id: e.target.value } })} placeholder="UA-XXXXXXXXX-X" /></div>
          <div className="space-y-2"><Label>Google Ads ID</Label><Input value={formData.integrations?.google_ads_id || ''} onChange={(e) => setFormData({ ...formData, integrations: { ...formData.integrations, google_ads_id: e.target.value } })} placeholder="AW-XXXXXXXXX" /></div>
          <div className="space-y-2"><Label>Meta Pixel ID</Label><Input value={formData.integrations?.meta_pixel_id || ''} onChange={(e) => setFormData({ ...formData, integrations: { ...formData.integrations, meta_pixel_id: e.target.value } })} placeholder="XXXXXXXXXXXXXXXX" /></div>
        </div>
      </CollapsibleSection>

      <Separator />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">İptal</Button>
        <Button type="submit" disabled={isLoading || !formData.name || aiResearch.isLoading} className="flex-1">
          {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Kaydediliyor...</> : customer ? 'Güncelle' : 'Marka Ekle'}
        </Button>
      </div>
    </form>
  )
}
