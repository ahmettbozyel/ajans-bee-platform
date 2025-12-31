'use client'

import { Users, TrendingDown, Eye, FileText, PieChart } from 'lucide-react'
import { SummaryCard, ConversionCard } from '../cards'
import { TrafficRow } from '../tables'

export function WebAnalyticsTab() {
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
