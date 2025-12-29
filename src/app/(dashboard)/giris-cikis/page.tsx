'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Attendance, AppUser } from '@/lib/auth-types'
import { notifyAdmins } from '@/lib/notifications'
import { ManualEntryModal } from './components/manual-entry-modal'
import { 
  Clock, 
  LogIn, 
  LogOut,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Users,
  MessageSquare,
  History,
  TrendingUp,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  Plus,
  Palmtree,
  Stethoscope,
  Home as HomeIcon,
  CalendarOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import * as XLSX from 'xlsx'

// Ofis lokasyonu - Ajans Bee İzmir
const OFFICE_LOCATION = { lat: 38.450468, lng: 27.186318, radius: 100 }
const WORK_HOURS = { start: '09:00', end: '18:30', toleranceMinutes: 0 }
const HYBRID_DAYS = [2, 4] // Salı ve Perşembe

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function getLocationType(lat: number, lng: number): 'office' | 'home' | 'other' {
  return calculateDistance(lat, lng, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng) <= OFFICE_LOCATION.radius ? 'office' : 'other'
}

function calculateLateMinutes(checkInTime: Date): number {
  const [startHour, startMinute] = WORK_HOURS.start.split(':').map(Number)
  const workStart = new Date(checkInTime)
  workStart.setHours(startHour, startMinute, 0, 0)
  const diffMinutes = Math.floor((checkInTime.getTime() - workStart.getTime()) / 60000)
  return diffMinutes <= WORK_HOURS.toleranceMinutes ? 0 : Math.max(0, diffMinutes)
}

function calculateOvertimeMinutes(checkOutTime: Date): number {
  const [endHour, endMinute] = WORK_HOURS.end.split(':').map(Number)
  const workEnd = new Date(checkOutTime)
  workEnd.setHours(endHour, endMinute, 0, 0)
  return Math.max(0, Math.floor((checkOutTime.getTime() - workEnd.getTime()) / 60000))
}

function calculateEarlyLeaveMinutes(checkOutTime: Date): number {
  const [endHour, endMinute] = WORK_HOURS.end.split(':').map(Number)
  const workEnd = new Date(checkOutTime)
  workEnd.setHours(endHour, endMinute, 0, 0)
  return Math.max(0, Math.floor((workEnd.getTime() - checkOutTime.getTime()) / 60000))
}

function isHybridDay(date: Date = new Date()): boolean {
  return HYBRID_DAYS.includes(date.getDay())
}

function getRecordTypeBadge(recordType: string | null | undefined) {
  if (!recordType || recordType === 'normal') return null
  const badges: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
    leave: { icon: <Palmtree className="w-3 h-3" />, label: 'İzin', className: 'bg-emerald-500/20 text-emerald-400' },
    sick: { icon: <Stethoscope className="w-3 h-3" />, label: 'Rapor', className: 'bg-rose-500/20 text-rose-400' },
    remote: { icon: <HomeIcon className="w-3 h-3" />, label: 'Evden', className: 'bg-blue-500/20 text-blue-400' },
    holiday: { icon: <CalendarOff className="w-3 h-3" />, label: 'Tatil', className: 'bg-amber-500/20 text-amber-400' },
  }
  const badge = badges[recordType]
  if (!badge) return null
  return <span className={cn("text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1", badge.className)}>{badge.icon}{badge.label}</span>
}

