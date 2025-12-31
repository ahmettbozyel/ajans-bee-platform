'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Attendance, AppUser } from '@/lib/auth-types'
import { notifyAdmins } from '@/lib/notifications'
import * as XLSX from 'xlsx'

import { AttendanceWithUser, MonthlyStats, WeeklyTrendItem, PendingCheckIn, PendingCheckOut } from './types'
import {
  calculateLateMinutes,
  calculateOvertimeMinutes,
  calculateEarlyLeaveMinutes,
  isHybridDay,
  getLocationType,
  getLocation
} from './utils'
import { AdminView, StaffView } from './components'

export default function GirisCikisPage() {
  const { appUser, isAdmin, isYonetici, isStajer } = useAuth()
  const [todayRecords, setTodayRecords] = useState<AttendanceWithUser[]>([])
  const [myHistory, setMyHistory] = useState<Attendance[]>([])
  const [allMonthlyRecords, setAllMonthlyRecords] = useState<Attendance[]>([])
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
  const [showLateModal, setShowLateModal] = useState(false)
  const [lateReason, setLateReason] = useState('')
  const [pendingCheckIn, setPendingCheckIn] = useState<PendingCheckIn | null>(null)
  const [showOvertimeModal, setShowOvertimeModal] = useState(false)
  const [overtimeReason, setOvertimeReason] = useState('')
  const [pendingCheckOut, setPendingCheckOut] = useState<PendingCheckOut | null>(null)
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({})
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyTrendItem[]>([])

  const supabase = createClient()

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch data on date/month change
  useEffect(() => { fetchData() }, [selectedDate, selectedMonth])

  const fetchData = async () => {
    if (!appUser) return
    setLoading(true)
    try {
      // Yönetici de admin gibi tüm personeli görür
      if (isAdmin || isYonetici) {
        const { data: usersData } = await supabase.from('users').select('*').eq('is_active', true).neq('role', 'admin').neq('role', 'yonetici').order('full_name')
        if (usersData) setUsers(usersData as AppUser[])

        const { data: recordsData } = await supabase.from('attendance').select('*, user:users(*)').eq('date', selectedDate).order('check_in', { ascending: true })
        if (recordsData) setTodayRecords((recordsData as unknown as AttendanceWithUser[]).filter(r => r.user?.role !== 'admin' && r.user?.role !== 'yonetici'))

        const [year, month] = selectedMonth.split('-').map(Number)
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`
        const endDate = new Date(year, month, 0).toISOString().split('T')[0]
        const { data: monthData } = await supabase.from('attendance').select('*').gte('date', startDate).lte('date', endDate)

        if (monthData) {
          setAllMonthlyRecords(monthData as Attendance[])
          const stats: MonthlyStats = {}
          monthData.forEach((r: any) => {
            if (!stats[r.user_id]) stats[r.user_id] = { overtime: 0, late: 0, lateDays: 0 }
            stats[r.user_id].overtime += r.overtime_minutes || 0
            stats[r.user_id].late += r.late_minutes || 0
            if (r.late_minutes && r.late_minutes > 0) stats[r.user_id].lateDays += 1
          })
          setMonthlyStats(stats)

          // Weekly trend calculation
          const dayTotals: { [key: number]: { total: number; count: number } } = { 1: { total: 0, count: 0 }, 2: { total: 0, count: 0 }, 3: { total: 0, count: 0 }, 4: { total: 0, count: 0 }, 5: { total: 0, count: 0 } }
          monthData.forEach((r: any) => {
            if (r.check_in && r.check_out) {
              const dayOfWeek = new Date(r.date).getDay()
              if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                const diff = new Date(r.check_out).getTime() - new Date(r.check_in).getTime()
                dayTotals[dayOfWeek].total += diff / 3600000
                dayTotals[dayOfWeek].count += 1
              }
            }
          })
          const dayNames = ['', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
          setWeeklyTrend([1, 2, 3, 4, 5].map(d => ({
            day: dayNames[d],
            hours: dayTotals[d].count > 0 ? Math.round(dayTotals[d].total / dayTotals[d].count) : 0
          })))
        }
      } else {
        // Staff view (personel, stajer, operasyon)
        const { data: todayData } = await supabase.from('attendance').select('*').eq('user_id', appUser.id).eq('date', selectedDate).single()
        setTodayRecords(todayData ? [todayData as Attendance] : [])

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const { data: historyData } = await supabase.from('attendance').select('*').eq('user_id', appUser.id).gte('date', thirtyDaysAgo.toISOString().split('T')[0]).order('date', { ascending: false })
        if (historyData) setMyHistory(historyData as Attendance[])

        // Leaderboard data
        const { data: allUsersData } = await supabase.from('users').select('*').eq('is_active', true).neq('role', 'admin').neq('role', 'yonetici').order('full_name')
        if (allUsersData) setUsers(allUsersData as AppUser[])

        const now = new Date()
        const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        const { data: monthData } = await supabase.from('attendance').select('user_id, overtime_minutes, late_minutes').gte('date', startDate).lte('date', endDate)
        if (monthData) {
          const stats: MonthlyStats = {}
          monthData.forEach((r: any) => {
            if (!stats[r.user_id]) stats[r.user_id] = { overtime: 0, late: 0, lateDays: 0 }
            stats[r.user_id].overtime += r.overtime_minutes || 0
            stats[r.user_id].late += r.late_minutes || 0
            if (r.late_minutes && r.late_minutes > 0) stats[r.user_id].lateDays += 1
          })
          setMonthlyStats(stats)
        }
      }
    } catch (error) { console.error('Fetch error:', error) }
    finally { setLoading(false) }
  }

  // Excel export handler
  const handleExportExcel = async () => {
    if (!isAdmin) return
    setExportLoading(true)
    try {
      const [year, month] = selectedMonth.split('-').map(Number)
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]
      const { data: records, error } = await supabase.from('attendance').select('*, user:users(full_name, email, role)').gte('date', startDate).lte('date', endDate).order('date', { ascending: true }).order('user_id', { ascending: true })
      if (error) throw error

      const filteredRecords = (records as any[])?.filter(r => r.user?.role !== 'admin' && r.user?.role !== 'yonetici') || []
      if (filteredRecords.length === 0) { alert('Bu ay için kayıt bulunamadı.'); setExportLoading(false); return }

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
        const locationType = record.check_in_location_type === 'office' ? 'Ofis' : record.check_in_location_type === 'home' ? 'Evden' : record.check_in_location_type === 'other' ? 'Dışarı' : '-'
        const recordTypeLabels: Record<string, string> = { normal: 'Normal', leave: 'İzin', sick: 'Rapor', remote: 'Evden Çalışma', holiday: 'Tatil' }
        const status = record.record_type && record.record_type !== 'normal' ? recordTypeLabels[record.record_type] || '-' : record.status === 'late' ? 'Geç' : record.status === 'early_leave' ? 'Erken Çıkış' : record.status === 'normal' ? 'Normal' : '-'
        return { 'Personel': record.user?.full_name || '-', 'Tarih': formattedDate, 'Gün': dayName, 'Giriş': checkIn, 'Çıkış': checkOut, 'Geç (dk)': record.late_minutes || 0, 'Mesai (dk)': record.overtime_minutes || 0, 'Erken Çıkış (dk)': record.early_leave_minutes || 0, 'Toplam Süre': duration, 'Konum': locationType, 'Durum': status, 'Geç Sebebi': record.late_reason || '', 'Mesai Sebebi': record.overtime_reason || '', 'Admin Notu': record.admin_notes || '' }
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

      const summaryData = Object.entries(summary).map(([name, data]) => ({ 'Personel': name, 'Toplam Gün': data.days, 'İzin Günü': data.leave, 'Rapor Günü': data.sick, 'Evden Çalışma': data.remote, 'Toplam Geç (dk)': data.late, 'Toplam Mesai (dk)': data.overtime, 'Toplam Erken Çıkış (dk)': data.earlyLeave }))

      const wb = XLSX.utils.book_new()
      const wsMain = XLSX.utils.json_to_sheet(mainData)
      wsMain['!cols'] = [{ wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 30 }, { wch: 30 }, { wch: 30 }]
      XLSX.utils.book_append_sheet(wb, wsMain, 'Detay')
      const wsSummary = XLSX.utils.json_to_sheet(summaryData)
      wsSummary['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Özet')

      const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
      XLSX.writeFile(wb, `Mesai-Raporu-${monthNames[month - 1]}-${year}.xlsx`)
    } catch (error) { console.error('Export error:', error); alert('Excel oluşturulurken hata oluştu.') }
    finally { setExportLoading(false) }
  }

  // Check-in/out handlers
  const myRecord = todayRecords.find(r => r.user_id === appUser?.id)
  const hasCheckedIn = myRecord?.check_in != null
  const hasCheckedOut = myRecord?.check_out != null

  const handleCheckIn = async () => {
    if (!appUser || isAdmin || isYonetici) return
    setActionLoading(true)
    try {
      const now = new Date()
      // Stajer için konum kontrolü yok
      const location = isStajer ? null : await getLocation()
      // Stajer için geç kalma kontrolü yok
      const lateMinutes = isStajer ? 0 : calculateLateMinutes(now)
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

    if (lateMinutes > 0 && appUser) { await notifyAdmins(supabase, { type: 'late', title: `${appUser.full_name} geç kaldı`, message: `${lateMinutes} dakika geç giriş. Sebep: ${reason || 'Belirtilmedi'}`, related_user_id: appUser.id }) }
    setShowLateModal(false); setLateReason(''); setPendingCheckIn(null); setActionLoading(false); fetchData()
  }

  const handleCheckOut = async () => {
    if (!appUser || !myRecord || isAdmin || isYonetici) return
    setActionLoading(true)
    try {
      const now = new Date()
      // Stajer için konum kontrolü yok
      const location = isStajer ? null : await getLocation()
      // Stajer için mesai var (overtime calculation stays)
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

    if (overtimeMinutes > 0 && appUser) { await notifyAdmins(supabase, { type: 'overtime', title: `${appUser.full_name} mesai yaptı`, message: `${overtimeMinutes} dakika mesai. Sebep: ${reason || 'Belirtilmedi'}`, related_user_id: appUser.id }) }
    if (earlyLeaveMinutes > 15 && appUser) { await notifyAdmins(supabase, { type: 'early_leave', title: `${appUser.full_name} erken çıktı`, message: `${earlyLeaveMinutes} dakika erken çıkış.`, related_user_id: appUser.id }) }
    setShowOvertimeModal(false); setOvertimeReason(''); setPendingCheckOut(null); setActionLoading(false); fetchData()
  }

  // Navigation helpers
  const goToPrevDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d.toISOString().split('T')[0]) }
  const goToNextDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d.toISOString().split('T')[0]) }
  const goToToday = () => setSelectedDate(new Date().toISOString().split('T')[0])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  // Render appropriate view - Yönetici de admin paneli görür
  if (isAdmin || isYonetici) {
    return (
      <AdminView
        currentTime={currentTime}
        selectedDate={selectedDate}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        todayRecords={todayRecords}
        users={users}
        allMonthlyRecords={allMonthlyRecords}
        monthlyStats={monthlyStats}
        weeklyTrend={weeklyTrend}
        exportLoading={exportLoading}
        onExport={handleExportExcel}
        onRefresh={fetchData}
        goToPrevDay={goToPrevDay}
        goToNextDay={goToNextDay}
        goToToday={goToToday}
      />
    )
  }

  return (
    <StaffView
      currentTime={currentTime}
      selectedDate={selectedDate}
      myRecord={myRecord}
      myHistory={myHistory}
      users={users}
      monthlyStats={monthlyStats}
      actionLoading={actionLoading}
      hasCheckedIn={hasCheckedIn}
      hasCheckedOut={hasCheckedOut}
      showLateModal={showLateModal}
      setShowLateModal={setShowLateModal}
      lateReason={lateReason}
      setLateReason={setLateReason}
      pendingCheckIn={pendingCheckIn}
      setPendingCheckIn={setPendingCheckIn}
      showOvertimeModal={showOvertimeModal}
      setShowOvertimeModal={setShowOvertimeModal}
      overtimeReason={overtimeReason}
      setOvertimeReason={setOvertimeReason}
      pendingCheckOut={pendingCheckOut}
      setPendingCheckOut={setPendingCheckOut}
      onCheckIn={handleCheckIn}
      onCheckOut={handleCheckOut}
      onSaveLateCheckIn={() => {
        if (!lateReason.trim() || !pendingCheckIn) return
        saveCheckIn(pendingCheckIn.now, pendingCheckIn.location, pendingCheckIn.lateMinutes, lateReason.trim())
      }}
      onSaveOvertimeCheckOut={() => {
        if (!overtimeReason.trim() || !pendingCheckOut) return
        saveCheckOut(pendingCheckOut.now, pendingCheckOut.location, pendingCheckOut.overtimeMinutes, pendingCheckOut.earlyLeaveMinutes, overtimeReason.trim())
      }}
    />
  )
}
