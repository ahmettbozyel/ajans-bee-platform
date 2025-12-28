"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface OptionCardProps {
  type: "radio" | "checkbox"
  name: string
  value: string
  label: string
  icon?: string | React.ReactNode
  description?: string
  checked: boolean
  onChange: (value: string, checked: boolean) => void
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const OptionCard = React.forwardRef<HTMLLabelElement, OptionCardProps>(
  (
    {
      type,
      name,
      value,
      label,
      icon,
      description,
      checked,
      onChange,
      disabled = false,
      size = "md",
      className,
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "p-2",
      md: "p-3",
      lg: "p-4",
    }

    const iconSizeClasses = {
      sm: "text-base mb-0.5",
      md: "text-lg mb-1",
      lg: "text-xl mb-2",
    }

    const labelSizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    }

    const handleChange = () => {
      if (disabled) return
      if (type === "radio") {
        onChange(value, true)
      } else {
        onChange(value, !checked)
      }
    }

    return (
      <label
        ref={ref}
        className={cn(
          "relative cursor-pointer block",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <input
          type={type}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="peer sr-only"
        />
        <div
          className={cn(
            "rounded-xl border-2 text-center transition-all",
            sizeClasses[size],
            // Default state
            "border-zinc-200 dark:border-white/10",
            "hover:border-zinc-300 dark:hover:border-white/20",
            // Checked state
            "peer-checked:border-indigo-500",
            "peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10",
            // Focus state
            "peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2"
          )}
        >
          {/* Icon */}
          {icon && (
            <span className={cn("block", iconSizeClasses[size])}>
              {typeof icon === "string" ? icon : icon}
            </span>
          )}
          
          {/* Label */}
          <span
            className={cn(
              "font-medium text-zinc-900 dark:text-white",
              labelSizeClasses[size]
            )}
          >
            {label}
          </span>
          
          {/* Description */}
          {description && (
            <span className="block text-xs text-zinc-500 mt-0.5">
              {description}
            </span>
          )}
        </div>
      </label>
    )
  }
)
OptionCard.displayName = "OptionCard"

export { OptionCard }
