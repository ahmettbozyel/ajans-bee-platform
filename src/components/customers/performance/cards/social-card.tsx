'use client'

import { cn } from '@/lib/utils'

interface SocialPlatformCardProps {
  platform: string
  icon: React.ReactNode
  gradient: string
  followers: string
  views: string
  engagement: string
  shares: number
}

export function SocialPlatformCard({
  platform, icon, gradient, followers, views, engagement, shares
}: SocialPlatformCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 card-hover">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", gradient)}>
          {icon}
        </div>
        <div>
          <p className="font-semibold text-zinc-900 dark:text-white">{platform}</p>
          <p className="text-xs text-zinc-500">{followers} takipçi</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-xs text-zinc-500">Görüntülenme</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{views}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Etkileşim</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{engagement}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Paylaşım</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{shares}</p>
        </div>
      </div>
    </div>
  )
}
