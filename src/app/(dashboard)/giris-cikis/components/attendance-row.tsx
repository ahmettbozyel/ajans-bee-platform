'use client'

import {
  CheckCircle2,
  Building2,
  Home as HomeIcon,
  AlertTriangle,
  Palmtree,
  Stethoscope,
  CalendarOff,
  Flame,
  Clock
} from 'lucide-react'
import { AttendanceWithUser } from '../types'
import { formatTime, calculateDuration, getAvatarColor } from '../utils'

interface AttendanceRowProps {
  record: AttendanceWithUser
  isHybridDay: boolean
}

export function AttendanceRow({ record, isHybridDay }: AttendanceRowProps) {
  const isLeave = record.record_type === 'leave'
  const isSick = record.record_type === 'sick'
  const isRemote = record.record_type === 'remote'
  const isHoliday = record.record_type === 'holiday'
  const isSpecialRecord = isLeave || isSick || isRemote || isHoliday
  const isOffice = record.check_in_location_type === 'office'
  const isHome = record.check_in_location_type === 'home'
  const isOther = record.check_in_location_type === 'other'
  const hasLate = !isSpecialRecord && (record.late_minutes ?? 0) > 0
  const hasOvertime = !isSpecialRecord && (record.overtime_minutes ?? 0) > 0

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${getAvatarColor(record.user?.full_name || '')} flex items-center justify-center`}>
        <span className="text-white text-sm font-bold">{record.user?.full_name?.charAt(0) || '?'}</span>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-white">{record.user?.full_name || 'Bilinmeyen'}</p>
        <div className="flex items-center gap-2 mt-1">
          {isSpecialRecord ? (
            <span className="text-zinc-500 text-sm">Tam gün</span>
          ) : (
            <>
              <span className="text-emerald-400 text-sm font-mono">→ {formatTime(record.check_in)}</span>
              <span className="text-zinc-600">···</span>
              <span className="text-zinc-500 text-sm font-mono">← {formatTime(record.check_out)}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isLeave && (
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,211,238,0.2)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}>
            <Palmtree className="w-3 h-3" />İzin
          </span>
        )}
        {isSick && (
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}>
            <Stethoscope className="w-3 h-3" />Rapor
          </span>
        )}
        {isHoliday && (
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
            <CalendarOff className="w-3 h-3" />Tatil
          </span>
        )}
        {!isSpecialRecord && record.check_in && (
          <>
            {isOffice && (
              <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                <Building2 className="w-3 h-3" />Ofiste<CheckCircle2 className="w-3 h-3" />
              </span>
            )}
            {isHome && (
              <>
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>
                  <HomeIcon className="w-3 h-3" />Evden
                </span>
                {isHybridDay && (
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>Hibrit</span>
                )}
              </>
            )}
            {isOther && (
              <>
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}>
                  <Building2 className="w-3 h-3" />Ofiste
                </span>
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}>
                  <AlertTriangle className="w-3 h-3" />Dışarıda!
                </span>
              </>
            )}
          </>
        )}
        {hasLate && (
          <span className="text-xs px-2 py-1 rounded-full font-mono" style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}>
            +{record.late_minutes}d geç
          </span>
        )}
        {hasOvertime && (
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-mono" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
            <Flame className="w-3 h-3" />+{record.overtime_minutes}d mesai
          </span>
        )}
      </div>
      <div className="text-right min-w-[80px]">
        {isSpecialRecord ? (
          <span className="text-sm text-zinc-500">--</span>
        ) : record.check_out ? (
          <span className="text-sm font-mono text-zinc-400">{calculateDuration(record.check_in, record.check_out)}</span>
        ) : record.check_in ? (
          <div className="text-right">
            <span className="text-sm text-zinc-500">--</span>
            <p className="text-xs text-emerald-400 mt-0.5">Devam ediyor</p>
          </div>
        ) : (
          <span className="text-sm text-zinc-500">--</span>
        )}
      </div>
    </div>
  )
}

// Empty row for users without check-in
interface EmptyAttendanceRowProps {
  userName: string
  userInitial: string
}

export function EmptyAttendanceRow({ userName, userInitial }: EmptyAttendanceRowProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="h-11 w-11 rounded-xl bg-zinc-700 flex items-center justify-center">
        <span className="text-zinc-400 text-sm font-bold">{userInitial}</span>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-zinc-400">{userName}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-zinc-600 text-sm font-mono">→ --:--</span>
          <span className="text-zinc-700">···</span>
          <span className="text-zinc-600 text-sm font-mono">← --:--</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}>
          <Clock className="w-3 h-3" />Henüz gelmedi
        </span>
      </div>
      <div className="text-right min-w-[80px]">
        <span className="text-sm text-zinc-500">--</span>
      </div>
    </div>
  )
}
