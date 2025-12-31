'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CampaignRowProps {
  name: string
  reach: string
  clicks: string
  spend: string
  cpc: string
  change: number
  performance: 'best' | 'good' | 'average' | 'low'
}

export function CampaignRow({
  name, reach, clicks, spend, cpc, change, performance
}: CampaignRowProps) {
  return (
    <tr className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
      <td className="p-4">
        <p className="text-sm font-medium text-zinc-900 dark:text-white">{name}</p>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">{reach}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">{clicks}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-900 dark:text-white">{spend}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-900 dark:text-white font-semibold">{cpc}</span>
      </td>
      <td className="p-4 text-right">
        <span className={cn(
          "text-sm font-medium",
          change >= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
        )}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      </td>
      <td className="p-4 text-center">
        {performance === 'best' ? (
          <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-medium shadow-sm">
            <Star className="w-3 h-3" fill="currentColor" />
            En İyi
          </span>
        ) : performance === 'good' ? (
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
            İyi
          </span>
        ) : performance === 'average' ? (
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-medium">
            Orta
          </span>
        ) : (
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-medium">
            Düşük
          </span>
        )}
      </td>
    </tr>
  )
}
