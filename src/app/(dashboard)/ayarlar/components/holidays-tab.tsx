'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Plus, Edit, Trash2, X, Loader2, RefreshCw } from 'lucide-react'

interface Holiday {
  id: string
  name: string
  date: string
  is_recurring: boolean
  description: string | null
  created_at: string
}

export function HolidaysTab() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    is_recurring: false,
    description: ''
  })

  const supabase = createClient()

  const fetchHolidays = useCallback(async () => {
    setLoading(true)
    const { data, error } = await (supabase as any)
      .from('app_holidays')
      .select('*')
      .order('date', { ascending: true })

    if (!error && data) {
      setHolidays(data)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchHolidays()
  }, [fetchHolidays])

  const openAddModal = () => {
    setEditingHoliday(null)
    setFormData({ name: '', date: '', is_recurring: false, description: '' })
    setShowModal(true)
  }

  const openEditModal = (holiday: Holiday) => {
    setEditingHoliday(holiday)
    setFormData({
      name: holiday.name,
      date: holiday.date,
      is_recurring: holiday.is_recurring,
      description: holiday.description || ''
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingHoliday(null)
    setFormData({ name: '', date: '', is_recurring: false, description: '' })
  }

  const handleSave = async () => {
    if (!formData.name || !formData.date) return

    setSaving(true)
    try {
      if (editingHoliday) {
        await (supabase as any)
          .from('app_holidays')
          .update({
            name: formData.name,
            date: formData.date,
            is_recurring: formData.is_recurring,
            description: formData.description || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingHoliday.id)
      } else {
        await (supabase as any)
          .from('app_holidays')
          .insert({
            name: formData.name,
            date: formData.date,
            is_recurring: formData.is_recurring,
            description: formData.description || null
          })
      }
      closeModal()
      fetchHolidays()
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu tatili silmek istediğinize emin misiniz?')) return

    setDeleting(id)
    try {
      await (supabase as any).from('app_holidays').delete().eq('id', id)
      fetchHolidays()
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="glass-card rounded-2xl border border-white/10 p-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
      </div>
    )
  }

  return (
    <>
      <div className="glass-card rounded-2xl border border-white/10 glow-indigo">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Resmi Tatiller</h3>
              <p className="text-xs text-zinc-500">{holidays.length} tatil tanımlı</p>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="h-11 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-lg shadow-indigo-500/25 flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Tatil Ekle
          </button>
        </div>

        {/* List */}
        <div className="p-6">
          {holidays.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">Henüz tatil tanımlanmamış</p>
            </div>
          ) : (
            <div className="space-y-1">
              {holidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center justify-between py-3 border-b border-white/10 last:border-0 hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-mono text-zinc-400 w-32">
                      {formatDate(holiday.date)}
                    </div>
                    <div>
                      <span className="text-white font-medium">{holiday.name}</span>
                      {holiday.is_recurring && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <RefreshCw className="w-3 h-3" />
                          Her yıl
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(holiday)}
                      className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(holiday.id)}
                      disabled={deleting === holiday.id}
                      className="p-2 rounded-lg hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition-colors disabled:opacity-50"
                    >
                      {deleting === holiday.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#18181b] border border-white/10">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-semibold">
                {editingHoliday ? 'Tatil Düzenle' : 'Yeni Tatil Ekle'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-white/10 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Tatil Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: Cumhuriyet Bayramı"
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Açıklama (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Örn: 29 Ekim"
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.is_recurring}
                    onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-lg border transition-all flex items-center justify-center ${
                    formData.is_recurring
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'bg-white/5 border-white/10 group-hover:border-white/20'
                  }`}>
                    {formData.is_recurring && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-zinc-300">Her yıl tekrarla</span>
              </label>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-medium hover:bg-white/10 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.date}
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-lg shadow-indigo-500/25 flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  'Kaydet'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
