// @ts-nocheck
'use client'

import { useState } from 'react'
import {
  TrendingUp, TrendingDown, MousePointer, Eye, Users, DollarSign,
  Target, Megaphone, Share2, Globe, BarChart3, PieChart,
  Plus, FileText, ChevronDown, ExternalLink, Info, Sparkles,
  Facebook, Instagram, Linkedin, Play, Download, Pencil, RefreshCw,
  CheckCircle, AlertTriangle, Star, Settings, Key, Link, Clock, Bell,
  History, Shield, Calendar, Zap, AlertOctagon, Timer, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Customer } from '@/lib/customer-types'

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

// ==================== REKLAMLAR TAB ====================
function ReklamlarTab() {
  return (
    <div className="space-y-6">
      {/* Platform Kartları */}
      <div className="grid grid-cols-3 gap-4">
        <PlatformCard
          platform="Meta Ads"
          subtitle="Facebook & Instagram"
          icon={<Facebook className="w-5 h-5" />}
          iconLetter="M"
          gradient="from-blue-500 to-indigo-600"
          spend="€186"
          spendTrend={8}
          reach="43.2K"
          reachTrend={15}
          clicks="912"
          cpc="€0.20"
          dataSource="api"
          lastUpdate="2 saat önce"
        />
        <PlatformCard
          platform="Google Ads"
          subtitle="Search & Display"
          icon={<span className="text-lg font-bold">G</span>}
          iconLetter="G"
          gradient="from-red-500 to-yellow-500"
          spend="€456"
          spendTrend={5}
          reach="13.1K"
          clicks="905"
          ctr="%6.88"
          ctrTrend={0.5}
          dataSource="api"
          lastUpdate="2 saat önce"
        />
        <PlatformCard
          platform="LinkedIn Ads"
          subtitle="B2B Reklamlar"
          icon={<Linkedin className="w-5 h-5" />}
          iconLetter="in"
          gradient="from-blue-600 to-blue-800"
          spend="€120"
          reach="8.5K"
          clicks="156"
          leads="12"
          dataSource="manual"
          lastUpdate="3 gün önce"
        />
      </div>

      {/* Kampanya Detay Tablosu */}
      <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Kampanya Detayları
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Meta Ads
            </span>
          </div>
          <button className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 transition-colors">
            <Download className="w-3 h-3" />
            Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-white/5">
                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Reklam</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Erişim</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Tıklama</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Harcama</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">CPC</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">vs Ekim</th>
                <th className="text-center p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Performans</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
              <CampaignRow
                name="Paket 2"
                reach="16,260"
                clicks="503"
                spend="€90.02"
                cpc="€0.18"
                change={12}
                performance="best"
              />
              <CampaignRow
                name="Video Paketli"
                reach="6,636"
                clicks="176"
                spend="€48.79"
                cpc="€0.28"
                change={5}
                performance="good"
              />
              <CampaignRow
                name="Paket 3"
                reach="5,625"
                clicks="68"
                spend="€12.59"
                cpc="€0.19"
                change={3}
                performance="good"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ==================== SOSYAL MEDYA TAB ====================
function SosyalMedyaTab() {
  return (
    <div className="space-y-6">
      {/* Platform Kartları - Yeni tasarım */}
      <div className="grid grid-cols-4 gap-4">
        {/* Facebook */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 card-hover relative">
          <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
            ✏️ Manuel
          </span>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white">
              <Facebook className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white">Facebook</p>
              <p className="text-xs text-zinc-500">Organik</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
              <p className="text-2xl font-bold text-zinc-900 dark:text-white font-mono">674K</p>
              <p className="text-xs text-zinc-500">Görüntülenme</p>
              <span className="text-xs text-emerald-400 font-medium">+18%</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
              <p className="text-xl font-bold text-zinc-900 dark:text-white font-mono">363</p>
              <p className="text-xs text-zinc-500">Etkileşim</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100 dark:border-white/5">
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
              1 gün önce
            </span>
            <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
              <Pencil className="w-3 h-3" />
              Düzenle
            </button>
          </div>
        </div>

        {/* Instagram */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 card-hover relative">
          <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
            ✏️ Manuel
          </span>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center text-white">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white">Instagram</p>
              <p className="text-xs text-zinc-500">Organik</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
              <p className="text-2xl font-bold text-zinc-900 dark:text-white font-mono">31K</p>
              <p className="text-xs text-zinc-500">Görüntülenme</p>
              <span className="text-xs text-emerald-400 font-medium">+8%</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
              <p className="text-xl font-bold text-zinc-900 dark:text-white font-mono">284</p>
              <p className="text-xs text-zinc-500">Etkileşim</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100 dark:border-white/5">
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
              1 gün önce
            </span>
            <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
              <Pencil className="w-3 h-3" />
              Düzenle
            </button>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 card-hover relative">
          <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
            ✏️ Manuel
          </span>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white">
              <Linkedin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white">LinkedIn</p>
              <p className="text-xs text-zinc-500">Organik</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
              <p className="text-2xl font-bold text-zinc-900 dark:text-white font-mono">756</p>
              <p className="text-xs text-zinc-500">Görüntülenme</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
              <p className="text-xl font-bold text-zinc-900 dark:text-white font-mono">17</p>
              <p className="text-xs text-zinc-500">Reaksiyon</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100 dark:border-white/5">
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
              2 gün önce
            </span>
            <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
              <Pencil className="w-3 h-3" />
              Düzenle
            </button>
          </div>
        </div>

        {/* TikTok - Empty State */}
        <div className="glass-card rounded-2xl p-5 border border-dashed border-zinc-300 dark:border-white/10 relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center">
              <span className="text-lg font-bold text-zinc-400">T</span>
            </div>
            <div>
              <p className="font-semibold text-zinc-500 dark:text-zinc-400">TikTok</p>
              <p className="text-xs text-zinc-400">Organik</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5">
              <p className="text-2xl font-bold text-zinc-300 dark:text-zinc-600 font-mono">-</p>
              <p className="text-xs text-zinc-400">Görüntülenme</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5">
              <p className="text-xl font-bold text-zinc-300 dark:text-zinc-600 font-mono">-</p>
              <p className="text-xs text-zinc-400">Etkileşim</p>
            </div>
          </div>
          <div className="flex items-center justify-end pt-4 mt-4 border-t border-zinc-100 dark:border-white/5">
            <button className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/10 transition-colors font-medium">
              <Plus className="w-3 h-3" />
              Veri Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner - Altta */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
        <Info className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        <p className="text-sm text-indigo-600 dark:text-indigo-300">Sosyal medya metrikleri <strong>organik</strong> içeriklerin performansını gösterir.</p>
      </div>
    </div>
  )
}

// ==================== WEB ANALYTICS TAB ====================
function WebAnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* Özet Kartları */}
      <div className="grid grid-cols-5 gap-4">
        <SummaryCard
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-indigo-500/10 border-indigo-500/20"
          iconColor="text-indigo-400"
          value="1,574"
          label="Kullanıcı"
          trend={{ value: 23, direction: 'up' }}
          glowColor="glow-indigo"
          small
        />
        <SummaryCard
          icon={<TrendingDown className="w-5 h-5" />}
          iconBg="bg-amber-500/10 border-amber-500/20"
          iconColor="text-amber-400"
          value="%52"
          label="Hemen Çıkma"
          trend={{ value: 5, direction: 'down' }}
          glowColor="glow-amber"
          small
        />
        <SummaryCard
          icon={<Eye className="w-5 h-5" />}
          iconBg="bg-violet-500/10 border-violet-500/20"
          iconColor="text-violet-400"
          value="2:07"
          label="Ort. Süre"
          glowColor="glow-violet"
          small
        />
        <SummaryCard
          icon={<FileText className="w-5 h-5" />}
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          iconColor="text-emerald-400"
          value="52"
          label="Form"
          glowColor="glow-emerald"
          small
        />
        <SummaryCard
          icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>}
          iconBg="bg-green-500/10 border-green-500/20"
          iconColor="text-green-400"
          value="38"
          label="WhatsApp"
          glowColor="glow-emerald"
          small
        />
      </div>

      {/* Trafik Kaynakları */}
      <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-white/5">
          <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-violet-400" />
            Trafik Kaynakları
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-white/5">
                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Kaynak</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Oturum</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Pay</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Hemen Çıkma</th>
                <th className="text-center p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Kalite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
              <TrafficRow source="Google CPC" sessions={792} share={42} bounceRate={38} quality="medium" />
              <TrafficRow source="Doğrudan" sessions={675} share={36} bounceRate={70} quality="low" />
              <TrafficRow source="Organik" sessions={342} share={18} bounceRate={14} quality="high" />
              <TrafficRow source="Sosyal" sessions={29} share={2} bounceRate={45} quality="medium" />
            </tbody>
          </table>
        </div>
      </div>

      {/* Dönüşümler */}
      <div className="grid grid-cols-4 gap-4">
        <ConversionCard label="Form Doldurma" value={52} change={12} />
        <ConversionCard label="WhatsApp Tıklama" value={38} change={8} />
        <ConversionCard label="Telefon Tıklama" value={24} change={-3} />
        <ConversionCard label="Sosyal Medya Geçiş" value={156} change={23} />
      </div>
    </div>
  )
}

