'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TagInputProps {
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  colorClass?: 'indigo' | 'cyan' | 'amber' | 'rose' | 'fuchsia'
}

const colors = {
  indigo: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
  cyan: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400',
  amber: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
  rose: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400',
  fuchsia: 'bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400'
}

export function TagInput({
  value,
  onChange,
  placeholder,
  colorClass = 'indigo'
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      if (inputValue.trim() && !value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()])
        setInputValue('')
      }
    }
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, i) => (
            <span key={i} className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm", colors[colorClass])}>
              {tag}
              <button type="button" onClick={() => onChange(value.filter(t => t !== tag))} className="hover:opacity-70">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "+ Yeni ekle..."}
        className="input-glow bg-zinc-50 dark:bg-white/[0.02] border-dashed text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
      />
    </div>
  )
}
