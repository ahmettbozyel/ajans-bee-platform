'use client'

import { ListChecks, CheckCircle, CircleDot, Circle, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRef, useState, useEffect } from 'react'

// Progress Overview Grid - UI Kit HTML ile UYUMLU
// Horizontal scroll ile tüm bölümler görünür
interface ProgressOverviewProps {
  sections: { label: string; filled: number; total: number; id: string }[]
  onSectionClick: (sectionId: string) => void
}

export function ProgressOverview({ sections, onSectionClick }: ProgressOverviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 200
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
    setTimeout(checkScroll, 300)
  }

  return (
    <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-indigo-500" />
          Brief Bölümleri
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{sections.length} bölüm</span>
      </div>
      
      {/* Scrollable container with arrows */}
      <div className="relative">
        {/* Left scroll button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </button>
        )}
        
        {/* Right scroll button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </button>
        )}
        
        {/* Scrollable area */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sections.map((section, i) => {
            const isComplete = section.filled === section.total
            const percentage = section.total > 0 ? Math.round((section.filled / section.total) * 100) : 0
            
            // HTML ile UYUMLU renk mantığı
            let colorClass = 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
            let iconColorClass = 'text-amber-600 dark:text-amber-400'
            let textColorClass = 'text-amber-700 dark:text-amber-400'
            let Icon = Circle
            
            if (isComplete) {
              // EMERALD - Tamamlandı
              colorClass = 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
              iconColorClass = 'text-emerald-600 dark:text-emerald-400'
              textColorClass = 'text-emerald-700 dark:text-emerald-400'
              Icon = CheckCircle
            } else if (percentage >= 50) {
              // CYAN - %50+ ama tamamlanmamış
              colorClass = 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20'
              iconColorClass = 'text-cyan-600 dark:text-cyan-400'
              textColorClass = 'text-cyan-700 dark:text-cyan-400'
              Icon = CircleDot
            }
            // Default: AMBER - %50'den az
            
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSectionClick(section.id)}
                className={cn(
                  "text-center p-3 rounded-xl border cursor-pointer transition-all hover:scale-105 hover:shadow-md flex-shrink-0",
                  "w-[120px]", // Sabit genişlik
                  colorClass
                )}
              >
                <Icon className={cn("w-5 h-5 mx-auto mb-1", iconColorClass)} />
                <p className={cn("text-[10px] font-medium leading-tight", textColorClass)}>{section.label}</p>
                <p className={cn("text-[10px] font-mono", textColorClass.replace('700', '600').replace('400', '500'))}>
                  {section.filled}/{section.total}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
