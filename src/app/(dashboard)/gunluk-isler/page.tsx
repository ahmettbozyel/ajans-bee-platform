'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { DailyTask, TaskCategory, AppUser } from '@/lib/auth-types'
import { 
  Plus, 
  Calendar,
  Building2,
  Trash2,
  Edit,
  Check,
  X,
  Loader2,
  Users,
  CheckCircle2,
  RotateCcw,
  Copy,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminGunlukIslerPage() {
  const { appUser, isAdmin } = useAuth()
  const [tasks, setTasks] = useState<DailyTask[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [brands, setBrands] = useState<{ id: string; brand_name: string }[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedUser, setSelectedUser] = useState<string>('all')
  
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

  useEffect(() => {
    fetchData()
  }, [selectedDate, selectedUser])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Kategoriler
      const { data: cats } = await (supabase as any)
        .from('task_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      
      if (cats) setCategories(cats as TaskCategory[])

      // Markalar
      const { data: brandsData } = await supabase
        .from('customers')
        .select('id, brand_name')
        .eq('status', 'active')
        .order('brand_name')
      
      if (brandsData) setBrands(brandsData)

      // Kullanıcılar (Admin için)
      if (isAdmin) {
        const { data: usersData } = await supabase
          .from('users')
          .select('*')
          .eq('is_active', true)
          .order('full_name')
        
        if (usersData) setUsers(usersData as AppUser[])
      }

      // Günlük işler
      let query = (supabase as any)
        .from('daily_tasks')
        .select(`
          *,
          category:task_categories(*),
          brand:customers(id, brand_name),
          user:users(id, full_name, email)
        `)
        .eq('date', selectedDate)
        .order('created_at', { ascending: false })
      
      if (selectedUser !== 'all') {
        query = query.eq('user_id', selectedUser)
      }
      
      const { data: tasksData } = await query
      
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
      if (editingTask) {
        // Düzenleme - sadece temel alanları güncelle
        await (supabase as any)
          .from('daily_tasks')
          .update({
            brand_id: formData.brand_id || null,
            category_id: formData.category_id,
            description: formData.description.trim(),
            date: formData.date
          })
          .eq('id', editingTask.id)
      } else {
        // Yeni iş - started_at ve status ekle
        await (supabase as any)
          .from('daily_tasks')
          .insert({
            user_id: appUser.id,
            brand_id: formData.brand_id || null,
            category_id: formData.category_id,
            description: formData.description.trim(),
            date: formData.date,
            started_at: new Date().toISOString(),
            status: 'in_progress'
          })
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
    
    await (supabase as any).from('daily_tasks').delete().eq('id', id)
    fetchData()
  }

  // Bitti butonu
  const handleComplete = async (task: DailyTask) => {
    const now = new Date()
    const startedAt = task.started_at ? new Date(task.started_at) : now
    const durationMinutes = Math.round((now.getTime() - startedAt.getTime()) / 60000)
    
    await (supabase as any).from('daily_tasks').update({
      completed_at: now.toISOString(),
      status: 'completed',
      duration_minutes: durationMinutes
    }).eq('id', task.id)
    
    fetchData()
  }

  // Geri Al butonu
  const handleReopen = async (task: DailyTask) => {
    await (supabase as any).from('daily_tasks').update({
      completed_at: null,
      status: 'in_progress',
      duration_minutes: null
    }).eq('id', task.id)
    
    fetchData()
  }

  // Revize butonu
  const handleRevise = async (task: DailyTask) => {
    const revisionNumber = (task.revision_number || 0) + 1
    // Orijinal açıklamayı al ([R1] vs varsa kaldır)
    const baseDescription = task.description.replace(/\s*\[R\d+\]$/, '')
    
    await (supabase as any).from('daily_tasks').insert({
      user_id: task.user_id,
      brand_id: task.brand_id,
      category_id: task.category_id,
      description: `${baseDescription} [R${revisionNumber}]`,
      date: task.date,
      started_at: new Date().toISOString(),
      status: 'in_progress',
      parent_id: task.parent_id || task.id, // Orijinal parent'ı koru
      revision_number: revisionNumber
    })
    
    fetchData()
  }

  // Süre formatla
  const formatDuration = (task: DailyTask) => {
    if (!task.started_at) return null
    
    const start = new Date(task.started_at)
    const end = task.completed_at ? new Date(task.completed_at) : new Date()
    const diffMinutes = Math.round((end.getTime() - start.getTime()) / 60000)
    
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    
    const startTime = start.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    const endTime = task.completed_at 
      ? end.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      : '...'
    
    const duration = hours > 0 ? `${hours}s ${minutes}d` : `${minutes}d`
    
    return { startTime, endTime, duration }
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  // Kullanıcılara göre grupla
  const groupedTasks = tasks.reduce((acc, task) => {
    const userId = task.user_id
    if (!acc[userId]) {
      acc[userId] = {
        user: (task as any).user,
        tasks: []
      }
    }
    acc[userId].tasks.push(task)
    return acc
  }, {} as Record<string, { user: any; tasks: DailyTask[] }>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Günlük İşler</h1>
          <p className="text-sm text-zinc-400 mt-1">Tüm personelin günlük iş kayıtları</p>
        </div>
        <Button onClick={openNewModal} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          İş Ekle
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border-none text-zinc-100 font-medium focus:outline-none"
          />
        </div>
        
        <div className="h-6 w-px bg-zinc-700" />
        
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-400" />
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tüm Personel</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name || user.email}
              </option>
            ))}
          </select>
        </div>
        
        <span className="text-zinc-400 text-sm ml-auto">{formatDate(selectedDate)}</span>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : Object.keys(groupedTasks).length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-zinc-400">Bu tarihte kayıtlı iş yok</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([userId, group]) => (
            <div key={userId} className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
              {/* User Header */}
              <div className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-700 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {group.user?.full_name?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    {group.user?.full_name || 'Bilinmeyen Kullanıcı'}
                  </p>
                  <p className="text-xs text-zinc-500">{group.tasks.length} iş</p>
                </div>
              </div>
              
              {/* Tasks */}
              <div className="divide-y divide-zinc-800">
                {group.tasks.map((task) => {
                  const timeInfo = formatDuration(task)
                  const isCompleted = task.status === 'completed'
                  
                  return (
                    <div key={task.id} className={`p-4 hover:bg-zinc-800/30 transition-colors ${isCompleted ? 'opacity-75' : ''}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {/* Status Badge */}
                            {isCompleted ? (
                              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Tamamlandı
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Devam
                              </span>
                            )}
                            
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
                            {task.brand ? (
                              <span className="text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-400 font-medium flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {task.brand.brand_name}
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded-full bg-zinc-700/50 text-zinc-400 font-medium">
                                Genel
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-zinc-200 ${isCompleted ? 'line-through text-zinc-400' : ''}`}>
                            {task.description}
                          </p>
                          
                          {/* Süre Bilgisi */}
                          {timeInfo && (
                            <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeInfo.startTime} → {timeInfo.endTime}
                              <span className="text-zinc-400 font-medium ml-1">({timeInfo.duration})</span>
                            </p>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                          {isCompleted ? (
                            // Tamamlanmış: Geri Al butonu
                            <button
                              onClick={() => handleReopen(task)}
                              className="p-2 rounded-lg hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 transition-colors"
                              title="Geri Al"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          ) : (
                            // Devam eden: Bitti ve Revize butonları
                            <>
                              <button
                                onClick={() => handleComplete(task)}
                                className="p-2 rounded-lg hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400 transition-colors"
                                title="Bitti"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRevise(task)}
                                className="p-2 rounded-lg hover:bg-blue-500/20 text-zinc-400 hover:text-blue-400 transition-colors"
                                title="Revize"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openEditModal(task)}
                            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                            title="Düzenle"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="p-2 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
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
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Tarih</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Marka (Opsiyonel)</label>
                <select
                  value={formData.brand_id}
                  onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Genel</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                  ))}
                </select>
              </div>

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
                          ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-900' 
                          : 'hover:opacity-80'
                      }`}
                      style={{ 
                        backgroundColor: `${cat.color}20`,
                        color: cat.color
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

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

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !formData.category_id || !formData.description.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-2" />{editingTask ? 'Güncelle' : 'Kaydet'}</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
