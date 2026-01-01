'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Settings, Loader2, Check, Clock, AlertTriangle } from 'lucide-react'

interface Tolerances {
  late_minutes: number
  early_leave_minutes: number
  grace_period_minutes: number
}

export function TolerancesTab() {
  const [tolerances, setTolerances] = useState<Tolerances>({
    late_minutes: 15,
    early_leave_minutes: 15,
    grace_period_minutes: 5
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createClient()

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await (supabase as any)
        .from('company_settings')
        .select('value')
        .eq('key', 'tolerances')
        .single()

      if (data?.value) {
        setTolerances(data.value as Tolerances)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const updateTolerance = (field: keyof Tolerances, value: number) => {
    setTolerances(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await (supabase as any)
        .from('company_settings')
        .update({ value: tolerances, updated_at: new Date().toISOString() })
        .eq('key', 'tolerances')

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-2xl border border-white/10 p-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tolerans Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Geç Kalma Toleransı */}
        <div className="glass-card rounded-2xl border border-white/10 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Geç Kalma Toleransı</h3>
              <p className="text-xs text-zinc-500">Mesai başlangıcından sonra</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="60"
              value={tolerances.late_minutes}
              onChange={(e) => updateTolerance('late_minutes', parseInt(e.target.value) || 0)}
              className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-center text-lg font-mono focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
            <span className="text-zinc-400 text-sm">dakika</span>
          </div>
        </div>

        {/* Erken Çıkış Toleransı */}
        <div className="glass-card rounded-2xl border border-white/10 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Erken Çıkış Toleransı</h3>
              <p className="text-xs text-zinc-500">Mesai bitişinden önce</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="60"
              value={tolerances.early_leave_minutes}
              onChange={(e) => updateTolerance('early_leave_minutes', parseInt(e.target.value) || 0)}
              className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-center text-lg font-mono focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
            <span className="text-zinc-400 text-sm">dakika</span>
          </div>
        </div>

        {/* Hoşgörü Süresi */}
        <div className="glass-card rounded-2xl border border-white/10 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Settings className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Hoşgörü Süresi</h3>
              <p className="text-xs text-zinc-500">Kayıt yapılmadan önce</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              max="30"
              value={tolerances.grace_period_minutes}
              onChange={(e) => updateTolerance('grace_period_minutes', parseInt(e.target.value) || 0)}
              className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-center text-lg font-mono focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
            <span className="text-zinc-400 text-sm">dakika</span>
          </div>
        </div>
      </div>

      {/* Açıklama */}
      <div className="glass-card rounded-2xl border border-white/10 p-5">
        <h4 className="text-white font-medium mb-3">Toleranslar Nasıl Çalışır?</h4>
        <div className="space-y-2 text-sm text-zinc-400">
          <p>
            <span className="text-amber-400 font-medium">Geç Kalma Toleransı:</span> Mesai başlangıç saatinden sonra bu süre içinde giriş yapan personel "geç" olarak işaretlenmez.
          </p>
          <p>
            <span className="text-rose-400 font-medium">Erken Çıkış Toleransı:</span> Mesai bitiş saatinden bu süre kadar önce çıkış yapan personel "erken çıkış" olarak işaretlenmez.
          </p>
          <p>
            <span className="text-emerald-400 font-medium">Hoşgörü Süresi:</span> Geç kalma/erken çıkış hesaplanmadan önce verilen ek süre. (Örn: 5 dakika hoşgörü + 15 dakika tolerans = toplam 20 dakika)
          </p>
        </div>
      </div>

      {/* Kaydet Butonu */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`h-11 px-6 rounded-xl font-medium shadow-lg flex items-center gap-2 transition-all ${
            saved
              ? 'bg-emerald-500 text-white shadow-emerald-500/25'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/25 hover:opacity-90'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              Kaydedildi
            </>
          ) : (
            'Değişiklikleri Kaydet'
          )}
        </button>
      </div>
    </div>
  )
}
