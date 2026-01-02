'use client'

import { Clock, Calendar, Home as HomeIcon } from 'lucide-react'

interface TimeHeaderProps {
  currentTime: Date
  formattedDate: string
  dayName: string
  isHybridDay: boolean
  variant?: 'admin' | 'staff'
}

export function TimeHeader({
  currentTime,
  formattedDate,
  dayName,
  isHybridDay,
  variant = 'admin'
}: TimeHeaderProps) {
  if (variant === 'staff') {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 0 20px -5px rgba(139,92,246,0.4)' }}>
        <div className="inline-block mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <div className="p-4 rounded-2xl inline-block" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Clock className="w-10 h-10 text-violet-400" />
          </div>
        </div>
        <div className="text-6xl font-mono font-bold text-white mb-2">
          {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <p className="text-lg text-zinc-400 mb-4">{formattedDate} {dayName}</p>
        {isHybridDay && (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
            <HomeIcon className="w-4 h-4" />
            Hibrit Gün (Evden çalışabilirsiniz)
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-violet-400" />
        <span className="text-2xl font-mono font-bold text-white">
          {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
      <div className="w-px h-8 bg-white/10" />
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-indigo-400" />
        <span className="text-base font-medium text-zinc-300">{formattedDate} {dayName}</span>
      </div>
      {isHybridDay && (
        <>
          <div className="w-px h-8 bg-white/10" />
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
            <HomeIcon className="w-4 h-4" />
            Hibrit Gün
          </span>
        </>
      )}
    </div>
  )
}
