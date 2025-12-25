// =====================================================
// Customer Types - Genişletilmiş Brief Sistemi
// Version: 1.0
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

// Marka Renkleri
export interface BrandColors {
  primary?: string;
  secondary?: string;
  accent?: string;
}

// Marka Fontları
export interface BrandFonts {
  heading?: string;
  body?: string;
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

// Brand voice options
export type BrandVoice = 'samimi' | 'kurumsal' | 'enerjik' | 'profesyonel';

// Business type
export type BusinessType = 'B2B' | 'B2C' | 'Both';

// Price segment
export type PriceSegment = 'ekonomik' | 'orta' | 'premium' | 'lüks';

// AI Research status
export type AIResearchStatus = 'pending' | 'completed' | 'partial' | 'failed';

// Ana Customer interface
export interface Customer {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;

  // Temel bilgiler (zorunlu)
  name: string;
  
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

  // Faz 2 - Marka Görselleri
  brand_colors?: BrandColors | null;
  brand_fonts?: BrandFonts | null;
  brand_assets?: BrandAssets | null;

  // Faz 2 - Entegrasyonlar
  integrations?: Integrations | null;

  // Eski alan (geriye uyumluluk)
  notes?: string | null;
}

// Form için partial tip
export type CustomerFormData = Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;

// Brief bölüm tanımları
export const BRIEF_SECTIONS = {
  temelBilgiler: {
    id: 'temel',
    label: 'Temel Bilgiler',
    icon: 'Building2',
    fields: ['name', 'website_url', 'sector', 'sub_sector', 'business_type', 'brand_voice'],
    required: ['name']
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
  // Faz 2 - Gelişmiş Bölümler
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
  }
} as const;

// Sektör listesi (genişletilmiş)
export const SECTORS = [
  { value: 'gida', label: 'Gıda & İçecek' },
  { value: 'tekstil', label: 'Tekstil & Moda' },
  { value: 'teknoloji', label: 'Teknoloji' },
  { value: 'saglik', label: 'Sağlık & Güzellik' },
  { value: 'egitim', label: 'Eğitim' },
  { value: 'finans', label: 'Finans & Sigorta' },
  { value: 'gayrimenkul', label: 'Gayrimenkul' },
  { value: 'otomotiv', label: 'Otomotiv' },
  { value: 'turizm', label: 'Turizm & Otelcilik' },
  { value: 'eticaret', label: 'E-ticaret' },
  { value: 'uretim', label: 'Üretim & Sanayi' },
  { value: 'hizmet', label: 'Hizmet Sektörü' },
  { value: 'perakende', label: 'Perakende' },
  { value: 'medya', label: 'Medya & Eğlence' },
  { value: 'diger', label: 'Diğer' }
] as const;

// Marka sesi seçenekleri
export const BRAND_VOICES = [
  { value: 'samimi', label: 'Samimi', description: 'Sıcak, arkadaşça, yakın' },
  { value: 'kurumsal', label: 'Kurumsal', description: 'Resmi, güvenilir, ciddi' },
  { value: 'enerjik', label: 'Enerjik', description: 'Dinamik, heyecanlı, genç' },
  { value: 'profesyonel', label: 'Profesyonel', description: 'Uzman, bilgili, güvenilir' }
] as const;

// İş tipi seçenekleri
export const BUSINESS_TYPES = [
  { value: 'B2B', label: 'B2B', description: 'İşletmeden işletmeye' },
  { value: 'B2C', label: 'B2C', description: 'İşletmeden tüketiciye' },
  { value: 'Both', label: 'Her İkisi', description: 'Hem B2B hem B2C' }
] as const;

// Fiyat segmenti seçenekleri
export const PRICE_SEGMENTS = [
  { value: 'ekonomik', label: 'Ekonomik' },
  { value: 'orta', label: 'Orta Segment' },
  { value: 'premium', label: 'Premium' },
  { value: 'luks', label: 'Lüks' }
] as const;

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
    // Temel
    'name', 'website_url', 'sector', 'sub_sector', 'business_type', 'brand_voice',
    // İletişim
    'email', 'phone', 'location',
    // Sosyal Medya
    'social_media',
    // Marka Kimliği
    'brand_description', 'mission', 'vision', 'slogan', 'usp',
    // Hedef Kitle
    'target_audience', 'target_age_range', 'target_geography',
    // Ürün
    'product_categories', 'top_products', 'price_segment',
    // Rekabet
    'competitors',
    // Kurallar
    'do_not_do', 'must_emphasize',
    // Takvim
    'special_events',
    // Faz 2 - Marka Değerleri
    'brand_values', 'buying_motivations',
    // Faz 2 - İçerik Stratejisi
    'content_pillars',
    // Faz 2 - Platform Kuralları
    'platform_rules',
    // Faz 2 - Örnek İçerikler
    'example_captions',
    // Faz 2 - Kelime Haritası
    'word_mapping',
    // Faz 2 - Marka Görselleri
    'brand_colors', 'brand_fonts', 'brand_assets',
    // Faz 2 - Entegrasyonlar
    'integrations'
  ];

  const filledCount = allFields.filter(field => 
    checkField((customer as Record<string, unknown>)[field])
  ).length;

  return Math.round((filledCount / allFields.length) * 100);
}

// Helper: Bölüm bazlı tamamlanma
export function calculateSectionCompletion(
  customer: Partial<Customer>,
  sectionFields: string[]
): number {
  const checkField = (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  };

  if (sectionFields.length === 0) return 0;
  
  const filledCount = sectionFields.filter(field => 
    checkField((customer as Record<string, unknown>)[field])
  ).length;

  return Math.round((filledCount / sectionFields.length) * 100);
}
