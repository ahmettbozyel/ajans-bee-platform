'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Layers, Plus, Edit, Trash2, X, Loader2, GripVertical, AlertTriangle } from 'lucide-react'

interface Sector {
  id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
  created_at: string
}

// Slug oluşturma fonksiyonu
function generateSlug(name: string): string {
  const turkishMap: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  }

  return name
    .toLowerCase()
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function SectorsTab() {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSector, setEditingSector] = useState<Sector | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [usageCount, setUsageCount] = useState<number>(0)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sort_order: 0
  })

  const supabase = createClient()

  const fetchSectors = useCallback(async () => {
    setLoading(true)
    const { data, error } = await (supabase as any)
      .from('sectors')
      .select('*')
      .order('sort_order', { ascending: true })

    if (!error && data) {
      setSectors(data)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchSectors()
  }, [fetchSectors])

  const openAddModal = () => {
    setEditingSector(null)
    const nextOrder = sectors.length > 0
      ? Math.max(...sectors.map(s => s.sort_order)) + 1
      : 1
    setFormData({ name: '', slug: '', sort_order: nextOrder })
    setShowModal(true)
  }

  const openEditModal = (sector: Sector) => {
    setEditingSector(sector)
    setFormData({
      name: sector.name,
      slug: sector.slug,
      sort_order: sector.sort_order
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingSector(null)
    setFormData({ name: '', slug: '', sort_order: 0 })
  }

  // İsim değiştiğinde slug otomatik oluştur (sadece yeni eklerken)
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      // Düzenleme modunda slug'ı değiştirme
      slug: editingSector ? prev.slug : generateSlug(name)
    }))
  }

  const handleSave = async () => {
    if (!formData.name || !formData.slug) return

    setSaving(true)
    try {
      if (editingSector) {
        await (supabase as any)
          .from('sectors')
          .update({
            name: formData.name,
            slug: formData.slug,
            sort_order: formData.sort_order
          })
          .eq('id', editingSector.id)
      } else {
        await (supabase as any)
          .from('sectors')
          .insert({
            name: formData.name,
            slug: formData.slug,
            sort_order: formData.sort_order,
            is_active: true
          })
      }
      closeModal()
      fetchSectors()
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  // Silmeden önce kullanım kontrolü
  const checkUsageAndConfirmDelete = async (sector: Sector) => {
    const { count } = await (supabase as any)
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('sector', sector.slug)

    setUsageCount(count || 0)
    setDeleteConfirmId(sector.id)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      await (supabase as any).from('sectors').delete().eq('id', id)
      setDeleteConfirmId(null)
      fetchSectors()
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setDeleting(null)
    }
  }

  const toggleActive = async (sector: Sector) => {
    await (supabase as any)
      .from('sectors')
      .update({ is_active: !sector.is_active })
      .eq('id', sector.id)
    fetchSectors()
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
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Sektörler</h3>
              <p className="text-xs text-zinc-500">{sectors.length} sektör tanımlı</p>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="h-11 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-lg shadow-indigo-500/25 flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Sektör Ekle
          </button>
        </div>

        {/* List */}
        <div className="p-6">
          {sectors.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">Henüz sektör eklenmedi</p>
            </div>
          ) : (
            <div className="space-y-1">
              {sectors.map((sector) => (
                <div
                  key={sector.id}
                  className={`flex items-center justify-between py-3 border-b border-white/10 last:border-0 hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors ${
                    !sector.is_active ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-4 h-4 text-zinc-600 cursor-grab" />
                    <div className="text-sm font-mono text-zinc-500 w-8">
                      {sector.sort_order}
                    </div>
                    <div>
                      <span className="text-white font-medium">{sector.name}</span>
                      <span className="ml-2 text-xs text-zinc-500 font-mono">({sector.slug})</span>
                      {!sector.is_active && (
                        <span className="ml-2 inline-flex items-center text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          Pasif
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleActive(sector)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        sector.is_active
                          ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                      }`}
                    >
                      {sector.is_active ? 'Aktif' : 'Pasif'}
                    </button>
                    <button
                      onClick={() => openEditModal(sector)}
                      className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => checkUsageAndConfirmDelete(sector)}
                      disabled={deleting === sector.id}
                      className="p-2 rounded-lg hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition-colors disabled:opacity-50"
                    >
                      {deleting === sector.id ? (
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#18181b] border border-white/10">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-semibold">
                {editingSector ? 'Sektör Düzenle' : 'Yeni Sektör Ekle'}
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
                  Sektör Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Örn: E-Ticaret"
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Slug (URL Kodu)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Örn: e-ticaret"
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm placeholder:text-zinc-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Otomatik oluşturulur, değiştirmemeniz önerilir.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Sıra
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>
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
                disabled={saving || !formData.name || !formData.slug}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#18181b] border border-white/10">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Sektörü Sil</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Bu sektörü silmek istediğinize emin misiniz?
              </p>
              {usageCount > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
                  <p className="text-amber-400 text-sm">
                    <strong>{usageCount}</strong> marka bu sektörü kullanıyor!
                    <br />
                    <span className="text-xs text-amber-400/70">
                      Silmeden önce markaların sektörünü değiştirmeniz önerilir.
                    </span>
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-medium hover:bg-white/10 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting === deleteConfirmId}
                className="h-10 px-4 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {deleting === deleteConfirmId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Siliniyor...
                  </>
                ) : (
                  'Sil'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
