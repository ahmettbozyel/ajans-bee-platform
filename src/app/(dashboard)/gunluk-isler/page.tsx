'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { DailyTask, TaskCategory, AppUser, TaskStatus, AVATAR_COLORS, CATEGORY_COLORS } from '@/lib/auth-types'
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
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RefreshCw,
  Trophy,
  PieChart,
  AlertTriangle,
  Download,
  ListChecks,
  PlayCircle,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Süre formatla (saniye -> Xs Xd)
function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '0d'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}s ${minutes}d`
  }
  return `${minutes}d`
}

// Saat formatla
function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Istanbul'
  })
}

// Tarih formatla
function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  })
}

// Tarih formatla (kısa)
function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Ay formatla
function formatMonth(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('tr-TR', {
    month: 'long',
    year: 'numeric'
  })
}

// Avatar rengi al
function getAvatarColor(name: string | null): string {
  if (!name) return AVATAR_COLORS['default']
  const firstChar = name.charAt(0).toUpperCase()
  return AVATAR_COLORS[firstChar] || AVATAR_COLORS['default']
}

// Revize noktaları
function RevizeDots({ count }: { count: number }) {
  if (count === 0) return null
  
  const dots = []
  const maxDots = Math.min(count, 4)
  const colors = ['bg-rose-400', 'bg-rose-500', 'bg-rose-600', 'bg-rose-700']
  
  for (let i = 0; i < maxDots; i++) {
    dots.push(
      <div key={i} className={`revize-dot ${colors[i]}`} title={`${count} Revize`} />
    )
  }
  
  return <div className="flex items-center gap-1 ml-2">{dots}</div>
}

// Status Badge
function StatusBadge({ status }: { status: TaskStatus }) {
  const config: Record<TaskStatus, { label: string; icon: React.ReactNode; classes: string }> = {
    'active': {
      label: 'Devam Ediyor',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 timer-active" />,
      classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
    },
    'paused': {
      label: 'Beklemede',
      icon: <Pause className="w-3 h-3" />,
      classes: 'bg-amber-500/20 text-amber-400 border-amber-500/20'
    },
    'completed': {
      label: 'Tamamlandı',
      icon: <CheckCircle className="w-3 h-3" />,
      classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  }
  
  const { label, icon, classes } = config[status]
  
  return (
    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${classes}`}>
      {icon}
      {label}
    </span>
  )
}

