'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConversionCardProps {
  label: string
  value: number
  change: number
}

export function ConversionCard({ label, value, change }: ConversionCardProps) {
  return (
    <div className="glass-card rounded-xl p-4 border border-zinc-200 dark:border-white/10 card-hover">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-zinc-900 dark:text-white font-mono">{value}</p>
        <span className={cn(
          "text-xs font-medium flex items-center gap-1",
          change >= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
        )}>
          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change >= 0 ? '+' : ''}{change}%
        </span>
      </div>
    </div>
  )
}
