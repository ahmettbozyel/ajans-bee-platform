'use client'

import { BarChart3 } from 'lucide-react'

interface MonthlySummaryProps {
  totalWorkHours: number
  avgMinutes: number
  totalOvertime: number
  totalLateDays: number
  isAdmin?: boolean
}

export function MonthlySummary({
  totalWorkHours,
  avgMinutes,
  totalOvertime,
  totalLateDays,
  isAdmin = false
}: MonthlySummaryProps) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-indigo-400" />
        <h3 className="font-semibold text-white">{isAdmin ? 'Bu Ay Özeti' : 'Bu Ay Özetim'}</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Toplam Çalışma</span>
          <span className="text-sm font-mono text-white font-semibold">{totalWorkHours} saat</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Ortalama / Gün</span>
          <span className="text-sm font-mono text-white">{Math.floor(avgMinutes / 60)}s {avgMinutes % 60}d</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Toplam Mesai</span>
          <span className="text-sm font-mono text-emerald-400">+{Math.floor(totalOvertime / 60)} saat</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Geç Kalma</span>
          <span className="text-sm font-mono text-rose-400">{totalLateDays} gün</span>
        </div>
      </div>
    </div>
  )
}
