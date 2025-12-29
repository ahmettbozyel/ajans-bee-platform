'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AppUser, RecordType } from '@/lib/auth-types'
import { 
  X, 
  Plus,
  Calendar,
  User,
  FileText,
  Loader2,
  CheckCircle2,
  Palmtree,
  Stethoscope,
  Home,
  CalendarOff,
  CalendarRange
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ManualEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  users: AppUser[]
  selectedDate: string
}

const RECORD_TYPES: { value: RecordType; label: string; icon: React.ReactNode; color: string; description: string }[] = [
  { 
    value: 'leave', 
    label: 'Yıllık İzin', 
    icon: <Palmtree className="w-5 h-5" />, 
    color: 'emerald',
    description: 'Yıllık izin kullanımı'
  },
  { 
    value: 'sick', 
    label: 'Rapor', 
    icon: <Stethoscope className="w-5 h-5" />, 
    color: 'rose',
    description: 'Sağlık raporu'
  },
  { 
    value: 'remote', 
    label: 'Evden Çalışma', 
    icon: <Home className="w-5 h-5" />, 
    color: 'blue',
    description: 'Uzaktan çalışma'
  },
  { 
    value: 'holiday', 
    label: 'Resmi Tatil', 
    icon: <CalendarOff className="w-5 h-5" />, 
    color: 'amber',
    description: 'Resmi tatil günü'
  },
]

// Tarih aralığındaki tüm günleri al (hafta sonlarını hariç tut)
function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const current = new Date(startDate)
  const end = new Date(endDate)
  
  while (current <= end) {
    const dayOfWeek = current.getDay()
    // Hafta sonlarını hariç tut (0 = Pazar, 6 = Cumartesi)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(current.toISOString().split('T')[0])
    }
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

export function ManualEntryModal({ isOpen, onClose, onSuccess, users, selectedDate }: ManualEntryModalProps) {
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [startDate, setStartDate] = useState(selectedDate)
  const [endDate, setEndDate] = useState(selectedDate)
  const [isDateRange, setIsDateRange] = useState(false)
  const [recordType, setRecordType] = useState<RecordType>('leave')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string>('')
  
  const supabase = createClient()

  // Kaç gün seçildiğini hesapla
  const selectedDays = isDateRange ? getDateRange(startDate, endDate).length : 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !startDate || !recordType) return
    
    setSaving(true)
    setError(null)
    setProgress('')
    
    try {
      const dates = isDateRange ? getDateRange(startDate, endDate) : [startDate]
      
      if (dates.length === 0) {
        throw new Error('Seçilen tarih aralığında iş günü bulunamadı')
      }
      
      let successCount = 0
      
      for (const date of dates) {
        setProgress(`${successCount + 1}/${dates.length} kayıt işleniyor...`)
        
        // O tarihte kayıt var mı kontrol et
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: existing } = await (supabase as any)
          .from('attendance')
          .select('id')
          .eq('user_id', selectedUser)
          .eq('date', date)
          .single()
        
        if (existing && existing.id) {
          // Güncelle
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: updateError } = await (supabase as any)
            .from('attendance')
            .update({
              record_type: recordType,
              admin_notes: notes || null,
              status: recordType === 'remote' ? 'remote' : recordType === 'leave' ? 'leave' : recordType === 'holiday' ? 'holiday' : 'normal',
              check_in_location_type: recordType === 'remote' ? 'home' : null,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
          
          if (updateError) throw updateError
        } else {
          // Yeni kayıt oluştur
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: insertError } = await (supabase as any)
            .from('attendance')
            .insert({
              user_id: selectedUser,
              date: date,
              record_type: recordType,
              admin_notes: notes || null,
              status: recordType === 'remote' ? 'remote' : recordType === 'leave' ? 'leave' : recordType === 'holiday' ? 'holiday' : 'normal',
              check_in_location_type: recordType === 'remote' ? 'home' : null,
              check_in: recordType === 'remote' ? new Date(`${date}T09:00:00`).toISOString() : null,
              check_out: recordType === 'remote' ? new Date(`${date}T18:30:00`).toISOString() : null
            })
          
          if (insertError) throw insertError
        }
        
        successCount++
      }
      
      setProgress(`${successCount} kayıt başarıyla oluşturuldu!`)
      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 1000)
    } catch (err: unknown) {
      console.error('Manual entry error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Kayıt eklenirken hata oluştu'
      setError(errorMessage)
      setProgress('')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setSelectedUser('')
    setStartDate(selectedDate)
    setEndDate(selectedDate)
    setIsDateRange(false)
    setRecordType('leave')
    setNotes('')
    setError(null)
    setProgress('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20">
              <Plus className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">Manuel Kayıt</h3>
              <p className="text-xs text-zinc-500">İzin, rapor veya evden çalışma kaydı ekleyin</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Personel Seçimi */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
              <User className="w-4 h-4" />
              Personel
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Personel seçin...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.full_name || user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Tarih Aralığı Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDateRange(!isDateRange)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
                isDateRange 
                  ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" 
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
              )}
            >
              <CalendarRange className="w-4 h-4" />
              Tarih Aralığı
            </button>
            {isDateRange && selectedDays > 0 && (
              <span className="text-sm text-zinc-500">
                {selectedDays} iş günü seçildi
              </span>
            )}
          </div>

          {/* Tarih(ler) */}
          <div className={cn("grid gap-3", isDateRange ? "grid-cols-2" : "grid-cols-1")}>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                <Calendar className="w-4 h-4" />
                {isDateRange ? 'Başlangıç' : 'Tarih'}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  if (!isDateRange || e.target.value > endDate) {
                    setEndDate(e.target.value)
                  }
                }}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {isDateRange && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  Bitiş
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            )}
          </div>

          {/* Kayıt Tipi */}
          <div>
            <label className="text-sm font-medium text-zinc-400 mb-3 block">Kayıt Tipi</label>
            <div className="grid grid-cols-2 gap-2">
              {RECORD_TYPES.map((type) => {
                const isSelected = recordType === type.value
                const colorClasses: Record<string, string> = {
                  emerald: isSelected ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'hover:bg-emerald-500/10 hover:border-emerald-500/30',
                  rose: isSelected ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'hover:bg-rose-500/10 hover:border-rose-500/30',
                  blue: isSelected ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'hover:bg-blue-500/10 hover:border-blue-500/30',
                  amber: isSelected ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'hover:bg-amber-500/10 hover:border-amber-500/30',
                }
                
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setRecordType(type.value)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      isSelected 
                        ? colorClasses[type.color]
                        : `bg-zinc-800/50 border-zinc-700 text-zinc-400 ${colorClasses[type.color]}`
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg",
                      isSelected ? 'bg-white/10' : 'bg-zinc-700/50'
                    )}>
                      {type.icon}
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium", isSelected ? '' : 'text-zinc-300')}>
                        {type.label}
                      </p>
                      <p className="text-xs text-zinc-500">{type.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Not */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
              <FileText className="w-4 h-4" />
              Not (Opsiyonel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ek bilgi ekleyin..."
              className="w-full h-20 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Progress */}
          {progress && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400 text-sm">
              {progress}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-zinc-700 text-zinc-400 hover:bg-zinc-800"
              disabled={saving}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={saving || !selectedUser}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              {isDateRange ? `${selectedDays} Gün Kaydet` : 'Kaydet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
