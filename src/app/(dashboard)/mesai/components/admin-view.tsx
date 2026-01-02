'use client'

import { useState } from 'react'
import {
  Download,
  Loader2,
  Plus,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Home
} from 'lucide-react'
import { AppUser, Attendance } from '@/lib/auth-types'
import { Holiday, HybridOverride, isHybridDayWithSettings } from '@/lib/use-company-settings'
import { createClient } from '@/lib/supabase/client'
import { AttendanceWithUser, MonthlyStats, WeeklyTrendItem, UserWithStats } from '../types'
import {
  TimeHeader,
  StatsCards,
  AttendanceRow,
  EmptyAttendanceRow,
  MonthlySummary,
  Leaderboard,
  WeeklyTrend,
  ManualEntryModal
} from './index'

interface AdminViewProps {
  currentTime: Date
  selectedDate: string
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  todayRecords: AttendanceWithUser[]
  users: AppUser[]
  allMonthlyRecords: Attendance[]
  monthlyStats: MonthlyStats
  weeklyTrend: WeeklyTrendItem[]
  exportLoading: boolean
  onExport: () => void
  onRefresh: () => void
  goToPrevDay: () => void
  goToNextDay: () => void
  goToToday: () => void
  todayHoliday?: Holiday | null
  isTodayWorkDay?: boolean
  hybridDays: string[]
  hybridOverrides: HybridOverride[]
  onRefetchSettings: () => Promise<void>
}

