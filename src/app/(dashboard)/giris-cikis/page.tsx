'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Attendance, AppUser } from '@/lib/auth-types'
import { 
  Clock, 
  LogIn, 
  LogOut,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminGirisCikisPage() {
  const { appUser, isAdmin } = useAuth()
  const [todayRecords, setTodayRecords] = useState<(Attendance & { user?: AppUser })[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const supabase = createClient()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchData()
  }, [selectedDate])

  const fetchData = async () => {
    if (!appUser) return
    setLoading(true)
    try {
      // Kullanıcılar
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .order('full_name')
      
      if (usersData) setUsers(usersData as AppUser[])

      // Seçili tarihteki tüm kayıtlar
      const { data: recordsData } = await (supabase as any)
        .from('attendance')
        .select('*, user:users(*)')
        .eq('date', selectedDate)
        .order('check_in', { ascending: true })
      
      if (recordsData) setTodayRecords(recordsData as (Attendance & { user?: AppUser })[])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Kendi giriş/çıkışı için
  const myRecord = todayRecords.find(r => r.user_id === appUser?.id)
  const hasCheckedIn = myRecord?.check_in != null
  const hasCheckedOut = myRecord?.check_out != null

  const handleCheckIn = async () => {
    if (!appUser) return
    setActionLoading(true)
    try {
      const now = new Date().toISOString()
      const today = new Date().toISOString().split('T')[0]
      
      if (myRecord) {
        await (supabase as any)
          .from('attendance')
          .update({ check_in: now, updated_at: now })
          .eq('id', myRecord.id)
      } else {
        await (supabase as any)
          .from('attendance')
          .insert({
            user_id: appUser.id,
            date: today,
            check_in: now
          })
      }
      
      fetchData()
    } catch (error) {
      console.error('Check-in error:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!appUser || !myRecord) return
    setActionLoading(true)
    try {
      const now = new Date().toISOString()
      
      await (supabase as any)
        .from('attendance')
        .update({ check_out: now, updated_at: now })
        .eq('id', myRecord.id)
      
      fetchData()
    } catch (error) {
      console.error('Check-out error:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '-'
    return new Date(isoString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
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

  const calculateDuration = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return '-'
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = end.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}s ${minutes}d`
  }

  // Giriş yapmamış kullanıcılar
  const usersWithoutCheckIn = users.filter(u => 
    !todayRecords.some(r => r.user_id === u.id)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  const isToday = selectedDate === new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Giriş / Çıkış Takibi</h1>
        <p className="text-sm text-zinc-400 mt-1">Personel mesai takibi</p>
      </div>

      {/* Current Time + My Status (Bugün ise) */}
      {isToday && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Time */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-center">
            <Clock className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
            <p className="text-4xl font-bold font-mono text-zinc-100">
              {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-sm text-zinc-400 mt-2">
              {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          {/* My Status */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Benim Durumum</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-center gap-2 mb-1">
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-zinc-400">Giriş</span>
                </div>
                <p className="text-xl font-bold font-mono text-zinc-100">
                  {formatTime(myRecord?.check_in || null)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-center gap-2 mb-1">
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span className="text-xs text-zinc-400">Çıkış</span>
                </div>
                <p className="text-xl font-bold font-mono text-zinc-100">
                  {formatTime(myRecord?.check_out || null)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCheckIn}
                disabled={actionLoading || hasCheckedOut}
                size="sm"
                className={`flex-1 ${hasCheckedIn ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {hasCheckedIn ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <LogIn className="w-4 h-4 mr-1" />}
                {hasCheckedIn ? 'Giriş OK' : 'Geldim'}
              </Button>
              <Button
                onClick={handleCheckOut}
                disabled={actionLoading || !hasCheckedIn || hasCheckedOut}
                size="sm"
                className={`flex-1 ${hasCheckedOut ? 'bg-rose-600/20 text-rose-400 border border-rose-600/30' : 'bg-rose-600 hover:bg-rose-700'}`}
              >
                {hasCheckedOut ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <LogOut className="w-4 h-4 mr-1" />}
                {hasCheckedOut ? 'Çıkış OK' : 'Gittim'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Date Filter */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
        <Calendar className="w-5 h-5 text-indigo-400" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-transparent border-none text-zinc-100 font-medium focus:outline-none"
        />
        <span className="text-zinc-400 text-sm">{formatDate(selectedDate)}</span>
        {isToday && (
          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
            Bugün
          </span>
        )}
      </div>

      {/* All Records */}
      <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
        <div className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Personel Durumu
          </h2>
          <span className="text-sm text-zinc-400">
            {todayRecords.length} / {users.length} kişi
          </span>
        </div>
        
        <div className="divide-y divide-zinc-800">
          {/* Giriş yapmış olanlar */}
          {todayRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {record.user?.full_name?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    {record.user?.full_name || 'Bilinmeyen'}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {record.check_in && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <LogIn className="w-3 h-3" />
                        {formatTime(record.check_in)}
                      </span>
                    )}
                    {record.check_out && (
                      <>
                        <span className="text-zinc-600">→</span>
                        <span className="text-xs text-rose-400 flex items-center gap-1">
                          <LogOut className="w-3 h-3" />
                          {formatTime(record.check_out)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {record.check_out ? (
                  <span className="text-sm font-mono text-zinc-400">
                    {calculateDuration(record.check_in, record.check_out)}
                  </span>
                ) : record.check_in ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                    Çalışıyor
                  </span>
                ) : null}
              </div>
            </div>
          ))}
          
          {/* Giriş yapmamış olanlar */}
          {usersWithoutCheckIn.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 opacity-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-zinc-700 flex items-center justify-center">
                  <span className="text-zinc-400 text-sm font-bold">
                    {user.full_name?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-400">{user.full_name}</p>
                  <p className="text-xs text-zinc-500">Henüz giriş yapmadı</p>
                </div>
              </div>
              <AlertCircle className="w-5 h-5 text-amber-500/50" />
            </div>
          ))}
          
          {todayRecords.length === 0 && usersWithoutCheckIn.length === 0 && (
            <div className="p-8 text-center text-zinc-500">
              Kayıt bulunamadı
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
