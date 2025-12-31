'use client'

import { cn } from '@/lib/utils'

interface OptionCardProps {
  label: string
  emoji?: string
  selected: boolean
  onChange: () => void
  type?: 'radio' | 'checkbox'
  colorClass?: 'indigo' | 'violet' | 'fuchsia' | 'rose'
}

const borderColor = {
  indigo: 'peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10',
  violet: 'peer-checked:border-violet-500 peer-checked:bg-violet-50 dark:peer-checked:bg-violet-500/10',
  fuchsia: 'peer-checked:border-fuchsia-500 peer-checked:bg-fuchsia-50 dark:peer-checked:bg-fuchsia-500/10',
  rose: 'peer-checked:border-rose-500 peer-checked:bg-rose-50 dark:peer-checked:bg-rose-500/10'
}

export function OptionCard({
  label,
  emoji,
  selected,
  onChange,
  type = 'radio',
  colorClass = 'indigo'
}: OptionCardProps) {
  return (
    <label className="relative cursor-pointer">
      <input
        type={type}
        className="peer sr-only"
        checked={selected}
        onChange={onChange}
      />
      <div className={cn(
        "p-3 rounded-xl border-2 border-zinc-200 dark:border-white/10 text-center transition-all",
        borderColor[colorClass]
      )}>
        {emoji && <span className="text-lg mb-1 block">{emoji}</span>}
        <span className="text-sm font-medium text-zinc-900 dark:text-white">{label}</span>
      </div>
    </label>
  )
}
