'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, RefreshCw, Trash2, X, HelpCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ConfirmVariant = 'danger' | 'warning' | 'info' | 'renew'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  isLoading?: boolean
}

const variantStyles: Record<ConfirmVariant, {
  icon: typeof AlertTriangle
  iconClass: string
  iconBoxClass: string
  buttonClass: string
}> = {
  danger: {
    icon: Trash2,
    iconClass: 'text-rose-400',
    iconBoxClass: 'icon-box-rose',
    buttonClass: 'bg-rose-500 hover:bg-rose-600 text-white'
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-400',
    iconBoxClass: 'icon-box-amber',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 text-white'
  },
  info: {
    icon: HelpCircle,
    iconClass: 'text-indigo-400',
    iconBoxClass: 'icon-box-indigo',
    buttonClass: 'bg-indigo-500 hover:bg-indigo-600 text-white'
  },
  renew: {
    icon: RefreshCw,
    iconClass: 'text-emerald-400',
    iconBoxClass: 'icon-box-emerald',
    buttonClass: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25'
  }
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  variant = 'info',
  isLoading = false
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const styles = variantStyles[variant]
  const Icon = styles.icon

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, isLoading])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md rounded-2xl border border-white/10 shadow-2xl"
        style={{ 
          backgroundColor: '#18181b',
          animation: 'scaleIn 0.2s ease-out'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className={cn("icon-box w-14 h-14 mx-auto mb-4", styles.iconBoxClass)}>
            <Icon className={cn("w-7 h-7", styles.iconClass)} />
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-white text-center mb-2">
            {title}
          </h2>

          {/* Description */}
          <p className="text-sm text-zinc-400 text-center mb-6 leading-relaxed">
            {description}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                styles.buttonClass
              )}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  {variant === 'renew' ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
