'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { Notification } from '@/lib/notifications'
import { 
  Bell, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Check,
  CheckCheck,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function NotificationBell() {
  const { appUser } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Bildirimleri çek
  const fetchNotifications = async () => {
    if (!appUser) return
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*, related_user:users!related_user_id(full_name)')
      .eq('user_id', appUser.id)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (!error && data) {
      setNotifications(data as unknown as Notification[])
      setUnreadCount(data.filter((n: any) => !n.is_read).length)
    }
  }

  // İlk yükleme ve polling
  useEffect(() => {
    fetchNotifications()
    
    // Her 30 saniyede bir kontrol et
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [appUser])

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
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
    
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  // Tümünü okundu işaretle
  const markAllAsRead = async () => {
    if (!appUser) return
    setLoading(true)
    
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', appUser.id)
      .eq('is_read', false)
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
    setLoading(false)
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-lg transition-colors",
          isOpen ? "bg-zinc-700" : "hover:bg-zinc-800"
        )}
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
        <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50">
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
