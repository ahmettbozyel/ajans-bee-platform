'use client'

import { Instagram, Facebook, Linkedin, Youtube, Twitter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { SocialMediaData } from '@/lib/customer-types'

interface SocialMediaInputProps {
  value: SocialMediaData
  onChange: (v: SocialMediaData) => void
}

const platforms = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, prefix: '@' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, prefix: '/' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, prefix: '/' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, prefix: '@' },
  { key: 'twitter', label: 'Twitter/X', icon: Twitter, prefix: '@' }
] as const

export function SocialMediaInput({ value, onChange }: SocialMediaInputProps) {
  return (
    <div className="space-y-3">
      {platforms.map(({ key, label, icon: Icon, prefix }) => (
        <div key={key} className="flex items-center gap-3">
          <div className="flex items-center gap-2 w-28 text-zinc-500 dark:text-zinc-400">
            <Icon className="h-4 w-4" />
            <span className="text-sm">{label}</span>
          </div>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 text-sm font-medium">{prefix}</span>
            <Input
              value={value[key]?.handle || ''}
              onChange={(e) => onChange({ ...value, [key]: { ...value[key], handle: e.target.value } })}
              placeholder="kullanici_adi"
              className="input-glow pl-8 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
