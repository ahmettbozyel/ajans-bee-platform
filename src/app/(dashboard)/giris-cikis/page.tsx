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
  MessageSquare
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

// Hibrit günler (Salı = 2, Perşembe = 4) - bu günlerde konum alınmaz
const HYBRID_DAYS = [2, 4]

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

// Bugün hibrit gün mü kontrol et
function isHybridDay(date: Date = new Date()): boolean {
  return HYBRID_DAYS.includes(date.getDay())
}

export default function GirisCikisPage() {
  const { appUser, isAdmin } = useAuth()
  const [todayRecords, setTodayRecords] = useState<(Attendance & { user?: AppUser })[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // Geç kalma açıklaması modal state
  const [showLateModal, setShowLateModal] = useState(false)
  const [lateReason, setLateReason] = useState('')
  const [pendingCheckIn, setPendingCheckIn] = useState<{
    now: Date
    location: { lat: number; lng: number } | null
    lateMinutes: number
  } | null>(null)

  // Mesai açıklaması modal state
  const [showOvertimeModal, setShowOvertimeModal] = useState(false)
  const [overtimeReason, setOvertimeReason] = useState('')
  const [pendingCheckOut, setPendingCheckOut] = useState<{
    now: Date
    location: { lat: number; lng: number } | null
    overtimeMinutes: number
    earlyLeaveMinutes: number
  } | null>(null)

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
      // Kullanıcılar (admin değilse sadece kendisi hariç)
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .neq('role', 'admin') // Admin'leri listeden çıkar
        .order('full_name')
      
      if (usersData) setUsers(usersData as AppUser[])

      // Seçili tarihteki tüm kayıtlar (admin hariç)
      const { data: recordsData } = await supabase
        .from('attendance')
        .select('*, user:users(*)')
        .eq('date', selectedDate)
        .order('check_in', { ascending: true })
      
      if (recordsData) {
        // Admin kayıtlarını filtrele
        const filtered = (recordsData as unknown as (Attendance & { user?: AppUser })[])
          .filter(r => r.user?.role !== 'admin')
        setTodayRecords(filtered)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Konum al - sadece ofis günlerinde
  const getLocation = (): Promise<{lat: number, lng: number} | null> => {
    return new Promise((resolve) => {
      // Hibrit günde konum alma
      if (isHybridDay()) {
        resolve(null)
        return
      }
      
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

  // Kendi giriş/çıkışı için (admin için kullanılmayacak)
  const myRecord = todayRecords.find(r => r.user_id === appUser?.id)
  const hasCheckedIn = myRecord?.check_in != null
  const hasCheckedOut = myRecord?.check_out != null

  const handleCheckIn = async () => {
    if (!appUser || isAdmin) return
    setActionLoading(true)
    
    try {
      const now = new Date()
      const location = await getLocation()
      const lateMinutes = calculateLateMinutes(now)
      
      // Geç kaldıysa modal aç
      if (lateMinutes > 0) {
        setPendingCheckIn({ now, location, lateMinutes })
        setShowLateModal(true)
        setActionLoading(false)
        return
      }
      
      // Geç değilse direkt kaydet
      await saveCheckIn(now, location, 0, '')
    } catch (error) {
      console.error('Check-in error:', error)
      setActionLoading(false)
    }
  }

  const saveCheckIn = async (
    now: Date, 
    location: { lat: number; lng: number } | null, 
    lateMinutes: number,
    reason: string
  ) => {
    const today = now.toISOString().split('T')[0]
    const locationType = location ? getLocationType(location.lat, location.lng) : (isHybridDay() ? 'home' : 'unknown')
    const status = lateMinutes > 0 ? 'late' : 'normal'
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkInData: any = {
      user_id: appUser!.id,
      date: today,
      check_in: now.toISOString(),
      late_minutes: lateMinutes,
      status: status,
      check_in_location_type: locationType,
      late_reason: reason || null
    }
    
    if (location) {
      checkInData.check_in_lat = location.lat
      checkInData.check_in_lng = location.lng
    }
    
    if (myRecord) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('attendance')
        .update({ ...checkInData, updated_at: now.toISOString() })
        .eq('id', myRecord.id)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('attendance')
        .insert(checkInData)
    }
    
    setShowLateModal(false)
    setLateReason('')
    setPendingCheckIn(null)
    setActionLoading(false)
    fetchData()
  }

  const handleCheckOut = async () => {
    if (!appUser || !myRecord || isAdmin) return
    setActionLoading(true)
    
    try {
      const now = new Date()
      const location = await getLocation()
      const overtimeMinutes = calculateOvertimeMinutes(now)
      const earlyLeaveMinutes = calculateEarlyLeaveMinutes(now)
      
      // Mesai yaptıysa modal aç
      if (overtimeMinutes > 0) {
        setPendingCheckOut({ now, location, overtimeMinutes, earlyLeaveMinutes })
        setShowOvertimeModal(true)
        setActionLoading(false)
        return
      }
      
      // Mesai yoksa direkt kaydet
      await saveCheckOut(now, location, 0, earlyLeaveMinutes, '')
    } catch (error) {
      console.error('Check-out error:', error)
      setActionLoading(false)
    }
  }

  const saveCheckOut = async (
    now: Date,
    location: { lat: number; lng: number } | null,
    overtimeMinutes: number,
    earlyLeaveMinutes: number,
    reason: string
  ) => {
    const locationType = location ? getLocationType(location.lat, location.lng) : (isHybridDay() ? 'home' : 'unknown')
    
    let status = myRecord!.status || 'normal'
    if (earlyLeaveMinutes > 0) status = 'early_leave'
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkOutData: any = {
      check_out: now.toISOString(),
      overtime_minutes: overtimeMinutes,
      early_leave_minutes: earlyLeaveMinutes,
      check_out_location_type: locationType,
      status: status,
      overtime_reason: reason || null,
      updated_at: now.toISOString()
    }
    
    if (location) {
      checkOutData.check_out_lat = location.lat
      checkOutData.check_out_lng = location.lng
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('attendance')
      .update(checkOutData)
      .eq('id', myRecord!.id)
    
    setShowOvertimeModal(false)
    setOvertimeReason('')
    setPendingCheckOut(null)
    setActionLoading(false)
    fetchData()
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

  // Konum tipi badge
  const getLocationBadge = (type: string | null | undefined) => {
    if (!type || type === 'unknown') return null
    if (type === 'office') {
      return <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Ofis</span>
    }
    if (type === 'home') {
      return <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">Evden</span>
    }
    return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Dışarı</span>
  }

  // Giriş yapmamış kullanıcılar (admin hariç)
  const usersWithoutCheckIn = users.filter(u => 
    !todayRecords.some(r => r.user_id === u.id) && u.role !== 'admin'
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  const isToday = selectedDate === new Date().toISOString().split('T')[0]
  const todayIsHybrid = isHybridDay(new Date(selectedDate))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Giriş / Çıkış Takibi</h1>
        <p className="text-sm text-zinc-400 mt-1">Personel mesai takibi</p>
      </div>

      {/* Current Time + My Status - Sadece personel için, admin için sadece saat */}
      {isToday && (
        <div className={`grid grid-cols-1 ${!isAdmin ? 'md:grid-cols-2' : ''} gap-4`}>
          {/* Current Time */}
          <div className={`p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-center ${isAdmin ? 'md:max-w-md' : ''}`}>
            <Clock className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
            <p className="text-4xl font-bold font-mono text-zinc-100">
              {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-sm text-zinc-400 mt-2">
              {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            {todayIsHybrid && (
              <p className="text-xs text-blue-400 mt-2">🏠 Hibrit Gün (Evden çalışma)</p>
            )}
          </div>

          {/* My Status - Sadece personel için */}
          {!isAdmin && (
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
                  {myRecord?.late_minutes && myRecord.late_minutes > 0 && (
                    <p className="text-xs text-amber-400 mt-1">
                      +{formatMinutes(myRecord.late_minutes)} geç
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
                  {myRecord?.overtime_minutes && myRecord.overtime_minutes > 0 && (
                    <p className="text-xs text-emerald-400 mt-1">
                      +{formatMinutes(myRecord.overtime_minutes)} mesai
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
          )}
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
        {todayIsHybrid && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
            Hibrit
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
                    {isAdmin && getLocationBadge(record.check_in_location_type)}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {record.check_in && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <LogIn className="w-3 h-3" />
                        {formatTime(record.check_in)}
                        {record.late_minutes && record.late_minutes > 0 && (
                          <span className="text-amber-400 ml-1">
                            (+{record.late_minutes}d)
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
                          {record.overtime_minutes && record.overtime_minutes > 0 && (
                            <span className="text-emerald-400 ml-1">
                              (+{record.overtime_minutes}d mesai)
                            </span>
                          )}
                        </span>
                      </>
                    )}
                  </div>
                  {/* Açıklamalar - sadece admin görür */}
                  {isAdmin && (record.late_reason || record.overtime_reason) && (
                    <div className="flex items-center gap-1 mt-1">
                      <MessageSquare className="w-3 h-3 text-zinc-500" />
                      <span className="text-xs text-zinc-500 italic">
                        {record.late_reason || record.overtime_reason}
                      </span>
                    </div>
                  )}
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

      {/* Geç Kalma Açıklaması Modal */}
      {showLateModal && pendingCheckIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Geç Kalma Açıklaması
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              {pendingCheckIn.lateMinutes} dakika geç kaldınız. Lütfen sebebini yazın.
            </p>
            <textarea
              value={lateReason}
              onChange={(e) => setLateReason(e.target.value)}
              placeholder="Geç kalma sebebinizi yazın..."
              className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 text-sm resize-none focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => {
                  setShowLateModal(false)
                  setPendingCheckIn(null)
                  setLateReason('')
                }}
                variant="outline"
                size="sm"
                className="flex-1 border-zinc-700 text-zinc-400"
              >
                İptal
              </Button>
              <Button
                onClick={() => {
                  if (!lateReason.trim()) return
                  saveCheckIn(
                    pendingCheckIn.now,
                    pendingCheckIn.location,
                    pendingCheckIn.lateMinutes,
                    lateReason.trim()
                  )
                }}
                disabled={!lateReason.trim()}
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mesai Açıklaması Modal */}
      {showOvertimeModal && pendingCheckOut && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">
              Mesai Açıklaması
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              {pendingCheckOut.overtimeMinutes} dakika mesai yaptınız. Lütfen ne için çalıştığınızı yazın.
            </p>
            <textarea
              value={overtimeReason}
              onChange={(e) => setOvertimeReason(e.target.value)}
              placeholder="Mesai sebebinizi yazın..."
              className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 text-sm resize-none focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => {
                  setShowOvertimeModal(false)
                  setPendingCheckOut(null)
                  setOvertimeReason('')
                }}
                variant="outline"
                size="sm"
                className="flex-1 border-zinc-700 text-zinc-400"
              >
                İptal
              </Button>
              <Button
                onClick={() => {
                  if (!overtimeReason.trim()) return
                  saveCheckOut(
                    pendingCheckOut.now,
                    pendingCheckOut.location,
                    pendingCheckOut.overtimeMinutes,
                    pendingCheckOut.earlyLeaveMinutes,
                    overtimeReason.trim()
                  )
                }}
                disabled={!overtimeReason.trim()}
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
