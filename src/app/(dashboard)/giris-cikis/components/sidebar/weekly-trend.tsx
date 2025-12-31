'use client'

import { TrendingUp } from 'lucide-react'
import { WeeklyTrendItem } from '../../types'

interface WeeklyTrendProps {
  data: WeeklyTrendItem[]
}

export function WeeklyTrend({ data }: WeeklyTrendProps) {
  const colors = ['#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#f59e0b']
  const maxHours = Math.max(...data.map(t => t.hours), 1)

  return (
    <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-emerald-400" />
        <h3 className="font-semibold text-white">Haftalık Trend</h3>
      </div>
      <div className="space-y-3">
        {data.map((item, i) => {
          const percentage = (item.hours / maxHours) * 100
          return (
            <div key={item.day}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">{item.day}</span>
                <span className="text-xs font-mono text-zinc-300">{item.hours}s</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${colors[i]} 0%, ${colors[(i + 1) % colors.length]} 100%)`
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
