'use client'

import { Plus } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AddDataModalProps {
  onClose: () => void
}

export function AddDataModal({ onClose }: AddDataModalProps) {
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
            <Select>
              <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
                <SelectValue placeholder="Seçin..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Reklamlar</SelectLabel>
                  <SelectItem value="meta">Meta Ads</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                  <SelectItem value="tiktok">TikTok Ads</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Sosyal Medya</SelectLabel>
                  <SelectItem value="facebook">Facebook (Organik)</SelectItem>
                  <SelectItem value="instagram">Instagram (Organik)</SelectItem>
                  <SelectItem value="linkedin-org">LinkedIn (Organik)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Periyot *</label>
              <Select defaultValue="monthly">
                <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Aylık</SelectItem>
                  <SelectItem value="weekly">Haftalık</SelectItem>
                  <SelectItem value="daily">Günlük</SelectItem>
                </SelectContent>
              </Select>
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
              <Select defaultValue="EUR">
                <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">€ EUR</SelectItem>
                  <SelectItem value="TRY">₺ TRY</SelectItem>
                  <SelectItem value="USD">$ USD</SelectItem>
                </SelectContent>
              </Select>
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
