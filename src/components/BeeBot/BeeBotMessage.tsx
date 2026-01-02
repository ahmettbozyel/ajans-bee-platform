'use client'

import { Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

interface BeeBotMessageProps {
  content: string
  isBot: boolean
  timestamp?: Date
}

// Custom markdown components styled for UI Kit
const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 rounded-md bg-white/10 text-fuchsia-400 text-xs font-mono">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-2 p-3 rounded-xl bg-white/5 border border-white/10 overflow-x-auto">
      {children}
    </pre>
  ),
  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
  li: ({ children }) => <li className="text-zinc-300">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-fuchsia-500/50 pl-3 my-2 text-zinc-400 italic">
      {children}
    </blockquote>
  ),
  h1: ({ children }) => <h1 className="text-lg font-bold text-white mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-bold text-white mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-bold text-white mb-1">{children}</h3>,
}

export function BeeBotMessage({ content, isBot, timestamp }: BeeBotMessageProps) {
  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/25">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${isBot ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isBot
              ? 'bg-white/5 border border-white/10 text-zinc-200'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
          }`}
          style={isBot ? { borderTopLeftRadius: '4px' } : { borderTopRightRadius: '4px' }}
        >
          {isBot ? (
            <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
          ) : (
            content
          )}
        </div>
        {timestamp && (
          <p className={`text-[10px] text-zinc-600 mt-1 ${isBot ? 'text-left' : 'text-right'}`}>
            {timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 order-2">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  )
}
