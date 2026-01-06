// Brief form configuration - extracted from customer-brief-form.tsx

export const AI_RESEARCH_ENDPOINT = 'https://n8n.beeswebsite.com/webhook/ai-research'

// 7 Bölüm yapısı - UI Kit v1.0 HTML ile UYUMLU (Renk/Font eklendi)
export const BRIEF_SECTIONS_CONFIG = {
  markaKimligi: {
    id: 'marka-kimligi',
    label: 'Marka Kimliği',
    description: 'Logo, slogan, değerler ve marka sesi',
    icon: 'Fingerprint',
    color: 'indigo',
    fields: ['name', 'slogan', 'brand_values', 'brand_voice', 'social_media', 'mission', 'vision', 'usp']
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
    description: 'Marka için önemli tarihler ve sezonsal takvim',
    icon: 'CalendarHeart',
    color: 'fuchsia',
    fields: ['general_holidays', 'special_events', 'seasonal_calendar']
  },
  markaAssets: {
    id: 'marka-assets',
    label: 'Renkler & Fontlar',
    description: 'Marka görsel kimliği',
    icon: 'Palette',
    color: 'emerald',
    fields: ['brand_colors', 'brand_fonts']
  }
} as const

// Genel Özel Günler listesi
export const GENERAL_HOLIDAYS = [
  { id: 'valentines', label: 'Sevgililer Günü', date: '14 Şubat' },
  { id: 'mothers', label: 'Anneler Günü', date: 'Mayıs 2. Pazar' },
  { id: 'fathers', label: 'Babalar Günü', date: 'Haziran 3. Pazar' },
  { id: 'newyear', label: 'Yılbaşı', date: '31 Aralık' },
  { id: 'blackfriday', label: 'Black Friday', date: 'Kasım son Cuma' },
  { id: 'ramadan', label: 'Ramazan', date: 'Değişken' }
]

export type BriefSectionConfig = typeof BRIEF_SECTIONS_CONFIG[keyof typeof BRIEF_SECTIONS_CONFIG]
