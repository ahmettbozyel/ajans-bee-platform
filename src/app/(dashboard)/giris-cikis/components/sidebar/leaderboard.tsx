'use client'

import { Trophy } from 'lucide-react'
import { UserWithStats } from '../../types'
import { getAvatarColor, formatMinutesToHours } from '../../utils'

interface LeaderboardProps {
  topWorkers: UserWithStats[]
  topLate: UserWithStats[]
  showBadge?: boolean
}

export function Leaderboard({ topWorkers, topLate, showBadge = false }: LeaderboardProps) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-white">Bu Ay Liderlik</h3>
        </div>
        {showBadge && (
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>🏆 Ödül</span>
        )}
      </div>

      {/* Top Workers */}
      <div className="mb-5">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>💪</span> EN ÇOK MESAİ
        </p>
        <div className="space-y-2.5">
          {topWorkers.map((user, i) => (
            <div key={user.id} className={`flex items-center gap-3 p-2 rounded-lg ${i === 0 ? 'bg-amber-500/10' : 'hover:bg-white/5'} transition-colors`}>
              <span className={`text-sm font-bold w-5 ${i === 0 ? 'text-amber-400' : 'text-zinc-500'}`}>{i + 1}.</span>
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${getAvatarColor(user.full_name || '')} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-xs font-bold">{user.full_name?.charAt(0)}</span>
              </div>
              <span className="text-sm text-white flex-1">{user.full_name}</span>
              <span className={`text-sm font-mono ${i === 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}`}>
                {user.overtime > 0 ? formatMinutesToHours(user.overtime) : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 my-5" />

      {/* Top Late */}
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>😅</span> EN ÇOK GEÇ KALAN
        </p>
        <div className="space-y-2.5">
          {topLate.length > 0 ? topLate.map((user, i) => (
            <div key={user.id} className={`flex items-center gap-3 p-2 rounded-lg ${i === 0 ? 'bg-rose-500/10' : 'hover:bg-white/5'} transition-colors`}>
              <span className={`text-sm font-bold w-5 ${i === 0 ? 'text-rose-400' : 'text-zinc-500'}`}>{i + 1}.</span>
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${getAvatarColor(user.full_name || '')} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-xs font-bold">{user.full_name?.charAt(0)}</span>
              </div>
              <span className="text-sm text-white flex-1">{user.full_name}</span>
              <span className={`text-sm font-mono ${i === 0 ? 'text-rose-400 font-semibold' : 'text-rose-400'}`}>{user.lateDays} gün</span>
            </div>
          )) : (
            <p className="text-sm text-zinc-500 text-center py-2">Geç kalan yok 🎉</p>
          )}
        </div>
      </div>
    </div>
  )
}
