'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { useCompanySettings, isHybridDayWithSettings, isWorkDay, isHoliday } from '@/lib/use-company-settings'
import { DailyTask, Attendance } from '@/lib/auth-types'
import {
  Sun,
  Moon,
  Clock,
  CheckCircle2,
  PlayCircle,
  Home,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Zap,
  Target,
  Loader2,
  Server,
  Building2,
  CalendarClock,
  Bell,
  RefreshCw,
  Globe
} from 'lucide-react'

// ==========================================
// COUNT UP ANIMATION HOOK
// ==========================================
function useCountUp(end: number, duration: number = 1000, startOnMount: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!startOnMount || hasStarted) return
    setHasStarted(true)

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, startOnMount, hasStarted])

  return count
}

// ==========================================
// ANIMATED CARD WRAPPER
// ==========================================
function AnimatedCard({ children, delay = 0, className = '' }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-all duration-500 ${className} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  )
}

// ==========================================
// PROGRESS BAR WITH ANIMATION
// ==========================================
function AnimatedProgress({ value, max, color = 'indigo', delay = 0 }: {
  value: number
  max: number
  color?: string
  delay?: number
}) {
  const [width, setWidth] = useState(0)
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), delay * 1000 + 300)
    return () => clearTimeout(timer)
  }, [percentage, delay])

  const colorClasses: Record<string, string> = {
    indigo: 'from-indigo-500 to-violet-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-pink-500',
    cyan: 'from-cyan-500 to-blue-500'
  }

  return (
    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

// ==========================================
// WEEKLY BAR CHART
// ==========================================
function WeeklyChart({ data, target }: { data: { day: string; hours: number }[]; target: number }) {
  const maxHours = Math.max(...data.map(d => d.hours), target)

  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map((item, i) => {
        const height = maxHours > 0 ? (item.hours / maxHours) * 100 : 0
        const isToday = i === data.length - 1

        return (
          <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full h-24 flex items-end">
              <div
                className={`w-full rounded-t-lg transition-all duration-700 ease-out ${
                  isToday
                    ? 'bg-gradient-to-t from-indigo-600 to-violet-500'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                style={{
                  height: `${height}%`,
                  transitionDelay: `${i * 100}ms`
                }}
              />
            </div>
            <span className={`text-[10px] font-medium ${isToday ? 'text-indigo-400' : 'text-zinc-500'}`}>
              {item.day}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ==========================================
// MAIN DASHBOARD PAGE
// ==========================================
export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const { appUser } = useAuth()
  const { workDays, workHours, hybridDays, hybridOverrides, holidays, loading: settingsLoading } = useCompanySettings()

  const [loading, setLoading] = useState(true)
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null)
  const [todayTasks, setTodayTasks] = useState<DailyTask[]>([])
  const [weeklyData, setWeeklyData] = useState<{ day: string; hours: number }[]>([])
  const [expiringServices, setExpiringServices] = useState<any[]>([])

  // Admin/Yönetici dashboard data
  const [dailyStats, setDailyStats] = useState<{
    bugun_gonderilen: number
    yenileme_onay: number
    iptal_talebi: number
    bu_hafta: number
    bu_ay: number
    kritik_alert: number
    toplam_alert: number
  } | null>(null)
  const [upcomingRenewals, setUpcomingRenewals] = useState<any[]>([])
  const [systemAlerts, setSystemAlerts] = useState<any[]>([])
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [totalServices, setTotalServices] = useState(0)

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const isHybrid = isHybridDayWithSettings(today, hybridDays, hybridOverrides)
  const isTodayWorkDay = isWorkDay(today, workDays)
  const todayHoliday = isHoliday(today, holidays)
  const currentHour = today.getHours()
  const greeting = currentHour < 12 ? 'Günaydın' : currentHour < 18 ? 'İyi günler' : 'İyi akşamlar'

  const isPersonel = appUser?.role === 'personel' || appUser?.role === 'stajer'
  const isOperasyon = appUser?.role === 'operasyon'
  const isAdmin = appUser?.role === 'admin'
  const isYonetici = appUser?.role === 'yonetici'

  // Fetch data
  useEffect(() => {
    if (!appUser?.id) return

    const userId = appUser.id

    async function fetchData() {
      setLoading(true)
      try {
        // Today's attendance
        const { data: attendanceData } = await supabase
          .from('app_attendance')
          .select('*')
          .eq('user_id', userId)
          .eq('date', todayStr)
          .single()

        setTodayAttendance(attendanceData)

        // Today's tasks (customers join'i kaldırıldı - RLS sorunu)
        const { data: tasksData } = await supabase
          .from('app_daily_tasks')
          .select('*, category:app_task_categories(*)')
          .eq('user_id', userId)
          .eq('work_date', todayStr)
          .order('created_at', { ascending: false })

        setTodayTasks(tasksData || [])

        // Weekly attendance for chart
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 6)
        const weekAgoStr = weekAgo.toISOString().split('T')[0]

        const { data: weeklyAttendance } = await supabase
          .from('app_attendance')
          .select('date, check_in, check_out')
          .eq('user_id', userId)
          .gte('date', weekAgoStr)
          .lte('date', todayStr)
          .order('date', { ascending: true }) as { data: { date: string; check_in: string | null; check_out: string | null }[] | null }

        // Build weekly data
        const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
        const weekly: { day: string; hours: number }[] = []

        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const dateStr = d.toISOString().split('T')[0]
          const record = weeklyAttendance?.find((r: { date: string }) => r.date === dateStr)

          let hours = 0
          if (record?.check_in && record?.check_out) {
            const diff = new Date(record.check_out).getTime() - new Date(record.check_in).getTime()
            hours = Math.round((diff / 3600000) * 10) / 10
          }

          weekly.push({ day: dayNames[d.getDay()], hours })
        }

        setWeeklyData(weekly)

        // Admin/Yönetici specific data
        if (isAdmin || isYonetici) {
          // Total counts - API üzerinden çek (RLS bypass)
          try {
            const brandsRes = await fetch('/api/customers?all=true')
            if (brandsRes.ok) {
              const brandsData = await brandsRes.json()
              setTotalCustomers(brandsData.length || 0)
            }
          } catch {
            // Brands fetch failed silently
          }

          const { count: servicesCount } = await (supabase as any)
            .from('app_technical_services')
            .select('*', { count: 'exact', head: true })

          setTotalServices(servicesCount || 0)

          // Daily stats from view (optional - may not exist yet)
          try {
            const { data: statsData, error: statsError } = await (supabase as any)
              .from('daily_stats')
              .select('*')
              .single()

            if (statsData && !statsError) {
              setDailyStats(statsData)
            } else {
              // Set default values if view doesn't exist
              setDailyStats({
                bugun_gonderilen: 0,
                yenileme_onay: 0,
                iptal_talebi: 0,
                bu_hafta: 0,
                bu_ay: 0,
                kritik_alert: 0,
                toplam_alert: 0
              })
            }
          } catch {
            setDailyStats({
              bugun_gonderilen: 0,
              yenileme_onay: 0,
              iptal_talebi: 0,
              bu_hafta: 0,
              bu_ay: 0,
              kritik_alert: 0,
              toplam_alert: 0
            })
          }

          // Upcoming renewals (this week)
          try {
            const { data: renewalsData } = await (supabase as any)
              .from('this_week_renewals')
              .select('*')
              .limit(10)
            setUpcomingRenewals(renewalsData || [])
          } catch {
            setUpcomingRenewals([])
          }

          // System alerts
          try {
            const { data: alertsData } = await (supabase as any)
              .from('system_alerts')
              .select('*')
              .eq('is_read', false)
              .order('created_at', { ascending: false })
              .limit(5)
            setSystemAlerts(alertsData || [])
          } catch {
            setSystemAlerts([])
          }
        }

        // Expiring services for operasyon role
        if (isOperasyon) {
          const thirtyDaysLater = new Date()
          thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)
          const thirtyDaysStr = thirtyDaysLater.toISOString().split('T')[0]

          const { data: servicesData } = await supabase
            .from('app_technical_services')
            .select('*, customer:customers(name)')
            .lte('end_date', thirtyDaysStr)
            .gte('end_date', todayStr)
            .order('end_date', { ascending: true })
            .limit(5)

          setExpiringServices(servicesData || [])
        }
      } catch {
        // Dashboard fetch error handled silently
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [appUser?.id, supabase, todayStr, isOperasyon, isAdmin, isYonetici])

  // Calculate stats
  const activeTasks = todayTasks.filter(t => t.status === 'active').length
  const completedTasks = todayTasks.filter(t => t.status === 'completed').length
  const totalTasks = todayTasks.length
  const weeklyTotalHours = weeklyData.reduce((sum, d) => sum + d.hours, 0)
  const weeklyTarget = 40 // 8 hours * 5 days

  const hasCheckedIn = !!todayAttendance?.check_in
  const hasCheckedOut = !!todayAttendance?.check_out

  // Count up values
  const animatedActive = useCountUp(activeTasks, 800)
  const animatedCompleted = useCountUp(completedTasks, 800)
  const animatedWeeklyHours = useCountUp(Math.round(weeklyTotalHours), 1200)

  if (loading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ========== WELCOME CARD ========== */}
      <AnimatedCard delay={0}>
        <div className="glass-card rounded-2xl p-6 border border-white/10 glow-indigo">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {currentHour < 18 ? (
                  <Sun className="w-6 h-6 text-amber-400" />
                ) : (
                  <Moon className="w-6 h-6 text-indigo-400" />
                )}
                <h1 className="text-2xl font-bold text-white">
                  {greeting}, {appUser?.full_name?.split(' ')[0] || 'Kullanıcı'}! 👋
                </h1>
              </div>
              <p className="text-zinc-400">
                {todayHoliday ? (
                  <span className="text-amber-400">Bugün tatil: {todayHoliday.name}</span>
                ) : !isTodayWorkDay ? (
                  <span className="text-zinc-500">Hafta sonu - İyi dinlenmeler!</span>
                ) : (
                  <>
                    {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    {isHybrid && (
                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30">
                        <Home className="w-3 h-3" /> Hibrit Gün
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hasCheckedIn ? (
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {hasCheckedOut ? 'Mesai Tamamlandı' : 'Mesaide'}
                </span>
              ) : isTodayWorkDay && !todayHoliday ? (
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Clock className="w-3.5 h-3.5" />
                  Giriş Bekleniyor
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* ========== ADMIN/YÖNETİCİ DASHBOARD ========== */}
      {(isAdmin || isYonetici) && dailyStats && (
        <>
          {/* Admin Stats Cards */}
          <AnimatedCard delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Toplam Müşteri */}
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <Building2 className="w-5 h-5 text-violet-400" />
                  </div>
                  <p className="text-sm text-zinc-400">Müşteriler</p>
                </div>
                <p className="text-3xl font-bold text-white">{totalCustomers}</p>
                <p className="text-xs text-zinc-500 mt-1">Toplam müşteri</p>
              </div>

              {/* Toplam Servis */}
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <Server className="w-5 h-5 text-cyan-400" />
                  </div>
                  <p className="text-sm text-zinc-400">Servisler</p>
                </div>
                <p className="text-3xl font-bold text-white">{totalServices}</p>
                <p className="text-xs text-zinc-500 mt-1">Toplam servis</p>
              </div>

              {/* Bu Hafta Yenilemeler */}
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <CalendarClock className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-sm text-zinc-400">Bu Hafta</p>
                </div>
                <p className="text-3xl font-bold text-white">{dailyStats.bu_hafta}</p>
                <p className="text-xs text-zinc-500 mt-1">Yenilenecek servis</p>
              </div>

              {/* Kritik Alertler */}
              <div className={`glass-card rounded-2xl p-5 border ${dailyStats.kritik_alert > 0 ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/10'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl ${dailyStats.kritik_alert > 0 ? 'bg-rose-500/20 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/20'} border`}>
                    <Bell className={`w-5 h-5 ${dailyStats.kritik_alert > 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
                  </div>
                  <p className="text-sm text-zinc-400">Alertler</p>
                </div>
                <p className={`text-3xl font-bold ${dailyStats.kritik_alert > 0 ? 'text-rose-400' : 'text-white'}`}>
                  {dailyStats.kritik_alert}
                </p>
                <p className="text-xs text-zinc-500 mt-1">Kritik alert</p>
              </div>
            </div>
          </AnimatedCard>

          {/* Bu Hafta Yenilemeler Liste */}
          {upcomingRenewals.length > 0 && (
            <AnimatedCard delay={0.4}>
              <div className="glass-card rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20">
                      <RefreshCw className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Bu Hafta Yenilenecekler</h3>
                      <p className="text-xs text-zinc-500">{upcomingRenewals.length} servis yenileme bekliyor</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/teknik-hizmetler')}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    Tümünü Gör <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="divide-y divide-white/5">
                  {upcomingRenewals.slice(0, 5).map((renewal: any) => (
                    <div key={renewal.id} className="px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-zinc-500" />
                        <div>
                          <p className="text-sm font-medium text-white">{renewal.customer_name || renewal.identifier}</p>
                          <p className="text-xs text-zinc-500">{renewal.service_type} • {renewal.provider_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-amber-400 font-medium">
                          {new Date(renewal.renewal_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-[10px] text-zinc-500">{renewal.days_until_renewal} gün kaldı</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          )}

          {/* System Alerts - CRITICAL SECTION */}
          {dailyStats.kritik_alert > 0 && (
            <AnimatedCard delay={0.5}>
              <div className="relative overflow-hidden rounded-2xl border-2 border-rose-500 bg-gradient-to-br from-rose-500/20 via-rose-600/10 to-rose-500/20 shadow-2xl shadow-rose-500/30">
                {/* Animated pulse background */}
                <div className="absolute inset-0 bg-rose-500/10 animate-pulse" />

                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl ring-4 ring-rose-500/30 animate-pulse" />

                <div className="relative px-6 py-5 border-b border-rose-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-rose-500 rounded-xl blur-lg opacity-60 animate-pulse" />
                      <div className="relative p-3 rounded-xl bg-rose-500 shadow-lg">
                        <AlertTriangle className="w-7 h-7 text-white animate-bounce" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-rose-400 flex items-center gap-2">
                        KRİTİK UYARI!
                        <span className="inline-flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                        </span>
                      </h3>
                      <p className="text-sm text-rose-300/80">{dailyStats.kritik_alert} kritik alert acil müdahale bekliyor!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-black text-rose-400 animate-pulse">{dailyStats.kritik_alert}</p>
                  </div>
                </div>

                {systemAlerts.length > 0 && (
                  <div className="relative divide-y divide-rose-500/20">
                    {systemAlerts.map((alert: any) => (
                      <div key={alert.id} className="px-6 py-4 hover:bg-rose-500/10 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="relative mt-1">
                            <span className="absolute inset-0 rounded-full bg-rose-500 blur-sm animate-pulse" />
                            <span className="relative block w-3 h-3 rounded-full bg-rose-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-white">{alert.title}</p>
                            <p className="text-sm text-rose-200/70 mt-1">{alert.message}</p>
                            <p className="text-xs text-rose-300/50 mt-2">
                              {new Date(alert.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedCard>
          )}

          {/* Normal alerts when no critical */}
          {dailyStats.kritik_alert === 0 && systemAlerts.length > 0 && (
            <AnimatedCard delay={0.5}>
              <div className="glass-card rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20">
                      <Bell className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Sistem Bildirimleri</h3>
                      <p className="text-xs text-zinc-500">{systemAlerts.length} bildirim</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-white/5">
                  {systemAlerts.map((alert: any) => (
                    <div key={alert.id} className="px-5 py-3">
                      <div className="flex items-start gap-3">
                        <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                          alert.alert_type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">{alert.title}</p>
                          <p className="text-xs text-zinc-500 mt-0.5 truncate">{alert.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          )}

          {/* Admin Monthly Stats */}
          <AnimatedCard delay={0.6}>
            <div className="glass-card rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Aylık Özet</h3>
                    <p className="text-xs text-zinc-500">Bu ayki yenileme istatistikleri</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-3xl font-bold text-indigo-400">{dailyStats.bu_ay}</p>
                  <p className="text-xs text-zinc-500 mt-1">Bu Ay Yenileme</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-3xl font-bold text-emerald-400">{dailyStats.yenileme_onay}</p>
                  <p className="text-xs text-zinc-500 mt-1">Onaylanan</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-3xl font-bold text-amber-400">{dailyStats.bugun_gonderilen}</p>
                  <p className="text-xs text-zinc-500 mt-1">Bugün Gönderilen</p>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </>
      )}

      {/* ========== PERSONEL/OPERASYON TODAY SUMMARY ========== */}
      {(!isAdmin && !isYonetici) && (
      <AnimatedCard delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mesai Durumu */}
          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Clock className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Mesai Durumu</p>
                <p className="text-lg font-semibold text-white">
                  {hasCheckedIn ? (
                    todayAttendance?.check_in ?
                      new Date(todayAttendance.check_in).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                      : '--:--'
                  ) : 'Giriş yapılmadı'}
                </p>
              </div>
            </div>
            {hasCheckedIn && !hasCheckedOut && (
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Aktif çalışma
              </div>
            )}
          </div>

          {/* Aktif İş */}
          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <PlayCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Aktif İş</p>
                <p className="text-3xl font-bold text-white">{animatedActive}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-500">Devam eden görevler</p>
          </div>

          {/* Tamamlanan */}
          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Tamamlanan</p>
                <p className="text-3xl font-bold text-white">{animatedCompleted}</p>
              </div>
            </div>
            <AnimatedProgress value={completedTasks} max={totalTasks || 1} color="indigo" delay={0.2} />
          </div>
        </div>
      </AnimatedCard>
      )}

      {/* ========== WEEKLY PERFORMANCE (Personel only) ========== */}
      {(!isAdmin && !isYonetici) && (
      <AnimatedCard delay={0.4}>
        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <TrendingUp className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Haftalık Performans</h3>
                <p className="text-xs text-zinc-500">Son 7 günlük çalışma saatlerin</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{animatedWeeklyHours}s</p>
              <p className="text-xs text-zinc-500">/ {weeklyTarget}s hedef</p>
            </div>
          </div>

          <WeeklyChart data={weeklyData} target={weeklyTarget / 5} />

          <div className="mt-4">
            <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
              <span>Haftalık İlerleme</span>
              <span className="font-mono text-cyan-400">{Math.round((weeklyTotalHours / weeklyTarget) * 100)}%</span>
            </div>
            <AnimatedProgress value={weeklyTotalHours} max={weeklyTarget} color="cyan" delay={0.4} />
          </div>
        </div>
      </AnimatedCard>
      )}

      {/* ========== EXPIRING SERVICES (Operasyon+) ========== */}
      {(isOperasyon || isAdmin || isYonetici) && expiringServices.length > 0 && (
        <AnimatedCard delay={0.6}>
          <div className="glass-card rounded-2xl border border-amber-500/20 bg-amber-500/5">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Yakında Biten Servisler</h3>
                  <p className="text-xs text-zinc-500">30 gün içinde yenilenmesi gereken</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/teknik-hizmetler')}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                Tümünü Gör <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {expiringServices.map((service) => {
                const daysLeft = Math.ceil((new Date(service.end_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <div key={service.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{service.customer?.name}</p>
                      <p className="text-xs text-zinc-500">{service.service_type} - {service.domain || service.provider}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      daysLeft <= 7
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {daysLeft} gün kaldı
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* ========== QUICK ACTIONS (Personel only) ========== */}
      {(!isAdmin && !isYonetici) && (
        <AnimatedCard delay={isOperasyon ? 0.8 : 0.6}>
          <div className="grid grid-cols-2 gap-4">
            {/* İş Başlat */}
            <button
              onClick={() => router.push('/gorevler')}
              className="glass-card rounded-2xl p-5 border border-white/10 text-left group hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">İş Başlat</h3>
                  <p className="text-sm text-zinc-500">Yeni görev oluştur</p>
                </div>
              </div>
            </button>

            {/* Mesai Giriş */}
            <button
              onClick={() => router.push('/mesai')}
              className="glass-card rounded-2xl p-5 border border-white/10 text-left group hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {hasCheckedIn ? (hasCheckedOut ? 'Mesai Detayı' : 'Mesai Çıkış') : 'Mesai Giriş'}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {hasCheckedIn ? 'Mesai sayfasına git' : 'Giriş kaydı oluştur'}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </AnimatedCard>
      )}
    </div>
  )
}
