'use client'

import {
  Fingerprint, Users, Package, Swords, ShieldAlert, CalendarHeart,
  ChevronDown, Palette
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BriefSectionConfig } from '../config'

interface SectionHeaderProps {
  section: BriefSectionConfig
  isOpen: boolean
  onToggle: () => void
  completion: { filled: number; total: number }
}

// HTML ile uyumlu ikon mapping
const iconMap = {
  Fingerprint: <Fingerprint className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
  Swords: <Swords className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  CalendarHeart: <CalendarHeart className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />
}

// HTML ile uyumlu renk mapping
const colorClasses = {
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-500/10',
    text: 'text-indigo-600 dark:text-indigo-400'
  },
  violet: {
    bg: 'bg-violet-100 dark:bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400'
  },
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-500/10',
    text: 'text-cyan-600 dark:text-cyan-400'
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400'
  },
  rose: {
    bg: 'bg-rose-100 dark:bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400'
  },
  fuchsia: {
    bg: 'bg-fuchsia-100 dark:bg-fuchsia-500/10',
    text: 'text-fuchsia-600 dark:text-fuchsia-400'
  },
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400'
  }
}

export function SectionHeader({ section, isOpen, onToggle, completion }: SectionHeaderProps) {
  const isComplete = completion.filled === completion.total
  const percentage = completion.total > 0 ? Math.round((completion.filled / completion.total) * 100) : 0
  const colors = colorClasses[section.color as keyof typeof colorClasses]

  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", colors.bg)}>
          <span className={colors.text}>{iconMap[section.icon as keyof typeof iconMap]}</span>
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-zinc-900 dark:text-white">{section.label}</h3>
          <p className="text-xs text-zinc-500">{section.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isComplete ? (
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium">
            Tamamlandı
          </span>
        ) : (
          <span className={cn(
            "text-xs px-2.5 py-1 rounded-full font-medium",
            percentage >= 70 ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400" :
            percentage >= 30 ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" :
            "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          )}>
            {completion.filled}/{completion.total} alan
          </span>
        )}
        <ChevronDown className={cn(
          "w-5 h-5 text-zinc-400 transition-transform",
          isOpen && "rotate-180"
        )} />
      </div>
    </button>
  )
}
