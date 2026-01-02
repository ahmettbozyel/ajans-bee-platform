'use client'

import { Bot, X } from 'lucide-react'

interface BeeBotButtonProps {
  isOpen: boolean
  onClick: () => void
  hasUnread?: boolean
}

export function BeeBotButton({ isOpen, onClick, hasUnread }: BeeBotButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-14 h-14 rounded-full flex items-center justify-center
        bg-gradient-to-r from-fuchsia-600 to-violet-600
        shadow-lg shadow-fuchsia-500/40 hover:shadow-fuchsia-500/60
        active:scale-95 transition-all duration-200"
      aria-label={isOpen ? 'Chatbot kapat' : 'Chatbot aç'}
    >
      <div className={`transition-transform duration-200 ${isOpen ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`}>
        <Bot className="w-6 h-6 text-white" />
      </div>
      <div className={`absolute transition-transform duration-200 ${isOpen ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`}>
        <X className="w-6 h-6 text-white" />
      </div>

      {/* Unread indicator */}
      {hasUnread && !isOpen && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-zinc-950 animate-pulse" />
      )}

      {/* Glow ring */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 hover:opacity-20 blur-xl transition-opacity" />
    </button>
  )
}
