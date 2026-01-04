'use client'

import { useState } from 'react'
import {
  TrendingUp, TrendingDown, MousePointer, Eye, DollarSign,
  Target, Megaphone, Share2, Globe, Plus, FileText, ChevronDown,
  Sparkles, RefreshCw, CheckCircle, AlertTriangle, Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Customer } from '@/lib/customer-types'

// Import tabs
import { ReklamlarTab, SosyalMedyaTab, WebAnalyticsTab, AyarlarTab } from './tabs'

// Import modals
import { AddDataModal, ReportModal } from './modals'

interface CustomerPerformanceTabProps {
  customer: Customer
  onUpdate?: () => void
}

type PerformanceTab = 'reklamlar' | 'sosyal-medya' | 'web-analytics' | 'ayarlar'

export function CustomerPerformanceTab({ customer, onUpdate }: CustomerPerformanceTabProps) {
  const [activeTab, setActiveTab] = useState<PerformanceTab>('reklamlar')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Performans</h2>
          <p className="text-sm text-zinc-500 mt-1">Reklam, sosyal medya ve web analytics verileri</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Dönem Seçici */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-white text-sm font-medium hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Kasım 2025
            <ChevronDown className="w-4 h-4" />
          </button>
          {/* Karşılaştır */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">Karşılaştır:</span>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 text-sm hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              vs Ekim
            </button>
          </div>
          {/* Rapor Oluştur */}
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all"
          >
            <FileText className="w-4 h-4" />
            Rapor Oluştur
          </button>
          {/* Veri Ekle */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            Veri Ekle
          </button>
        </div>
      </div>

      {/* Özet Kartları - En üstte */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 glow-indigo card-hover relative">
          <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
            🔗 API
          </span>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Eye className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white font-mono">705K</p>
          <p className="text-xs text-zinc-500 mt-1">Toplam Erişim</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">+12%</span>
            <span className="text-xs text-zinc-500">vs Ekim</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 glow-amber card-hover relative">
          <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
            🔗 API
          </span>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white font-mono">€642</p>
          <p className="text-xs text-zinc-500 mt-1">Toplam Harcama</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">+8%</span>
            <span className="text-xs text-zinc-500">vs Ekim</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 glow-emerald card-hover relative">
          <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
            ✏️ Manuel
          </span>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white font-mono">103</p>
          <p className="text-xs text-zinc-500 mt-1">Toplam Lead</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">+23%</span>
            <span className="text-xs text-zinc-500">vs Ekim</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 glow-cyan card-hover relative">
          <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
            🔗 API
          </span>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <MousePointer className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white font-mono">€6.24</p>
          <p className="text-xs text-zinc-500 mt-1">CPL</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">-11%</span>
            <span className="text-xs text-zinc-500">vs Ekim</span>
          </div>
        </div>
      </div>

      {/* AI Performans Analizi Kartı */}
      <div className="glass-card rounded-2xl p-5 border border-violet-500/20 glow-violet bg-gradient-to-r from-violet-500/5 to-indigo-500/5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30">
              <Sparkles className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">AI Performans Analizi</h3>
              <p className="text-xs text-zinc-500 mb-3">Son analiz: 11 Aralık 2025, 14:32</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    <strong className="text-zinc-900 dark:text-white">Meta Ads "Paket 2"</strong> en düşük CPC (€0.18) ile en verimli reklam.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    <strong className="text-zinc-900 dark:text-white">Google Ads CTR (%6.88)</strong> sektör ortalamasının üzerinde.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    <strong className="text-zinc-900 dark:text-white">Organik arama</strong> %10.46 dönüşüm oranı ile en kaliteli trafik.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    <strong className="text-zinc-900 dark:text-white">Doğrudan trafik</strong> %70 hemen çıkma - bot trafiği olabilir.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/20 transition-colors text-sm">
            <RefreshCw className="w-4 h-4" />
            Yeniden Analiz
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('reklamlar')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === 'reklamlar'
              ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
          )}
        >
          <Megaphone className="w-4 h-4" />
          Reklamlar
        </button>
        <button
          onClick={() => setActiveTab('sosyal-medya')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === 'sosyal-medya'
              ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
          )}
        >
          <Share2 className="w-4 h-4" />
          Sosyal Medya
        </button>
        <button
          onClick={() => setActiveTab('web-analytics')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === 'web-analytics'
              ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
          )}
        >
          <Globe className="w-4 h-4" />
          Web Analytics
        </button>
        <button
          onClick={() => setActiveTab('ayarlar')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === 'ayarlar'
              ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
          )}
        >
          <Settings className="w-4 h-4" />
          Ayarlar
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'reklamlar' && <ReklamlarTab />}
      {activeTab === 'sosyal-medya' && <SosyalMedyaTab />}
      {activeTab === 'web-analytics' && <WebAnalyticsTab />}
      {activeTab === 'ayarlar' && <AyarlarTab customer={customer} onUpdate={onUpdate} />}

      {/* Modals */}
      {showAddModal && <AddDataModal onClose={() => setShowAddModal(false)} />}
      {showReportModal && <ReportModal onClose={() => setShowReportModal(false)} />}
    </div>
  )
}
