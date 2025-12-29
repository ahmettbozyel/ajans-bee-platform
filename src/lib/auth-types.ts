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

// Günlük iş
export interface DailyTask {
  id: string
  user_id: string
  brand_id: string | null
  category_id: string
  date: string
  description: string
  duration_minutes: number | null
  created_at: string
  updated_at: string
  // Relations
  category?: TaskCategory
  brand?: { id: string; brand_name: string } | null
  user?: { full_name: string }
}

// Attendance status types
export type AttendanceStatus = 'normal' | 'late' | 'early_leave' | 'absent' | 'leave' | 'remote' | 'holiday'
export type LocationType = 'office' | 'home' | 'other' | 'unknown'
export type LeaveType = 'annual' | 'sick' | 'remote' | 'half_day' | 'official_holiday' | 'other'

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
  // İzin bilgileri
  leave_type?: LeaveType | null
  leave_reason?: string | null
  // Açıklamalar
  late_reason?: string | null
  overtime_reason?: string | null
}