// ==================== AYARLAR TAB ====================
function AyarlarTab({ customer, onUpdate }: { customer: Customer; onUpdate?: () => void }) {
  const supabase = createClient()
  const [metaPageId, setMetaPageId] = useState(customer.meta_page_id || '')
  const [metaIgId, setMetaIgId] = useState(customer.meta_ig_id || '')
  const [metaAdAccountId, setMetaAdAccountId] = useState(customer.meta_ad_account_id || '')
  const [ga4PropertyId, setGa4PropertyId] = useState(customer.google_ga4_id || '')
  const [googleAdsId, setGoogleAdsId] = useState(customer.google_ads_id || '')
  const [autoSyncFrequency, setAutoSyncFrequency] = useState<'disabled' | 'daily' | 'weekly'>(customer.auto_sync_frequency || 'disabled')
  const [dataRetention, setDataRetention] = useState('12')
  const [notifySyncErrors, setNotifySyncErrors] = useState(true)
  const [notifyMonthlyReport, setNotifyMonthlyReport] = useState(true)
  const [notifyWeeklySummary, setNotifyWeeklySummary] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Token durumu hesaplama (örnek veri)
  const tokenExpiresAt = customer.meta_token_expires_at ? new Date(customer.meta_token_expires_at) : null
  const now = new Date()
  const daysUntilExpiry = tokenExpiresAt ? Math.ceil((tokenExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

  const getTokenStatus = () => {
    if (!tokenExpiresAt) return { status: 'none', label: 'Token Yok', color: 'zinc', icon: '⚪' }
    if (daysUntilExpiry && daysUntilExpiry <= 0) return { status: 'expired', label: 'Süresi Doldu', color: 'red', icon: '❌' }
    if (daysUntilExpiry && daysUntilExpiry <= 15) return { status: 'critical', label: 'Kritik', color: 'red', icon: '🔴' }
    if (daysUntilExpiry && daysUntilExpiry <= 30) return { status: 'warning', label: 'Yakında Sona Erecek', color: 'amber', icon: '⚠️' }
    return { status: 'active', label: 'Aktif', color: 'emerald', icon: '✅' }
  }

  const tokenStatus = getTokenStatus()

  // Mock sync history data
  const syncHistory = [
    { id: 1, date: '2025-12-30 14:32', platform: 'Meta Ads', status: 'success', summary: '3 kampanya, 156 lead senkronize edildi' },
    { id: 2, date: '2025-12-29 09:15', platform: 'Meta Ads', status: 'success', summary: '3 kampanya, 142 lead senkronize edildi' },
    { id: 3, date: '2025-12-28 14:30', platform: 'Meta Ads', status: 'error', summary: 'API rate limit aşıldı' },
    { id: 4, date: '2025-12-27 09:00', platform: 'Meta Ads', status: 'success', summary: '3 kampanya, 138 lead senkronize edildi' },
    { id: 5, date: '2025-12-26 14:28', platform: 'Meta Ads', status: 'success', summary: '3 kampanya, 125 lead senkronize edildi' },
  ]

  const handleTestConnection = async () => {
    setIsTesting(true)
    // Simüle test
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsTesting(false)
  }

  const handleSync = async () => {
    setIsSyncing(true)
    setSaveMessage(null)

    try {
      // Meta ID'leri DB'ye kaydet
      const { error } = await supabase
        .from('customers')
        .update({
          meta_page_id: metaPageId || null,
          meta_ig_id: metaIgId || null,
          meta_ad_account_id: metaAdAccountId || null,
          meta_last_sync: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id)

      if (error) throw error

      setSaveMessage({ type: 'success', text: 'Meta hesapları senkronize edildi!' })

      // Refresh customer data
      if (onUpdate) onUpdate()

      // 3 saniye sonra mesajı kaldır
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      console.error('Error syncing:', err)
      setSaveMessage({ type: 'error', text: 'Senkronizasyon sırasında bir hata oluştu.' })
    } finally {
      setIsSyncing(false)
    }
  }

  // Ayarları kaydet
  const handleSaveSettings = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const { error } = await supabase
        .from('customers')
        .update({
          meta_page_id: metaPageId || null,
          meta_ig_id: metaIgId || null,
          meta_ad_account_id: metaAdAccountId || null,
          google_ga4_id: ga4PropertyId || null,
          google_ads_id: googleAdsId || null,
          auto_sync_frequency: autoSyncFrequency,
          auto_sync_enabled: autoSyncFrequency !== 'disabled',
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id)

      if (error) throw error

      setSaveMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi!' })

      // Refresh customer data
      if (onUpdate) onUpdate()

      // 3 saniye sonra mesajı kaldır
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      setSaveMessage({ type: 'error', text: 'Kaydetme sırasında bir hata oluştu.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ==================== BÖLÜM 1: TOKEN DURUMU ==================== */}
      <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-white/5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Key className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">Meta Token Durumu</h3>
        </div>
        <div className="p-5">
          {tokenExpiresAt ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Token Durumu:</span>
                <span className={cn(
                  "flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full",
                  tokenStatus.color === 'emerald' && "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
                  tokenStatus.color === 'amber' && "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400",
                  tokenStatus.color === 'red' && "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400",
                )}>
                  {tokenStatus.icon} {tokenStatus.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Son Yenileme:</span>
                <span className="text-sm text-zinc-900 dark:text-white font-medium">15 Kasım 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Geçerlilik:</span>
                <span className="text-sm text-zinc-900 dark:text-white font-medium">
                  {tokenExpiresAt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}'e kadar
                  {daysUntilExpiry && daysUntilExpiry > 0 && (
                    <span className="text-zinc-500 ml-1">({daysUntilExpiry} gün kaldı)</span>
                  )}
                </span>
              </div>
              {daysUntilExpiry && daysUntilExpiry > 15 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span className="text-xs text-amber-600 dark:text-amber-300">15 gün kala otomatik uyarı alacaksınız</span>
                </div>
              )}
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all">
                <RefreshCw className="w-4 h-4" />
                Token'ı Şimdi Yenile
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-sm text-zinc-500 mb-4">Henüz Meta token bağlantısı yapılmamış</p>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all mx-auto">
                <Link className="w-4 h-4" />
                Meta ile Bağlan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==================== BÖLÜM 2: META BAĞLANTILARI ==================== */}
      <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-white/5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Facebook className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">Meta Bağlantıları</h3>
        </div>
        <div className="p-5 space-y-5">
          {/* Facebook Page ID */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-600" />
                Facebook Page ID
              </label>
              {metaPageId ? (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  ✅ Bağlı
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                  ⚪ Boş
                </span>
              )}
            </div>
            <input
              type="text"
              value={metaPageId}
              onChange={(e) => setMetaPageId(e.target.value)}
              placeholder="123456789012345"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-blue-500/50 font-mono"
            />
            {customer.meta_last_sync && (
              <p className="text-[10px] text-zinc-400 mt-1">Son senkron: {new Date(customer.meta_last_sync).toLocaleString('tr-TR')}</p>
            )}
          </div>

          {/* Instagram Account ID */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-600" />
                Instagram Account ID
              </label>
              {metaIgId ? (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  ✅ Bağlı
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                  ⚪ Boş
                </span>
              )}
            </div>
            <input
              type="text"
              value={metaIgId}
              onChange={(e) => setMetaIgId(e.target.value)}
              placeholder="17841400000000000"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-pink-500/50 font-mono"
            />
          </div>

          {/* Ad Account ID */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                Ad Account ID
              </label>
              {metaAdAccountId ? (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  ✅ Bağlı
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                  ⚪ Boş
                </span>
              )}
            </div>
            <input
              type="text"
              value={metaAdAccountId}
              onChange={(e) => setMetaAdAccountId(e.target.value)}
              placeholder="act_123456789012345"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500/50 font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-zinc-200 dark:border-white/5">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              🔄 Bağlantıyı Test Et
            </button>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50"
            >
              {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              📥 Şimdi Senkronize Et
            </button>
          </div>
        </div>
      </div>

      {/* ==================== BÖLÜM 3: GOOGLE BAĞLANTILARI ==================== */}
      <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden opacity-70">
        <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-white/5">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <Globe className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">Google Bağlantıları</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">🔒 Yakında</span>
        </div>
        <div className="p-5 space-y-5">
          {/* GA4 Property ID */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-500 dark:text-zinc-500 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                GA4 Property ID
              </label>
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                🔒 Yakında
              </span>
            </div>
            <input
              type="text"
              value={ga4PropertyId}
              onChange={(e) => setGa4PropertyId(e.target.value)}
              placeholder="123456789"
              disabled
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 text-zinc-400 text-sm cursor-not-allowed font-mono"
            />
          </div>

          {/* Google Ads Account ID */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-500 dark:text-zinc-500 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Google Ads Account ID
              </label>
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                🔒 Yakında
              </span>
            </div>
            <input
              type="text"
              value={googleAdsId}
              onChange={(e) => setGoogleAdsId(e.target.value)}
              placeholder="123-456-7890"
              disabled
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 text-zinc-400 text-sm cursor-not-allowed font-mono"
            />
          </div>
        </div>
      </div>

      {/* ==================== BÖLÜM 4: SENKRONİZASYON AYARLARI ==================== */}
      <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-white/5">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <RefreshCw className="w-5 h-5 text-violet-400" />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">Senkronizasyon Ayarları</h3>
        </div>
        <div className="p-5 space-y-5">
          {/* Otomatik Senkronizasyon */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3 block">Otomatik Senkronizasyon</label>
            <div className="flex gap-3">
              {(['disabled', 'daily', 'weekly'] as const).map((freq) => (
                <label key={freq} className="flex-1 relative cursor-pointer">
                  <input
                    type="radio"
                    name="syncFrequency"
                    value={freq}
                    checked={autoSyncFrequency === freq}
                    onChange={() => setAutoSyncFrequency(freq)}
                    className="peer sr-only"
                  />
                  <div className="p-3 rounded-xl border-2 border-zinc-200 dark:border-white/10 peer-checked:border-violet-500 peer-checked:bg-violet-50 dark:peer-checked:bg-violet-500/10 text-center transition-all">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">
                      {freq === 'disabled' && 'Kapalı'}
                      {freq === 'daily' && 'Günlük'}
                      {freq === 'weekly' && 'Haftalık'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Veri Saklama Süresi */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">Veri Saklama Süresi</label>
            <select
              value={dataRetention}
              onChange={(e) => setDataRetention(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-violet-500/50"
            >
              <option value="6">6 ay</option>
              <option value="12">12 ay</option>
              <option value="24">24 ay</option>
            </select>
          </div>
        </div>
      </div>

      {/* ==================== BÖLÜM 5: SON SENKRONİZASYONLAR ==================== */}
      <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <History className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">Son Senkronizasyonlar</h3>
          </div>
          <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
            Tümünü Gör →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-white/5">
                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Tarih</th>
                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Platform</th>
                <th className="text-center p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Durum</th>
                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Özet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
              {syncHistory.map((sync) => (
                <tr key={sync.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">{sync.date}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-zinc-900 dark:text-white">{sync.platform}</span>
                  </td>
                  <td className="p-4 text-center">
                    {sync.status === 'success' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        ✅ Başarılı
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                        ❌ Hata
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">{sync.summary}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== BÖLÜM 6: BİLDİRİM AYARLARI ==================== */}
      <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-white/5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <Bell className="w-5 h-5 text-rose-400" />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">Bildirim Ayarları</h3>
        </div>
        <div className="p-5 space-y-4">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
            <input
              type="checkbox"
              checked={notifySyncErrors}
              onChange={(e) => setNotifySyncErrors(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 dark:border-white/20 text-indigo-500"
            />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Senkronizasyon hatalarında bildirim</p>
              <p className="text-xs text-zinc-500">API bağlantı hataları veya veri çekme sorunlarında</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
            <input
              type="checkbox"
              checked={notifyMonthlyReport}
              onChange={(e) => setNotifyMonthlyReport(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 dark:border-white/20 text-indigo-500"
            />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Aylık rapor hazır olduğunda bildirim</p>
              <p className="text-xs text-zinc-500">Her ayın başında otomatik rapor oluşturulduğunda</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
            <input
              type="checkbox"
              checked={notifyWeeklySummary}
              onChange={(e) => setNotifyWeeklySummary(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 dark:border-white/20 text-indigo-500"
            />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Haftalık performans özeti</p>
              <p className="text-xs text-zinc-500">Her pazartesi performans değişikliklerinin özeti</p>
            </div>
          </label>
        </div>
      </div>

      {/* Kaydet Butonu */}
      <div className="flex items-center justify-between">
        {saveMessage && (
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm",
            saveMessage.type === 'success'
              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
              : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
          )}>
            {saveMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {saveMessage.text}
          </div>
        )}
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 ml-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Ayarları Kaydet
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ==================== MODALS ====================
function AddDataModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gradient-to-b dark:from-zinc-800/95 dark:to-zinc-900/95 border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30">
              <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Manuel Veri Ekle</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Platform *</label>
            <select className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500/50">
              <option value="">Seçin...</option>
              <optgroup label="Reklamlar">
                <option value="meta">Meta Ads</option>
                <option value="google">Google Ads</option>
                <option value="linkedin">LinkedIn Ads</option>
                <option value="tiktok">TikTok Ads</option>
              </optgroup>
              <optgroup label="Sosyal Medya">
                <option value="facebook">Facebook (Organik)</option>
                <option value="instagram">Instagram (Organik)</option>
                <option value="linkedin-org">LinkedIn (Organik)</option>
              </optgroup>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Periyot *</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500/50">
                <option value="monthly">Aylık</option>
                <option value="weekly">Haftalık</option>
                <option value="daily">Günlük</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Tarih *</label>
              <input type="month" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500/50" defaultValue="2025-11" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Harcama</label>
              <input type="number" placeholder="0.00" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Para Birimi</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500/50">
                <option value="EUR">€ EUR</option>
                <option value="TRY">₺ TRY</option>
                <option value="USD">$ USD</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Erişim</label>
              <input type="number" placeholder="0" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Tıklama</label>
              <input type="number" placeholder="0" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Lead</label>
              <input type="number" placeholder="0" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
          </div>

          <p className="text-xs text-zinc-500">💡 CPC ve CTR otomatik hesaplanır</p>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:text-zinc-900 dark:hover:text-white transition-colors">
            İptal
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all">
            <Plus className="w-4 h-4" />
            Ekle
          </button>
        </div>
      </div>
    </div>
  )
}

function ReportModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gradient-to-b dark:from-zinc-800/95 dark:to-zinc-900/95 border border-zinc-200 dark:border-white/10 rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-500/20 border border-violet-200 dark:border-violet-500/30">
              <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Rapor Oluştur</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-3">Rapor Dönemi</label>
            <div className="grid grid-cols-2 gap-2">
              {['Kasım 2025', 'Ekim 2025', 'Q4 2025', '2025 Yılı'].map((period, i) => (
                <label key={period} className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">
                  <input type="radio" name="period" value={period} defaultChecked={i === 0} className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{period}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-3">Dahil Edilecek Bölümler</label>
            <div className="space-y-2">
              {[
                { id: 'summary', label: 'Yönetici Özeti', checked: true },
                { id: 'ads', label: 'Reklam Performansı', checked: true },
                { id: 'social', label: 'Sosyal Medya', checked: true },
                { id: 'web', label: 'Web Analytics', checked: true },
                { id: 'ai', label: 'AI Analizi', checked: true, ai: true },
                { id: 'actions', label: 'Aksiyon Planı', checked: false },
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">
                  <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4 rounded border-zinc-300 dark:border-white/20 bg-white dark:bg-white/10 text-indigo-500" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{item.label}</span>
                  {item.ai && <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20">AI</span>}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
            <Sparkles className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            <p className="text-xs text-violet-600 dark:text-violet-300">AI otomatik yorum ve öneri ekleyecek</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:text-zinc-900 dark:hover:text-white transition-colors">
            İptal
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
            <Sparkles className="w-4 h-4" />
            Oluştur
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== HELPER COMPONENTS ====================

function SummaryCard({ 
  icon, iconBg, iconColor, value, label, subValue, trend, glowColor, small 
}: { 
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  value: string
  label: string
  subValue?: string
  trend?: { value: number; direction: 'up' | 'down' }
  glowColor: string
  small?: boolean
}) {
  return (
    <div className={cn("glass-card rounded-2xl p-4 card-hover", glowColor)}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-2 rounded-xl border", iconBg)}>
          <span className={iconColor}>{icon}</span>
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium flex items-center gap-1",
            trend.direction === 'up' ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
          )}>
            {trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}%
          </span>
        )}
      </div>
      <p className={cn("font-bold text-zinc-900 dark:text-white font-mono", small ? "text-xl" : "text-2xl")}>{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{label}</p>
      {subValue && <p className="text-[10px] text-zinc-400 mt-0.5">{subValue}</p>}
    </div>
  )
}

function PlatformCard({
  platform, subtitle, icon, iconLetter, gradient, spend, spendTrend, reach, reachTrend, clicks, cpc, ctr, ctrTrend, leads, dataSource, lastUpdate
}: {
  platform: string
  subtitle: string
  icon: React.ReactNode
  iconLetter: string
  gradient: string
  spend: string
  spendTrend?: number
  reach: string
  reachTrend?: number
  clicks: string
  cpc?: string
  ctr?: string
  ctrTrend?: number
  leads?: string
  dataSource: 'api' | 'manual'
  lastUpdate: string
}) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 card-hover relative">
      {/* Data Source Badge */}
      <span className={cn(
        "absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-medium",
        dataSource === 'api' 
          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" 
          : "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
      )}>
        {dataSource === 'api' ? '🔗 API' : '✏️ Manuel'}
      </span>

      <div className="flex items-center gap-3 mb-4">
        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold", gradient)}>
          {icon}
        </div>
        <div>
          <p className="font-semibold text-zinc-900 dark:text-white">{platform}</p>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-zinc-500">Harcama</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-white font-mono">{spend}</p>
          {spendTrend && (
            <span className="text-xs text-emerald-500 dark:text-emerald-400">+{spendTrend}%</span>
          )}
        </div>
        <div>
          <p className="text-xs text-zinc-500">Erişim</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-white font-mono">{reach}</p>
          {reachTrend && (
            <span className="text-xs text-emerald-500 dark:text-emerald-400">+{reachTrend}%</span>
          )}
        </div>
        <div>
          <p className="text-xs text-zinc-500">Tıklama</p>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-mono">{clicks}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">{cpc ? 'CPC' : ctr ? 'CTR' : 'Lead'}</p>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-mono">{cpc || ctr || leads}</p>
          {ctrTrend && (
            <span className="text-xs text-emerald-500 dark:text-emerald-400">+{ctrTrend}%</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-white/5">
        <span className="text-xs text-zinc-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
          {lastUpdate}
        </span>
        <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
          <Pencil className="w-3 h-3" />
          Düzenle
        </button>
      </div>
    </div>
  )
}

function SocialPlatformCard({
  platform, icon, gradient, followers, views, engagement, shares
}: {
  platform: string
  icon: React.ReactNode
  gradient: string
  followers: string
  views: string
  engagement: string
  shares: number
}) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 card-hover">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", gradient)}>
          {icon}
        </div>
        <div>
          <p className="font-semibold text-zinc-900 dark:text-white">{platform}</p>
          <p className="text-xs text-zinc-500">{followers} takipçi</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-xs text-zinc-500">Görüntülenme</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{views}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Etkileşim</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{engagement}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Paylaşım</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{shares}</p>
        </div>
      </div>
    </div>
  )
}

function CampaignRow({
  name, reach, clicks, spend, cpc, change, performance
}: {
  name: string
  reach: string
  clicks: string
  spend: string
  cpc: string
  change: number
  performance: 'best' | 'good' | 'average' | 'low'
}) {
  return (
    <tr className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
      <td className="p-4">
        <p className="text-sm font-medium text-zinc-900 dark:text-white">{name}</p>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">{reach}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">{clicks}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-900 dark:text-white">{spend}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-900 dark:text-white font-semibold">{cpc}</span>
      </td>
      <td className="p-4 text-right">
        <span className={cn(
          "text-sm font-medium",
          change >= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
        )}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      </td>
      <td className="p-4 text-center">
        {performance === 'best' ? (
          <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white font-medium shadow-sm">
            <Star className="w-3 h-3" fill="currentColor" />
            En İyi
          </span>
        ) : performance === 'good' ? (
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
            İyi
          </span>
        ) : performance === 'average' ? (
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-medium">
            Orta
          </span>
        ) : (
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-medium">
            Düşük
          </span>
        )}
      </td>
    </tr>
  )
}

function TrafficRow({
  source, sessions, share, bounceRate, quality
}: {
  source: string
  sessions: number
  share: number
  bounceRate: number
  quality: 'high' | 'medium' | 'low'
}) {
  return (
    <tr className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
      <td className="p-4">
        <span className="text-sm font-medium text-zinc-900 dark:text-white">{source}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-600 dark:text-zinc-300">{sessions.toLocaleString()}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-500 dark:text-zinc-400">%{share}</span>
      </td>
      <td className="p-4 text-right">
        <span className={cn(
          "text-sm font-mono font-medium",
          bounceRate > 60 ? "text-rose-500 dark:text-rose-400" : bounceRate > 40 ? "text-amber-500 dark:text-amber-400" : "text-emerald-500 dark:text-emerald-400"
        )}>
          %{bounceRate}
        </span>
      </td>
      <td className="p-4 text-center">
        <span className={cn(
          "text-[10px] px-2.5 py-1 rounded-full font-medium",
          quality === 'high' && "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
          quality === 'medium' && "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400",
          quality === 'low' && "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"
        )}>
          {quality === 'high' && 'Çok İyi'}
          {quality === 'medium' && 'Orta'}
          {quality === 'low' && 'Düşük'}
        </span>
      </td>
    </tr>
  )
}

function ConversionCard({ label, value, change }: { label: string; value: number; change: number }) {
  return (
    <div className="glass-card rounded-xl p-4 border border-zinc-200 dark:border-white/10 card-hover">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-zinc-900 dark:text-white font-mono">{value}</p>
        <span className={cn(
          "text-xs font-medium flex items-center gap-1",
          change >= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
        )}>
          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change >= 0 ? '+' : ''}{change}%
        </span>
      </div>
    </div>
  )
}
