import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("glass-card rounded-2xl p-12 text-center border border-white/10", className)}>
      <div className="icon-box icon-box-default w-16 h-16 flex items-center justify-center mx-auto mb-4 animate-float">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-zinc-500 mb-6">{description}</p>
      )}
      {action && (
        <Button 
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
