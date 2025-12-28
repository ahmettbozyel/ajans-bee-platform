// =====================================================
// Customer Types - Genişletilmiş Brief Sistemi
// Version: 2.4 - Genişletilmiş Renk ve Font Yapısı
// =====================================================

// Sosyal medya platform tipi
export interface SocialMediaAccount {
  handle: string;
  followers?: number;
  url?: string;
}

export interface SocialMediaData {
  instagram?: SocialMediaAccount;
  facebook?: SocialMediaAccount;
  linkedin?: SocialMediaAccount;
  youtube?: SocialMediaAccount & { subscribers?: number };
  tiktok?: SocialMediaAccount;
  twitter?: SocialMediaAccount;
}

// Rakip analizi
export interface Competitor {
  name: string;
  instagram_handle?: string;
  followers?: number;
  strengths: string[];
  website?: string;
}

// Özel günler/takvim
export interface SpecialEvent {
  date: string;
  name: string;
  notes?: string;
  recurring?: boolean;
}

// İçerik Sütunları (Content Pillars)
export interface ContentPillar {
  name: string;
  description: string;
  example_topics?: string[];
}

// Platform Kuralları
export interface PlatformRule {
  caption_length?: string;
  emoji_count?: string;
  hashtag_count?: string;
  cta_style?: string;
}

export interface PlatformRules {
  instagram?: PlatformRule;
  linkedin?: PlatformRule;
  facebook?: PlatformRule;
  tiktok?: PlatformRule;
  twitter?: PlatformRule;
}

// Örnek İçerikler
export interface ExampleCaptions {
  good_examples?: string[];
  bad_examples?: string[];
}

// Kelime Haritası
export interface WordMapping {
  avoid: string;
  use_instead: string;
}

// =====================================================
// Marka Renkleri - Genişletilmiş (v2.4)
// =====================================================
export interface BrandColors {
  // Ana Renkler (max 3)
  primary?: string;      // Ana marka rengi
  secondary?: string;    // İkincil renk
  accent?: string;       // Vurgu rengi

  // Yardımcı Renkler (max 3)
  light?: string;        // Açık ton
  dark?: string;         // Koyu ton
  neutral?: string;      // Nötr renk

  // Extra (kullanıcı ekler)
  extra?: string[];
}

// =====================================================
// Marka Fontları - Genişletilmiş (v2.4)
// =====================================================
export interface BrandFonts {
  // Kurumsal (Ofset, basılı materyaller)
  corporate?: {
    heading?: string;    // Başlık fontu
    body?: string;       // Gövde fontu
  };
  
  // Web / Dijital
  web?: {
    heading?: string;    // Web başlık
    body?: string;       // Web gövde
    fallback?: string;   // Yedek font (system-ui vb)
  };
}

// Marka Varlıkları
export interface BrandAssets {
  logo_url?: string;
  guidelines_url?: string;
}

// Entegrasyonlar
export interface Integrations {
  google_analytics_id?: string;
  google_ads_id?: string;
  meta_pixel_id?: string;
}

// =====================================================
// AI Research Tipleri
// =====================================================

// Müşteri Acı Noktaları
export interface PainPoint {
  problem: string;
  intensity: 'low' | 'medium' | 'high';
  source?: string;
}

// Hook Cümleleri
export interface HookSentence {
  hook: string;
  type: 'question' | 'statistic' | 'emotion' | 'curiosity' | 'benefit';
  platform?: string[];
}

// CTA Standartları
export interface CtaStandard {
  cta: string;
  context: string;
  platform?: string[];
}

// Yasaklı Kelimeler
export interface ForbiddenWord {
  word: string;
  reason?: string;
  alternative?: string;
}

// Sezonsal Takvim
export interface SeasonalEvent {
  name: string;
  date_range: string;
  content_ideas?: string[];
  hashtags?: string[];
}

// =====================================================
// Müşteri Dosyaları Tipleri (v2.4)
// =====================================================

export type FileCategory = 'logo' | 'product' | 'post';
export type LogoSubCategory = 'primary' | 'white' | 'black' | 'icon' | 'vertical' | 'horizontal';

export interface CustomerFile {
  id: string;
  created_at: string;
  user_id: string;
  customer_id: string;
  category: FileCategory;
  sub_category?: LogoSubCategory | null;
  file_name: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  is_primary?: boolean;
  notes?: string;
}