export default function GirisCikisPage() {
  const { appUser, isAdmin } = useAuth()
  const [todayRecords, setTodayRecords] = useState<(Attendance & { user?: AppUser })[]>([])
  const [myHistory, setMyHistory] = useState<Attendance[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [showManualModal, setShowManualModal] = useState(false)
  const [showLateModal, setShowLateModal] = useState(false)
  const [lateReason, setLateReason] = useState('')
  const [pendingCheckIn, setPendingCheckIn] = useState<{ now: Date; location: { lat: number; lng: number } | null; lateMinutes: number } | null>(null)
  const [showOvertimeModal, setShowOvertimeModal] = useState(false)
  const [overtimeReason, setOvertimeReason] = useState('')
  const [pendingCheckOut, setPendingCheckOut] = useState<{ now: Date; location: { lat: number; lng: number } | null; overtimeMinutes: number; earlyLeaveMinutes: number } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => { fetchData() }, [selectedDate])

  const fetchData = async () => {
    if (!appUser) return
    setLoading(true)
    try {
      if (isAdmin) {
        const { data: usersData } = await supabase.from('users').select('*').eq('is_active', true).neq('role', 'admin').order('full_name')
        if (usersData) setUsers(usersData as AppUser[])
        const { data: recordsData } = await supabase.from('attendance').select('*, user:users(*)').eq('date', selectedDate).order('check_in', { ascending: true })
        if (recordsData) setTodayRecords((recordsData as unknown as (Attendance & { user?: AppUser })[]).filter(r => r.user?.role !== 'admin'))
      } else {
        const { data: todayData } = await supabase.from('attendance').select('*').eq('user_id', appUser.id).eq('date', selectedDate).single()
        setTodayRecords(todayData ? [todayData as Attendance] : [])
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const { data: historyData } = await supabase.from('attendance').select('*').eq('user_id', appUser.id).gte('date', thirtyDaysAgo.toISOString().split('T')[0]).order('date', { ascending: false })
        if (historyData) setMyHistory(historyData as Attendance[])
      }
    } catch (error) { console.error('Fetch error:', error) }
    finally { setLoading(false) }
  }

  const handleExportExcel = async () => {
    if (!isAdmin) return
    setExportLoading(true)
    try {
      const [year, month] = selectedMonth.split('-').map(Number)
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]
      const { data: records, error } = await supabase.from('attendance').select('*, user:users(full_name, email, role)').gte('date', startDate).lte('date', endDate).order('date', { ascending: true }).order('user_id', { ascending: true })
      if (error) throw error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredRecords = (records as any[])?.filter(r => r.user?.role !== 'admin') || []
      if (filteredRecords.length === 0) { alert('Bu ay için kayıt bulunamadı.'); setExportLoading(false); return }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mainData = filteredRecords.map((record: any) => {
        const date = new Date(record.date)
        const dayName = date.toLocaleDateString('tr-TR', { weekday: 'long' })
        const checkIn = record.check_in ? new Date(record.check_in).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'
        const checkOut = record.check_out ? new Date(record.check_out).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'
        let duration = '-'
        if (record.check_in && record.check_out) {
          const diff = new Date(record.check_out).getTime() - new Date(record.check_in).getTime()
          duration = `${Math.floor(diff / 3600000)}s ${Math.floor((diff % 3600000) / 60000)}d`
        }
        const locationType = record.check_in_location_type === 'office' ? 'Ofis' : record.check_in_location_type === 'home' ? 'Evden' : record.check_in_location_type === 'other' ? 'Dışarı' : '-'
        const recordTypeLabels: Record<string, string> = { normal: 'Normal', leave: 'İzin', sick: 'Rapor', remote: 'Evden Çalışma', holiday: 'Tatil' }
        const status = record.record_type && record.record_type !== 'normal' ? recordTypeLabels[record.record_type] || '-' : record.status === 'late' ? 'Geç' : record.status === 'early_leave' ? 'Erken Çıkış' : record.status === 'normal' ? 'Normal' : '-'
        return { 'Personel': record.user?.full_name || '-', 'Tarih': new Date(record.date).toLocaleDateString('tr-TR'), 'Gün': dayName, 'Giriş': checkIn, 'Çıkış': checkOut, 'Geç (dk)': record.late_minutes || 0, 'Mesai (dk)': record.overtime_minutes || 0, 'Erken Çıkış (dk)': record.early_leave_minutes || 0, 'Toplam Süre': duration, 'Konum': locationType, 'Durum': status, 'Geç Sebebi': record.late_reason || '', 'Mesai Sebebi': record.overtime_reason || '', 'Admin Notu': record.admin_notes || '' }
      })
      const summary: { [key: string]: { late: number; overtime: number; earlyLeave: number; days: number; leave: number; sick: number; remote: number } } = {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filteredRecords.forEach((record: any) => {
        const name = record.user?.full_name || 'Bilinmeyen'
        if (!summary[name]) summary[name] = { late: 0, overtime: 0, earlyLeave: 0, days: 0, leave: 0, sick: 0, remote: 0 }
        summary[name].late += record.late_minutes || 0
        summary[name].overtime += record.overtime_minutes || 0
        summary[name].earlyLeave += record.early_leave_minutes || 0
        summary[name].days += 1
        if (record.record_type === 'leave') summary[name].leave += 1
        if (record.record_type === 'sick') summary[name].sick += 1
        if (record.record_type === 'remote') summary[name].remote += 1
      })
      const summaryData = Object.entries(summary).map(([name, data]) => ({ 'Personel': name, 'Toplam Gün': data.days, 'İzin Günü': data.leave, 'Rapor Günü': data.sick, 'Evden Çalışma': data.remote, 'Toplam Geç (dk)': data.late, 'Toplam Mesai (dk)': data.overtime, 'Toplam Erken Çıkış (dk)': data.earlyLeave }))
      const wb = XLSX.utils.book_new()
      const wsMain = XLSX.utils.json_to_sheet(mainData)
      wsMain['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 30 }, { wch: 30 }, { wch: 30 }]
      XLSX.utils.book_append_sheet(wb, wsMain, 'Detay')
      const wsSummary = XLSX.utils.json_to_sheet(summaryData)
      wsSummary['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Özet')
      const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
      XLSX.writeFile(wb, `Mesai-Raporu-${monthNames[month - 1]}-${year}.xlsx`)
    } catch (error) { console.error('Export error:', error); alert('Excel oluşturulurken hata oluştu.') }
    finally { setExportLoading(false) }
  }

  const getLocation = (): Promise<{lat: number, lng: number} | null> => {
    return new Promise((resolve) => {
      if (isHybridDay()) { resolve(null); return }
      if (!navigator.geolocation) { resolve(null); return }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      )
    })
  }

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
      if (lateMinutes > 0) { setPendingCheckIn({ now, location, lateMinutes }); setShowLateModal(true); setActionLoading(false); return }
      await saveCheckIn(now, location, 0, '')
    } catch (error) { console.error('Check-in error:', error); setActionLoading(false) }
  }

  const saveCheckIn = async (now: Date, location: { lat: number; lng: number } | null, lateMinutes: number, reason: string) => {
    const today = now.toISOString().split('T')[0]
    const locationType = location ? getLocationType(location.lat, location.lng) : (isHybridDay() ? 'home' : 'unknown')
    const status = lateMinutes > 0 ? 'late' : 'normal'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkInData: any = { user_id: appUser!.id, date: today, check_in: now.toISOString(), late_minutes: lateMinutes, status, check_in_location_type: locationType, late_reason: reason || null, record_type: 'normal' }
    if (location) { checkInData.check_in_lat = location.lat; checkInData.check_in_lng = location.lng }
    
    if (myRecord) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('attendance').update({ ...checkInData, updated_at: now.toISOString() }).eq('id', myRecord.id)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('attendance').insert(checkInData)
    }
    
    // 🔔 Geç kalma bildirimi gönder
    if (lateMinutes > 0 && appUser) {
      await notifyAdmins(supabase, {
        type: 'late',
        title: `${appUser.full_name} geç kaldı`,
        message: `${lateMinutes} dakika geç giriş. Sebep: ${reason || 'Belirtilmedi'}`,
        related_user_id: appUser.id
      })
    }
    
    setShowLateModal(false); setLateReason(''); setPendingCheckIn(null); setActionLoading(false); fetchData()
  }

  const handleCheckOut = async () => {
    if (!appUser || !myRecord || isAdmin) return
    setActionLoading(true)
    try {
      const now = new Date()
      const location = await getLocation()
      const overtimeMinutes = calculateOvertimeMinutes(now)
      const earlyLeaveMinutes = calculateEarlyLeaveMinutes(now)
      if (overtimeMinutes > 0) { setPendingCheckOut({ now, location, overtimeMinutes, earlyLeaveMinutes }); setShowOvertimeModal(true); setActionLoading(false); return }
      await saveCheckOut(now, location, 0, earlyLeaveMinutes, '')
    } catch (error) { console.error('Check-out error:', error); setActionLoading(false) }
  }

  const saveCheckOut = async (now: Date, location: { lat: number; lng: number } | null, overtimeMinutes: number, earlyLeaveMinutes: number, reason: string) => {
    const locationType = location ? getLocationType(location.lat, location.lng) : (isHybridDay() ? 'home' : 'unknown')
    let status = myRecord!.status || 'normal'
    if (earlyLeaveMinutes > 0) status = 'early_leave'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkOutData: any = { check_out: now.toISOString(), overtime_minutes: overtimeMinutes, early_leave_minutes: earlyLeaveMinutes, check_out_location_type: locationType, status, overtime_reason: reason || null, updated_at: now.toISOString() }
    if (location) { checkOutData.check_out_lat = location.lat; checkOutData.check_out_lng = location.lng }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('attendance').update(checkOutData).eq('id', myRecord!.id)
    
    // 🔔 Mesai bildirimi gönder
    if (overtimeMinutes > 0 && appUser) {
      await notifyAdmins(supabase, {
        type: 'overtime',
        title: `${appUser.full_name} mesai yaptı`,
        message: `${overtimeMinutes} dakika mesai. Sebep: ${reason || 'Belirtilmedi'}`,
        related_user_id: appUser.id
      })
    }
    
    // 🔔 Erken çıkış bildirimi gönder
    if (earlyLeaveMinutes > 15 && appUser) {
      await notifyAdmins(supabase, {
        type: 'early_leave',
        title: `${appUser.full_name} erken çıktı`,
        message: `${earlyLeaveMinutes} dakika erken çıkış.`,
        related_user_id: appUser.id
      })
    }
    
    setShowOvertimeModal(false); setOvertimeReason(''); setPendingCheckOut(null); setActionLoading(false); fetchData()
  }

  const formatTime = (isoString: string | null) => !isoString ? '-' : new Date(isoString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const formatShortDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })
  const calculateDuration = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return '-'
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return `${Math.floor(diff / 3600000)}s ${Math.floor((diff % 3600000) / 60000)}d`
  }
  const formatMinutes = (minutes: number | null | undefined) => {
    if (!minutes || minutes === 0) return null
    const h = Math.floor(minutes / 60), m = minutes % 60
    return h > 0 ? (m > 0 ? `${h}s ${m}d` : `${h}s`) : `${m}d`
  }
  const getLocationBadge = (type: string | null | undefined) => {
    if (!type || type === 'unknown') return null
    if (type === 'office') return <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Ofis</span>
    if (type === 'home') return <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">Evden</span>
    return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Dışarı</span>
  }
  const getRecordStatus = (record: Attendance): { color: string; icon: React.ReactNode; label: string } => {
    if (record.record_type && record.record_type !== 'normal') {
      const types: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
        leave: { color: 'emerald', icon: <Palmtree className="w-4 h-4" />, label: 'İzin' },
        sick: { color: 'rose', icon: <Stethoscope className="w-4 h-4" />, label: 'Rapor' },
        remote: { color: 'blue', icon: <HomeIcon className="w-4 h-4" />, label: 'Evden' },
        holiday: { color: 'amber', icon: <CalendarOff className="w-4 h-4" />, label: 'Tatil' },
      }
      return types[record.record_type] || { color: 'zinc', icon: <AlertCircle className="w-4 h-4" />, label: '-' }
    }
    const hasLate = record.late_minutes && record.late_minutes > 0
    const hasOvertime = record.overtime_minutes && record.overtime_minutes > 0
    const hasEarlyLeave = record.early_leave_minutes && record.early_leave_minutes > 0
    if (hasLate && hasOvertime) return { color: 'amber', icon: <AlertTriangle className="w-4 h-4" />, label: 'Geç + Mesai' }
    if (hasLate) return { color: 'rose', icon: <AlertCircle className="w-4 h-4" />, label: 'Geç Kalma' }
    if (hasOvertime) return { color: 'amber', icon: <TrendingUp className="w-4 h-4" />, label: 'Mesai' }
    if (hasEarlyLeave) return { color: 'orange', icon: <AlertTriangle className="w-4 h-4" />, label: 'Erken Çıkış' }
    return { color: 'emerald', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Zamanında' }
  }
  const usersWithoutCheckIn = users.filter(u => !todayRecords.some(r => r.user_id === u.id) && u.role !== 'admin')

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>

  const isToday = selectedDate === new Date().toISOString().split('T')[0]
  const todayIsHybrid = isHybridDay(new Date(selectedDate))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Giriş / Çıkış Takibi</h1>
          <p className="text-sm text-zinc-400 mt-1">{isAdmin ? 'Personel mesai takibi' : 'Mesai kayıtlarım'}</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-3">
            <Button onClick={() => setShowManualModal(true)} size="sm" variant="outline" className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"><Plus className="w-4 h-4 mr-2" />Manuel Kayıt</Button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-transparent border-none text-zinc-100 text-sm focus:outline-none w-32" />
            </div>
            <Button onClick={handleExportExcel} disabled={exportLoading} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              {exportLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}Excel İndir
            </Button>
          </div>
        )}
      </div>

      {isToday && (
        <div className={`grid grid-cols-1 ${!isAdmin ? 'md:grid-cols-2' : ''} gap-4`}>
          <div className={`p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-center ${isAdmin ? 'md:max-w-md' : ''}`}>
            <Clock className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
            <p className="text-4xl font-bold font-mono text-zinc-100">{currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
            <p className="text-sm text-zinc-400 mt-2">{currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            {todayIsHybrid && <p className="text-xs text-blue-400 mt-2">🏠 Hibrit Gün (Evden çalışma)</p>}
          </div>
          {!isAdmin && (
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">Benim Durumum</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
                  <div className="flex items-center gap-2 mb-1"><LogIn className="w-4 h-4 text-emerald-400" /><span className="text-xs text-zinc-400">Giriş</span></div>
                  <p className="text-xl font-bold font-mono text-zinc-100">{formatTime(myRecord?.check_in || null)}</p>
                  {myRecord?.late_minutes && myRecord.late_minutes > 0 && <p className="text-xs text-rose-400 mt-1">+{formatMinutes(myRecord.late_minutes)} geç</p>}
                </div>
                <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
                  <div className="flex items-center gap-2 mb-1"><LogOut className="w-4 h-4 text-rose-400" /><span className="text-xs text-zinc-400">Çıkış</span></div>
                  <p className="text-xl font-bold font-mono text-zinc-100">{formatTime(myRecord?.check_out || null)}</p>
                  {myRecord?.overtime_minutes && myRecord.overtime_minutes > 0 && <p className="text-xs text-amber-400 mt-1">+{formatMinutes(myRecord.overtime_minutes)} mesai</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCheckIn} disabled={actionLoading || hasCheckedOut} size="sm" className={`flex-1 ${hasCheckedIn ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                  {actionLoading && !hasCheckedIn ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : hasCheckedIn ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <LogIn className="w-4 h-4 mr-1" />}{hasCheckedIn ? 'Giriş OK' : 'Geldim'}
                </Button>
                <Button onClick={handleCheckOut} disabled={actionLoading || !hasCheckedIn || hasCheckedOut} size="sm" className={`flex-1 ${hasCheckedOut ? 'bg-rose-600/20 text-rose-400 border border-rose-600/30' : 'bg-rose-600 hover:bg-rose-700'}`}>
                  {actionLoading && hasCheckedIn && !hasCheckedOut ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : hasCheckedOut ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <LogOut className="w-4 h-4 mr-1" />}{hasCheckedOut ? 'Çıkış OK' : 'Gittim'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent border-none text-zinc-100 font-medium focus:outline-none" />
          <span className="text-zinc-400 text-sm">{formatDate(selectedDate)}</span>
          {isToday && <span className="ml-2 text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Bugün</span>}
          {todayIsHybrid && <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">Hibrit</span>}
        </div>
      )}

      {isAdmin && (
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
          <div className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2"><Users className="w-5 h-5 text-indigo-400" />Personel Durumu</h2>
            <span className="text-sm text-zinc-400">{todayRecords.length} / {users.length} kişi</span>
          </div>
          <div className="divide-y divide-zinc-800">
            {todayRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center"><span className="text-white text-sm font-bold">{record.user?.full_name?.charAt(0) || '?'}</span></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-zinc-100">{record.user?.full_name || 'Bilinmeyen'}</p>
                      {getRecordTypeBadge(record.record_type)}
                      {!record.record_type || record.record_type === 'normal' ? getLocationBadge(record.check_in_location_type) : null}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {record.check_in && <span className="text-xs text-emerald-400 flex items-center gap-1"><LogIn className="w-3 h-3" />{formatTime(record.check_in)}{record.late_minutes && record.late_minutes > 0 && <span className="text-rose-400 ml-1">(+{formatMinutes(record.late_minutes)})</span>}</span>}
                      {record.check_out && <><span className="text-zinc-600">→</span><span className="text-xs text-rose-400 flex items-center gap-1"><LogOut className="w-3 h-3" />{formatTime(record.check_out)}{record.overtime_minutes && record.overtime_minutes > 0 && <span className="text-amber-400 ml-1">(+{formatMinutes(record.overtime_minutes)} mesai)</span>}</span></>}
                      {!record.check_in && record.record_type && record.record_type !== 'normal' && <span className="text-xs text-zinc-500">Tam gün</span>}
                    </div>
                    {(record.late_reason || record.overtime_reason || record.admin_notes) && <div className="flex items-center gap-1 mt-1"><MessageSquare className="w-3 h-3 text-zinc-500" /><span className="text-xs text-zinc-500 italic">{record.late_reason || record.overtime_reason || record.admin_notes}</span></div>}
                  </div>
                </div>
                <div className="text-right">{record.check_out ? <span className="text-sm font-mono text-zinc-400">{calculateDuration(record.check_in, record.check_out)}</span> : record.check_in ? <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Çalışıyor</span> : null}</div>
              </div>
            ))}
            {usersWithoutCheckIn.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 opacity-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-700 flex items-center justify-center"><span className="text-zinc-400 text-sm font-bold">{user.full_name?.charAt(0) || '?'}</span></div>
                  <div><p className="text-sm font-semibold text-zinc-400">{user.full_name}</p><p className="text-xs text-zinc-500">Henüz giriş yapmadı</p></div>
                </div>
                <AlertCircle className="w-5 h-5 text-amber-500/50" />
              </div>
            ))}
            {todayRecords.length === 0 && usersWithoutCheckIn.length === 0 && <div className="p-8 text-center text-zinc-500">Kayıt bulunamadı</div>}
          </div>
        </div>
      )}

      {!isAdmin && (
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
          <div className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2"><History className="w-5 h-5 text-indigo-400" />Geçmiş Kayıtlarım</h2>
            <span className="text-sm text-zinc-400">Son 30 gün</span>
          </div>
          <div className="divide-y divide-zinc-800">
            {myHistory.length > 0 ? myHistory.map((record) => {
              const status = getRecordStatus(record)
              const colorClasses: Record<string, string> = { emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400', amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400', orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400', blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400', zinc: 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400' }
              return (
                <div key={record.id} className={cn("flex items-center justify-between p-4 transition-colors", record.date === selectedDate ? 'bg-indigo-500/5' : 'hover:bg-zinc-800/30')}>
                  <div className="flex items-center gap-4">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border", colorClasses[status.color] || colorClasses.zinc)}>{status.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-zinc-100">{formatShortDate(record.date)}</p>
                        {record.date === new Date().toISOString().split('T')[0] && <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400">Bugün</span>}
                        {isHybridDay(new Date(record.date)) && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">Hibrit</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        {record.check_in ? <><span className="text-xs text-zinc-400"><LogIn className="w-3 h-3 inline mr-1" />{formatTime(record.check_in)}</span>{record.check_out && <><span className="text-zinc-600">→</span><span className="text-xs text-zinc-400"><LogOut className="w-3 h-3 inline mr-1" />{formatTime(record.check_out)}</span></>}</> : <span className="text-xs text-zinc-500">Tam gün</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-xs px-2 py-1 rounded-full border mb-1", colorClasses[status.color] || colorClasses.zinc)}>{status.label}{record.late_minutes && record.late_minutes > 0 && <span className="ml-1">({formatMinutes(record.late_minutes)})</span>}{record.overtime_minutes && record.overtime_minutes > 0 && <span className="ml-1">(+{formatMinutes(record.overtime_minutes)})</span>}</div>
                    {record.check_out && <p className="text-xs font-mono text-zinc-500">{calculateDuration(record.check_in, record.check_out)}</p>}
                  </div>
                </div>
              )
            }) : <div className="p-8 text-center text-zinc-500"><History className="w-8 h-8 mx-auto mb-2 opacity-50" /><p>Henüz kayıt bulunmuyor</p></div>}
          </div>
        </div>
      )}

      <ManualEntryModal isOpen={showManualModal} onClose={() => setShowManualModal(false)} onSuccess={fetchData} users={users} selectedDate={selectedDate} />

      {showLateModal && pendingCheckIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Geç Kalma Açıklaması</h3>
            <p className="text-sm text-zinc-400 mb-4">{pendingCheckIn.lateMinutes} dakika geç kaldınız. Lütfen sebebini yazın.</p>
            <textarea value={lateReason} onChange={(e) => setLateReason(e.target.value)} placeholder="Geç kalma sebebinizi yazın..." className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 text-sm resize-none focus:outline-none focus:border-indigo-500" autoFocus />
            <div className="flex gap-2 mt-4">
              <Button onClick={() => { setShowLateModal(false); setPendingCheckIn(null); setLateReason('') }} variant="outline" size="sm" className="flex-1 border-zinc-700 text-zinc-400">İptal</Button>
              <Button onClick={() => { if (!lateReason.trim()) return; saveCheckIn(pendingCheckIn.now, pendingCheckIn.location, pendingCheckIn.lateMinutes, lateReason.trim()) }} disabled={!lateReason.trim()} size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">Kaydet</Button>
            </div>
          </div>
        </div>
      )}

      {showOvertimeModal && pendingCheckOut && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Mesai Açıklaması</h3>
            <p className="text-sm text-zinc-400 mb-4">{pendingCheckOut.overtimeMinutes} dakika mesai yaptınız. Lütfen ne için çalıştığınızı yazın.</p>
            <textarea value={overtimeReason} onChange={(e) => setOvertimeReason(e.target.value)} placeholder="Mesai sebebinizi yazın..." className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 text-sm resize-none focus:outline-none focus:border-indigo-500" autoFocus />
            <div className="flex gap-2 mt-4">
              <Button onClick={() => { setShowOvertimeModal(false); setPendingCheckOut(null); setOvertimeReason('') }} variant="outline" size="sm" className="flex-1 border-zinc-700 text-zinc-400">İptal</Button>
              <Button onClick={() => { if (!overtimeReason.trim()) return; saveCheckOut(pendingCheckOut.now, pendingCheckOut.location, pendingCheckOut.overtimeMinutes, pendingCheckOut.earlyLeaveMinutes, overtimeReason.trim()) }} disabled={!overtimeReason.trim()} size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">Kaydet</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
