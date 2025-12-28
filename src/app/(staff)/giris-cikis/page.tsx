'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Attendance } from '@/lib/auth-types'
import { 
  Clock, 
  LogIn, 
  LogOut,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GirisCikisPage() {
  const { appUser } = useAuth()
  const [todayRecord, setTodayRecord] = useState<Attendance | null>(null)
  const [recentRecords, setRecentRecords] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  // Current time updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch data
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!appUser) return
    setLoading(true)
    try {
      // Bugünkü kayıt
      const { data: todayData } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', appUser.id)
        .eq('date', today)
        .single()
      
      setTodayRecord(todayData as Attendance | null)

      // Son 7 gün
      const { data: recentData } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', appUser.id)
        .order('date', { ascending: false })
        .limit(7)
      
      if (recentData) setRecentRecords(recentData as Attendance[])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    if (!appUser) return
    setActionLoading(true)
    try {
      const now = new Date().toISOString()
      
      if (todayRecord) {
        // Güncelle
        await supabase
          .from('attendance')
          .update({ check_in: now, updated_at: now })
          .eq('id', todayRecord.id)
      } else {
        // Yeni kayıt
        await supabase
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
    if (!appUser || !todayRecord) return
    setActionLoading(true)
    try {
      const now = new Date().toISOString()
      
      await supabase
        .from('attendance')
        .update({ check_out: now, updated_at: now })
        .eq('id', todayRecord.id)
      
      fetchData()
    } catch (error) {
      console.error('Check-out error:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '-'
    return new Date(isoString).toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  const hasCheckedIn = todayRecord?.check_in != null
  const hasCheckedOut = todayRecord?.check_out != null

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-100">Giriş / Çıkış</h1>
        <p className="text-sm text-zinc-400 mt-1">Günlük mesai takibi</p>
      </div>

      {/* Current Time Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-center">
        <Clock className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
        <p className="text-4xl font-bold font-mono text-zinc-100">
          {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
        <p className="text-sm text-zinc-400 mt-2">
          {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Today Status */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Bugünkü Durum</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Check In */}
          <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <div className="flex items-center gap-2 mb-2">
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-zinc-400">Giriş</span>
            </div>
            <p className="text-2xl font-bold font-mono text-zinc-100">
              {formatTime(todayRecord?.check_in || null)}
            </p>
          </div>
          
          {/* Check Out */}
          <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <div className="flex items-center gap-2 mb-2">
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="text-sm text-zinc-400">Çıkış</span>
            </div>
            <p className="text-2xl font-bold font-mono text-zinc-100">
              {formatTime(todayRecord?.check_out || null)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCheckIn}
            disabled={actionLoading || hasCheckedOut}
            className={`flex-1 ${hasCheckedIn ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {actionLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : hasCheckedIn ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Giriş Yapıldı
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Geldim
              </>
            )}
          </Button>
          
          <Button
            onClick={handleCheckOut}
            disabled={actionLoading || !hasCheckedIn || hasCheckedOut}
            className={`flex-1 ${hasCheckedOut ? 'bg-rose-600/20 text-rose-400 border border-rose-600/30' : 'bg-rose-600 hover:bg-rose-700'}`}
          >
            {actionLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : hasCheckedOut ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Çıkış Yapıldı
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Gittim
              </>
            )}
          </Button>
        </div>

        {!hasCheckedIn && (
          <div className="mt-4 flex items-center gap-2 text-amber-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Henüz giriş yapmadın</span>
          </div>
        )}
      </div>

      {/* Recent Records */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Son 7 Gün
        </h2>
        
        <div className="space-y-2">
          {recentRecords.map((record) => (
            <div
              key={record.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                record.date === today ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-zinc-800/50'
              }`}
            >
              <span className="text-sm font-medium text-zinc-300">
                {formatDate(record.date)}
                {record.date === today && (
                  <span className="ml-2 text-xs text-indigo-400">(Bugün)</span>
                )}
              </span>
              <div className="flex items-center gap-4 text-sm font-mono">
                <span className="text-emerald-400">{formatTime(record.check_in)}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-rose-400">{formatTime(record.check_out)}</span>
                <span className="text-zinc-400 text-xs w-16 text-right">
                  {calculateDuration(record.check_in, record.check_out)}
                </span>
              </div>
            </div>
          ))}
          
          {recentRecords.length === 0 && (
            <p className="text-center text-zinc-500 py-4">Henüz kayıt yok</p>
          )}
        </div>
      </div>
    </div>
  )
}
