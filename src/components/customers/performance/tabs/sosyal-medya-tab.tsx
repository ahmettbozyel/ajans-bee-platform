'use client'

import { Facebook, Instagram, Linkedin, Pencil, Plus, Info } from 'lucide-react'

export function SosyalMedyaTab() {
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