// Logo kategorileri
export const LOGO_CATEGORIES = [
  { value: 'primary', label: 'Ana Logo', description: 'Renkli, tam versiyon' },
  { value: 'white', label: 'Tek Renk (Beyaz)', description: 'Dark arka plan için' },
  { value: 'black', label: 'Tek Renk (Siyah)', description: 'Light arka plan için' },
  { value: 'icon', label: 'İkon/Favicon', description: 'Sadece sembol' },
  { value: 'vertical', label: 'Dikey', description: 'Dikey layout' },
  { value: 'horizontal', label: 'Yatay', description: 'Yatay layout' }
] as const;

// Dosya kategorileri
export const FILE_CATEGORIES = [
  { value: 'logo', label: 'Logolar', icon: 'Image', description: 'Tüm logo varyasyonları' },
  { value: 'product', label: 'Ürün Görselleri', icon: 'Package', description: 'Ürün fotoğrafları' },
  { value: 'post', label: 'Örnek Postlar', icon: 'FileImage', description: 'Beğenilen içerik örnekleri' }
] as const;

// =====================================================
// Enum Types
// =====================================================

// Customer type (Karar #13)
export type CustomerType = 'retainer' | 'project';

// Customer status (Karar #14)
export type CustomerStatus = 'active' | 'inactive';

// Brand voice options - Karar #18 - UI Kit HTML ile uyumlu
export type BrandVoice = 'samimi' | 'profesyonel' | 'kurumsal' | 'enerjik';

// Business type
export type BusinessType = 'B2B' | 'B2C' | 'Both';

// Price segment
export type PriceSegment = 'ekonomik' | 'orta' | 'premium' | 'lüks';

// AI Research status
export type AIResearchStatus = 'pending' | 'completed' | 'partial' | 'failed';

// =====================================================
// Teknik Hizmetler Tipleri (Karar #18)
// =====================================================

export type ServiceType = 'hosting' | 'domain' | 'ssl' | 'email';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface TechnicalService {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  customer_id: string;
  service_type: ServiceType;
  provider?: string;
  name: string;
  renewal_date: string;
  price?: number;
  payment_status: PaymentStatus;
  notes?: string;
}

