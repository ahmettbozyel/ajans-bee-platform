"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  value: number
  size?: "sm" | "md" | "lg"
  strokeWidth?: number
  showLabel?: boolean
  className?: string
}

/**
 * Circular Progress Ring - Karar #18
 * 0-30%: Rose | 31-70%: Amber | 71-99%: Cyan | 100%: Emerald
 */
const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  ({ value = 0, size = "md", strokeWidth, showLabel = true, className }, ref) => {
    const sizeConfig = {
      sm: { dimension: 48, stroke: 4, fontSize: "text-xs" },
      md: { dimension: 64, stroke: 5, fontSize: "text-sm" },
      lg: { dimension: 96, stroke: 6, fontSize: "text-lg" }
    }

    const config = sizeConfig[size]
    const finalStrokeWidth = strokeWidth || config.stroke
    const radius = (config.dimension - finalStrokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (value / 100) * circumference

    // Color based on percentage
    const getColor = () => {
      if (value >= 100) return { stroke: "stroke-emerald-500", text: "text-emerald-500" }
      if (value >= 71) return { stroke: "stroke-cyan-500", text: "text-cyan-500" }
      if (value >= 31) return { stroke: "stroke-amber-500", text: "text-amber-500" }
      return { stroke: "stroke-rose-500", text: "text-rose-500" }
    }

    const colors = getColor()

    return (
      <div 
        ref={ref} 
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: config.dimension, height: config.dimension }}
      >
        <svg
          className="-rotate-90"
          width={config.dimension}
          height={config.dimension}
        >
          {/* Background circle */}
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={finalStrokeWidth}
            className="text-zinc-200 dark:text-white/10"
          />
          {/* Progress circle */}
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            strokeWidth={finalStrokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(colors.stroke, "transition-all duration-500 ease-out")}
          />
        </svg>
        
        {/* Center label */}
        {showLabel && (
          <span className={cn(
            "absolute font-mono font-bold",
            config.fontSize,
            colors.text
          )}>
            {Math.round(value)}%
          </span>
        )}
      </div>
    )
  }
)
ProgressRing.displayName = "ProgressRing"

export { ProgressRing }
