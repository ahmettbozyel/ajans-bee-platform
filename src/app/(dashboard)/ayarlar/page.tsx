'use client'

import { useState, useEffect } from 'react'
import { Settings, DollarSign, Users, Calendar, Clock, Sliders, User, Building2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { ServiceProvidersTab } from './components/service-providers-tab'
import { UsersTab } from './components/users-tab'
import { HolidaysTab } from './components/holidays-tab'
import { WorkCalendarTab } from './components/work-calendar-tab'
import { TolerancesTab } from './components/tolerances-tab'
import { ProfileTab } from './components/profile-tab'
import { CustomersTab } from './components/customers-tab'

type TabType = 'profile' | 'providers' | 'users' | 'holidays' | 'calendar' | 'tolerances' | 'customers'

interface TabConfig {
  id: TabType
  label: string
  icon: typeof Settings
  roles: ('admin' | 'yonetici' | 'operasyon' | 'personel' | 'stajer')[]
}

// Rol bazlı sekme erişimi
const ALL_TABS: TabConfig[] = [
  {
    id: 'profile',
    label: 'Profil',
    icon: User,
    roles: ['admin', 'yonetici', 'operasyon', 'personel', 'stajer']
  },
  {
    id: 'users',
    label: 'Kullanıcılar',
    icon: Users,
    roles: ['admin', 'yonetici']
  },
  {
    id: 'calendar',
    label: 'Çalışma Takvimi',
    icon: Clock,
    roles: ['admin', 'yonetici']
  },
  {
    id: 'tolerances',
    label: 'Toleranslar',
    icon: Sliders,
    roles: ['admin', 'yonetici']
  },
  {
    id: 'holidays',
    label: 'Tatiller',
    icon: Calendar,
    roles: ['admin', 'yonetici']
  },
  {
    id: 'providers',
    label: 'Sağlayıcı Fiyatları',
    icon: DollarSign,
    roles: ['admin', 'yonetici', 'operasyon']
  },
  {
    id: 'customers',
    label: 'Müşteriler',
    icon: Building2,
    roles: ['admin']
  },
]

export default function AyarlarPage() {
  const { appUser } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType | null>(null)

  // Kullanıcının erişebildiği sekmeler
  const visibleTabs = ALL_TABS.filter(tab =>
    appUser?.role && tab.roles.includes(appUser.role)
  )

  // İlk yüklemede varsayılan sekmeyi ayarla
  useEffect(() => {
    if (visibleTabs.length > 0 && !activeTab) {
      setActiveTab(visibleTabs[0].id)
    }
  }, [visibleTabs, activeTab])

  if (!appUser || !activeTab) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <Settings className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">Ayarlar</h1>
          <p className="text-sm text-zinc-500">
            {visibleTabs.length > 1 ? 'Hesap ve sistem ayarlarını yönetin' : 'Hesap ayarlarınızı yönetin'}
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
      {activeTab === 'profile' && <ProfileTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'calendar' && <WorkCalendarTab />}
      {activeTab === 'tolerances' && <TolerancesTab />}
      {activeTab === 'holidays' && <HolidaysTab />}
      {activeTab === 'providers' && <ServiceProvidersTab />}
      {activeTab === 'customers' && <CustomersTab />}
    </div>
  )
}
