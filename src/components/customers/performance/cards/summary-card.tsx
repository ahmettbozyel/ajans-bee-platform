'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SummaryCardProps {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  value: string
  label: string
  subValue?: string
  trend?: { value: number; direction: 'up' | 'down' }
  glowColor: string
  small?: boolean
}

export function SummaryCard({
  icon, iconBg, iconColor, value, label, subValue, trend, glowColor, small
}: SummaryCardProps) {
  return (
    <div className={cn("glass-card rounded-2xl p-4 card-hover", glowColor)}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-2 rounded-xl border", iconBg)}>
          <span className={iconColor}>{icon}</span>
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium flex items-center gap-1",
            trend.direction === 'up' ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
          )}>
            {trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}%
          </span>
        )}
      </div>
      <p className={cn("font-bold text-zinc-900 dark:text-white font-mono", small ? "text-xl" : "text-2xl")}>{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{label}</p>
      {subValue && <p className="text-[10px] text-zinc-400 mt-0.5">{subValue}</p>}
    </div>
  )
}
