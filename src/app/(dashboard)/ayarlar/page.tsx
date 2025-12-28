'use client'

import { useState } from 'react'
import { Settings, DollarSign, Users, Shield, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ServiceProvidersTab } from './components/service-providers-tab'

type TabType = 'providers' | 'users' | 'security' | 'appearance'

const TABS = [
  { id: 'providers' as TabType, label: 'Sağlayıcı Fiyatları', icon: DollarSign, ready: true },
  { id: 'users' as TabType, label: 'Kullanıcılar', icon: Users, ready: false },
  { id: 'security' as TabType, label: 'Güvenlik', icon: Shield, ready: false },
  { id: 'appearance' as TabType, label: 'Görünüm', icon: Palette, ready: false },
]

export default function AyarlarPage() {
  const [activeTab, setActiveTab] = useState<TabType>('providers')

  return (
    <div className="p-6 content-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Ayarlar</h1>
        </div>
        <p className="text-sm text-zinc-500">Sistem ayarlarını ve fiyatları yönetin</p>
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-xl border border-zinc-200 dark:border-white/10 mb-6">
        <div className="flex border-b border-zinc-200 dark:border-white/10">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => tab.ready && setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative",
                activeTab === tab.id
                  ? "text-indigo-600 dark:text-indigo-400"
                  : tab.ready
                  ? "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  : "text-zinc-400 cursor-not-allowed",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {!tab.ready && (
                <span className="text-[10px] bg-zinc-100 dark:bg-white/5 text-zinc-500 px-1.5 py-0.5 rounded-full">
                  Yakında
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'providers' && <ServiceProvidersTab />}
      
      {activeTab !== 'providers' && (
        <div className="glass-card rounded-2xl p-12 border border-zinc-200 dark:border-white/10 text-center">
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 w-fit mx-auto mb-4">
            <Settings className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Yakında
          </h3>
          <p className="text-sm text-zinc-500">
            Bu bölüm üzerinde çalışıyoruz.
          </p>
        </div>
      )}
    </div>
  )
}
