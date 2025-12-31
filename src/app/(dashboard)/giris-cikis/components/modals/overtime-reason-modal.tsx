'use client'

import { PendingCheckOut } from '../../types'

interface OvertimeReasonModalProps {
  pendingCheckOut: PendingCheckOut
  overtimeReason: string
  setOvertimeReason: (reason: string) => void
  onCancel: () => void
  onSave: () => void
}

export function OvertimeReasonModal({
  pendingCheckOut,
  overtimeReason,
  setOvertimeReason,
  onCancel,
  onSave
}: OvertimeReasonModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="rounded-2xl p-6 w-full max-w-md mx-4" style={{ background: 'linear-gradient(135deg, rgba(24,24,27,0.98) 0%, rgba(9,9,11,0.99) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 className="text-lg font-semibold text-white mb-2">Mesai Açıklaması</h3>
        <p className="text-sm text-zinc-400 mb-4">{pendingCheckOut.overtimeMinutes} dakika mesai yaptınız. Lütfen ne için çalıştığınızı yazın.</p>
        <textarea
          value={overtimeReason}
          onChange={(e) => setOvertimeReason(e.target.value)}
          placeholder="Mesai sebebinizi yazın..."
          className="w-full h-24 rounded-xl p-3 text-sm resize-none focus:outline-none text-white placeholder:text-zinc-600"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          autoFocus
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-zinc-400"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            İptal
          </button>
          <button
            onClick={onSave}
            disabled={!overtimeReason.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)' }}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
