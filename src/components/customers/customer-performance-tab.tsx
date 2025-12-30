// @ts-nocheck
'use client'

import { useState } from 'react'
import { 
  TrendingUp, TrendingDown, MousePointer, Eye, Users, DollarSign,
  Target, Megaphone, Share2, Globe, BarChart3, PieChart,
  Plus, FileText, ChevronDown, ExternalLink, Info, Sparkles,
  Facebook, Instagram, Linkedin, Play
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Customer } from '@/lib/customer-types'

interface CustomerPerformanceTabProps {
  customer: Customer
  onUpdate?: () => void
}

// Tab türleri
type PerformanceTab = 'reklamlar' | 'sosyal-medya' | 'web-analytics'

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
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-sm text-zinc-400">Dönem:</span>
            <button className="flex items-center gap-1 text-sm font-medium text-white">
              Kasım 2025
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Veri Ekle
          </button>
          <button 
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
          >
            <FileText className="w-4 h-4" />
            Rapor Oluştur
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('reklamlar')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === 'reklamlar'
              ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-white border-b-2 border-indigo-500"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
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
              ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-white border-b-2 border-indigo-500"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
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
              ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-white border-b-2 border-indigo-500"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Globe className="w-4 h-4" />
          Web Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'reklamlar' && <ReklamlarTab />}
      {activeTab === 'sosyal-medya' && <SosyalMedyaTab />}
      {activeTab === 'web-analytics' && <WebAnalyticsTab />}

      {/* Add Data Modal */}
      {showAddModal && (
        <AddDataModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal onClose={() => setShowReportModal(false)} />
      )}
    </div>
  )
}

