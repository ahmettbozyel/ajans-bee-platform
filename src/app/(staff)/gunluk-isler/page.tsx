'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { DailyTask, TaskCategory } from '@/lib/auth-types'
import { 
  Plus, 
  Calendar,
  Building2,
  Tag,
  Clock,
  Trash2,
  Edit,
  Check,
  X,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GunlukIslerPage() {
  const { appUser } = useAuth()
  const [tasks, setTasks] = useState<DailyTask[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [brands, setBrands] = useState<{ id: string; brand_name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null)
  const [formData, setFormData] = useState({
    brand_id: '',
    category_id: '',
    description: '',
    date: selectedDate
  })
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  // Fetch data
  useEffect(() => {
    fetchData()
  }, [selectedDate])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Kategoriler
      const { data: cats } = await supabase
        .from('task_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      
      if (cats) setCategories(cats)

      // Markalar (sadece admin için tümü, diğerleri için aktifler)
      const { data: brandsData } = await supabase
        .from('customers')
        .select('id, brand_name')
        .eq('status', 'active')
        .order('brand_name')
      
      if (brandsData) setBrands(brandsData)

      // Günlük işler
      const { data: tasksData } = await supabase
        .from('daily_tasks')
        .select(`
          *,
          category:task_categories(*),
          brand:customers(id, brand_name)
        `)
        .eq('date', selectedDate)
        .order('created_at', { ascending: false })
      
      if (tasksData) setTasks(tasksData as DailyTask[])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appUser || !formData.category_id || !formData.description.trim()) return

    setSaving(true)
    try {
      const payload = {
        user_id: appUser.id,
        brand_id: formData.brand_id || null,
        category_id: formData.category_id,
        description: formData.description.trim(),
        date: formData.date
      }

      if (editingTask) {
        await supabase
          .from('daily_tasks')
          .update(payload)
          .eq('id', editingTask.id)
      } else {
        await supabase
          .from('daily_tasks')
          .insert(payload)
      }

      setShowModal(false)
      setEditingTask(null)
      setFormData({ brand_id: '', category_id: '', description: '', date: selectedDate })
      fetchData()
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu işi silmek istediğine emin misin?')) return
    
    await supabase.from('daily_tasks').delete().eq('id', id)
    fetchData()
  }

  const openEditModal = (task: DailyTask) => {
    setEditingTask(task)
    setFormData({
      brand_id: task.brand_id || '',
      category_id: task.category_id,
      description: task.description,
      date: task.date
    })
    setShowModal(true)
  }

  const openNewModal = () => {
    setEditingTask(null)
    setFormData({ brand_id: '', category_id: '', description: '', date: selectedDate })
    setShowModal(true)
  }

  // Today's date formatted
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Günlük İşler</h1>
          <p className="text-sm text-zinc-400 mt-1">Bugün yaptığın işleri kaydet</p>
        </div>
        <Button onClick={openNewModal} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          İş Ekle
        </Button>
      </div>

      {/* Date Selector */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
        <Calendar className="w-5 h-5 text-indigo-400" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-transparent border-none text-zinc-100 text-lg font-medium focus:outline-none"
        />
        <span className="text-zinc-400 text-sm">{formatDate(selectedDate)}</span>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-zinc-400">Bu tarihte kayıtlı iş yok</p>
          <Button onClick={openNewModal} variant="outline" className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            İlk işini ekle
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Category & Brand */}
                  <div className="flex items-center gap-2 mb-2">
                    {task.category && (
                      <span 
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ 
                          backgroundColor: `${task.category.color}20`,
                          color: task.category.color
                        }}
                      >
                        {task.category.name}
                      </span>
                    )}
                    {task.brand && (
                      <span className="text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-400 font-medium flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {task.brand.brand_name}
                      </span>
                    )}
                    {!task.brand && (
                      <span className="text-xs px-2 py-1 rounded-full bg-zinc-700/50 text-zinc-400 font-medium">
                        Genel
                      </span>
                    )}
                  </div>
                  {/* Description */}
                  <p className="text-zinc-200">{task.description}</p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-zinc-100">
                {editingTask ? 'İşi Düzenle' : 'Yeni İş Ekle'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Tarih</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Marka (Opsiyonel)</label>
                <select
                  value={formData.brand_id}
                  onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Genel (Marka seçme)</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Kategori *</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category_id: cat.id })}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        formData.category_id === cat.id
                          ? 'ring-2 ring-offset-2 ring-offset-zinc-900'
                          : 'hover:opacity-80'
                      }`}
                      style={{ 
                        backgroundColor: `${cat.color}20`,
                        color: cat.color,
                        ringColor: formData.category_id === cat.id ? cat.color : undefined
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Açıklama *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ne yaptın?"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !formData.category_id || !formData.description.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {editingTask ? 'Güncelle' : 'Kaydet'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
