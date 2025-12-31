import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type GlowColor = "indigo" | "violet" | "cyan" | "emerald" | "amber" | "rose" | "fuchsia"

interface StatCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  glow?: GlowColor
  onClick?: () => void
  className?: string
  badge?: string
}

const iconBoxColors: Record<GlowColor, string> = {
  indigo: "icon-box-indigo",
  violet: "icon-box-violet",
  cyan: "icon-box-cyan",
  emerald: "icon-box-emerald",
  amber: "icon-box-amber",
  rose: "icon-box-rose",
  fuchsia: "icon-box-fuchsia",
}

const glowColors: Record<GlowColor, string> = {
  indigo: "glow-indigo",
  violet: "glow-violet",
  cyan: "glow-cyan",
  emerald: "glow-emerald",
  amber: "glow-amber",
  rose: "glow-rose",
  fuchsia: "glow-fuchsia",
}

export function StatCard({
  icon: Icon,
  value,
  label,
  glow = "indigo",
  onClick,
  className,
  badge,
}: StatCardProps) {
  return (
    <div 
      className={cn(
        "glass-card rounded-2xl p-5 card-hover",
        glowColors[glow],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("icon-box mb-4", iconBoxColors[glow])}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex items-center gap-2">
        <p className="text-3xl font-bold text-white">{value}</p>
        {badge && (
          <span className="text-[11px] bg-fuchsia-500/20 text-fuchsia-400 px-2 py-0.5 rounded-full font-mono border border-fuchsia-500/20">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-500 mt-1">{label}</p>
    </div>
  )
}
