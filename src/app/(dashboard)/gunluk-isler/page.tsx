'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { DailyTask, TaskCategory, AppUser, TaskStatus, AVATAR_COLORS, CATEGORY_COLORS } from '@/lib/auth-types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  ChevronDown,
  BarChart3,
  Tag,
  RotateCcw,
  History,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// TaskRevision tipi
interface TaskRevision {
  id: string
  task_id: string
  revision_number: number
  note: string | null
  start_time: string
  end_time: string | null
  duration: number
  created_at: string
}

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

// Süre formatla (saniye -> X saat)
function formatDurationHours(seconds: number): string {
  if (!seconds || seconds < 0) return '0 saat'
  const hours = Math.floor(seconds / 3600)
  return `${hours} saat`
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
      <div key={i} className={`w-2 h-2 rounded-full ${colors[i]}`} title={`${count} Revize`} />
    )
  }
  
  return <div className="flex items-center gap-0.5">{dots}</div>
}

// Status Badge - Kompakt
function StatusBadge({ status }: { status: TaskStatus }) {
  const config: Record<TaskStatus, { label: string; icon: React.ReactNode; classes: string }> = {
    'active': {
      label: 'Devam Ediyor',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />,
      classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    'paused': {
      label: 'Beklemede',
      icon: <Pause className="w-3 h-3" />,
      classes: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    'completed': {
      label: 'Tamamlandı',
      icon: <CheckCircle className="w-3 h-3" />,
      classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    }
  }
  
  const { label, icon, classes } = config[status]
  
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${classes}`}>
      {icon}
      {label}
    </span>
  )
}

// Özet Kart Component (Admin için)
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

// Task Card Component - ACCORDION İLE
function TaskCard({ 
  task, 
  isAdmin, 
  revisions,
  onPause, 
  onResume, 
  onComplete, 
  onStartRevision,
  onReopen,
  onEdit,
  onDelete 
}: { 
  task: DailyTask & { user?: { id: string; full_name: string | null } }
  isAdmin: boolean
  revisions: TaskRevision[]
  onPause: (task: DailyTask) => void
  onResume: (task: DailyTask) => void
  onComplete: (task: DailyTask) => void
  onStartRevision: (task: DailyTask) => void
  onReopen: (task: DailyTask) => void
  onEdit: (task: DailyTask) => void
  onDelete: (task: DailyTask) => void
}) {
  const [currentDuration, setCurrentDuration] = useState(task.total_duration)
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Bu task'a ait revizyonlar
  const taskRevisions = revisions.filter(r => r.task_id === task.id).sort((a, b) => a.revision_number - b.revision_number)
  
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
    return 'border-white/10'
  }
  
  const categorySlug = task.category?.slug || 'genel'
  const categoryColor = CATEGORY_COLORS[categorySlug] || CATEGORY_COLORS['genel']
  
  return (
    <div className={`glass-card rounded-2xl transition-all hover:bg-white/[0.02] hover:border-white/20 group ${getCardClasses()}`}>
      {/* Ana Kart İçeriği - Tıklanabilir */}
      <div 
        className="p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Üst Satır: Avatar + İsim + Status + Kategori + Marka + Revize Dots + Edit/Delete */}
        <div className="flex items-center gap-2 mb-3">
          {/* Avatar + İsim */}
          {isAdmin && task.user && (
            <div className="flex items-center gap-2">
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
          
          {/* Status Badge */}
          <StatusBadge status={task.status} />
          
          {/* Kategori */}
          <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}>
            {task.category?.name || 'Genel'}
          </span>
          
          {/* Marka */}
          {task.brand && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building2 className="w-3 h-3 inline mr-1" />
              {task.brand.brand_name}
            </span>
          )}
          
          {/* Revize Dots */}
          <RevizeDots count={task.revision_count} />
          
          {/* Spacer */}
          <div className="flex-1" />
          
          {/* Edit/Delete - Her zaman görünür */}
          <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(task) }} 
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(task) }} 
              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Açıklama */}
        <h3 className="text-base font-semibold text-white mb-2">{task.description}</h3>
        
        {/* Alt Satır: Saat + Süre + (Revize Badge) */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{formatTime(task.start_time)}</span>
            <span className="text-zinc-600">→</span>
            {task.end_time ? (
              <span className="font-mono text-sm">{formatTime(task.end_time)}</span>
            ) : (
              <span className="text-zinc-600 font-mono">...</span>
            )}
          </div>
          
          {/* Süre Badge */}
          {task.status === 'active' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-sm font-semibold">
              {formatDuration(currentDuration)}
            </span>
          ) : task.status === 'completed' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-sm">
              <Check className="w-3 h-3" />
              {formatDuration(task.total_duration)}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-lg bg-white/5 text-zinc-400 font-mono text-sm">
              {formatDuration(task.total_duration)}
            </span>
          )}
          
          {/* Revize badge */}
          {task.revision_count > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-400 font-mono text-sm">
              <RefreshCw className="w-3 h-3" />
              R{task.revision_count}
            </span>
          )}
        </div>
      </div>
      
      {/* Genişletilmiş Alan - Accordion */}
      {isExpanded && (
        <div className="border-t border-white/10 p-5 space-y-4">
          {/* Zaman Detayı */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-400">Başlangıç:</span>
              <span className="font-mono text-white">{formatTime(task.start_time)}</span>
            </div>
            {task.end_time && (
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Bitiş:</span>
                <span className="font-mono text-white">{formatTime(task.end_time)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Toplam:</span>
              <span className="font-mono font-semibold text-cyan-400">{formatDuration(task.total_duration)}</span>
            </div>
          </div>
          
          {/* Revize Geçmişi */}
          {taskRevisions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <RefreshCw className="w-4 h-4 text-rose-400" />
                <span>Revize Geçmişi</span>
              </div>
              <div className="space-y-2 pl-6">
                {taskRevisions.map((rev) => (
                  <div key={rev.id} className="flex items-start gap-3 text-sm">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-medium">
                      R{rev.revision_number}
                    </span>
                    <div className="flex-1">
                      {rev.note ? (
                        <p className="text-zinc-300">{rev.note}</p>
                      ) : (
                        <p className="text-zinc-500 italic">Not girilmedi</p>
                      )}
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {formatTime(rev.start_time)}
                        {rev.duration > 0 && ` • ${formatDuration(rev.duration)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Butonları */}
          <div className="flex items-center gap-2 pt-2">
            {task.status === 'active' && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); onPause(task) }} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                >
                  <Pause className="w-3 h-3" />
                  Beklet
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onComplete(task) }} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors"
                >
                  <Check className="w-3 h-3" />
                  Bitti
                </button>
              </>
            )}
            
            {task.status === 'paused' && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); onResume(task) }} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  Devam Et
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onComplete(task) }} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors"
                >
                  <Check className="w-3 h-3" />
                  Bitti
                </button>
              </>
            )}
            
            {task.status === 'completed' && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); onStartRevision(task) }} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium hover:bg-rose-500/20 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Revize Başlat
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onReopen(task) }} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Yenile
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Revize Modal Component
function RevisionModal({ 
  task, 
  onClose, 
  onSubmit 
}: { 
  task: DailyTask
  onClose: () => void
  onSubmit: (note: string) => void
}) {
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSubmit(note)
    setSaving(false)
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 shadow-2xl" style={{ backgroundColor: '#18181b' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Revize Başlat</h2>
          <p className="text-sm text-zinc-400 mt-1">{task.description}</p>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Revize Notu <span className="text-zinc-500">(Opsiyonel)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Müşteri geri bildirimi, değişiklik detayı..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/10 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
              />
            </div>
            
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <p className="text-xs text-rose-400">
                <RefreshCw className="w-3 h-3 inline mr-1" />
                Revize başlatıldığında görev tekrar aktif olacak ve sayaç devam edecek.
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 active:scale-[0.98] transition-all"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 px-5 rounded-xl text-white text-sm font-medium bg-gradient-to-r from-rose-600 to-pink-600 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Revize Başlat
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Admin Stats Panel Component
function AdminStatsPanel({ tasks, users }: { tasks: DailyTask[], users: AppUser[] }) {
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

// Personel Stats Panel Component - Bu Ay Özetim
function PersonelStatsPanel({ tasks, allMonthTasks, categories }: { 
  tasks: DailyTask[], 
  allMonthTasks: DailyTask[],
  categories: TaskCategory[]
}) {
  // Bu ay istatistikleri
  const totalTasks = allMonthTasks.length
  const totalDuration = allMonthTasks.reduce((sum, t) => sum + (t.total_duration || 0), 0)
  const totalRevisions = allMonthTasks.reduce((sum, t) => sum + t.revision_count, 0)
  const revisionDuration = totalRevisions * 35 * 60 // Her revize 35 dk varsayımı
  
  // Gün sayısı hesapla (bu ay içinde iş olan günler)
  const uniqueDays = new Set(allMonthTasks.map(t => t.work_date)).size
  const avgPerDay = uniqueDays > 0 ? Math.floor(totalDuration / uniqueDays) : 0
  
  // Marka dağılımı
  const brandStats: Record<string, { name: string; duration: number }> = {}
  allMonthTasks.forEach(task => {
    const brandName = task.brand?.brand_name || 'Genel'
    if (!brandStats[brandName]) {
      brandStats[brandName] = { name: brandName, duration: 0 }
    }
    brandStats[brandName].duration += task.total_duration || 0
  })
  const brandData = Object.values(brandStats).sort((a, b) => b.duration - a.duration).slice(0, 5)
  const totalBrandDuration = brandData.reduce((sum, b) => sum + b.duration, 0)
  
  // Kategori dağılımı
  const categoryStats: Record<string, { name: string; slug: string; count: number }> = {}
  allMonthTasks.forEach(task => {
    const catName = task.category?.name || 'Genel'
    const catSlug = task.category?.slug || 'genel'
    if (!categoryStats[catSlug]) {
      categoryStats[catSlug] = { name: catName, slug: catSlug, count: 0 }
    }
    categoryStats[catSlug].count++
  })
  const categoryData = Object.values(categoryStats).sort((a, b) => b.count - a.count)
  
  const brandGradients = [
    'from-amber-500 to-orange-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-rose-500 to-pink-500'
  ]
  
  return (
    <div className="space-y-4">
      {/* Bu Ay Özetim */}
      <div className="glass-card rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-white">Bu Ay Özetim</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Toplam İş</span>
            <span className="text-sm font-mono font-bold text-white">{totalTasks} iş</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Toplam Süre</span>
            <span className="text-sm font-mono font-bold text-white">{formatDurationHours(totalDuration)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Ortalama / Gün</span>
            <span className="text-sm font-mono font-bold text-white">{formatDuration(avgPerDay)}</span>
          </div>
          <div className="h-px bg-white/10 my-2" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Revize Sayısı</span>
            <span className="text-sm font-mono font-bold text-rose-400">{totalRevisions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Revize Süresi</span>
            <span className="text-sm font-mono font-bold text-rose-400">{formatDuration(revisionDuration)}</span>
          </div>
        </div>
      </div>
      
      {/* Marka Dağılımı */}
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
                    <span className="text-xs font-mono text-zinc-500">{formatDurationHours(brand.duration)} ({percentage}%)</span>
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
      
      {/* Kategori Dağılımı */}
      <div className="glass-card rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">Kategori Dağılımı</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryData.length === 0 ? (
            <p className="text-sm text-zinc-500">Henüz veri yok</p>
          ) : (
            categoryData.map((cat) => {
              const catColor = CATEGORY_COLORS[cat.slug] || CATEGORY_COLORS['genel']
              return (
                <span 
                  key={cat.slug} 
                  className={`text-xs px-2.5 py-1 rounded-full ${catColor.bg} ${catColor.text} border ${catColor.border}`}
                >
                  {cat.name} <span className="font-mono font-bold">{cat.count}</span>
                </span>
              )
            })
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
  const [revisions, setRevisions] = useState<TaskRevision[]>([])
  const [monthTasks, setMonthTasks] = useState<DailyTask[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [brands, setBrands] = useState<{ id: string; brand_name: string }[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedUser, setSelectedUser] = useState<string>('all')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const [showModal, setShowModal] = useState(false)
  const [showRevisionModal, setShowRevisionModal] = useState(false)
  const [revisionTask, setRevisionTask] = useState<DailyTask | null>(null)
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

      // Günlük işler
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
      
      if (tasksData) {
        setTasks(tasksData as DailyTask[])
        
        // Bu task'lara ait revizyonları çek
        const taskIds = tasksData.map((t: DailyTask) => t.id)
        if (taskIds.length > 0) {
          const { data: revisionsData } = await (supabase as any)
            .from('task_revisions')
            .select('*')
            .in('task_id', taskIds)
            .order('revision_number')
          
          if (revisionsData) setRevisions(revisionsData as TaskRevision[])
        } else {
          setRevisions([])
        }
      }
      
      // Personel için bu ay işleri
      if (!isAdmin && appUser) {
        const now = new Date(selectedDate)
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
        
        const { data: monthData } = await (supabase as any)
          .from('daily_tasks')
          .select(`
            *,
            category:task_categories(*),
            brand:customers(id, brand_name)
          `)
          .eq('user_id', appUser.id)
          .gte('work_date', firstDay)
          .lte('work_date', lastDay)
        
        if (monthData) setMonthTasks(monthData as DailyTask[])
      }
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

  // Revize Modal'ı aç
  const handleOpenRevisionModal = (task: DailyTask) => {
    setRevisionTask(task)
    setShowRevisionModal(true)
  }

  // Revize başlat (modal'dan)
  const handleStartRevision = async (note: string) => {
    if (!revisionTask) return
    
    const now = new Date()
    
    // Task'ı güncelle
    await (supabase as any)
      .from('daily_tasks')
      .update({
        status: 'active',
        start_time: now.toISOString(),
        end_time: null,
        revision_count: revisionTask.revision_count + 1
      })
      .eq('id', revisionTask.id)
    
    // Revize kaydı oluştur
    await (supabase as any)
      .from('task_revisions')
      .insert({
        task_id: revisionTask.id,
        revision_number: revisionTask.revision_count + 1,
        note: note || null,
        start_time: now.toISOString(),
        duration: 0
      })
    
    setShowRevisionModal(false)
    setRevisionTask(null)
    fetchData()
  }

  // Yenile (yanlış kapatma) - Revize olmadan tekrar aç
  const handleReopen = async (task: DailyTask) => {
    await (supabase as any)
      .from('daily_tasks')
      .update({
        status: 'active',
        start_time: new Date().toISOString(),
        end_time: null
      })
      .eq('id', task.id)
    
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

  // Admin ve Personel için farklı render
  if (!isAdmin) {
    // PERSONEL GÖRÜNÜMÜ
    return (
      <div className="space-y-6">
        {/* Başlık */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Günlük İşler</h1>
            <p className="text-sm text-zinc-400">Günlük iş kayıtlarım</p>
          </div>
          <Button onClick={() => { setEditingTask(null); setFormData({ brand_id: '', category_id: '', description: '' }); setShowModal(true) }} className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            İş Ekle
          </Button>
        </div>

        {/* Tarih Bar + Mini Stats */}
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

              {/* Filtreler */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="İş ara..."
                  className="w-40 h-8 pl-8 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              </div>

              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-[140px] h-8 rounded-lg bg-white/5 border-white/10 text-zinc-300 text-sm">
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
                  <SelectValue placeholder="Tüm Markalar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Markalar</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand.id} value={brand.id}>{brand.brand_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[130px] h-8 rounded-lg bg-white/5 border-white/10 text-zinc-300 text-sm">
                  <Tag className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
                  <SelectValue placeholder="Tüm Kategoriler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="w-px h-8 bg-white/10" />
            </div>

            {/* Mini Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-zinc-400">Bugün:</span>
                <span className="text-sm font-bold text-white">{stats.total} iş</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-zinc-400">Toplam:</span>
                <span className="text-sm font-bold text-white">{formatDuration(stats.totalDuration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-rose-400" />
                <span className="text-sm text-zinc-400">Revize:</span>
                <span className="text-sm font-bold text-rose-400">{stats.revisions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* İşler + Sağ Panel */}
        <div className="grid grid-cols-3 gap-6">
          {/* Sol: İş Listesi */}
          <div className="col-span-2 space-y-3">
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
              (() => {
                const filteredTasks = tasks.filter(task => {
                  if (searchQuery && !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return false
                  }
                  if (selectedBrand !== 'all' && task.brand_id !== selectedBrand) {
                    return false
                  }
                  if (selectedCategory !== 'all' && task.category_id !== selectedCategory) {
                    return false
                  }
                  return true
                })

                if (filteredTasks.length === 0) {
                  return (
                    <div className="text-center py-12 glass-card rounded-2xl border border-white/10">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Search className="w-8 h-8 text-zinc-600" />
                      </div>
                      <p className="text-zinc-400">Filtrelere uygun iş bulunamadı</p>
                      <button
                        onClick={() => { setSearchQuery(''); setSelectedBrand('all'); setSelectedCategory('all') }}
                        className="mt-4 text-sm text-indigo-400 hover:text-indigo-300"
                      >
                        Filtreleri Temizle
                      </button>
                    </div>
                  )
                }

                return filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task as DailyTask & { user?: { id: string; full_name: string | null } }}
                    isAdmin={false}
                    revisions={revisions}
                    onPause={handlePause}
                    onResume={handleResume}
                    onComplete={handleComplete}
                    onStartRevision={handleOpenRevisionModal}
                    onReopen={handleReopen}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              })()
            )}
          </div>
          
          {/* Sağ: Bu Ay Özetim */}
          <PersonelStatsPanel tasks={tasks} allMonthTasks={monthTasks} categories={categories} />
        </div>

        {/* İş Ekleme/Düzenleme Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 shadow-2xl" style={{ backgroundColor: '#18181b' }}>
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">
                  {editingTask ? 'İşi Düzenle' : 'Yeni İş Ekle'}
                </h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Marka <span className="text-zinc-500">(Opsiyonel)</span></label>
                    <Select value={formData.brand_id || "none"} onValueChange={(value) => setFormData({ ...formData, brand_id: value === "none" ? "" : value })}>
                      <SelectTrigger className="w-full h-11 rounded-xl bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Genel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Genel</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>{brand.brand_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Kategori <span className="text-rose-400">*</span></label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map((cat) => {
                        const catColor = CATEGORY_COLORS[cat.slug] || CATEGORY_COLORS['genel']
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, category_id: cat.id })}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${catColor.bg} ${catColor.text} border ${catColor.border} ${
                              formData.category_id === cat.id 
                                ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#18181b]' 
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
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Açıklama <span className="text-rose-400">*</span></label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Ne yapıyorsun?"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/10 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="h-11 px-5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 active:scale-[0.98] transition-all"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !formData.category_id || !formData.description.trim()}
                    className="h-11 px-5 rounded-xl text-white text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {editingTask ? 'Güncelle' : 'Başlat'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Revize Modal */}
        {showRevisionModal && revisionTask && (
          <RevisionModal 
            task={revisionTask}
            onClose={() => { setShowRevisionModal(false); setRevisionTask(null) }}
            onSubmit={handleStartRevision}
          />
        )}
      </div>
    )
  }

  // ADMİN GÖRÜNÜMÜ
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
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-[180px] h-10 rounded-xl bg-white/5 border-white/10 text-zinc-300 text-sm">
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id}>{brand.brand_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-3">
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
                revisions={revisions}
                onPause={handlePause}
                onResume={handleResume}
                onComplete={handleComplete}
                onStartRevision={handleOpenRevisionModal}
                onReopen={handleReopen}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
        
        <AdminStatsPanel tasks={tasks} users={users} />
      </div>

      {/* İş Ekleme/Düzenleme Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 shadow-2xl" style={{ backgroundColor: '#18181b' }}>
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">
                {editingTask ? 'İşi Düzenle' : 'Yeni İş Ekle'}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Marka <span className="text-zinc-500">(Opsiyonel)</span></label>
                  <Select value={formData.brand_id || "none"} onValueChange={(value) => setFormData({ ...formData, brand_id: value === "none" ? "" : value })}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Genel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Genel</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>{brand.brand_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Kategori <span className="text-rose-400">*</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => {
                      const catColor = CATEGORY_COLORS[cat.slug] || CATEGORY_COLORS['genel']
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category_id: cat.id })}
                          className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${catColor.bg} ${catColor.text} border ${catColor.border} ${
                            formData.category_id === cat.id 
                              ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#18181b]' 
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
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Açıklama <span className="text-rose-400">*</span></label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ne yapıyorsun?"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/10 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="h-11 px-5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.category_id || !formData.description.trim()}
                  className="h-11 px-5 rounded-xl text-white text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingTask ? 'Güncelle' : 'Başlat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revize Modal */}
      {showRevisionModal && revisionTask && (
        <RevisionModal 
          task={revisionTask}
          onClose={() => { setShowRevisionModal(false); setRevisionTask(null) }}
          onSubmit={handleStartRevision}
        />
      )}
    </div>
  )
}
