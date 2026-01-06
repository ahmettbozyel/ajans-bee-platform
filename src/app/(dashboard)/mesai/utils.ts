import { OFFICE_LOCATION, WORK_HOURS } from './constants'
import { MonthlyStats } from './types'

// Distance calculation using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

// Determine if location is office or other
export function getLocationType(lat: number, lng: number): 'office' | 'home' | 'other' {
  return calculateDistance(lat, lng, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng) <= OFFICE_LOCATION.radius ? 'office' : 'other'
}

// Calculate late minutes based on check-in time
export function calculateLateMinutes(checkInTime: Date): number {
  const [startHour, startMinute] = WORK_HOURS.start.split(':').map(Number)
  const workStart = new Date(checkInTime)
  workStart.setHours(startHour, startMinute, 0, 0)
  const diffMinutes = Math.floor((checkInTime.getTime() - workStart.getTime()) / 60000)
  return diffMinutes <= WORK_HOURS.toleranceMinutes ? 0 : Math.max(0, diffMinutes)
}

// Calculate overtime minutes based on check-out time
export function calculateOvertimeMinutes(checkOutTime: Date): number {
  const [endHour, endMinute] = WORK_HOURS.end.split(':').map(Number)
  const workEnd = new Date(checkOutTime)
  workEnd.setHours(endHour, endMinute, 0, 0)
  return Math.max(0, Math.floor((checkOutTime.getTime() - workEnd.getTime()) / 60000))
}

// Calculate early leave minutes
export function calculateEarlyLeaveMinutes(checkOutTime: Date): number {
  const [endHour, endMinute] = WORK_HOURS.end.split(':').map(Number)
  const workEnd = new Date(checkOutTime)
  workEnd.setHours(endHour, endMinute, 0, 0)
  return Math.max(0, Math.floor((workEnd.getTime() - checkOutTime.getTime()) / 60000))
}

// Format time from ISO string
export function formatTime(isoString: string | null): string {
  if (!isoString) return '--:--'
  return new Date(isoString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

// Format short date
export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })
}

// Calculate duration between check-in and check-out
export function calculateDuration(checkIn: string | null, checkOut: string | null): string {
  if (!checkIn || !checkOut) return '--'
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return `${Math.floor(diff / 3600000)}s ${Math.floor((diff % 3600000) / 60000)}d`
}

// Format minutes to human readable string
export function formatMinutes(minutes: number | null | undefined): string | null {
  if (!minutes || minutes === 0) return null
  const h = Math.floor(minutes / 60), m = minutes % 60
  return h > 0 ? (m > 0 ? `${h}s ${m}d` : `${h}s`) : `${m}d`
}

// Format minutes to hours for display
export function formatMinutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60), m = minutes % 60
  return h > 0 ? `+${h}s` : `+${m}d`
}

// Get geolocation
export function getLocation(): Promise<{lat: number, lng: number} | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    )
  })
}

// Avatar colors
export const avatarColors = [
  'from-rose-500 to-pink-600',
  'from-violet-500 to-purple-600',
  'from-indigo-500 to-blue-600',
  'from-cyan-500 to-teal-600',
  'from-emerald-500 to-green-600',
  'from-amber-500 to-orange-600'
]

export function getAvatarColor(name: string): string {
  return avatarColors[name?.charCodeAt(0) % avatarColors.length || 0]
}

// MonthlyStats hesaplama - attendance kayıtlarından istatistik çıkar
export function calculateMonthlyStats(monthData: any[]): MonthlyStats {
  const stats: MonthlyStats = {}
  monthData.forEach((r: any) => {
    if (!stats[r.user_id]) stats[r.user_id] = { overtime: 0, late: 0, lateDays: 0 }
    stats[r.user_id].overtime += r.overtime_minutes || 0
    stats[r.user_id].late += r.late_minutes || 0
    if (r.late_minutes && r.late_minutes > 0) stats[r.user_id].lateDays += 1
  })
  return stats
}

// Location type belirleme - konum ve hybrid durumuna göre
export function determineLocationType(
  location: { lat: number; lng: number } | null,
  isHybridDay: boolean
): 'office' | 'home' | 'other' | 'unknown' {
  if (location) {
    const isInOffice = getLocationType(location.lat, location.lng) === 'office'
    if (isInOffice) return 'office'
    if (isHybridDay) return 'home'
    return 'other'
  }
  return isHybridDay ? 'home' : 'unknown'
}
