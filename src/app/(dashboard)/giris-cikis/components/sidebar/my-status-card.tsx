'use client'

import { Award, LogIn, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Attendance } from '@/lib/auth-types'
import { formatTime, calculateDuration } from '../../utils'

interface MyStatusCardProps {
  myRecord: Attendance | undefined
  actionLoading: boolean
  hasCheckedIn: boolean
  hasCheckedOut: boolean
  onCheckIn: () => void
  onCheckOut: () => void
}

export function MyStatusCard({
  myRecord,
  actionLoading,
  hasCheckedIn,
  hasCheckedOut,
  onCheckIn,
  onCheckOut
}: MyStatusCardProps) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(16,185,129,0.4)', boxShadow: '0 0 20px -5px rgba(16,185,129,0.4)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-emerald-400" />
        <h3 className="font-semibold text-white">Benim Durumum</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-1">
            <LogIn className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-zinc-400">Giriş</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">{formatTime(myRecord?.check_in || null)}</p>
          {(myRecord?.late_minutes ?? 0) > 0 && (
            <p className="text-xs text-rose-400 mt-1">+{myRecord?.late_minutes}d geç</p>
          )}
        </div>
        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-1">
            <LogOut className="w-4 h-4 text-rose-400" />
            <span className="text-xs text-zinc-400">Çıkış</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">{formatTime(myRecord?.check_out || null)}</p>
          {(myRecord?.overtime_minutes ?? 0) > 0 && (
            <p className="text-xs text-amber-400 mt-1">+{myRecord?.overtime_minutes}d mesai</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={onCheckIn}
          disabled={actionLoading || hasCheckedIn || hasCheckedOut}
          variant="default"
          className="flex-1 py-3 rounded-xl"
        >
          {actionLoading && !hasCheckedIn ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          Geldim
        </Button>
        <Button
          onClick={onCheckOut}
          disabled={actionLoading || !hasCheckedIn || hasCheckedOut}
          variant="destructive"
          className="flex-1 py-3 rounded-xl"
        >
          {actionLoading && hasCheckedIn && !hasCheckedOut ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          Gittim
        </Button>
      </div>

      {myRecord?.check_in && myRecord?.check_out && (
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-zinc-500 mb-1">Toplam Çalışma</p>
          <p className="text-2xl font-bold font-mono text-white">
            {calculateDuration(myRecord.check_in, myRecord.check_out)}
          </p>
        </div>
      )}
    </div>
  )
}
