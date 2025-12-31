'use client'

import { cn } from '@/lib/utils'

interface TrafficRowProps {
  source: string
  sessions: number
  share: number
  bounceRate: number
  quality: 'high' | 'medium' | 'low'
}

export function TrafficRow({
  source, sessions, share, bounceRate, quality
}: TrafficRowProps) {
  return (
    <tr className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
      <td className="p-4">
        <span className="text-sm font-medium text-zinc-900 dark:text-white">{source}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-600 dark:text-zinc-300">{sessions.toLocaleString()}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-500 dark:text-zinc-400">%{share}</span>
      </td>
      <td className="p-4 text-right">
        <span className={cn(
          "text-sm font-mono font-medium",
          bounceRate > 60 ? "text-rose-500 dark:text-rose-400" : bounceRate > 40 ? "text-amber-500 dark:text-amber-400" : "text-emerald-500 dark:text-emerald-400"
        )}>
          %{bounceRate}
        </span>
      </td>
      <td className="p-4 text-center">
        <span className={cn(
          "text-[10px] px-2.5 py-1 rounded-full font-medium",
          quality === 'high' && "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
          quality === 'medium' && "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400",
          quality === 'low' && "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"
        )}>
          {quality === 'high' && 'Çok İyi'}
          {quality === 'medium' && 'Orta'}
          {quality === 'low' && 'Düşük'}
        </span>
      </td>
    </tr>
  )
}
