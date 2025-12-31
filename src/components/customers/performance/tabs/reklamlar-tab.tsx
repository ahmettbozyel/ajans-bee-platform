'use client'

import { Facebook, Linkedin, BarChart3, Download } from 'lucide-react'
import { PlatformCard } from '../cards'
import { CampaignRow } from '../tables'

export function ReklamlarTab() {
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
