'use client'

import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlatformCardProps {
  platform: string
  subtitle: string
  icon: React.ReactNode
  iconLetter: string
  gradient: string
  spend: string
  spendTrend?: number
  reach: string
  reachTrend?: number
  clicks: string
  cpc?: string
  ctr?: string
  ctrTrend?: number
  leads?: string
  dataSource: 'api' | 'manual'
  lastUpdate: string
}

export function PlatformCard({
  platform, subtitle, icon, iconLetter, gradient, spend, spendTrend, reach, reachTrend, clicks, cpc, ctr, ctrTrend, leads, dataSource, lastUpdate
}: PlatformCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 card-hover relative">
      {/* Data Source Badge */}
      <span className={cn(
        "absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-medium",
        dataSource === 'api'
          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
          : "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
      )}>
        {dataSource === 'api' ? '🔗 API' : '✏️ Manuel'}
      </span>

      <div className="flex items-center gap-3 mb-4">
        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold", gradient)}>
          {icon}
        </div>
        <div>
          <p className="font-semibold text-zinc-900 dark:text-white">{platform}</p>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-zinc-500">Harcama</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-white font-mono">{spend}</p>
          {spendTrend && (
            <span className="text-xs text-emerald-500 dark:text-emerald-400">+{spendTrend}%</span>
          )}
        </div>
        <div>
          <p className="text-xs text-zinc-500">Erişim</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-white font-mono">{reach}</p>
          {reachTrend && (
            <span className="text-xs text-emerald-500 dark:text-emerald-400">+{reachTrend}%</span>
          )}
        </div>
        <div>
          <p className="text-xs text-zinc-500">Tıklama</p>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-mono">{clicks}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">{cpc ? 'CPC' : ctr ? 'CTR' : 'Lead'}</p>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-mono">{cpc || ctr || leads}</p>
          {ctrTrend && (
            <span className="text-xs text-emerald-500 dark:text-emerald-400">+{ctrTrend}%</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-white/5">
        <span className="text-xs text-zinc-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
          {lastUpdate}
        </span>
        <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
          <Pencil className="w-3 h-3" />
          Düzenle
        </button>
      </div>
    </div>
  )
}
