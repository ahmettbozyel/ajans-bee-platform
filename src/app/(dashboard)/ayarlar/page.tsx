'use client'

import { useState } from 'react'
import { Settings, DollarSign, Users, Calendar, Clock, Sliders } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { ServiceProvidersTab } from './components/service-providers-tab'
import { UsersTab } from './components/users-tab'
import { HolidaysTab } from './components/holidays-tab'
import { WorkCalendarTab } from './components/work-calendar-tab'
import { TolerancesTab } from './components/tolerances-tab'

type TabType = 'providers' | 'users' | 'holidays' | 'calendar' | 'tolerances'

const ALL_TABS = [
  { id: 'providers' as TabType, label: 'Sağlayıcı Fiyatları', icon: DollarSign, adminOnly: false },
  { id: 'users' as TabType, label: 'Kullanıcılar', icon: Users, adminOnly: true },
  { id: 'holidays' as TabType, label: 'Resmi Tatiller', icon: Calendar, adminOnly: true },
  { id: 'calendar' as TabType, label: 'Çalışma Takvimi', icon: Clock, adminOnly: true },
  { id: 'tolerances' as TabType, label: 'Toleranslar', icon: Sliders, adminOnly: true },
]

export default function AyarlarPage() {
  const { isAdmin, isYonetici, appUser } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('providers')

  // Admin veya Yönetici kontrolü
  const canManage = isAdmin || isYonetici || appUser?.role === 'yonetici'

  // Görünecek tablar
  const visibleTabs = canManage
    ? ALL_TABS
    : ALL_TABS.filter(tab => !tab.adminOnly)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <Settings className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">
            {canManage ? 'Ayarlar' : 'Sağlayıcı Fiyatları'}
          </h1>
          <p className="text-sm text-zinc-500">
            {canManage ? 'Sistem ayarlarını ve fiyatları yönetin' : 'Hosting, domain ve SSL fiyatlarını görüntüleyin'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      {visibleTabs.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-10 px-4 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-zinc-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'providers' && <ServiceProvidersTab />}
      {activeTab === 'users' && canManage && <UsersTab />}
      {activeTab === 'holidays' && canManage && <HolidaysTab />}
      {activeTab === 'calendar' && canManage && <WorkCalendarTab />}
      {activeTab === 'tolerances' && canManage && <TolerancesTab />}
    </div>
  )
}
