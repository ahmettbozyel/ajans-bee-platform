"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

/**
 * Progress bar with color variants based on percentage
 * 0-30%: Rose | 31-70%: Amber | 71-99%: Cyan | 100%: Emerald
 */
function getProgressColor(value: number): string {
  if (value >= 100) return "progress-emerald"
  if (value >= 71) return "progress-cyan"
  if (value >= 31) return "progress-amber"
  return "progress-rose"
}

function getProgressTextColor(value: number): string {
  if (value >= 100) return "text-emerald-600 dark:text-emerald-400"
  if (value >= 71) return "text-cyan-600 dark:text-cyan-400"
  if (value >= 31) return "text-amber-600 dark:text-amber-400"
  return "text-rose-600 dark:text-rose-400"
}

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, showLabel = false, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-zinc-500">Tamamlanma</span>
          <span className={cn("text-xs font-mono font-semibold", getProgressTextColor(value))}>
            %{Math.round(value)}
          </span>
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 rounded-full transition-all duration-500 ease-out",
            getProgressColor(value)
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress, getProgressColor, getProgressTextColor }