// Özet Kart Component
function StatCard({ icon, value, label, color, subtitle }: { 
  icon: React.ReactNode
  value: string | number
  label: string
  color: string
  subtitle?: string 
}) {
  const colorClasses: Record<string, { iconBg: string; glow: string }> = {
    'indigo': { 
      iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      glow: 'glow-indigo'
    },
    'emerald': { 
      iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      glow: 'glow-emerald'
    },
    'amber': { 
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      glow: 'glow-amber'
    },
    'rose': { 
      iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      glow: 'glow-rose'
    },
    'cyan': { 
      iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      glow: 'glow-cyan'
    },
  }
  
  const { iconBg, glow } = colorClasses[color] || colorClasses['indigo']
  
  return (
    <div className={`glass-card rounded-2xl p-4 border border-white/10 ${glow} card-hover`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg border ${iconBg}`}>
          {icon}
        </div>
        <span className="text-xs text-zinc-500">{subtitle || 'Bugün'}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  )
}

// Task Card Component
function TaskCard({ 
  task, 
  isAdmin, 
  onPause, 
  onResume, 
  onComplete, 
  onStartRevision,
  onEdit,
  onDelete 
}: { 
  task: DailyTask & { user?: { id: string; full_name: string | null } }
  isAdmin: boolean
  onPause: (task: DailyTask) => void
  onResume: (task: DailyTask) => void
  onComplete: (task: DailyTask) => void
  onStartRevision: (task: DailyTask) => void
  onEdit: (task: DailyTask) => void
  onDelete: (task: DailyTask) => void
}) {
  const [currentDuration, setCurrentDuration] = useState(task.total_duration)
  
  useEffect(() => {
    if (task.status !== 'active') {
      setCurrentDuration(task.total_duration)
      return
    }
    
    const startTime = new Date(task.start_time).getTime()
    const pausedDuration = task.total_duration || 0
    
    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - startTime) / 1000)
      setCurrentDuration(pausedDuration + elapsed)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [task.status, task.start_time, task.total_duration])
  
  const getCardClasses = () => {
    if (task.status === 'active') {
      return 'border-emerald-500/30 glow-emerald'
    }
    if (task.status === 'paused') {
      return 'border-white/10'
    }
    return 'border-white/10 opacity-75'
  }
  
  const categorySlug = task.category?.slug || 'genel'
  const categoryColor = CATEGORY_COLORS[categorySlug] || CATEGORY_COLORS['genel']
  
  return (
    <div className={`glass-card rounded-2xl p-5 cursor-pointer hover:border-white/20 transition-all ${getCardClasses()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && task.user && (
            <div className="flex items-center gap-2 mr-2">
              <div className={`h-7 w-7 rounded-full bg-gradient-to-br ${getAvatarColor(task.user.full_name)} flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">
                  {task.user.full_name?.charAt(0) || '?'}
                </span>
              </div>
              <span className="text-sm font-medium text-zinc-300">
                {task.user.full_name?.split(' ')[0]}
              </span>
            </div>
          )}
          
          <StatusBadge status={task.status} />
          
          <span className={`text-xs px-2.5 py-1 rounded-full ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}>
            {task.category?.name || 'Genel'}
          </span>
          
          {task.brand && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20">
              <Building2 className="w-3 h-3 inline mr-1" />
              {task.brand.brand_name}
            </span>
          )}
          
          <RevizeDots count={task.revision_count} />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">{task.description}</h3>
      
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-zinc-400">
          <Clock className="w-4 h-4" />
          <span className="font-mono">{formatTime(task.start_time)}</span>
          <span className="text-zinc-600">→</span>
          {task.end_time ? (
            <span className="font-mono">{formatTime(task.end_time)}</span>
          ) : (
            <span className="text-zinc-600 font-mono">...</span>
          )}
        </div>
        
        {task.status === 'active' ? (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400">
            <span className="font-mono font-semibold timer-active">{formatDuration(currentDuration)}</span>
          </div>
        ) : task.status === 'completed' ? (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Check className="w-3 h-3" />
            <span className="font-mono">{formatDuration(task.total_duration)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 text-zinc-300">
            <span className="font-mono">{formatDuration(task.total_duration)}</span>
          </div>
        )}
      </div>
      
      {/* Action Buttons - Revize sol alt, düzenle/sil sağ alt */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
        {task.status === 'active' && (
          <>
            <Button size="sm" variant="outline" onClick={() => onPause(task)} className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10">
              <Pause className="w-3 h-3 mr-1" />
              Beklemede
            </Button>
            <Button size="sm" onClick={() => onComplete(task)} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Check className="w-3 h-3 mr-1" />
              Bitti
            </Button>
          </>
        )}
        
        {task.status === 'paused' && (
          <>
            <Button size="sm" variant="outline" onClick={() => onResume(task)} className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10">
              <Play className="w-3 h-3 mr-1" />
              Devam Et
            </Button>
            <Button size="sm" onClick={() => onComplete(task)} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Check className="w-3 h-3 mr-1" />
              Bitti
            </Button>
            <Button size="sm" variant="outline" onClick={() => onStartRevision(task)} className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
              <RefreshCw className="w-3 h-3 mr-1" />
              Revize
            </Button>
          </>
        )}
        
        {task.status === 'completed' && (
          <Button size="sm" variant="outline" onClick={() => onStartRevision(task)} className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
            <RefreshCw className="w-3 h-3 mr-1" />
            Revize Başlat
          </Button>
        )}
        
        <div className="flex-1" />
        
        <button onClick={() => onEdit(task)} className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-zinc-200 transition-colors">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(task)} className="p-2 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Stats Panel Component
function StatsPanel({ tasks, users }: { tasks: DailyTask[], users: AppUser[] }) {
  const performanceData = users.map(user => {
    const userTasks = tasks.filter(t => t.user_id === user.id)
    const totalDuration = userTasks.reduce((sum, t) => sum + (t.total_duration || 0), 0)
    return { user, totalDuration, taskCount: userTasks.length }
  }).filter(p => p.taskCount > 0).sort((a, b) => b.totalDuration - a.totalDuration)
  
  const brandStats: Record<string, { name: string; duration: number }> = {}
  tasks.forEach(task => {
    const brandName = task.brand?.brand_name || 'Genel'
    if (!brandStats[brandName]) {
      brandStats[brandName] = { name: brandName, duration: 0 }
    }
    brandStats[brandName].duration += task.total_duration || 0
  })
  const brandData = Object.values(brandStats).sort((a, b) => b.duration - a.duration).slice(0, 5)
  const totalBrandDuration = brandData.reduce((sum, b) => sum + b.duration, 0)
  
  const totalRevisions = tasks.reduce((sum, t) => sum + t.revision_count, 0)
  const revisionTasks = tasks.filter(t => t.revision_count > 0)
  const avgRevision = tasks.length > 0 ? (totalRevisions / tasks.length).toFixed(1) : '0'
  
  const brandRevisions: Record<string, { name: string; count: number }> = {}
  tasks.forEach(task => {
    if (task.revision_count > 0) {
      const brandName = task.brand?.brand_name || 'Genel'
      if (!brandRevisions[brandName]) {
        brandRevisions[brandName] = { name: brandName, count: 0 }
      }
      brandRevisions[brandName].count += task.revision_count
    }
  })
  const topRevisionBrand = Object.values(brandRevisions).sort((a, b) => b.count - a.count)[0]
  
  const maxDuration = Math.max(...performanceData.map(p => p.totalDuration), 1)
  
  const gradientColors = [
    'from-rose-500 to-pink-500',
    'from-violet-500 to-purple-500',
    'from-cyan-500 to-blue-500',
    'from-amber-500 to-orange-500',
    'from-emerald-500 to-teal-500'
  ]
  
  const brandGradients = [
    'from-amber-500 to-orange-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-pink-500'
  ]
  
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-white">Bugün Performans</h3>
        </div>
        <div className="space-y-3">
          {performanceData.length === 0 ? (
            <p className="text-sm text-zinc-500">Henüz veri yok</p>
          ) : (
            performanceData.slice(0, 5).map((item, index) => (
              <div key={item.user.id} className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${getAvatarColor(item.user.full_name)} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">
                    {item.user.full_name?.charAt(0) || '?'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">{item.user.full_name?.split(' ')[0]}</span>
                    <span className="text-xs font-mono text-zinc-400">{formatDuration(item.totalDuration)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${gradientColors[index % gradientColors.length]}`}
                      style={{ width: `${(item.totalDuration / maxDuration) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="glass-card rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-violet-400" />
          <h3 className="font-semibold text-white">Marka Dağılımı</h3>
        </div>
        <div className="space-y-3">
          {brandData.length === 0 ? (
            <p className="text-sm text-zinc-500">Henüz veri yok</p>
          ) : (
            brandData.map((brand, index) => {
              const percentage = totalBrandDuration > 0 ? Math.round((brand.duration / totalBrandDuration) * 100) : 0
              return (
                <div key={brand.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-zinc-400">{brand.name}</span>
                    <span className="text-xs font-mono text-zinc-500">{formatDuration(brand.duration)} ({percentage}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${brandGradients[index % brandGradients.length]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
      
      <div className="glass-card rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <h3 className="font-semibold text-white">Revize Durumu</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-full bg-rose-500/10 border border-rose-500/20">
            <span className="text-sm text-white ml-2">Bugün Revize</span>
            <span className="text-lg font-bold text-rose-400 mr-2">{totalRevisions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Revizeli İş</span>
            <span className="text-sm font-mono font-semibold text-zinc-300">{revisionTasks.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Ort. Revize / İş</span>
            <span className="text-sm font-mono font-semibold text-zinc-300">{avgRevision}</span>
          </div>
          {topRevisionBrand && (
            <div className="pt-3 border-t border-white/10">
              <p className="text-xs text-zinc-500 mb-2">En Çok Revize Alan</p>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">{topRevisionBrand.name}</span>
                <span className="text-xs text-rose-400">{topRevisionBrand.count} revize</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Page Component
export default function GunlukIslerPage() {
  const { appUser, isAdmin } = useAuth()
  const [tasks, setTasks] = useState<DailyTask[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [brands, setBrands] = useState<{ id: string; brand_name: string }[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedUser, setSelectedUser] = useState<string>('all')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null)
  const [formData, setFormData] = useState({
    brand_id: '',
    category_id: '',
    description: ''
  })
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: cats } = await (supabase as any)
        .from('task_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      
      if (cats) setCategories(cats as TaskCategory[])

      const { data: brandsData } = await supabase
        .from('customers')
        .select('id, brand_name')
        .eq('status', 'active')
        .order('brand_name')
      
      if (brandsData) setBrands(brandsData)

      if (isAdmin) {
        const { data: usersData } = await supabase
          .from('users')
          .select('*')
          .eq('is_active', true)
          .neq('role', 'admin')
          .order('full_name')
        
        if (usersData) setUsers(usersData as AppUser[])
      }

      let query = (supabase as any)
        .from('daily_tasks')
        .select(`
          *,
          category:task_categories(*),
          brand:customers(id, brand_name),
          user:users(id, full_name, email, role)
        `)
        .eq('work_date', selectedDate)
        .order('created_at', { ascending: false })
      
      if (!isAdmin && appUser) {
        query = query.eq('user_id', appUser.id)
      } else if (selectedUser !== 'all') {
        query = query.eq('user_id', selectedUser)
      }
      
      if (selectedBrand !== 'all') {
        query = query.eq('brand_id', selectedBrand)
      }
      
      const { data: tasksData } = await query
      
      if (tasksData) setTasks(tasksData as DailyTask[])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedDate, selectedUser, selectedBrand, isAdmin, appUser, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    active: tasks.filter(t => t.status === 'active').length,
    revisions: tasks.reduce((sum, t) => sum + t.revision_count, 0),
    totalDuration: tasks.reduce((sum, t) => sum + (t.total_duration || 0), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appUser || !formData.category_id || !formData.description.trim()) return

    setSaving(true)
    try {
      if (editingTask) {
        await (supabase as any)
          .from('daily_tasks')
          .update({
            brand_id: formData.brand_id || null,
            category_id: formData.category_id,
            description: formData.description.trim()
          })
          .eq('id', editingTask.id)
      } else {
        await (supabase as any)
          .from('daily_tasks')
          .insert({
            user_id: appUser.id,
            brand_id: formData.brand_id || null,
            category_id: formData.category_id,
            description: formData.description.trim(),
            status: 'active',
            start_time: new Date().toISOString(),
            total_duration: 0,
            revision_count: 0,
            work_date: selectedDate
          })
      }

      setShowModal(false)
      setEditingTask(null)
      setFormData({ brand_id: '', category_id: '', description: '' })
      fetchData()
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePause = async (task: DailyTask) => {
    const now = new Date()
    const startTime = new Date(task.start_time).getTime()
    const elapsed = Math.floor((now.getTime() - startTime) / 1000)
    
    await (supabase as any)
      .from('daily_tasks')
      .update({
        status: 'paused',
        paused_at: now.toISOString(),
        total_duration: (task.total_duration || 0) + elapsed
      })
      .eq('id', task.id)
    
    fetchData()
  }

  const handleResume = async (task: DailyTask) => {
    await (supabase as any)
      .from('daily_tasks')
      .update({
        status: 'active',
        start_time: new Date().toISOString(),
        paused_at: null
      })
      .eq('id', task.id)
    
    fetchData()
  }

  const handleComplete = async (task: DailyTask) => {
    const now = new Date()
    let totalDuration = task.total_duration || 0
    
    if (task.status === 'active') {
      const startTime = new Date(task.start_time).getTime()
      const elapsed = Math.floor((now.getTime() - startTime) / 1000)
      totalDuration += elapsed
    }
    
    await (supabase as any)
      .from('daily_tasks')
      .update({
        status: 'completed',
        end_time: now.toISOString(),
        total_duration: totalDuration
      })
      .eq('id', task.id)
    
    fetchData()
  }

  const handleStartRevision = async (task: DailyTask) => {
    const now = new Date()
    
    await (supabase as any)
      .from('daily_tasks')
      .update({
        revision_count: task.revision_count + 1
      })
      .eq('id', task.id)
    
    await (supabase as any)
      .from('task_revisions')
      .insert({
        task_id: task.id,
        revision_number: task.revision_count + 1,
        start_time: now.toISOString(),
        duration: 0
      })
    
    fetchData()
  }

  const handleDelete = async (task: DailyTask) => {
    if (!confirm('Bu işi silmek istediğine emin misin?')) return
    
    await (supabase as any).from('daily_tasks').delete().eq('id', task.id)
    fetchData()
  }

  const handleEdit = (task: DailyTask) => {
    setEditingTask(task)
    setFormData({
      brand_id: task.brand_id || '',
      category_id: task.category_id,
      description: task.description
    })
    setShowModal(true)
  }

  const changeDate = (days: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + days)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0])
  }

  const getUserTaskCount = (userId: string) => {
    return tasks.filter(t => t.user_id === userId).length
  }

  const handleExcelExport = () => {
    alert('Excel export özelliği yakında eklenecek!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Günlük İşler</h1>
          <p className="text-sm text-zinc-400">Tüm personelin günlük iş kayıtları</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExcelExport} className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Excel İndir
          </Button>
          <Button onClick={() => { setEditingTask(null); setFormData({ brand_id: '', category_id: '', description: '' }); setShowModal(true) }} className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            İş Ekle
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <StatCard 
          icon={<ListChecks className="w-5 h-5" />} 
          value={stats.total} 
          label="Toplam İş" 
          color="indigo" 
        />
        <StatCard 
          icon={<CheckCircle className="w-5 h-5" />} 
          value={stats.completed} 
          label="Tamamlanan" 
          color="emerald" 
        />
        <StatCard 
          icon={<PlayCircle className="w-5 h-5" />} 
          value={stats.active} 
          label="Devam Eden" 
          color="amber"
          subtitle="Şu an"
        />
        <StatCard 
          icon={<RefreshCw className="w-5 h-5" />} 
          value={stats.revisions} 
          label="Revize" 
          color="rose" 
        />
        <StatCard 
          icon={<Clock className="w-5 h-5" />} 
          value={formatDuration(stats.totalDuration)} 
          label="Toplam Süre" 
          color="cyan" 
        />
      </div>

      <div className="glass-card rounded-2xl p-4 border border-white/10 glow-violet">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => changeDate(-1)}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold">{formatDateShort(selectedDate)}</span>
            </button>
            
            <button 
              onClick={() => changeDate(1)}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <button 
              onClick={goToToday}
              className="ml-2 px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30 transition-all"
            >
              Bugün
            </button>
            
            <div className="w-px h-8 bg-white/10" />
            
            <span className="text-zinc-400">{formatDateLong(selectedDate)}</span>
          </div>
          
          {/* Ay Dropdown */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 transition-all">
            <Calendar className="w-4 h-4 text-zinc-500" />
            <span className="text-sm">{formatMonth(selectedDate)}</span>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {isAdmin && (
        <div className="glass-card rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-400">Personel:</span>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <button 
                  onClick={() => setSelectedUser('all')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedUser === 'all' 
                      ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-400' 
                      : 'bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Tümü
                </button>
                
                {users.map(user => (
                  <button 
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${
                      selectedUser === user.id 
                        ? 'bg-indigo-500/20 border border-indigo-500/30' 
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className={`h-6 w-6 rounded-full bg-gradient-to-br ${getAvatarColor(user.full_name)} flex items-center justify-center`}>
                      <span className="text-white text-[10px] font-bold">
                        {user.full_name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-300">{user.full_name?.split(' ')[0]}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      {getUserTaskCount(user.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-500">Marka:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-sm hover:bg-white/10 transition-colors focus:outline-none"
              >
                <option value="all">Tümü</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className={`grid gap-6 ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
        <div className={`space-y-4 ${isAdmin ? 'col-span-2' : ''}`}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl border border-white/10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-zinc-600" />
              </div>
              <p className="text-zinc-400">Bu tarihte kayıtlı iş yok</p>
              <Button onClick={() => { setEditingTask(null); setFormData({ brand_id: '', category_id: '', description: '' }); setShowModal(true) }} className="mt-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600">
                <Plus className="w-4 h-4 mr-2" />
                İlk İşi Ekle
              </Button>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task as DailyTask & { user?: { id: string; full_name: string | null } }}
                isAdmin={isAdmin}
                onPause={handlePause}
                onResume={handleResume}
                onComplete={handleComplete}
                onStartRevision={handleStartRevision}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
        
        {isAdmin && <StatsPanel tasks={tasks} users={users} />}
      </div>

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
                  {categories.map((cat) => {
                    const catColor = CATEGORY_COLORS[cat.slug] || CATEGORY_COLORS['genel']
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category_id: cat.id })}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${catColor.bg} ${catColor.text} border ${catColor.border} ${
                          formData.category_id === cat.id 
                            ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-900' 
                            : 'hover:opacity-80'
                        }`}
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Açıklama *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ne yapıyorsun?"
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
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-2" />{editingTask ? 'Güncelle' : 'Başlat'}</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
