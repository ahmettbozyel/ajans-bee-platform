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
  History,
  TrendingUp,
  AlertTriangle,
  Download,
  Plus,
  Palmtree,
  Stethoscope,
  Home as HomeIcon,
  CalendarOff,
  Building2,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Award,
  Flame
} from 'lucide-react'
import * as XLSX from 'xlsx'

const OFFICE_LOCATION = { lat: 38.450468, lng: 27.186318, radius: 100 }
const WORK_HOURS = { start: '09:00', end: '18:30', toleranceMinutes: 0 }
const HYBRID_DAYS = [2, 4]

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
  const [monthlyStats, setMonthlyStats] = useState<{ [userId: string]: { overtime: number; late: number; lateDays: number } }>({})

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
        
        const [year, month] = selectedMonth.split('-').map(Number)
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`
        const endDate = new Date(year, month, 0).toISOString().split('T')[0]
        const { data: monthData } = await supabase.from('attendance').select('user_id, overtime_minutes, late_minutes').gte('date', startDate).lte('date', endDate)
        if (monthData) {
          const stats: { [userId: string]: { overtime: number; late: number; lateDays: number } } = {}
          monthData.forEach((r: { user_id: string; overtime_minutes?: number; late_minutes?: number }) => {
            if (!stats[r.user_id]) stats[r.user_id] = { overtime: 0, late: 0, lateDays: 0 }
            stats[r.user_id].overtime += r.overtime_minutes || 0
            stats[r.user_id].late += r.late_minutes || 0
            if (r.late_minutes && r.late_minutes > 0) stats[r.user_id].lateDays += 1
          })
          setMonthlyStats(stats)
        }
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
      const filteredRecords = (records as any[])?.filter(r => r.user?.role !== 'admin') || []
      if (filteredRecords.length === 0) { alert('Bu ay i\u00e7in kay\u0131t bulunamad\u0131.'); setExportLoading(false); return }
      const mainData = filteredRecords.map((record: any) => {
        const date = new Date(record.date)
        const dayName = date.toLocaleDateString('tr-TR', { weekday: 'long' })
        const formattedDate = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
        const checkIn = record.check_in ? new Date(record.check_in).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'
        const checkOut = record.check_out ? new Date(record.check_out).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'
        let duration = '-'
        if (record.check_in && record.check_out) {
          const diff = new Date(record.check_out).getTime() - new Date(record.check_in).getTime()
          duration = `${Math.floor(diff / 3600000)}s ${Math.floor((diff % 3600000) / 60000)}d`
        }
        const locationType = record.check_in_location_type === 'office' ? 'Ofis' : record.check_in_location_type === 'home' ? 'Evden' : record.check_in_location_type === 'other' ? 'D\u0131\u015far\u0131' : '-'
        const recordTypeLabels: Record<string, string> = { normal: 'Normal', leave: '\u0130zin', sick: 'Rapor', remote: 'Evden \u00c7al\u0131\u015fma', holiday: 'Tatil' }
        const status = record.record_type && record.record_type !== 'normal' ? recordTypeLabels[record.record_type] || '-' : record.status === 'late' ? 'Ge\u00e7' : record.status === 'early_leave' ? 'Erken \u00c7\u0131k\u0131\u015f' : record.status === 'normal' ? 'Normal' : '-'
        return { 'Personel': record.user?.full_name || '-', 'Tarih': formattedDate, 'G\u00fcn': dayName, 'Giri\u015f': checkIn, '\u00c7\u0131k\u0131\u015f': checkOut, 'Ge\u00e7 (dk)': record.late_minutes || 0, 'Mesai (dk)': record.overtime_minutes || 0, 'Erken \u00c7\u0131k\u0131\u015f (dk)': record.early_leave_minutes || 0, 'Toplam S\u00fcre': duration, 'Konum': locationType, 'Durum': status, 'Ge\u00e7 Sebebi': record.late_reason || '', 'Mesai Sebebi': record.overtime_reason || '', 'Admin Notu': record.admin_notes || '' }
      })
      const summary: { [key: string]: { late: number; overtime: number; earlyLeave: number; days: number; leave: number; sick: number; remote: number } } = {}
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
      const summaryData = Object.entries(summary).map(([name, data]) => ({ 'Personel': name, 'Toplam G\u00fcn': data.days, '\u0130zin G\u00fcn\u00fc': data.leave, 'Rapor G\u00fcn\u00fc': data.sick, 'Evden \u00c7al\u0131\u015fma': data.remote, 'Toplam Ge\u00e7 (dk)': data.late, 'Toplam Mesai (dk)': data.overtime, 'Toplam Erken \u00c7\u0131k\u0131\u015f (dk)': data.earlyLeave }))
      const wb = XLSX.utils.book_new()
      const wsMain = XLSX.utils.json_to_sheet(mainData)
      wsMain['!cols'] = [{ wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 30 }, { wch: 30 }, { wch: 30 }]
      XLSX.utils.book_append_sheet(wb, wsMain, 'Detay')
      const wsSummary = XLSX.utils.json_to_sheet(summaryData)
      wsSummary['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, wsSummary, '\u00d6zet')
      const monthNames = ['Ocak', '\u015eubat', 'Mart', 'Nisan', 'May\u0131s', 'Haziran', 'Temmuz', 'A\u011fustos', 'Eyl\u00fcl', 'Ekim', 'Kas\u0131m', 'Aral\u0131k']
      XLSX.writeFile(wb, `Mesai-Raporu-${monthNames[month - 1]}-${year}.xlsx`)
    } catch (error) { console.error('Export error:', error); alert('Excel olu\u015fturulurken hata olu\u015ftu.') }
    finally { setExportLoading(false) }
  }

  const getLocation = (): Promise<{lat: number, lng: number} | null> => {
    return new Promise((resolve) => {
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
    const todayIsHybrid = isHybridDay(now)
    let locationType: 'office' | 'home' | 'other' | 'unknown'
    if (location) {
      const isInOffice = getLocationType(location.lat, location.lng) === 'office'
      if (isInOffice) { locationType = 'office' } 
      else if (todayIsHybrid) { locationType = 'home' } 
      else { locationType = 'other' }
    } else { locationType = todayIsHybrid ? 'home' : 'unknown' }
    const status = lateMinutes > 0 ? 'late' : 'normal'
    const checkInData: any = { user_id: appUser!.id, date: today, check_in: now.toISOString(), late_minutes: lateMinutes, status, check_in_location_type: locationType, late_reason: reason || null, record_type: 'normal' }
    if (location) { checkInData.check_in_lat = location.lat; checkInData.check_in_lng = location.lng }
    if (myRecord) { await (supabase as any).from('attendance').update({ ...checkInData, updated_at: now.toISOString() }).eq('id', myRecord.id) } 
    else { await (supabase as any).from('attendance').insert(checkInData) }
    if (lateMinutes > 0 && appUser) { await notifyAdmins(supabase, { type: 'late', title: `${appUser.full_name} ge\u00e7 kald\u0131`, message: `${lateMinutes} dakika ge\u00e7 giri\u015f. Sebep: ${reason || 'Belirtilmedi'}`, related_user_id: appUser.id }) }
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
    const todayIsHybrid = isHybridDay(now)
    let locationType: 'office' | 'home' | 'other' | 'unknown'
    if (location) {
      const isInOffice = getLocationType(location.lat, location.lng) === 'office'
      if (isInOffice) { locationType = 'office' } 
      else if (todayIsHybrid) { locationType = 'home' } 
      else { locationType = 'other' }
    } else { locationType = todayIsHybrid ? 'home' : 'unknown' }
    let status = myRecord!.status || 'normal'
    if (earlyLeaveMinutes > 0) status = 'early_leave'
    const checkOutData: any = { check_out: now.toISOString(), overtime_minutes: overtimeMinutes, early_leave_minutes: earlyLeaveMinutes, check_out_location_type: locationType, status, overtime_reason: reason || null, updated_at: now.toISOString() }
    if (location) { checkOutData.check_out_lat = location.lat; checkOutData.check_out_lng = location.lng }
    await (supabase as any).from('attendance').update(checkOutData).eq('id', myRecord!.id)
    if (overtimeMinutes > 0 && appUser) { await notifyAdmins(supabase, { type: 'overtime', title: `${appUser.full_name} mesai yapt\u0131`, message: `${overtimeMinutes} dakika mesai. Sebep: ${reason || 'Belirtilmedi'}`, related_user_id: appUser.id }) }
    if (earlyLeaveMinutes > 15 && appUser) { await notifyAdmins(supabase, { type: 'early_leave', title: `${appUser.full_name} erken \u00e7\u0131kt\u0131`, message: `${earlyLeaveMinutes} dakika erken \u00e7\u0131k\u0131\u015f.`, related_user_id: appUser.id }) }
    setShowOvertimeModal(false); setOvertimeReason(''); setPendingCheckOut(null); setActionLoading(false); fetchData()
  }

  const formatTime = (isoString: string | null) => !isoString ? '--:--' : new Date(isoString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  const formatShortDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })
  const calculateDuration = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return '--'
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return `${Math.floor(diff / 3600000)}s ${Math.floor((diff % 3600000) / 60000)}d`
  }
  const formatMinutes = (minutes: number | null | undefined) => {
    if (!minutes || minutes === 0) return null
    const h = Math.floor(minutes / 60), m = minutes % 60
    return h > 0 ? (m > 0 ? `${h}s ${m}d` : `${h}s`) : `${m}d`
  }
  const formatMinutesToHours = (minutes: number) => {
    const h = Math.floor(minutes / 60), m = minutes % 60
    return h > 0 ? `+${h}s` : `+${m}d`
  }

  const usersWithoutCheckIn = users.filter(u => !todayRecords.some(r => r.user_id === u.id) && u.role !== 'admin')
  const officeCount = todayRecords.filter(r => r.check_in_location_type === 'office' && r.check_in).length
  const homeCount = todayRecords.filter(r => r.check_in_location_type === 'home' && r.check_in).length
  const notArrivedCount = usersWithoutCheckIn.length

  const getLeaderboard = () => {
    const usersWithStats = users.map(u => ({ ...u, overtime: monthlyStats[u.id]?.overtime || 0, lateDays: monthlyStats[u.id]?.lateDays || 0 }))
    const topWorkers = [...usersWithStats].sort((a, b) => b.overtime - a.overtime).slice(0, 3)
    const topLate = [...usersWithStats].sort((a, b) => b.lateDays - a.lateDays).slice(0, 3).filter(u => u.lateDays > 0)
    return { topWorkers, topLate }
  }
  const { topWorkers, topLate } = getLeaderboard()

  const avatarColors = ['from-rose-500 to-pink-600','from-violet-500 to-purple-600','from-indigo-500 to-blue-600','from-cyan-500 to-teal-600','from-emerald-500 to-green-600','from-amber-500 to-orange-600']
  const getAvatarColor = (name: string) => avatarColors[name?.charCodeAt(0) % avatarColors.length || 0]

  const goToPrevDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().split('T')[0]) }
  const goToNextDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().split('T')[0]) }
  const goToToday = () => setSelectedDate(new Date().toISOString().split('T')[0])

  if (loading) return (<div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>)

  const isToday = selectedDate === new Date().toISOString().split('T')[0]
  const todayIsHybrid = isHybridDay(new Date(selectedDate))
  const selectedDateObj = new Date(selectedDate)
  const dayName = selectedDateObj.toLocaleDateString('tr-TR', { weekday: 'long' })
  const formattedDate = selectedDateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h2 className="text-2xl font-bold text-white">Giri\u015f / \u00c7\u0131k\u0131\u015f Takibi</h2><p className="text-sm text-zinc-500 mt-1">Personel mesai takibi ve analizler</p></div>
          <button onClick={handleExportExcel} disabled={exportLoading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium shadow-lg transition-all" style={{ background: 'linear-gradient(90deg, #059669 0%, #0d9488 100%)', boxShadow: '0 10px 25px -5px rgba(16,185,129,0.4)' }}>
            {exportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Excel \u0130ndir
          </button>
        </div>

        <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 0 20px -5px rgba(139,92,246,0.4)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-violet-400" /><span className="text-2xl font-mono font-bold text-white">{currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-indigo-400" /><span className="text-base font-medium text-zinc-300">{formattedDate} {dayName}</span></div>
              {todayIsHybrid && (<><div className="w-px h-8 bg-white/10" /><span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}><HomeIcon className="w-4 h-4" />Hibrit G\u00fcn</span></>)}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-300 text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Calendar className="w-4 h-4" /><input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-transparent border-none text-zinc-100 text-sm focus:outline-none" /></div>
              <button onClick={() => setShowManualModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-lg transition-all" style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)', boxShadow: '0 10px 25px -5px rgba(99,102,241,0.4)' }}><Plus className="w-4 h-4" />Manuel Kay\u0131t</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5">
          <div className="rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99,102,241,0.4)', boxShadow: '0 0 20px -5px rgba(99,102,241,0.4)' }}><div className="p-3 rounded-xl w-fit mb-4" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}><Users className="w-6 h-6 text-indigo-400" /></div><p className="text-3xl font-bold text-white mb-1">{users.length}</p><p className="text-sm text-zinc-500">Toplam Personel</p></div>
          <div className="rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(16,185,129,0.4)', boxShadow: '0 0 20px -5px rgba(16,185,129,0.4)' }}><div className="p-3 rounded-xl w-fit mb-4" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}><Building2 className="w-6 h-6 text-emerald-400" /></div><p className="text-3xl font-bold text-white mb-1">{officeCount}</p><p className="text-sm text-zinc-500">Ofiste</p></div>
          <div className="rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 0 20px -5px rgba(139,92,246,0.4)' }}><div className="p-3 rounded-xl w-fit mb-4" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}><HomeIcon className="w-6 h-6 text-violet-400" /></div><p className="text-3xl font-bold text-white mb-1">{homeCount}</p><p className="text-sm text-zinc-500">Evden \u00c7al\u0131\u015f\u0131yor</p></div>
          <div className="rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(244,63,94,0.4)', boxShadow: '0 0 20px -5px rgba(244,63,94,0.4)' }}><div className="p-3 rounded-xl w-fit mb-4" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}><AlertCircle className="w-6 h-6 text-rose-400" /></div><p className="text-3xl font-bold text-white mb-1">{notArrivedCount}</p><p className="text-sm text-zinc-500">Hen\u00fcz Gelmedi</p></div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <div className="flex items-center gap-2">
                    <button onClick={goToPrevDay} className="p-1.5 rounded-lg transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><ChevronLeft className="w-4 h-4 text-zinc-400" /></button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><Calendar className="w-4 h-4 text-indigo-400" /><span className="font-semibold text-white">{selectedDateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span><span className="text-zinc-500">{dayName}</span></button>
                    <button onClick={goToNextDay} className="p-1.5 rounded-lg transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><ChevronRight className="w-4 h-4 text-zinc-400" /></button>
                    {!isToday && (<button onClick={goToToday} className="ml-2 px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:bg-indigo-500/30" style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>Bug\u00fcn</button>)}
                  </div>
                </div>
                <span className="text-sm text-zinc-500">{todayRecords.filter(r => r.check_in).length} / {users.length} ki\u015fi giri\u015f yapt\u0131</span>
              </div>
              <div className="divide-y divide-white/5">
                {todayRecords.map((record) => {
                  const isLeave = record.record_type === 'leave'
                  const isSick = record.record_type === 'sick'
                  const isRemote = record.record_type === 'remote'
                  const isHoliday = record.record_type === 'holiday'
                  const isSpecialRecord = isLeave || isSick || isRemote || isHoliday
                  const isOffice = record.check_in_location_type === 'office'
                  const isHome = record.check_in_location_type === 'home'
                  const isOther = record.check_in_location_type === 'other'
                  const hasLate = !isSpecialRecord && record.late_minutes && record.late_minutes > 0
                  const hasOvertime = !isSpecialRecord && record.overtime_minutes && record.overtime_minutes > 0
                  
                  return (
                    <div key={record.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
                      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${getAvatarColor(record.user?.full_name || '')} flex items-center justify-center`}><span className="text-white text-sm font-bold">{record.user?.full_name?.charAt(0) || '?'}</span></div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{record.user?.full_name || 'Bilinmeyen'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {isSpecialRecord ? (<span className="text-zinc-500 text-sm">Tam g\u00fcn</span>) : (<><span className="text-emerald-400 text-sm font-mono">\u2192 {formatTime(record.check_in)}</span><span className="text-zinc-600">\u00b7\u00b7\u00b7</span><span className="text-zinc-500 text-sm font-mono">\u2190 {formatTime(record.check_out)}</span></>)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLeave && (<span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,211,238,0.2)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}><Palmtree className="w-3 h-3" />\u0130zin</span>)}
                        {isSick && (<span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}><Stethoscope className="w-3 h-3" />Rapor</span>)}
                        {isHoliday && (<span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}><CalendarOff className="w-3 h-3" />Tatil</span>)}
                        {!isSpecialRecord && record.check_in && (
                          <>
                            {isOffice && (<span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}><Building2 className="w-3 h-3" />Ofiste<CheckCircle2 className="w-3 h-3" /></span>)}
                            {isHome && (<><span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}><HomeIcon className="w-3 h-3" />Evden</span>{todayIsHybrid && (<span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>Hibrit</span>)}</>)}
                            {isOther && (<><span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}><Building2 className="w-3 h-3" />Ofiste</span><span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}><AlertTriangle className="w-3 h-3" />D\u0131\u015far\u0131da!</span></>)}
                          </>
                        )}
                        {hasLate && (<span className="text-xs px-2 py-1 rounded-full font-mono" style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}>+{record.late_minutes}d ge\u00e7</span>)}
                        {hasOvertime && (<span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-mono" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}><Flame className="w-3 h-3" />+{record.overtime_minutes}d mesai</span>)}
                      </div>
                      <div className="text-right min-w-[80px]">
                        {isSpecialRecord ? (<span className="text-sm text-zinc-500">--</span>) : record.check_out ? (<span className="text-sm font-mono text-zinc-400">{calculateDuration(record.check_in, record.check_out)}</span>) : record.check_in ? (<div className="text-right"><span className="text-sm text-zinc-500">--</span><p className="text-xs text-emerald-400 mt-0.5">Devam ediyor</p></div>) : (<span className="text-sm text-zinc-500">--</span>)}
                      </div>
                    </div>
                  )
                })}
                {usersWithoutCheckIn.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="h-11 w-11 rounded-xl bg-zinc-700 flex items-center justify-center"><span className="text-zinc-400 text-sm font-bold">{user.full_name?.charAt(0) || '?'}</span></div>
                    <div className="flex-1"><p className="font-semibold text-zinc-400">{user.full_name}</p><div className="flex items-center gap-2 mt-1"><span className="text-zinc-600 text-sm font-mono">\u2192 --:--</span><span className="text-zinc-700">\u00b7\u00b7\u00b7</span><span className="text-zinc-600 text-sm font-mono">\u2190 --:--</span></div></div>
                    <div className="flex items-center gap-2"><span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}><Clock className="w-3 h-3" />Hen\u00fcz gelmedi</span></div>
                    <div className="text-right min-w-[80px]"><span className="text-sm text-zinc-500">--</span></div>
                  </div>
                ))}
                {todayRecords.length === 0 && usersWithoutCheckIn.length === 0 && (<div className="p-8 text-center text-zinc-500">Kay\u0131t bulunamad\u0131</div>)}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2 mb-4"><Trophy className="w-5 h-5 text-amber-400" /><h3 className="font-semibold text-white">Liderlik Tablosu</h3></div>
              <div className="mb-5"><p className="text-xs text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2"><span>\ud83c\udfc6</span> En \u00c7ok Mesai Yapan</p><div className="space-y-2.5">{topWorkers.map((user, i) => (<div key={user.id} className={`flex items-center gap-3 p-2 rounded-lg ${i === 0 ? 'bg-amber-500/10' : 'hover:bg-white/5'} transition-colors`}><span className={`text-sm font-bold w-5 ${i === 0 ? 'text-amber-400' : 'text-zinc-500'}`}>{i + 1}.</span><div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${getAvatarColor(user.full_name || '')} flex items-center justify-center flex-shrink-0`}><span className="text-white text-xs font-bold">{user.full_name?.charAt(0)}</span></div><span className="text-sm text-white flex-1">{user.full_name}</span><span className={`text-sm font-mono ${i === 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}`}>{user.overtime > 0 ? formatMinutesToHours(user.overtime) : '-'}</span></div>))}</div></div>
              <div className="border-t border-white/10 my-5" />
              <div><p className="text-xs text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2"><span>\ud83d\ude05</span> En \u00c7ok Ge\u00e7 Kalan</p><div className="space-y-2.5">{topLate.length > 0 ? topLate.map((user, i) => (<div key={user.id} className={`flex items-center gap-3 p-2 rounded-lg ${i === 0 ? 'bg-rose-500/10' : 'hover:bg-white/5'} transition-colors`}><span className={`text-sm font-bold w-5 ${i === 0 ? 'text-rose-400' : 'text-zinc-500'}`}>{i + 1}.</span><div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${getAvatarColor(user.full_name || '')} flex items-center justify-center flex-shrink-0`}><span className="text-white text-xs font-bold">{user.full_name?.charAt(0)}</span></div><span className="text-sm text-white flex-1">{user.full_name}</span><span className={`text-sm font-mono ${i === 0 ? 'text-rose-400 font-semibold' : 'text-rose-400'}`}>{user.lateDays} g\u00fcn</span></div>)) : (<p className="text-sm text-zinc-500 text-center py-2">Ge\u00e7 kalan yok \ud83c\udf89</p>)}</div></div>
            </div>
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-emerald-400" /><h3 className="font-semibold text-white">Bu Ay \u00d6zet</h3></div>
              <div className="space-y-3"><div className="flex items-center justify-between"><span className="text-sm text-zinc-400">Toplam Mesai</span><span className="text-sm font-mono text-emerald-400">{formatMinutes(Object.values(monthlyStats).reduce((a, b) => a + b.overtime, 0)) || '0d'}</span></div><div className="flex items-center justify-between"><span className="text-sm text-zinc-400">Toplam Ge\u00e7 Kalma</span><span className="text-sm font-mono text-rose-400">{formatMinutes(Object.values(monthlyStats).reduce((a, b) => a + b.late, 0)) || '0d'}</span></div></div>
            </div>
          </div>
        </div>
        <ManualEntryModal isOpen={showManualModal} onClose={() => setShowManualModal(false)} onSuccess={fetchData} users={users} selectedDate={selectedDate} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-white">Giri\u015f / \u00c7\u0131k\u0131\u015f Takibi</h2><p className="text-sm text-zinc-500 mt-1">Mesai kay\u0131tlar\u0131m</p></div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 0 20px -5px rgba(139,92,246,0.4)' }}>
            <div className="inline-block mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}><div className="p-4 rounded-2xl inline-block" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}><Clock className="w-10 h-10 text-violet-400" /></div></div>
            <div className="text-6xl font-mono font-bold text-white mb-2">{currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
            <p className="text-lg text-zinc-400 mb-4">{formattedDate} {dayName}</p>
            {todayIsHybrid && (<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}><HomeIcon className="w-4 h-4" />Hibrit G\u00fcn (Evden \u00e7al\u0131\u015fabilirsiniz)</span>)}
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5"><div className="flex items-center gap-3"><History className="w-5 h-5 text-cyan-400" /><h3 className="font-semibold text-white">Ge\u00e7mi\u015f Kay\u0131tlar\u0131m</h3></div><span className="text-sm text-zinc-500">Son 30 g\u00fcn</span></div>
            <div className="divide-y divide-white/5">
              {myHistory.length > 0 ? myHistory.slice(0, 10).map((record) => {
                const isLeave = record.record_type === 'leave'
                const isSick = record.record_type === 'sick'
                const isRemote = record.record_type === 'remote'
                return (
                  <div key={record.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
                    <div className={`p-2.5 rounded-xl ${isLeave ? 'bg-emerald-500/10 border-emerald-500/20' : isSick ? 'bg-rose-500/10 border-rose-500/20' : isRemote ? 'bg-blue-500/10 border-blue-500/20' : 'bg-indigo-500/10 border-indigo-500/20'} border`}>{isLeave ? <Palmtree className="w-5 h-5 text-emerald-400" /> : isSick ? <Stethoscope className="w-5 h-5 text-rose-400" /> : isRemote ? <HomeIcon className="w-5 h-5 text-blue-400" /> : <Clock className="w-5 h-5 text-indigo-400" />}</div>
                    <div className="flex-1"><p className="font-semibold text-white">{formatShortDate(record.date)}</p><p className="text-sm text-zinc-500">{isLeave || isSick ? 'Tam g\u00fcn' : `${formatTime(record.check_in)} \u2192 ${formatTime(record.check_out)}`}</p></div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${isLeave ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20' : isSick ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' : isRemote ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : record.late_minutes && record.late_minutes > 0 ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'} border`}>{isLeave ? '\u0130zin' : isSick ? 'Rapor' : isRemote ? 'Evden' : record.late_minutes && record.late_minutes > 0 ? `+${record.late_minutes}d ge\u00e7` : 'Normal'}</span>
                  </div>
                )
              }) : (<div className="p-8 text-center text-zinc-500"><History className="w-8 h-8 mx-auto mb-2 opacity-50" /><p>Hen\u00fcz kay\u0131t bulunmuyor</p></div>)}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(16,185,129,0.4)', boxShadow: '0 0 20px -5px rgba(16,185,129,0.4)' }}>
            <div className="flex items-center gap-2 mb-4"><Award className="w-5 h-5 text-emerald-400" /><h3 className="font-semibold text-white">Bug\u00fcnk\u00fc Durumum</h3></div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><div className="flex items-center gap-2 mb-1"><LogIn className="w-4 h-4 text-emerald-400" /><span className="text-xs text-zinc-400">Giri\u015f</span></div><p className="text-xl font-bold font-mono text-white">{formatTime(myRecord?.check_in || null)}</p>{myRecord?.late_minutes && myRecord.late_minutes > 0 && (<p className="text-xs text-rose-400 mt-1">+{myRecord.late_minutes}d ge\u00e7</p>)}</div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}><div className="flex items-center gap-2 mb-1"><LogOut className="w-4 h-4 text-rose-400" /><span className="text-xs text-zinc-400">\u00c7\u0131k\u0131\u015f</span></div><p className="text-xl font-bold font-mono text-white">{formatTime(myRecord?.check_out || null)}</p>{myRecord?.overtime_minutes && myRecord.overtime_minutes > 0 && (<p className="text-xs text-amber-400 mt-1">+{myRecord.overtime_minutes}d mesai</p>)}</div>
            </div>
            <div className="space-y-2">
              <button onClick={handleCheckIn} disabled={actionLoading || hasCheckedOut} className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${hasCheckedIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' : 'text-white shadow-lg hover:shadow-emerald-500/40'}`} style={!hasCheckedIn ? { background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)', boxShadow: '0 10px 25px -5px rgba(16,185,129,0.4)' } : undefined}>{actionLoading && !hasCheckedIn ? (<Loader2 className="w-4 h-4 animate-spin" />) : hasCheckedIn ? (<CheckCircle2 className="w-4 h-4" />) : (<LogIn className="w-4 h-4" />)}{hasCheckedIn ? 'Giri\u015f Yap\u0131ld\u0131 \u2713' : 'Geldim'}</button>
              <button onClick={handleCheckOut} disabled={actionLoading || !hasCheckedIn || hasCheckedOut} className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${hasCheckedOut ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-default' : !hasCheckedIn ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'text-white shadow-lg hover:shadow-rose-500/40'}`} style={hasCheckedIn && !hasCheckedOut ? { background: 'linear-gradient(90deg, #e11d48 0%, #f43f5e 100%)', boxShadow: '0 10px 25px -5px rgba(244,63,94,0.4)' } : undefined}>{actionLoading && hasCheckedIn && !hasCheckedOut ? (<Loader2 className="w-4 h-4 animate-spin" />) : hasCheckedOut ? (<CheckCircle2 className="w-4 h-4" />) : (<LogOut className="w-4 h-4" />)}{hasCheckedOut ? '\u00c7\u0131k\u0131\u015f Yap\u0131ld\u0131 \u2713' : 'Gittim'}</button>
            </div>
            {myRecord?.check_in && myRecord?.check_out && (<div className="mt-4 pt-4 border-t border-white/10 text-center"><p className="text-xs text-zinc-500 mb-1">Toplam \u00c7al\u0131\u015fma</p><p className="text-2xl font-bold font-mono text-white">{calculateDuration(myRecord.check_in, myRecord.check_out)}</p></div>)}
          </div>
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-cyan-400" /><h3 className="font-semibold text-white">Bu Ay \u00d6zetim</h3></div>
            <div className="space-y-3"><div className="flex items-center justify-between"><span className="text-sm text-zinc-400">\u00c7al\u0131\u015f\u0131lan G\u00fcn</span><span className="text-sm font-mono text-white">{myHistory.filter(r => r.check_in).length} g\u00fcn</span></div><div className="flex items-center justify-between"><span className="text-sm text-zinc-400">Toplam Mesai</span><span className="text-sm font-mono text-emerald-400">{formatMinutes(myHistory.reduce((a, r) => a + (r.overtime_minutes || 0), 0)) || '0d'}</span></div><div className="flex items-center justify-between"><span className="text-sm text-zinc-400">Ge\u00e7 Kalma</span><span className="text-sm font-mono text-rose-400">{myHistory.filter(r => r.late_minutes && r.late_minutes > 0).length} g\u00fcn</span></div></div>
          </div>
        </div>
      </div>
      {showLateModal && pendingCheckIn && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="rounded-2xl p-6 w-full max-w-md mx-4" style={{ background: 'linear-gradient(135deg, rgba(24,24,27,0.98) 0%, rgba(9,9,11,0.99) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}><h3 className="text-lg font-semibold text-white mb-2">Ge\u00e7 Kalma A\u00e7\u0131klamas\u0131</h3><p className="text-sm text-zinc-400 mb-4">{pendingCheckIn.lateMinutes} dakika ge\u00e7 kald\u0131n\u0131z. L\u00fctfen sebebini yaz\u0131n.</p><textarea value={lateReason} onChange={(e) => setLateReason(e.target.value)} placeholder="Ge\u00e7 kalma sebebinizi yaz\u0131n..." className="w-full h-24 rounded-xl p-3 text-sm resize-none focus:outline-none text-white placeholder:text-zinc-600" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} autoFocus /><div className="flex gap-2 mt-4"><button onClick={() => { setShowLateModal(false); setPendingCheckIn(null); setLateReason('') }} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-zinc-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>\u0130ptal</button><button onClick={() => { if (!lateReason.trim()) return; saveCheckIn(pendingCheckIn.now, pendingCheckIn.location, pendingCheckIn.lateMinutes, lateReason.trim()) }} disabled={!lateReason.trim()} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50" style={{ background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)' }}>Kaydet</button></div></div></div>)}
      {showOvertimeModal && pendingCheckOut && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="rounded-2xl p-6 w-full max-w-md mx-4" style={{ background: 'linear-gradient(135deg, rgba(24,24,27,0.98) 0%, rgba(9,9,11,0.99) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}><h3 className="text-lg font-semibold text-white mb-2">Mesai A\u00e7\u0131klamas\u0131</h3><p className="text-sm text-zinc-400 mb-4">{pendingCheckOut.overtimeMinutes} dakika mesai yapt\u0131n\u0131z. L\u00fctfen ne i\u00e7in \u00e7al\u0131\u015ft\u0131\u011f\u0131n\u0131z\u0131 yaz\u0131n.</p><textarea value={overtimeReason} onChange={(e) => setOvertimeReason(e.target.value)} placeholder="Mesai sebebinizi yaz\u0131n..." className="w-full h-24 rounded-xl p-3 text-sm resize-none focus:outline-none text-white placeholder:text-zinc-600" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} autoFocus /><div className="flex gap-2 mt-4"><button onClick={() => { setShowOvertimeModal(false); setPendingCheckOut(null); setOvertimeReason('') }} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-zinc-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>\u0130ptal</button><button onClick={() => { if (!overtimeReason.trim()) return; saveCheckOut(pendingCheckOut.now, pendingCheckOut.location, pendingCheckOut.overtimeMinutes, pendingCheckOut.earlyLeaveMinutes, overtimeReason.trim()) }} disabled={!overtimeReason.trim()} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50" style={{ background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)' }}>Kaydet</button></div></div></div>)}
    </div>
  )
}