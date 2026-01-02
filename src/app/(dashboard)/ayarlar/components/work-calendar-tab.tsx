'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Clock, Loader2, Check, Home } from 'lucide-react'

interface WorkHours {
  start: string
  end: string
  lunch_start: string
  lunch_end: string
}

const DAYS = [
  { key: 'monday', label: 'Pazartesi', short: 'Pzt' },
  { key: 'tuesday', label: 'Salı', short: 'Sal' },
  { key: 'wednesday', label: 'Çarşamba', short: 'Çar' },
  { key: 'thursday', label: 'Perşembe', short: 'Per' },
  { key: 'friday', label: 'Cuma', short: 'Cum' },
  { key: 'saturday', label: 'Cumartesi', short: 'Cmt' },
  { key: 'sunday', label: 'Pazar', short: 'Paz' },
]

export function WorkCalendarTab() {
  const [workDays, setWorkDays] = useState<string[]>([])
  const [workHours, setWorkHours] = useState<WorkHours>({
    start: '09:00',
    end: '18:00',
    lunch_start: '12:00',
    lunch_end: '13:00'
  })
  const [hybridDays, setHybridDays] = useState<string[]>(['wednesday'])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createClient()

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const [daysRes, hoursRes, hybridRes] = await Promise.all([
        (supabase as any).from('company_settings').select('value').eq('key', 'work_days').single(),
        (supabase as any).from('company_settings').select('value').eq('key', 'work_hours').single(),
        (supabase as any).from('company_settings').select('value').eq('key', 'hybrid_days').single()
      ])

      if (daysRes.data?.value) {
        setWorkDays(daysRes.data.value as string[])
      }

      if (hoursRes.data?.value) {
        setWorkHours(hoursRes.data.value as WorkHours)
      }

      if (hybridRes.data?.value) {
        setHybridDays(hybridRes.data.value as string[])
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

  const toggleDay = (dayKey: string) => {
    setWorkDays(prev =>
      prev.includes(dayKey)
        ? prev.filter(d => d !== dayKey)
        : [...prev, dayKey]
    )
    setSaved(false)
  }

  const updateHours = (field: keyof WorkHours, value: string) => {
    setWorkHours(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const toggleHybridDay = (dayKey: string) => {
    setHybridDays(prev =>
      prev.includes(dayKey)
        ? prev.filter(d => d !== dayKey)
        : [...prev, dayKey]
    )
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const [daysResult, hoursResult, hybridResult] = await Promise.all([
        (supabase as any)
          .from('company_settings')
          .update({ value: workDays, updated_at: new Date().toISOString() })
          .eq('key', 'work_days'),
        (supabase as any)
          .from('company_settings')
          .update({ value: workHours, updated_at: new Date().toISOString() })
          .eq('key', 'work_hours'),
        (supabase as any)
          .from('company_settings')
          .upsert({ key: 'hybrid_days', value: hybridDays, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      ])

      if (daysResult.error) console.error('Days save error:', daysResult.error)
      if (hoursResult.error) console.error('Hours save error:', hoursResult.error)
      if (hybridResult.error) console.error('Hybrid save error:', hybridResult.error)

      if (!daysResult.error && !hoursResult.error && !hybridResult.error) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
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
      {/* Çalışma Günleri */}
      <div className="glass-card rounded-2xl border border-white/10 glow-emerald">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Çalışma Günleri</h3>
            <p className="text-xs text-zinc-500">Haftalık çalışma günlerini seçin</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {DAYS.map((day) => (
              <button
                key={day.key}
                onClick={() => toggleDay(day.key)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all ${
                  workDays.includes(day.key)
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                }`}
              >
                <span className="text-xs font-medium">{day.short}</span>
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                  workDays.includes(day.key)
                    ? 'bg-emerald-500'
                    : 'bg-white/5 border border-white/10'
                }`}>
                  {workDays.includes(day.key) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hibrit Çalışma Günleri */}
      <div className="glass-card rounded-2xl border border-white/10 glow-violet">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Home className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Varsayılan Hibrit Günler</h3>
            <p className="text-xs text-zinc-500">Evden çalışma günleri (birden fazla seçebilirsiniz)</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {DAYS.filter(d => workDays.includes(d.key)).map((day) => (
              <button
                key={day.key}
                onClick={() => toggleHybridDay(day.key)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all ${
                  hybridDays.includes(day.key)
                    ? 'bg-violet-500/20 border-violet-500/30 text-violet-400'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                }`}
              >
                <span className="text-xs font-medium">{day.short}</span>
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                  hybridDays.includes(day.key)
                    ? 'bg-violet-500'
                    : 'bg-white/5 border border-white/10'
                }`}>
                  {hybridDays.includes(day.key) && (
                    <Home className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            Seçilen günler varsayılan hibrit günlerdir. Haftalık istisnalar için Mesai sayfasındaki &quot;Hibrit/Ofis&quot; butonunu kullanın.
          </p>
        </div>
      </div>

      {/* Çalışma Saatleri */}
      <div className="glass-card rounded-2xl border border-white/10">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Çalışma Saatleri</h3>
            <p className="text-xs text-zinc-500">Günlük mesai saatlerini belirleyin</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Mesai Başlangıç/Bitiş */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-zinc-300">Mesai Saatleri</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500 mb-1.5">Başlangıç</label>
                  <input
                    type="time"
                    value={workHours.start}
                    onChange={(e) => updateHours('start', e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
                <span className="text-zinc-500 mt-5">—</span>
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500 mb-1.5">Bitiş</label>
                  <input
                    type="time"
                    value={workHours.end}
                    onChange={(e) => updateHours('end', e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Öğle Arası */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-zinc-300">Öğle Arası</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500 mb-1.5">Başlangıç</label>
                  <input
                    type="time"
                    value={workHours.lunch_start}
                    onChange={(e) => updateHours('lunch_start', e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
                <span className="text-zinc-500 mt-5">—</span>
                <div className="flex-1">
                  <label className="block text-xs text-zinc-500 mb-1.5">Bitiş</label>
                  <input
                    type="time"
                    value={workHours.lunch_end}
                    onChange={(e) => updateHours('lunch_end', e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
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