// Service type badge renkleri (Karar #18)
export const SERVICE_TYPE_COLORS = {
  hosting: { bg: 'bg-cyan-100 dark:bg-cyan-500/20', text: 'text-cyan-700 dark:text-cyan-400', glow: 'glow-cyan' },
  domain: { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-400', glow: 'glow-amber' },
  ssl: { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-400', glow: 'glow-emerald' },
  email: { bg: 'bg-violet-100 dark:bg-violet-500/20', text: 'text-violet-700 dark:text-violet-400', glow: 'glow-violet' }
} as const;

export const SERVICE_TYPES = [
  { value: 'hosting', label: 'Hosting', icon: 'Server' },
  { value: 'domain', label: 'Domain', icon: 'Globe' },
  { value: 'ssl', label: 'SSL', icon: 'ShieldCheck' },
  { value: 'email', label: 'E-posta', icon: 'Mail' }
] as const;

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Bekliyor' },
  { value: 'paid', label: 'Ödendi' },
  { value: 'overdue', label: 'Gecikmiş' },
  { value: 'cancelled', label: 'İptal' }
] as const;

// =====================================================
// Ana Customer Interface
// =====================================================

export interface Customer {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;

  // Temel bilgiler (zorunlu)
  name: string;
  
  // Müşteri tipi (Karar #13)
  customer_type: CustomerType;
  
  // Müşteri durumu (Karar #14)
  status: CustomerStatus;
  
  // Temel bilgiler (opsiyonel)
  brand_name?: string | null;
  website_url?: string | null;
  sector?: string | null;
  sub_sector?: string | null;
  business_type?: BusinessType | null;
  brand_voice?: BrandVoice | null;

  // İletişim
  email?: string | null;
  phone?: string | null;
  location?: string | null;

  // Sosyal medya (JSONB)
  social_media?: SocialMediaData | null;

  // Marka kimliği
  brand_description?: string | null;
  mission?: string | null;
  vision?: string | null;
  slogan?: string | null;
  usp?: string | null;

  // Hedef kitle
  target_audience?: string | null;
  target_age_range?: string | null;
  target_geography?: string | null;

  // Ürün bilgileri
  product_categories?: string[] | null;
  top_products?: string[] | null;
  price_segment?: PriceSegment | null;

  // Rekabet (JSONB array)
  competitors?: Competitor[] | null;

  // Kurallar
  do_not_do?: string[] | null;
  must_emphasize?: string[] | null;

  // Özel günler (JSONB array)
  special_events?: SpecialEvent[] | null;

  // AI araştırma meta
  ai_research_date?: string | null;
  ai_research_status?: AIResearchStatus | null;

  // Faz 2 - Marka Değerleri
  brand_values?: string[] | null;
  buying_motivations?: string[] | null;

  // Faz 2 - İçerik Stratejisi
  content_pillars?: ContentPillar[] | null;

  // Faz 2 - Platform Kuralları
  platform_rules?: PlatformRules | null;

  // Faz 2 - Örnek İçerikler
  example_captions?: ExampleCaptions | null;

  // Faz 2 - Kelime Haritası
  word_mapping?: WordMapping[] | null;

  // Faz 2 - Marka Görselleri (Genişletilmiş v2.4)
  brand_colors?: BrandColors | null;
  brand_fonts?: BrandFonts | null;
  brand_assets?: BrandAssets | null;

  // Faz 2 - Entegrasyonlar
  integrations?: Integrations | null;

  // AI Research Alanları
  pain_points?: PainPoint[] | null;
  hook_sentences?: HookSentence[] | null;
  cta_standards?: CtaStandard[] | null;
  forbidden_words?: ForbiddenWord[] | null;
  seasonal_calendar?: SeasonalEvent[] | null;

  // Eski alan (geriye uyumluluk)
  notes?: string | null;
}

// Form için partial tip
export type CustomerFormData = Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;

// =====================================================
// Müşteri Tipi Sabitleri (Karar #13)
// =====================================================

export const CUSTOMER_TYPES = [
  { value: 'retainer', label: 'Retainer', description: 'Aylık düzenli hizmet', icon: '🔄' },
  { value: 'project', label: 'Proje', description: 'Proje bazlı hizmet', icon: '📁' }
] as const;

// =====================================================
// Müşteri Durumu Sabitleri (Karar #14)
// =====================================================

export const CUSTOMER_STATUSES = [
  { value: 'active', label: 'Aktif', description: 'Aktif müşteri', icon: '✅' },
  { value: 'inactive', label: 'Pasif', description: 'İş bitti, teknik hizmet devam', icon: '⏸️' }
] as const;

// =====================================================
// Brief Bölüm Tanımları - 6 Ana Bölüm (Karar #18)
// =====================================================

export const BRIEF_SECTIONS_NEW = {
  markaKimligi: {
    id: 'marka-kimligi',
    label: 'Marka Kimliği',
    icon: 'Sparkles',
    fields: ['name', 'customer_type', 'status', 'website_url', 'sector', 'sub_sector', 'business_type', 'brand_voice', 'social_media', 'brand_description', 'mission', 'vision', 'slogan', 'usp'],
    required: ['name', 'customer_type']
  },
  hedefKitle: {
    id: 'hedef-kitle',
    label: 'Hedef Kitle',
    icon: 'Users',
    fields: ['target_audience', 'target_age_range', 'target_geography'],
    required: []
  },
  urunHizmet: {
    id: 'urun-hizmet',
    label: 'Ürün/Hizmet',
    icon: 'Package',
    fields: ['product_categories', 'top_products', 'price_segment'],
    required: []
  },
  rakipler: {
    id: 'rakipler',
    label: 'Rakipler',
    icon: 'Target',
    fields: ['competitors'],
    required: []
  },
  kurallar: {
    id: 'kurallar',
    label: 'İçerik Kuralları',
    icon: 'ShieldCheck',
    fields: ['do_not_do', 'must_emphasize'],
    required: []
  },
  ozelGunler: {
    id: 'ozel-gunler',
    label: 'Özel Günler',
    icon: 'Calendar',
    fields: ['special_events'],
    required: []
  }
} as const;

// Eski bölümler (geriye uyumluluk)
export const BRIEF_SECTIONS = {
  temelBilgiler: {
    id: 'temel',
    label: 'Temel Bilgiler',
    icon: 'Building2',
    fields: ['name', 'customer_type', 'status', 'website_url', 'sector', 'sub_sector', 'business_type', 'brand_voice'],
    required: ['name', 'customer_type']
  },
  iletisim: {
    id: 'iletisim',
    label: 'İletişim',
    icon: 'Phone',
    fields: ['email', 'phone', 'location'],
    required: []
  },
  sosyalMedya: {
    id: 'sosyal',
    label: 'Sosyal Medya',
    icon: 'Share2',
    fields: ['social_media'],
    required: []
  },
  markaKimligi: {
    id: 'marka',
    label: 'Marka Kimliği',
    icon: 'Sparkles',
    fields: ['brand_description', 'mission', 'vision', 'slogan', 'usp'],
    required: []
  },
  hedefKitle: {
    id: 'hedef',
    label: 'Hedef Kitle',
    icon: 'Users',
    fields: ['target_audience', 'target_age_range', 'target_geography'],
    required: []
  },
  urunBilgileri: {
    id: 'urun',
    label: 'Ürün Bilgileri',
    icon: 'Package',
    fields: ['product_categories', 'top_products', 'price_segment'],
    required: []
  },
  rekabet: {
    id: 'rekabet',
    label: 'Rekabet Analizi',
    icon: 'Target',
    fields: ['competitors'],
    required: []
  },
  kurallar: {
    id: 'kurallar',
    label: 'İçerik Kuralları',
    icon: 'ShieldCheck',
    fields: ['do_not_do', 'must_emphasize'],
    required: []
  },
  takvim: {
    id: 'takvim',
    label: 'Özel Günler',
    icon: 'Calendar',
    fields: ['special_events'],
    required: []
  },
  markaDegerleri: {
    id: 'degerler',
    label: 'Marka Değerleri',
    icon: 'Heart',
    fields: ['brand_values', 'buying_motivations'],
    required: []
  },
  icerikStratejisi: {
    id: 'strateji',
    label: 'İçerik Stratejisi',
    icon: 'Layers',
    fields: ['content_pillars'],
    required: []
  },
  platformKurallari: {
    id: 'platform',
    label: 'Platform Kuralları',
    icon: 'Settings',
    fields: ['platform_rules'],
    required: []
  },
  ornekIcerikler: {
    id: 'ornekler',
    label: 'Örnek İçerikler',
    icon: 'FileText',
    fields: ['example_captions'],
    required: []
  },
  kelimeHaritasi: {
    id: 'kelime',
    label: 'Kelime Haritası',
    icon: 'BookOpen',
    fields: ['word_mapping'],
    required: []
  },
  markaGorselleri: {
    id: 'gorseller',
    label: 'Marka Görselleri',
    icon: 'Palette',
    fields: ['brand_colors', 'brand_fonts', 'brand_assets'],
    required: []
  },
  entegrasyonlar: {
    id: 'entegrasyon',
    label: 'Entegrasyonlar',
    icon: 'Link',
    fields: ['integrations'],
    required: []
  },
  aiResearch: {
    id: 'ai-research',
    label: 'AI Araştırma',
    icon: 'Bot',
    fields: ['pain_points', 'hook_sentences', 'cta_standards', 'forbidden_words', 'seasonal_calendar'],
    required: []
  }
} as const;

// =====================================================
// Sabit Değerler - GENİŞLETİLMİŞ SEKTÖR LİSTESİ
// =====================================================

export const SECTORS = [
  // Perakende & Ticaret
  { value: 'e-ticaret', label: 'E-Ticaret' },
  { value: 'perakende', label: 'Perakende' },
  { value: 'toptan', label: 'Toptan Ticaret' },
  
  // Gıda & İçecek
  { value: 'gida', label: 'Gıda & İçecek' },
  { value: 'restoran', label: 'Restoran & Kafe' },
  { value: 'catering', label: 'Catering & Organizasyon' },
  
  // Moda & Güzellik
  { value: 'tekstil', label: 'Tekstil & Moda' },
  { value: 'kozmetik', label: 'Kozmetik & Güzellik' },
  { value: 'kuyumculuk', label: 'Kuyumculuk & Aksesuar' },
  { value: 'ayakkabi', label: 'Ayakkabı & Çanta' },
  
  // Sağlık
  { value: 'saglik', label: 'Sağlık & Medikal' },
  { value: 'eczane', label: 'Eczane' },
  { value: 'dis', label: 'Diş Hekimliği' },
  { value: 'estetik', label: 'Estetik & Plastik Cerrahi' },
  { value: 'psikoloji', label: 'Psikoloji & Terapi' },
  { value: 'veteriner', label: 'Veterinerlik' },
  { value: 'spor-fitness', label: 'Spor & Fitness' },
  
  // Teknoloji & Yazılım
  { value: 'teknoloji', label: 'Teknoloji' },
  { value: 'yazilim', label: 'Yazılım & SaaS' },
  { value: 'ajans', label: 'Dijital Ajans' },
  { value: 'danismanlik-it', label: 'IT Danışmanlık' },
  
  // Eğitim
  { value: 'egitim', label: 'Eğitim' },
  { value: 'kurs', label: 'Kurs & Eğitim Merkezi' },
  { value: 'universite', label: 'Üniversite & Okul' },
  { value: 'cocuk', label: 'Çocuk Eğitimi' },
  
  // Finans & Hukuk
  { value: 'finans', label: 'Finans & Bankacılık' },
  { value: 'sigorta', label: 'Sigorta' },
  { value: 'muhasebe', label: 'Muhasebe & Mali Müşavirlik' },
  { value: 'hukuk', label: 'Hukuk & Avukatlık' },
  
  // Gayrimenkul & İnşaat
  { value: 'gayrimenkul', label: 'Gayrimenkul' },
  { value: 'insaat', label: 'İnşaat' },
  { value: 'mimarlik', label: 'Mimarlık & İç Tasarım' },
  { value: 'dekorasyon', label: 'Dekorasyon & Mobilya' },
  
  // Turizm & Konaklama
  { value: 'turizm', label: 'Turizm & Seyahat' },
  { value: 'otel', label: 'Otel & Konaklama' },
  { value: 'transfer', label: 'Transfer & Araç Kiralama' },
  
  // Otomotiv & Ulaşım
  { value: 'otomotiv', label: 'Otomotiv' },
  { value: 'oto-servis', label: 'Oto Servis & Yedek Parça' },
  { value: 'lojistik', label: 'Lojistik & Kargo' },
  
  // Enerji & Çevre
  { value: 'enerji', label: 'Enerji' },
  { value: 'yenilenebilir', label: 'Yenilenebilir Enerji' },
  { value: 'cevre', label: 'Çevre & Geri Dönüşüm' },
  
  // Üretim & Sanayi
  { value: 'uretim', label: 'Üretim & Sanayi' },
  { value: 'makine', label: 'Makine & Ekipman' },
  { value: 'kimya', label: 'Kimya & Plastik' },
  { value: 'ambalaj', label: 'Ambalaj' },
  
  // Tarım & Hayvancılık
  { value: 'tarim', label: 'Tarım' },
  { value: 'hayvancilik', label: 'Hayvancılık' },
  { value: 'organik', label: 'Organik Ürünler' },
  
  // Medya & Eğlence
  { value: 'medya', label: 'Medya & Yayıncılık' },
  { value: 'eglence', label: 'Eğlence & Etkinlik' },
  { value: 'muzik', label: 'Müzik & Sanat' },
  { value: 'oyun', label: 'Oyun & E-Spor' },
  
  // Hizmet
  { value: 'danismanlik', label: 'Danışmanlık' },
  { value: 'temizlik', label: 'Temizlik Hizmetleri' },
  { value: 'guvenlik', label: 'Güvenlik' },
  { value: 'hr', label: 'İnsan Kaynakları' },
  { value: 'fotograf', label: 'Fotoğraf & Video' },
  
  // STK & Kamu
  { value: 'stk', label: 'STK & Vakıf' },
  { value: 'kamu', label: 'Kamu & Belediye' },
  
  // Diğer
  { value: 'diger', label: 'Diğer' }
] as const;

// Marka Sesi - UI Kit v1.0 HTML ile UYUMLU
// emoji field'ı Brief formunda OptionCard için kullanılıyor
export const BRAND_VOICES = [
  { value: 'samimi', label: 'Samimi', emoji: '🤝', icon: '🤝', description: 'Arkadaşça, sıcak' },
  { value: 'profesyonel', label: 'Profesyonel', emoji: '💼', icon: '💼', description: 'Ciddi, iş odaklı' },
  { value: 'kurumsal', label: 'Kurumsal', emoji: '🏢', icon: '🏢', description: 'Formal, resmi' },
  { value: 'enerjik', label: 'Enerjik', emoji: '⚡', icon: '⚡', description: 'Dinamik, heyecanlı' }
] as const;

export const BUSINESS_TYPES = [
  { value: 'B2B', label: 'B2B', description: 'İşletmeden işletmeye' },
  { value: 'B2C', label: 'B2C', description: 'İşletmeden tüketiciye' },
  { value: 'Both', label: 'Her İkisi', description: 'Hem B2B hem B2C' }
] as const;

export const PRICE_SEGMENTS = [
  { value: 'ekonomik', label: 'Ekonomik' },
  { value: 'orta', label: 'Orta Segment' },
  { value: 'premium', label: 'Premium' },
  { value: 'luks', label: 'Lüks' }
] as const;

// =====================================================
// Empty State Mesajları (Karar #18)
// =====================================================

export const EMPTY_STATE_MESSAGES = {
  dashboard_activity: "Henüz aktivite yok. İlk içeriği üretmek için bir marka seç! 🚀",
  files: "Henüz dosya yüklenmedi. Logo ve görselleri buraya yükle.",
  calendar: "Takvim boş. İçerik planlamaya başla!",
  content: "Henüz içerik üretilmedi. Hemen başla! ✨",
  performance: "Performans raporları çok yakında burada! 📊",
  brands: "Henüz marka eklenmedi. İlk markanı ekleyerek başla! 🐝"
} as const;

// =====================================================
// Helper Fonksiyonlar
// =====================================================

// Helper: Brief tamamlanma yüzdesini hesapla
export function calculateBriefCompletion(customer: Partial<Customer>): number {
  const checkField = (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  };

  const allFields = [
    'name', 'customer_type', 'status', 'website_url', 'sector', 'sub_sector', 'business_type', 'brand_voice',
    'email', 'phone', 'location',
    'social_media',
    'brand_description', 'mission', 'vision', 'slogan', 'usp',
    'target_audience', 'target_age_range', 'target_geography',
    'product_categories', 'top_products', 'price_segment',
    'competitors',
    'do_not_do', 'must_emphasize',
    'special_events',
    'brand_values', 'buying_motivations',
    'content_pillars',
    'platform_rules',
    'example_captions',
    'word_mapping',
    'brand_colors', 'brand_fonts', 'brand_assets',
    'integrations',
    'pain_points', 'hook_sentences', 'cta_standards', 'forbidden_words', 'seasonal_calendar'
  ];

  const filledFields = allFields.filter(field => 
    checkField(customer[field as keyof Customer])
  );

  return Math.round((filledFields.length / allFields.length) * 100);
}

// Helper: Bölüm tamamlanma yüzdesini hesapla
export function calculateSectionCompletion(
  customer: Partial<Customer>, 
  fields: readonly string[]
): number {
  const checkField = (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  };

  const filledFields = fields.filter(field => 
    checkField(customer[field as keyof Customer])
  );

  return fields.length > 0 
    ? Math.round((filledFields.length / fields.length) * 100) 
    : 0;
}

// Helper: Müşteri tipi label'ı getir
export function getCustomerTypeLabel(type: CustomerType): string {
  const found = CUSTOMER_TYPES.find(t => t.value === type);
  return found?.label || type;
}

// Helper: Müşteri durumu label'ı getir
export function getCustomerStatusLabel(status: CustomerStatus): string {
  const found = CUSTOMER_STATUSES.find(s => s.value === status);
  return found?.label || status;
}

// Helper: Servis tipi renkleri getir
export function getServiceTypeColors(type: ServiceType) {
  return SERVICE_TYPE_COLORS[type] || SERVICE_TYPE_COLORS.hosting;
}

// Helper: Progress bar rengini getir
export function getProgressColor(value: number): string {
  if (value >= 100) return 'progress-emerald';
  if (value >= 71) return 'progress-cyan';
  if (value >= 31) return 'progress-amber';
  return 'progress-rose';
}

// Helper: Progress text rengini getir
export function getProgressTextColor(value: number): string {
  if (value >= 100) return 'text-emerald-600 dark:text-emerald-400';
  if (value >= 71) return 'text-cyan-600 dark:text-cyan-400';
  if (value >= 31) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}
