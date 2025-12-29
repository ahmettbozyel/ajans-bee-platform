'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Attendance, AppUser } from '@/lib/auth-types'
import { 
  Clock, 
  LogIn, 
  LogOut,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Users,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Ofis koordinatları - Modda Suites, Bayraklı/İzmir
const OFFICE_LOCATION = {
  lat: 38.452324,
  lng: 27.186422,
  radius: 100 // metre
}

const WORK_HOURS = {
  start: '09:00',
  end: '18:30',
  toleranceMinutes: 0
}

// İki koordinat arası mesafe hesapla (metre)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000 // Dünya yarıçapı (metre)
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Konum tipini belirle
function getLocationType(lat: number, lng: number): 'office' | 'home' | 'other' {
  const distance = calculateDistance(lat, lng, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng)
  return distance <= OFFICE_LOCATION.radius ? 'office' : 'other'
}

// Geç kalma hesapla (dakika)
function calculateLateMinutes(checkInTime: Date): number {
  const [startHour, startMinute] = WORK_HOURS.start.split(':').map(Number)
  const workStart = new Date(checkInTime)
  workStart.setHours(startHour, startMinute, 0, 0)
  
  const diffMs = checkInTime.getTime() - workStart.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  // Tolerans içindeyse 0
  if (diffMinutes <= WORK_HOURS.toleranceMinutes) return 0
  return diffMinutes > 0 ? diffMinutes : 0
}

// Mesai hesapla (dakika)
function calculateOvertimeMinutes(checkOutTime: Date): number {
  const [endHour, endMinute] = WORK_HOURS.end.split(':').map(Number)
  const workEnd = new Date(checkOutTime)
  workEnd.setHours(endHour, endMinute, 0, 0)
  
  const diffMs = checkOutTime.getTime() - workEnd.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  return diffMinutes > 0 ? diffMinutes : 0
}

// Erken çıkış hesapla (dakika)
function calculateEarlyLeaveMinutes(checkOutTime: Date): number {
  const [endHour, endMinute] = WORK_HOURS.end.split(':').map(Number)
  const workEnd = new Date(checkOutTime)
  workEnd.setHours(endHour, endMinute, 0, 0)
  
  const diffMs = workEnd.getTime() - checkOutTime.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  return diffMinutes > 0 ? diffMinutes : 0
}

export default function GirisCikisPage() {
  const { appUser, isAdmin } = useAuth()
  const [todayRecords, setTodayRecords] = useState<(Attendance & { user?: AppUser })[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [locationError, setLocationError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchData()
  }, [selectedDate])

  const fetchData = async () => {
    if (!appUser) return
    setLoading(true)
    try {
      // Kullanıcılar
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .order('full_name')
      
      if (usersData) setUsers(usersData as AppUser[])

      // Seçili tarihteki tüm kayıtlar
      const { data: recordsData } = await (supabase as any)
        .from('attendance')
        .select('*, user:users(*)')
        .eq('date', selectedDate)
        .order('check_in', { ascending: true })
      
      if (recordsData) setTodayRecords(recordsData as (Attendance & { user?: AppUser })[])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Konum al (gizli - kullanıcıya sormadan)
  const getLocation = (): Promise<{lat: number, lng: number} | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          // Hata olsa bile devam et, konum olmadan kaydet
          resolve(null)
        },
        { 
          enableHighAccuracy: true, 
          timeout: 5000, 
          maximumAge: 0 
        }
      )
    })
  }

  // Kendi giriş/çıkışı için
  const myRecord = todayRecords.find(r => r.user_id === appUser?.id)
  const hasCheckedIn = myRecord?.check_in != null
  const hasCheckedOut = myRecord?.check_out != null

  const handleCheckIn = async () => {
    if (!appUser) return
    setActionLoading(true)
    setLocationError(null)
    
    try {
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const location = await getLocation()
      
      const lateMinutes = calculateLateMinutes(now)
      const locationType = location ? getLocationType(location.lat, location.lng) : 'unknown'
      const status = lateMinutes > 0 ? 'late' : 'normal'
      
      const checkInData: any = {
        user_id: appUser.id,
        date: today,
        check_in: now.toISOString(),
        late_minutes: lateMinutes,
        status: status,
        check_in_location_type: locationType
      }
      
      if (location) {
        checkInData.check_in_lat = location.lat
        checkInData.check_in_lng = location.lng
      }
      
      if (myRecord) {
        await (supabase as any)
          .from('attendance')
          .update({ 
            ...checkInData, 
            updated_at: now.toISOString() 
          })
          .eq('id', myRecord.id)
      } else {
        await (supabase as any)
          .from('attendance')
          .insert(checkInData)
      }
      
      fetchData()
    } catch (error) {
      console.error('Check-in error:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!appUser || !myRecord) return
    setActionLoading(true)
    
    try {
      const now = new Date()
      const location = await getLocation()
      
      const overtimeMinutes = calculateOvertimeMinutes(now)
      const earlyLeaveMinutes = calculateEarlyLeaveMinutes(now)
      const locationType = location ? getLocationType(location.lat, location.lng) : 'unknown'
      
      let status = myRecord.status || 'normal'
      if (earlyLeaveMinutes > 0) status = 'early_leave'
      
      const checkOutData: any = {
        check_out: now.toISOString(),
        overtime_minutes: overtimeMinutes,
        early_leave_minutes: earlyLeaveMinutes,
        check_out_location_type: locationType,
        status: status,
        updated_at: now.toISOString()
      }
      
      if (location) {
        checkOutData.check_out_lat = location.lat
        checkOutData.check_out_lng = location.lng
      }
      
      await (supabase as any)
        .from('attendance')
        .update(checkOutData)
        .eq('id', myRecord.id)
      
      fetchData()
    } catch (error) {
      console.error('Check-out error:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '-'
    return new Date(isoString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const calculateDuration = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return '-'
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = end.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}s ${minutes}d`
  }

  const formatMinutes = (minutes: number | null | undefined) => {
    if (!minutes || minutes === 0) return null
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h > 0) return `${h}s ${m}d`
    return `${m}d`
  }

  // Konum tipi ikonu/rengi
  const getLocationBadge = (type: string | null | undefined) => {
    if (!type || type === 'unknown') return null
    if (type === 'office') {
      return <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Ofis</span>
    }
    return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Dışarı</span>
  }

  // Giriş yapmamış kullanıcılar
  const usersWithoutCheckIn = users.filter(u => 
    !todayRecords.some(r => r.user_id === u.id)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  const isToday = selectedDate === new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Giriş / Çıkış Takibi</h1>
        <p className="text-sm text-zinc-400 mt-1">Personel mesai takibi</p>
      </div>

      {/* Current Time + My Status (Bugün ise) */}
      {isToday && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Time */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-center">
            <Clock className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
            <p className="text-4xl font-bold font-mono text-zinc-100">
              {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-sm text-zinc-400 mt-2">
              {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          {/* My Status */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Benim Durumum</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-center gap-2 mb-1">
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-zinc-400">Giriş</span>
                </div>
                <p className="text-xl font-bold font-mono text-zinc-100">
                  {formatTime(myRecord?.check_in || null)}
                </p>
                {(myRecord as any)?.late_minutes > 0 && (
                  <p className="text-xs text-amber-400 mt-1">
                    +{formatMinutes((myRecord as any)?.late_minutes)} geç
                  </p>
                )}
              </div>
              <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-center gap-2 mb-1">
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span className="text-xs text-zinc-400">Çıkış</span>
                </div>
                <p className="text-xl font-bold font-mono text-zinc-100">
                  {formatTime(myRecord?.check_out || null)}
                </p>
                {(myRecord as any)?.overtime_minutes > 0 && (
                  <p className="text-xs text-emerald-400 mt-1">
                    +{formatMinutes((myRecord as any)?.overtime_minutes)} mesai
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCheckIn}
                disabled={actionLoading || hasCheckedOut}
                size="sm"
                className={`flex-1 ${hasCheckedIn ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {actionLoading && !hasCheckedIn ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : hasCheckedIn ? (
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                ) : (
                  <LogIn className="w-4 h-4 mr-1" />
                )}
                {hasCheckedIn ? 'Giriş OK' : 'Geldim'}
              </Button>
              <Button
                onClick={handleCheckOut}
                disabled={actionLoading || !hasCheckedIn || hasCheckedOut}
                size="sm"
                className={`flex-1 ${hasCheckedOut ? 'bg-rose-600/20 text-rose-400 border border-rose-600/30' : 'bg-rose-600 hover:bg-rose-700'}`}
              >
                {actionLoading && hasCheckedIn && !hasCheckedOut ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : hasCheckedOut ? (
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                ) : (
                  <LogOut className="w-4 h-4 mr-1" />
                )}
                {hasCheckedOut ? 'Çıkış OK' : 'Gittim'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Date Filter */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
        <Calendar className="w-5 h-5 text-indigo-400" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-transparent border-none text-zinc-100 font-medium focus:outline-none"
        />
        <span className="text-zinc-400 text-sm">{formatDate(selectedDate)}</span>
        {isToday && (
          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
            Bugün
          </span>
        )}
      </div>

      {/* All Records */}
      <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
        <div className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Personel Durumu
          </h2>
          <span className="text-sm text-zinc-400">
            {todayRecords.length} / {users.length} kişi
          </span>
        </div>
        
        <div className="divide-y divide-zinc-800">
          {/* Giriş yapmış olanlar */}
          {todayRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {record.user?.full_name?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-100">
                      {record.user?.full_name || 'Bilinmeyen'}
                    </p>
                    {/* Admin için konum badge'i göster */}
                    {isAdmin && getLocationBadge((record as any)?.check_in_location_type)}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {record.check_in && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <LogIn className="w-3 h-3" />
                        {formatTime(record.check_in)}
                        {(record as any)?.late_minutes > 0 && (
                          <span className="text-amber-400 ml-1">
                            (+{(record as any)?.late_minutes}d)
                          </span>
                        )}
                      </span>
                    )}
                    {record.check_out && (
                      <>
                        <span className="text-zinc-600">→</span>
                        <span className="text-xs text-rose-400 flex items-center gap-1">
                          <LogOut className="w-3 h-3" />
                          {formatTime(record.check_out)}
                          {(record as any)?.overtime_minutes > 0 && (
                            <span className="text-emerald-400 ml-1">
                              (+{(record as any)?.overtime_minutes}d mesai)
                            </span>
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {record.check_out ? (
                  <span className="text-sm font-mono text-zinc-400">
                    {calculateDuration(record.check_in, record.check_out)}
                  </span>
                ) : record.check_in ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                    Çalışıyor
                  </span>
                ) : null}
              </div>
            </div>
          ))}
          
          {/* Giriş yapmamış olanlar */}
          {usersWithoutCheckIn.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 opacity-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                  <span className="text-zinc-400 text-sm font-bold">
                    {user.full_name?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-400">{user.full_name}</p>
                  <p className="text-xs text-zinc-500">Henüz giriş yapmadı</p>
                </div>
              </div>
              <AlertCircle className="w-5 h-5 text-amber-500/50" />
            </div>
          ))}
          
          {todayRecords.length === 0 && usersWithoutCheckIn.length === 0 && (
            <div className="p-8 text-center text-zinc-500">
              Kayıt bulunamadı
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
