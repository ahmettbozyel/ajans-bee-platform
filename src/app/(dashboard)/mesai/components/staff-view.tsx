'use client'

import { History } from 'lucide-react'
import { Attendance, AppUser } from '@/lib/auth-types'
import { WorkHours, Tolerances, HybridOverride, isHybridDayWithSettings } from '@/lib/use-company-settings'
import { MonthlyStats, PendingCheckIn, PendingCheckOut, UserWithStats } from '../types'
import { formatMinutes } from '../utils'
import {
  TimeHeader,
  HistoryRow,
  MonthlySummary,
  Leaderboard,
  MyStatusCard,
  LateReasonModal,
  OvertimeReasonModal
} from './index'

interface StaffViewProps {
  currentTime: Date
  selectedDate: string
  myRecord: Attendance | undefined
  myHistory: Attendance[]
  users: AppUser[]
  monthlyStats: MonthlyStats
  actionLoading: boolean
  hasCheckedIn: boolean
  hasCheckedOut: boolean
  showLateModal: boolean
  setShowLateModal: (show: boolean) => void
  lateReason: string
  setLateReason: (reason: string) => void
  pendingCheckIn: PendingCheckIn | null
  setPendingCheckIn: (pending: PendingCheckIn | null) => void
  showOvertimeModal: boolean
  setShowOvertimeModal: (show: boolean) => void
  overtimeReason: string
  setOvertimeReason: (reason: string) => void
  pendingCheckOut: PendingCheckOut | null
  setPendingCheckOut: (pending: PendingCheckOut | null) => void
  onCheckIn: () => void
  onCheckOut: () => void
  onSaveLateCheckIn: () => void
  onSaveOvertimeCheckOut: () => void
  workHours?: WorkHours
  tolerances?: Tolerances
  hybridDays: string[]
  hybridOverrides: HybridOverride[]
  isHoliday?: boolean
}

export function StaffView({
  currentTime,
  selectedDate,
  myRecord,
  myHistory,
  users,
  monthlyStats,
  actionLoading,
  hasCheckedIn,
  hasCheckedOut,
  showLateModal,
  setShowLateModal,
  lateReason,
  setLateReason,
  pendingCheckIn,
  setPendingCheckIn,
  showOvertimeModal,
  setShowOvertimeModal,
  overtimeReason,
  setOvertimeReason,
  pendingCheckOut,
  setPendingCheckOut,
  onCheckIn,
  onCheckOut,
  onSaveLateCheckIn,
  onSaveOvertimeCheckOut,
  workHours,
  tolerances,
  hybridDays,
  hybridOverrides,
  isHoliday = false
}: StaffViewProps) {
  // Tatil günlerinde hibrit badge'i gösterme
  const todayIsHybrid = !isHoliday && isHybridDayWithSettings(new Date(selectedDate), hybridDays, hybridOverrides)
  const selectedDateObj = new Date(selectedDate)
  const dayName = selectedDateObj.toLocaleDateString('tr-TR', { weekday: 'long' })
  const formattedDate = selectedDateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

  // My stats
  const myWorkRecords = myHistory.filter(r => r.check_in && r.check_out && r.record_type === 'normal')
  const myTotalWorkMinutes = myWorkRecords.reduce((total, r) => {
    if (r.check_in && r.check_out) {
      const diff = new Date(r.check_out).getTime() - new Date(r.check_in).getTime()
      return total + diff / 60000
    }
    return total
  }, 0)
  const myTotalWorkHours = Math.round(myTotalWorkMinutes / 60)
  const myWorkDays = myWorkRecords.length
  const myAvgMinutes = myWorkDays > 0 ? Math.round(myTotalWorkMinutes / myWorkDays) : 0
  const myTotalOvertime = myHistory.reduce((a, r) => a + (r.overtime_minutes || 0), 0)
  const myLateDays = myHistory.filter(r => (r.late_minutes ?? 0) > 0).length
  const myLeaveDays = myHistory.filter(r => r.record_type === 'leave').length

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
      <div>
        <h2 className="text-2xl font-bold text-white">Mesai Takibi</h2>
        <p className="text-sm text-zinc-500 mt-1">Mesai kayıtlarım</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Time Display */}
          <TimeHeader
            currentTime={currentTime}
            formattedDate={formattedDate}
            dayName={dayName}
            isHybridDay={todayIsHybrid}
            variant="staff"
          />

          {/* History Table */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Geçmiş Kayıtlarım</h3>
              </div>
              <span className="text-sm text-zinc-500">Son 30 gün</span>
            </div>
            <div className="divide-y divide-white/5">
              {myHistory.length > 0 ? myHistory.slice(0, 10).map((record) => (
                <HistoryRow key={record.id} record={record} hybridDays={hybridDays} hybridOverrides={hybridOverrides} />
              )) : (
                <div className="p-8 text-center text-zinc-500">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Henüz kayıt bulunmuyor</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Mobile'da önce göster */}
        <div className="space-y-6 order-first lg:order-none relative z-10">
          <MyStatusCard
            myRecord={myRecord}
            actionLoading={actionLoading}
            hasCheckedIn={hasCheckedIn}
            hasCheckedOut={hasCheckedOut}
            onCheckIn={onCheckIn}
            onCheckOut={onCheckOut}
          />

          {/* My Monthly Summary */}
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">Bu Ay Özetim</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Çalışma Günü</span>
                <span className="text-sm font-mono text-white">{myWorkDays} gün</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Toplam Çalışma</span>
                <span className="text-sm font-mono text-white font-semibold">{myTotalWorkHours} saat</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Ortalama / Gün</span>
                <span className="text-sm font-mono text-white">{Math.floor(myAvgMinutes / 60)}s {myAvgMinutes % 60}d</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Mesai</span>
                <span className="text-sm font-mono text-emerald-400">+{formatMinutes(myTotalOvertime) || '0d'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Geç Kalma</span>
                <span className="text-sm font-mono text-rose-400">{myLateDays} gün</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">İzin</span>
                <span className="text-sm font-mono text-cyan-400">{myLeaveDays} gün</span>
              </div>
            </div>
          </div>

          <Leaderboard topWorkers={topWorkers} topLate={topLate} showBadge />
        </div>
      </div>

      {/* Modals */}
      {showLateModal && pendingCheckIn && (
        <LateReasonModal
          pendingCheckIn={pendingCheckIn}
          lateReason={lateReason}
          setLateReason={setLateReason}
          onCancel={() => {
            setShowLateModal(false)
            setPendingCheckIn(null)
            setLateReason('')
          }}
          onSave={onSaveLateCheckIn}
        />
      )}
      {showOvertimeModal && pendingCheckOut && (
        <OvertimeReasonModal
          pendingCheckOut={pendingCheckOut}
          overtimeReason={overtimeReason}
          setOvertimeReason={setOvertimeReason}
          onCancel={() => {
            setShowOvertimeModal(false)
            setPendingCheckOut(null)
            setOvertimeReason('')
          }}
          onSave={onSaveOvertimeCheckOut}
        />
      )}
    </div>
  )
}