// ==================== REKLAMLAR TAB ====================
function ReklamlarTab() {
  return (
    <div className="space-y-6">
      {/* Özet Kartları */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          iconColor="text-emerald-400"
          value="₺45,230"
          label="Toplam Harcama"
          trend={{ value: 12, direction: 'up' }}
          glowColor="glow-emerald"
        />
        <SummaryCard
          icon={<Eye className="w-5 h-5" />}
          iconBg="bg-indigo-500/10 border-indigo-500/20"
          iconColor="text-indigo-400"
          value="1.2M"
          label="Gösterim"
          trend={{ value: 8, direction: 'up' }}
          glowColor="glow-indigo"
        />
        <SummaryCard
          icon={<MousePointer className="w-5 h-5" />}
          iconBg="bg-violet-500/10 border-violet-500/20"
          iconColor="text-violet-400"
          value="24,892"
          label="Tıklama"
          subValue="CTR: %2.07"
          glowColor="glow-violet"
        />
        <SummaryCard
          icon={<Target className="w-5 h-5" />}
          iconBg="bg-cyan-500/10 border-cyan-500/20"
          iconColor="text-cyan-400"
          value="342"
          label="Dönüşüm"
          subValue="CPA: ₺132"
          glowColor="glow-cyan"
        />
      </div>

      {/* Platform Kartları */}
      <div className="grid grid-cols-3 gap-4">
        <PlatformCard
          platform="Meta Ads"
          icon={<Facebook className="w-5 h-5" />}
          gradient="from-blue-500 to-indigo-600"
          spend="₺28,450"
          impressions="856K"
          clicks="18,234"
          ctr="2.13%"
          conversions={245}
          roas="3.2x"
          dataSource="api"
        />
        <PlatformCard
          platform="Google Ads"
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
          gradient="from-red-500 to-yellow-500"
          spend="₺12,780"
          impressions="324K"
          clicks="5,892"
          ctr="1.82%"
          conversions={89}
          roas="2.8x"
          dataSource="manual"
        />
        <PlatformCard
          platform="LinkedIn Ads"
          icon={<Linkedin className="w-5 h-5" />}
          gradient="from-blue-600 to-blue-800"
          spend="₺4,000"
          impressions="45K"
          clicks="766"
          ctr="1.70%"
          conversions={8}
          roas="1.2x"
          dataSource="manual"
        />
      </div>

      {/* Kampanya Detay Tablosu */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Kampanya Detayları
          </h3>
          <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            Tümünü Gör
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Kampanya</th>
                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Platform</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Harcama</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Gösterim</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Tıklama</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">CTR</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Dönüşüm</th>
                <th className="text-center p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <CampaignRow
                name="Black Friday - Awareness"
                platform="Meta"
                platformColor="text-blue-400"
                spend="₺12,450"
                impressions="425K"
                clicks="8,234"
                ctr="1.94%"
                conversions={89}
                status="active"
              />
              <CampaignRow
                name="Yılsonu Kampanyası"
                platform="Meta"
                platformColor="text-blue-400"
                spend="₺8,200"
                impressions="256K"
                clicks="5,892"
                ctr="2.30%"
                conversions={124}
                status="active"
              />
              <CampaignRow
                name="Search - Brand"
                platform="Google"
                platformColor="text-red-400"
                spend="₺6,780"
                impressions="89K"
                clicks="3,456"
                ctr="3.88%"
                conversions={67}
                status="active"
              />
              <CampaignRow
                name="Retargeting"
                platform="Meta"
                platformColor="text-blue-400"
                spend="₺4,200"
                impressions="124K"
                clicks="2,108"
                ctr="1.70%"
                conversions={32}
                status="paused"
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
      {/* Info Banner */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <Info className="w-4 h-4 text-indigo-400" />
        <p className="text-sm text-indigo-300">Sosyal medya metrikleri organik içeriklerin performansını gösterir.</p>
      </div>

      {/* Platform Kartları */}
      <div className="grid grid-cols-4 gap-4">
        <SocialPlatformCard
          platform="Facebook"
          icon={<Facebook className="w-5 h-5" />}
          gradient="from-blue-500 to-blue-700"
          followers="12.4K"
          views="45.2K"
          engagement="3.2K"
          shares={234}
        />
        <SocialPlatformCard
          platform="Instagram"
          icon={<Instagram className="w-5 h-5" />}
          gradient="from-pink-500 via-purple-500 to-orange-500"
          followers="8.9K"
          views="89.1K"
          engagement="5.8K"
          shares={567}
        />
        <SocialPlatformCard
          platform="LinkedIn"
          icon={<Linkedin className="w-5 h-5" />}
          gradient="from-blue-600 to-blue-800"
          followers="2.1K"
          views="12.3K"
          engagement="892"
          shares={45}
        />
        {/* TikTok - Empty State */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 border-dashed flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
            <Play className="w-5 h-5 text-zinc-500" />
          </div>
          <p className="text-sm font-medium text-zinc-400 mb-1">TikTok</p>
          <p className="text-xs text-zinc-500 mb-3">Henüz bağlanmadı</p>
          <button className="text-xs text-indigo-400 hover:text-indigo-300">+ Bağla</button>
        </div>
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
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-violet-400" />
            Trafik Kaynakları
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Kaynak</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Oturum</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Pay</th>
                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Hemen Çıkma</th>
                <th className="text-center p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Kalite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
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

// ==================== MODALS ====================
function AddDataModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-gradient-to-b from-zinc-800/95 to-zinc-900/95 border border-white/10 rounded-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
              <Plus className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Manuel Veri Ekle</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Platform *</label>
            <select className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50">
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
              <label className="block text-sm font-medium text-zinc-400 mb-2">Periyot *</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50">
                <option value="monthly">Aylık</option>
                <option value="weekly">Haftalık</option>
                <option value="daily">Günlük</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Tarih *</label>
              <input type="month" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50" defaultValue="2025-11" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Harcama</label>
              <input type="number" placeholder="0.00" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Para Birimi</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50">
                <option value="TRY">₺ TRY</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Gösterim</label>
              <input type="number" placeholder="0" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Erişim</label>
              <input type="number" placeholder="0" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Tıklama</label>
              <input type="number" placeholder="0" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
          </div>

          <p className="text-xs text-zinc-500">💡 CTR ve CPC otomatik hesaplanır</p>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Dönüşüm</label>
              <input type="number" placeholder="0" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Lead</label>
              <input type="number" placeholder="0" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">ROAS</label>
              <input type="number" step="0.1" placeholder="0.0" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Not (opsiyonel)</label>
            <textarea rows={2} placeholder="Kampanya veya dönem hakkında not..." className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 resize-none" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10 bg-black/20">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-sm font-medium hover:text-white transition-colors">
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-gradient-to-b from-zinc-800/95 to-zinc-900/95 border border-white/10 rounded-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-500/30">
              <FileText className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Rapor Oluştur</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-3">Rapor Dönemi</label>
            <div className="grid grid-cols-2 gap-2">
              {['Kasım 2025', 'Ekim 2025', 'Q4 2025', '2025 Yılı'].map((period, i) => (
                <label key={period} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <input type="radio" name="period" value={period} defaultChecked={i === 0} className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-zinc-300">{period}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-3">Dahil Edilecek Bölümler</label>
            <div className="space-y-2">
              {[
                { id: 'summary', label: 'Yönetici Özeti', checked: true },
                { id: 'ads', label: 'Reklam Performansı', checked: true },
                { id: 'social', label: 'Sosyal Medya', checked: true },
                { id: 'web', label: 'Web Analytics', checked: true },
                { id: 'ai', label: 'AI Analizi', checked: true },
                { id: 'actions', label: 'Aksiyon Planı', checked: false },
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                  <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4 rounded border-white/20 bg-white/10 text-indigo-500" />
                  <span className="text-sm text-zinc-300">{item.label}</span>
                  {item.id === 'ai' && <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/20">AI</span>}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-3">Çıktı Formatı</label>
            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 cursor-pointer">
                <input type="radio" name="format" value="html" defaultChecked className="sr-only" />
                <Globe className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-indigo-300">HTML</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input type="radio" name="format" value="pdf" className="sr-only" />
                <FileText className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">PDF</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <p className="text-xs text-violet-300">AI otomatik yorum ekleyecek</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10 bg-black/20">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-sm font-medium hover:text-white transition-colors">
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
            trend.direction === 'up' ? "text-emerald-400" : "text-rose-400"
          )}>
            {trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}%
          </span>
        )}
      </div>
      <p className={cn("font-bold text-white font-mono", small ? "text-xl" : "text-2xl")}>{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{label}</p>
      {subValue && <p className="text-[10px] text-zinc-600 mt-0.5">{subValue}</p>}
    </div>
  )
}

function PlatformCard({
  platform, icon, gradient, spend, impressions, clicks, ctr, conversions, roas, dataSource
}: {
  platform: string
  icon: React.ReactNode
  gradient: string
  spend: string
  impressions: string
  clicks: string
  ctr: string
  conversions: number
  roas: string
  dataSource: 'api' | 'manual'
}) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", gradient)}>
            {icon}
          </div>
          <div>
            <p className="font-semibold text-white">{platform}</p>
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded",
              dataSource === 'api' 
                ? "bg-emerald-500/20 text-emerald-400" 
                : "bg-amber-500/20 text-amber-400"
            )}>
              {dataSource === 'api' ? '🔗 API' : '✏️ Manuel'}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-zinc-500">Harcama</p>
          <p className="text-lg font-bold text-white font-mono">{spend}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">ROAS</p>
          <p className="text-lg font-bold text-emerald-400 font-mono">{roas}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Gösterim</p>
          <p className="text-sm font-semibold text-zinc-300 font-mono">{impressions}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Tıklama</p>
          <p className="text-sm font-semibold text-zinc-300 font-mono">{clicks}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">CTR</p>
          <p className="text-sm font-semibold text-zinc-300 font-mono">{ctr}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Dönüşüm</p>
          <p className="text-sm font-semibold text-zinc-300 font-mono">{conversions}</p>
        </div>
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
    <div className="glass-card rounded-2xl p-5 border border-white/10 card-hover">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", gradient)}>
          {icon}
        </div>
        <div>
          <p className="font-semibold text-white">{platform}</p>
          <p className="text-xs text-zinc-500">{followers} takipçi</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-xs text-zinc-500">Görüntülenme</p>
          <p className="text-sm font-bold text-white font-mono">{views}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Etkileşim</p>
          <p className="text-sm font-bold text-white font-mono">{engagement}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Paylaşım</p>
          <p className="text-sm font-bold text-white font-mono">{shares}</p>
        </div>
      </div>
    </div>
  )
}

function CampaignRow({
  name, platform, platformColor, spend, impressions, clicks, ctr, conversions, status
}: {
  name: string
  platform: string
  platformColor: string
  spend: string
  impressions: string
  clicks: string
  ctr: string
  conversions: number
  status: 'active' | 'paused' | 'ended'
}) {
  return (
    <tr className="hover:bg-white/5 transition-colors">
      <td className="p-4">
        <p className="text-sm font-medium text-white">{name}</p>
      </td>
      <td className="p-4">
        <span className={cn("text-xs font-medium", platformColor)}>{platform}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-white">{spend}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-400">{impressions}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-400">{clicks}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-400">{ctr}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-emerald-400">{conversions}</span>
      </td>
      <td className="p-4 text-center">
        <span className={cn(
          "text-[10px] px-2 py-1 rounded-full font-medium",
          status === 'active' && "bg-emerald-500/20 text-emerald-400",
          status === 'paused' && "bg-amber-500/20 text-amber-400",
          status === 'ended' && "bg-zinc-500/20 text-zinc-400"
        )}>
          {status === 'active' && 'Aktif'}
          {status === 'paused' && 'Durduruldu'}
          {status === 'ended' && 'Bitti'}
        </span>
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
    <tr className="hover:bg-white/5 transition-colors">
      <td className="p-4">
        <span className="text-sm font-medium text-white">{source}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-300">{sessions.toLocaleString()}</span>
      </td>
      <td className="p-4 text-right">
        <span className="text-sm font-mono text-zinc-400">%{share}</span>
      </td>
      <td className="p-4 text-right">
        <span className={cn(
          "text-sm font-mono",
          bounceRate > 60 ? "text-rose-400" : bounceRate > 40 ? "text-amber-400" : "text-emerald-400"
        )}>
          %{bounceRate}
        </span>
      </td>
      <td className="p-4 text-center">
        <span className={cn(
          "text-[10px] px-2 py-1 rounded-full font-medium",
          quality === 'high' && "bg-emerald-500/20 text-emerald-400",
          quality === 'medium' && "bg-amber-500/20 text-amber-400",
          quality === 'low' && "bg-rose-500/20 text-rose-400"
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
    <div className="glass-card rounded-xl p-4 border border-white/10 card-hover">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-white font-mono">{value}</p>
        <span className={cn(
          "text-xs font-medium flex items-center gap-1",
          change >= 0 ? "text-emerald-400" : "text-rose-400"
        )}>
          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change >= 0 ? '+' : ''}{change}%
        </span>
      </div>
    </div>
  )
}
