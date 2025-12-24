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
    'name', 'website_url', 'sector', 'sub_sector', 'business_type', 'brand_voice',
    'email', 'phone', 'location',
    'social_media',
    'brand_description', 'mission', 'vision', 'slogan', 'usp',
    'target_audience', 'target_age_range', 'target_geography',
    'product_categories', 'top_products', 'price_segment',
    'competitors',
    'do_not_do', 'must_emphasize',
    'special_events'
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
