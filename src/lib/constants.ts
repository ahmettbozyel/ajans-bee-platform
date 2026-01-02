// Marka sesi seçenekleri
export const BRAND_VOICES = [
  { 
    value: 'samimi', 
    label: 'Samimi',
    description: 'Sıcak, arkadaşça, güler yüzlü'
  },
  { 
    value: 'kurumsal', 
    label: 'Kurumsal',
    description: 'Ciddi, güvenilir, profesyonel'
  },
  { 
    value: 'enerjik', 
    label: 'Enerjik',
    description: 'Dinamik, heyecan verici, genç'
  },
  { 
    value: 'profesyonel', 
    label: 'Profesyonel',
    description: 'Uzman, bilgili, otoriter'
  },
] as const

// Platform seçenekleri
export const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
] as const

// İçerik türleri
export const CONTENT_TYPES = [
  { value: 'post', label: 'Post' },
  { value: 'story', label: 'Story' },
  { value: 'reel', label: 'Reel' },
  { value: 'carousel', label: 'Carousel' },
] as const

// Brand voice label helper
export function getBrandVoiceLabel(value: string): string {
  const voice = BRAND_VOICES.find(v => v.value === value)
  return voice?.label || value
}
