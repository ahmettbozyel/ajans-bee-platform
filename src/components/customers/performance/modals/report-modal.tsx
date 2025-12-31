'use client'

import { FileText, Sparkles } from 'lucide-react'

interface ReportModalProps {
  onClose: () => void
}

export function ReportModal({ onClose }: ReportModalProps) {
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
