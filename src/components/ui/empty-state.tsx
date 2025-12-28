"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon | string
  title?: string
  message: string
  action?: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

/**
 * Empty State Component - Karar #18
 * Float animation + emoji destekli
 * 
 * @example
 * <EmptyState 
 *   icon={FileText}
 *   message="Henüz içerik üretilmedi. Hemen başla! ✨"
 * />
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, message, action, className, size = "md" }, ref) => {
    const sizeClasses = {
      sm: {
        container: "py-8 px-4",
        icon: "text-3xl mb-2",
        iconComponent: "h-8 w-8 mb-2",
        title: "text-base",
        message: "text-sm"
      },
      md: {
        container: "py-12 px-6",
        icon: "text-5xl mb-3",
        iconComponent: "h-12 w-12 mb-3",
        title: "text-lg",
        message: "text-base"
      },
      lg: {
        container: "py-16 px-8",
        icon: "text-6xl mb-4",
        iconComponent: "h-16 w-16 mb-4",
        title: "text-xl",
        message: "text-lg"
      }
    }

    const IconComponent = typeof icon === "function" ? icon : null
    const iconEmoji = typeof icon === "string" ? icon : null

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center",
          "rounded-2xl border border-dashed",
          "border-zinc-200 dark:border-white/10",
          "bg-zinc-50/50 dark:bg-white/[0.02]",
          sizeClasses[size].container,
          className
        )}
      >
        {/* Icon with float animation */}
        {(IconComponent || iconEmoji) && (
          <div className="float-animation">
            {IconComponent ? (
              <IconComponent 
                className={cn(
                  "text-zinc-300 dark:text-zinc-600",
                  sizeClasses[size].iconComponent
                )} 
              />
            ) : (
              <span className={cn("block", sizeClasses[size].icon)}>
                {iconEmoji}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        {title && (
          <h3 className={cn(
            "font-semibold text-zinc-700 dark:text-zinc-300 mb-1",
            sizeClasses[size].title
          )}>
            {title}
          </h3>
        )}

        {/* Message */}
        <p className={cn(
          "text-zinc-500 dark:text-zinc-400 max-w-sm",
          sizeClasses[size].message
        )}>
          {message}
        </p>

        {/* Action Button */}
        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