export function AdminView({
  currentTime,
  selectedDate,
  selectedMonth,
  setSelectedMonth,
  todayRecords,
  users,
  allMonthlyRecords,
  monthlyStats,
  weeklyTrend,
  exportLoading,
  onExport,
  onRefresh,
  goToPrevDay,
  goToNextDay,
  goToToday,
  todayHoliday,
  isTodayWorkDay = true,
  hybridDays,
  hybridOverrides,
  onRefetchSettings
}: AdminViewProps) {
  const [showManualModal, setShowManualModal] = useState(false)
  const [hybridLoading, setHybridLoading] = useState(false)
  const supabase = createClient()

  const isToday = selectedDate === new Date().toISOString().split('T')[0]
  const todayIsHybrid = isHybridDayWithSettings(new Date(selectedDate), hybridDays, hybridOverrides)

  // Check if current date has an override
  const currentOverride = hybridOverrides.find(o => o.date === selectedDate)

  // Toggle hybrid for selected date
  const toggleHybridOverride = async () => {
    setHybridLoading(true)
    try {
      if (currentOverride) {
        // Remove override
        await (supabase as any).from('hybrid_overrides').delete().eq('id', currentOverride.id)
      } else {
        // Add override (opposite of default)
        const defaultIsHybrid = isHybridDayWithSettings(new Date(selectedDate), hybridDays, [])
        await (supabase as any).from('hybrid_overrides').insert({
          date: selectedDate,
          is_hybrid: !defaultIsHybrid,
          note: !defaultIsHybrid ? 'Manuel olarak hibrit yapıldı' : 'Manuel olarak ofis günü yapıldı'
        })
      }
      await onRefetchSettings()
    } catch (error) {
      console.error('Hybrid override error:', error)
    } finally {
      setHybridLoading(false)
    }
  }
  const selectedDateObj = new Date(selectedDate)
  const dayName = selectedDateObj.toLocaleDateString('tr-TR', { weekday: 'long' })
  const formattedDate = selectedDateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

  const usersWithoutCheckIn = users.filter(u => !todayRecords.some(r => r.user_id === u.id) && u.role !== 'admin')
  const officeCount = todayRecords.filter(r => r.check_in_location_type === 'office' && r.check_in).length
  const homeCount = todayRecords.filter(r => r.check_in_location_type === 'home' && r.check_in).length
  const notArrivedCount = usersWithoutCheckIn.length

  // Monthly calculations
  const adminTotalWorkMinutes = allMonthlyRecords.reduce((total, r) => {
    if (r.check_in && r.check_out) {
      const diff = new Date(r.check_out).getTime() - new Date(r.check_in).getTime()
      return total + diff / 60000
    }
    return total
  }, 0)
  const adminTotalWorkHours = Math.round(adminTotalWorkMinutes / 60)
  const adminWorkDays = allMonthlyRecords.filter(r => r.check_in && r.check_out).length
  const adminAvgMinutes = adminWorkDays > 0 ? Math.round(adminTotalWorkMinutes / adminWorkDays) : 0
  const adminTotalOvertime = Object.values(monthlyStats).reduce((a, b) => a + b.overtime, 0)
  const adminTotalLateDays = Object.values(monthlyStats).reduce((a, b) => a + b.lateDays, 0)

  // Leaderboard
  const usersWithStats: UserWithStats[] = users.map(u => ({
    ...u,
    overtime: monthlyStats[u.id]?.overtime || 0,
    lateDays: monthlyStats[u.id]?.lateDays || 0
  }))
  const topWorkers = [...usersWithStats].sort((a, b) => b.overtime - a.overtime).slice(0, 3)
  const topLate = [...usersWithStats].sort((a, b) => b.lateDays - a.lateDays).slice(0, 3).filter(u => u.lateDays > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Mesai Takibi</h2>
          <p className="text-sm text-zinc-500 mt-1">Personel mesai takibi ve analizler</p>
        </div>
        <button
          onClick={onExport}
          disabled={exportLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium shadow-lg transition-all"
          style={{ background: 'linear-gradient(90deg, #059669 0%, #0d9488 100%)', boxShadow: '0 10px 25px -5px rgba(16,185,129,0.4)' }}
        >
          {exportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Excel İndir
        </button>
      </div>

      {/* Time Header Card */}
      <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 0 20px -5px rgba(139,92,246,0.4)' }}>
        <div className="flex items-center justify-between">
          <TimeHeader
            currentTime={currentTime}
            formattedDate={formattedDate}
            dayName={dayName}
            isHybridDay={todayIsHybrid}
            variant="admin"
          />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-300 text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Calendar className="w-4 h-4" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent border-none text-zinc-100 text-sm focus:outline-none"
              />
            </div>
            <button
              onClick={toggleHybridOverride}
              disabled={hybridLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-lg transition-all ${
                todayIsHybrid
                  ? 'text-violet-300'
                  : 'text-zinc-300'
              }`}
              style={{
                background: todayIsHybrid
                  ? 'linear-gradient(90deg, rgba(139,92,246,0.3) 0%, rgba(124,58,237,0.3) 100%)'
                  : 'rgba(255,255,255,0.05)',
                border: todayIsHybrid
                  ? '1px solid rgba(139,92,246,0.5)'
                  : '1px solid rgba(255,255,255,0.1)',
                boxShadow: todayIsHybrid ? '0 5px 15px -5px rgba(139,92,246,0.4)' : 'none'
              }}
              title={currentOverride ? 'Override aktif - tıklayarak kaldır' : 'Bu günü hibrit/ofis yap'}
            >
              {hybridLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Home className="w-4 h-4" />
              )}
              {todayIsHybrid ? 'Hibrit' : 'Ofis'}
              {currentOverride && <span className="text-xs opacity-70">(özel)</span>}
            </button>
            <button
              onClick={() => setShowManualModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-lg transition-all"
              style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)', boxShadow: '0 10px 25px -5px rgba(99,102,241,0.4)' }}
            >
              <Plus className="w-4 h-4" />Manuel Kayıt
            </button>
          </div>
        </div>
      </div>

      {/* Tatil veya Çalışma Dışı Gün Uyarısı */}
      {(todayHoliday || !isTodayWorkDay) && (
        <div className="glass-card rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-amber-400 font-medium">
              {todayHoliday ? `Bugün Resmi Tatil: ${todayHoliday.name}` : 'Bugün çalışma günü değil'}
            </p>
            <p className="text-xs text-amber-400/70">
              {todayHoliday ? 'Tatil günlerinde giriş/çıkış kaydı opsiyoneldir.' : 'Hafta sonu veya tanımlı çalışma günü dışında.'}
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <StatsCards
        totalUsers={users.length}
        officeCount={officeCount}
        homeCount={homeCount}
        notArrivedCount={notArrivedCount}
      />

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Attendance Table */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-indigo-400" />
                <div className="flex items-center gap-2">
                  <button onClick={goToPrevDay} className="p-1.5 rounded-lg transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <ChevronLeft className="w-4 h-4 text-zinc-400" />
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-white">{formattedDate}</span>
                    <span className="text-zinc-500">{dayName}</span>
                  </button>
                  <button onClick={goToNextDay} className="p-1.5 rounded-lg transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </button>
                  {!isToday && (
                    <button onClick={goToToday} className="ml-2 px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:bg-indigo-500/30" style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
                      Bugün
                    </button>
                  )}
                </div>
              </div>
              <span className="text-sm text-zinc-500">{todayRecords.filter(r => r.check_in).length} / {users.length} kişi giriş yaptı</span>
            </div>
            <div className="divide-y divide-white/5">
              {todayRecords.map((record) => (
                <AttendanceRow key={record.id} record={record} isHybridDay={todayIsHybrid} />
              ))}
              {usersWithoutCheckIn.map((user) => (
                <EmptyAttendanceRow
                  key={user.id}
                  userName={user.full_name || 'Bilinmeyen'}
                  userInitial={user.full_name?.charAt(0) || '?'}
                  isHoliday={!!todayHoliday}
                  isWeekend={!isTodayWorkDay}
                />
              ))}
              {todayRecords.length === 0 && usersWithoutCheckIn.length === 0 && (
                <div className="p-8 text-center text-zinc-500">Kayıt bulunamadı</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <MonthlySummary
            totalWorkHours={adminTotalWorkHours}
            avgMinutes={adminAvgMinutes}
            totalOvertime={adminTotalOvertime}
            totalLateDays={adminTotalLateDays}
            isAdmin
          />
          <Leaderboard topWorkers={topWorkers} topLate={topLate} />
          <WeeklyTrend data={weeklyTrend} />
        </div>
      </div>

      {/* Modal */}
      <ManualEntryModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSuccess={onRefresh}
        users={users}
        selectedDate={selectedDate}
      />
    </div>
  )
}
