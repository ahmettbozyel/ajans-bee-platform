'use client'

import { Users, Building2, Home as HomeIcon, AlertCircle } from 'lucide-react'

interface StatsCardsProps {
  totalUsers: number
  officeCount: number
  homeCount: number
  notArrivedCount: number
}

export function StatsCards({ totalUsers, officeCount, homeCount, notArrivedCount }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-5">
      <div className="rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99,102,241,0.4)', boxShadow: '0 0 20px -5px rgba(99,102,241,0.4)' }}>
        <div className="p-3 rounded-xl w-fit mb-4" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Users className="w-6 h-6 text-indigo-400" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{totalUsers}</p>
        <p className="text-sm text-zinc-500">Toplam Personel</p>
      </div>

      <div className="rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(16,185,129,0.4)', boxShadow: '0 0 20px -5px rgba(16,185,129,0.4)' }}>
        <div className="p-3 rounded-xl w-fit mb-4" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <Building2 className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{officeCount}</p>
        <p className="text-sm text-zinc-500">Ofiste</p>
      </div>

      <div className="rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 0 20px -5px rgba(139,92,246,0.4)' }}>
        <div className="p-3 rounded-xl w-fit mb-4" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <HomeIcon className="w-6 h-6 text-violet-400" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{homeCount}</p>
        <p className="text-sm text-zinc-500">Evden Çalışıyor</p>
      </div>

      <div className="rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(244,63,94,0.4)', boxShadow: '0 0 20px -5px rgba(244,63,94,0.4)' }}>
        <div className="p-3 rounded-xl w-fit mb-4" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
          <AlertCircle className="w-6 h-6 text-rose-400" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{notArrivedCount}</p>
        <p className="text-sm text-zinc-500">Henüz Gelmedi</p>
      </div>
    </div>
  )
}
