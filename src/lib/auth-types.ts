// ==========================================
// RBAC Types - Ajans Bee Platform
// ==========================================

// Roller
export type UserRole = 'admin' | 'personel' | 'operasyon'

// Kullanıcı tipi (public.users tablosu)
export interface AppUser {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

// Modül erişimleri
export type ModuleSlug = 
  | 'dashboard'
  | 'markalar'
  | 'teknik-hizmetler'
  | 'icerik-uret'
  | 'gunluk-isler'
  | 'giris-cikis'
  | 'ayarlar'

// Rol bazlı erişim matrisi
export const ROLE_ACCESS: Record<UserRole, ModuleSlug[]> = {
  admin: ['dashboard', 'markalar', 'teknik-hizmetler', 'icerik-uret', 'gunluk-isler', 'giris-cikis', 'ayarlar'],
  personel: ['gunluk-isler', 'giris-cikis'],
  operasyon: ['gunluk-isler', 'giris-cikis', 'teknik-hizmetler']
}

// Erişim kontrol fonksiyonları
export function canAccess(role: UserRole, module: ModuleSlug): boolean {
  if (role === 'admin') return true
  return ROLE_ACCESS[role]?.includes(module) ?? false
}

export function canEdit(role: UserRole, module: ModuleSlug): boolean {
  // Admin her şeyi düzenleyebilir
  if (role === 'admin') return true
  
  // Operasyon teknik hizmetleri düzenleyebilir
  if (role === 'operasyon' && module === 'teknik-hizmetler') return true
  
  // Herkes kendi günlük işlerini düzenleyebilir
  if (module === 'gunluk-isler' || module === 'giris-cikis') return true
  
  return false
}

export function getDefaultRoute(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/dashboard'
    case 'operasyon':
      return '/gunluk-isler'
    case 'personel':
      return '/gunluk-isler'
    default:
      return '/gunluk-isler'
  }
}

// Task kategorileri
export interface TaskCategory {
  id: string
  name: string
  slug: string
  color: string
  icon: string
  sort_order: number
  is_active: boolean
}

// Task status - YENİ SİSTEM
export type TaskStatus = 'active' | 'paused' | 'completed'

// Günlük iş - YENİ YAPI
export interface DailyTask {
  id: string
  user_id: string
  brand_id: string | null
  category_id: string
  description: string
  
  // Durum
  status: TaskStatus
  
  // Zaman takibi
  start_time: string
  end_time: string | null
  paused_at: string | null
  total_duration: number  // saniye cinsinden
  
  // Revize sayısı
  revision_count: number
  
  // Hangi güne ait
  work_date: string
  
  created_at: string
  updated_at: string
  
  // Relations
  category?: TaskCategory
  brand?: { id: string; brand_name: string } | null
  user?: { id: string; full_name: string }
}

// Task Revisions
export interface TaskRevision {
  id: string
  task_id: string
  revision_number: number
  start_time: string
  end_time: string | null
  duration: number  // saniye
  created_at: string
}

// Attendance status types
export type AttendanceStatus = 'normal' | 'late' | 'early_leave' | 'absent' | 'leave' | 'remote' | 'holiday'
export type LocationType = 'office' | 'home' | 'other' | 'unknown'
export type RecordType = 'normal' | 'leave' | 'sick' | 'remote' | 'holiday'

// Giriş/Çıkış
export interface Attendance {
  id: string
  user_id: string
  date: string
  check_in: string | null
  check_out: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // Konum bilgileri
  check_in_lat?: number | null
  check_in_lng?: number | null
  check_out_lat?: number | null
  check_out_lng?: number | null
  check_in_location_type?: LocationType | null
  check_out_location_type?: LocationType | null
  // Durum ve süreler
  status?: AttendanceStatus | null
  late_minutes?: number | null
  overtime_minutes?: number | null
  early_leave_minutes?: number | null
  // Kayıt tipi ve admin notları
  record_type?: RecordType | null
  admin_notes?: string | null
  // Açıklamalar
  late_reason?: string | null
  overtime_reason?: string | null
}

// Personel avatar renkleri
export const AVATAR_COLORS: Record<string, string> = {
  'A': 'from-amber-500 to-orange-600',
  'B': 'from-violet-500 to-purple-600',
  'E': 'from-rose-500 to-pink-600',
  'N': 'from-emerald-500 to-teal-600',
  'Ö': 'from-cyan-500 to-blue-600',
  'default': 'from-zinc-500 to-zinc-600'
}

// Kategori renkleri
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'tasarim': { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-400', border: 'border-fuchsia-500/20' },
  'video': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/20' },
  'revize': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/20' },
  'toplanti': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/20' },
  'arastirma': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  'gelistirme': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  'icerik': { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/20' },
  'destek': { bg: 'bg-zinc-500/20', text: 'text-zinc-400', border: 'border-zinc-500/20' },
  'genel': { bg: 'bg-zinc-500/20', text: 'text-zinc-400', border: 'border-zinc-500/20' }
}

// Status badge stilleri
export const STATUS_STYLES: Record<TaskStatus, { bg: string; text: string; border: string; icon: string }> = {
  'active': { 
    bg: 'bg-emerald-500/20', 
    text: 'text-emerald-400', 
    border: 'border-emerald-500/20',
    icon: 'pulse'
  },
  'paused': { 
    bg: 'bg-amber-500/20', 
    text: 'text-amber-400', 
    border: 'border-amber-500/20',
    icon: 'pause'
  },
  'completed': { 
    bg: 'bg-emerald-500/10', 
    text: 'text-emerald-400', 
    border: 'border-emerald-500/20',
    icon: 'check-circle'
  }
}
