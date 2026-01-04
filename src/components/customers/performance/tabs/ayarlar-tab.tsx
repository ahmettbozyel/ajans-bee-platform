'use client'

import { useState } from 'react'
import {
  Facebook, Instagram, Target, Globe, BarChart3, RefreshCw, Download,
  Key, Link, AlertTriangle, CheckCircle, History, Bell, Zap, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Customer } from '@/lib/customer-types'

interface AyarlarTabProps {
  customer: Customer
  onUpdate?: () => void
}

export function AyarlarTab({ customer, onUpdate }: AyarlarTabProps) {
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

  // Bağlantıyı test et - şimdilik mock response (n8n düzeltilince gerçek API'ye bağlanacak)
  const handleTestConnection = async () => {
    setIsTesting(true)
    setSaveMessage(null)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // En az bir ID girilmiş mi kontrol et
    if (!metaPageId && !metaIgId && !metaAdAccountId) {
      setSaveMessage({
        type: 'error',
        text: 'En az bir Meta ID girmelisiniz'
      })
    } else {
      setSaveMessage({
        type: 'success',
        text: 'Bağlantı başarılı! (mock - 245ms)'
      })
    }

    setTimeout(() => setSaveMessage(null), 5000)
    setIsTesting(false)
  }

  // Şimdi Senkronize Et - DB'ye kaydet (n8n düzeltilince gerçek sync eklenecek)
  const handleSync = async () => {
    setIsSyncing(true)
    setSaveMessage(null)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbError } = await (supabase as any)
        .from('customers')
        .update({
          meta_page_id: metaPageId || null,
          meta_ig_id: metaIgId || null,
          meta_ad_account_id: metaAdAccountId || null,
          meta_last_sync: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id)

      if (dbError) {
        throw new Error(`DB kayıt hatası: ${dbError.message}`)
      }

      // TODO: n8n düzeltilince buraya gerçek sync eklenecek
      // if (metaAdAccountId) {
      //   await fetch('/api/meta/sync', { ... })
      // }

      setSaveMessage({ type: 'success', text: 'Meta ID\'leri kaydedildi ve senkronize edildi!' })

      // Refresh customer data
      if (onUpdate) onUpdate()

      setTimeout(() => setSaveMessage(null), 5000)
    } catch (err) {
      setSaveMessage({ type: 'error', text: err instanceof Error ? err.message : 'Senkronizasyon hatası' })
    } finally {
      setIsSyncing(false)
    }
  }

  // Ayarları kaydet
  const handleSaveSettings = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
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
    } catch {
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
              type="button"
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
            <Select value={dataRetention} onValueChange={setDataRetention}>
              <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 ay</SelectItem>
                <SelectItem value="12">12 ay</SelectItem>
                <SelectItem value="24">24 ay</SelectItem>
              </SelectContent>
            </Select>
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
