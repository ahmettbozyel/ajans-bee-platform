'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Notification } from '@/lib/notifications'
import { 
  Bell, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Check,
  CheckCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // User ID'yi al
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  }, [])

  // Bildirimleri çek
  const fetchNotifications = async () => {
    if (!userId) {
      return
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Bildirimler yüklenirken hata:', error)
        return
      }

      if (data) {
        setNotifications(data as Notification[])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUnreadCount(data.filter((n: any) => !n.is_read).length)
      }
    } catch (error) {
      console.error('Bildirimler yüklenirken beklenmeyen hata:', error)
    }
  }

  // userId değişince bildirimleri çek
  useEffect(() => {
    if (userId) {
      fetchNotifications()
      
      // Her 30 saniyede bir kontrol et
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [userId])

  // Dışarı tıklamada kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Tek bildirimi okundu işaretle
  const markAsRead = async (id: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Bildirim okundu işaretlenirken hata:', error)
    }
  }

  // Tümünü okundu işaretle
  const markAllAsRead = async () => {
    if (!userId) return
    setLoading(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Bildirimler okundu işaretlenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  // İkon ve renk belirle
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'late':
        return { 
          icon: <Clock className="w-4 h-4" />, 
          bg: 'bg-rose-500/20', 
          text: 'text-rose-400',
          border: 'border-rose-500/30'
        }
      case 'overtime':
        return { 
          icon: <TrendingUp className="w-4 h-4" />, 
          bg: 'bg-amber-500/20', 
          text: 'text-amber-400',
          border: 'border-amber-500/30'
        }
      case 'early_leave':
        return { 
          icon: <AlertTriangle className="w-4 h-4" />, 
          bg: 'bg-orange-500/20', 
          text: 'text-orange-400',
          border: 'border-orange-500/30'
        }
      default:
        return { 
          icon: <Bell className="w-4 h-4" />, 
          bg: 'bg-indigo-500/20', 
          text: 'text-indigo-400',
          border: 'border-indigo-500/30'
        }
    }
  }

  // Zaman formatlama
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Az önce'
    if (minutes < 60) return `${minutes}d önce`
    if (hours < 24) return `${hours}s önce`
    if (days < 7) return `${days}g önce`
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
  }

  const handleBellClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative z-50" ref={dropdownRef} style={{ pointerEvents: 'auto' }}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleBellClick}
        className={cn(
          "relative p-2.5 rounded-lg transition-all cursor-pointer",
          isOpen ? "bg-zinc-700" : "hover:bg-zinc-800"
        )}
        style={{
          background: isOpen ? 'rgba(63, 63, 70, 1)' : 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          pointerEvents: 'auto'
        }}
      >
        <Bell className="w-5 h-5 text-zinc-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-[100]">
          {/* Header */}
          <div className="px-4 py-3 bg-zinc-800/50 border-b border-zinc-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-100">Bildirimler</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Tümünü oku
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const style = getNotificationStyle(notification.type)
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors",
                      !notification.is_read && "bg-zinc-800/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg border",
                        style.bg, style.text, style.border
                      )}>
                        {style.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn(
                            "text-sm font-medium truncate",
                            notification.is_read ? "text-zinc-400" : "text-zinc-100"
                          )}>
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-zinc-700 rounded"
                            >
                              <Check className="w-3 h-3 text-zinc-500" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-1">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">Bildirim yok</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
