'use client'

import {
  CheckCircle2,
  Home as HomeIcon,
  AlertTriangle,
  Palmtree,
  Stethoscope,
  Flame
} from 'lucide-react'
import { Attendance } from '@/lib/auth-types'
import { formatTime, formatShortDate, calculateDuration, formatMinutes, isHybridDay } from '../utils'

interface HistoryRowProps {
  record: Attendance
}

export function HistoryRow({ record }: HistoryRowProps) {
  const isLeave = record.record_type === 'leave'
  const isSick = record.record_type === 'sick'
  const isRemote = record.record_type === 'remote'
  const isHoliday = record.record_type === 'holiday'
  const isSpecialRecord = isLeave || isSick || isRemote || isHoliday
  const hasLate = !isSpecialRecord && (record.late_minutes ?? 0) > 0
  const hasOvertime = !isSpecialRecord && (record.overtime_minutes ?? 0) > 0
  const recordIsHybrid = isHybridDay(new Date(record.date))
  const duration = record.check_in && record.check_out ? calculateDuration(record.check_in, record.check_out) : null

  let badgeStyle = { bg: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }
  let badgeText = 'Zamanında'
  let badgeIcon = <CheckCircle2 className="w-3 h-3" />

  if (isLeave) {
    badgeStyle = { bg: 'rgba(34,211,238,0.2)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }
    badgeText = 'İzin'
    badgeIcon = <Palmtree className="w-3 h-3" />
  } else if (isSick) {
    badgeStyle = { bg: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }
    badgeText = 'Rapor'
    badgeIcon = <Stethoscope className="w-3 h-3" />
  } else if (isRemote) {
    badgeStyle = { bg: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }
    badgeText = 'Evden'
    badgeIcon = <HomeIcon className="w-3 h-3" />
  } else if (hasLate && hasOvertime) {
    badgeStyle = { bg: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }
    badgeText = `Geç + Mesai (${record.late_minutes}d) (+${formatMinutes(record.overtime_minutes)})`
    badgeIcon = <Flame className="w-3 h-3" />
  } else if (hasLate) {
    badgeStyle = { bg: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }
    badgeText = `Geç Kalma (${record.late_minutes}d)`
    badgeIcon = <AlertTriangle className="w-3 h-3" />
  } else if (hasOvertime) {
    badgeStyle = { bg: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }
    badgeText = `Mesai (+${formatMinutes(record.overtime_minutes)})`
    badgeIcon = <Flame className="w-3 h-3" />
  }

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
      <div className={`p-2.5 rounded-xl ${isLeave ? 'bg-cyan-500/10 border-cyan-500/20' : isSick ? 'bg-rose-500/10 border-rose-500/20' : isRemote ? 'bg-blue-500/10 border-blue-500/20' : hasLate ? 'bg-rose-500/10 border-rose-500/20' : hasOvertime ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} border`}>
        {isLeave ? <Palmtree className="w-5 h-5 text-cyan-400" /> :
         isSick ? <Stethoscope className="w-5 h-5 text-rose-400" /> :
         isRemote ? <HomeIcon className="w-5 h-5 text-blue-400" /> :
         hasLate ? <AlertTriangle className="w-5 h-5 text-rose-400" /> :
         hasOvertime ? <Flame className="w-5 h-5 text-amber-400" /> :
         <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-white">{formatShortDate(record.date)}</p>
          {recordIsHybrid && !isSpecialRecord && (
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa' }}>Hibrit</span>
          )}
        </div>
        <p className="text-sm text-zinc-500">
          {isSpecialRecord ? 'Tam gün' : `${formatTime(record.check_in)} → ${formatTime(record.check_out)}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: badgeStyle.bg, color: badgeStyle.color, border: badgeStyle.border }}>
          {badgeIcon}{badgeText}
        </span>
      </div>
      <div className="text-right min-w-[60px]">
        <span className="text-sm font-mono text-zinc-400">{duration || '--'}</span>
      </div>
    </div>
  )
}
