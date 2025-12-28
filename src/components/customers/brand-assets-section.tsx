// @ts-nocheck
'use client'

import { useState } from 'react'
import { Palette, Type, Plus, X, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BrandColors, BrandFonts } from '@/lib/customer-types'

interface BrandAssetsSectionProps {
  colors: BrandColors
  fonts: BrandFonts
  onChange: (colors: BrandColors, fonts: BrandFonts) => void
  defaultExpanded?: boolean
}

// Color input with preview
function ColorInput({ 
  label, 
  value, 
  onChange,
  placeholder = '#000000'
}: { 
  label: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-zinc-600 dark:text-zinc-400">{label}</Label>
      <div className="flex gap-2">
        <div 
          className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-white/10 flex-shrink-0"
          style={{ backgroundColor: value || '#e5e5e5' }}
        />
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-mono text-sm h-10"
        />
      </div>
    </div>
  )
}

// Extra colors list
function ExtraColorsList({
  colors,
  onChange
}: {
  colors: string[]
  onChange: (colors: string[]) => void
}) {
  const [newColor, setNewColor] = useState('')

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      onChange([...colors, newColor])
      setNewColor('')
    }
  }

  const removeColor = (index: number) => {
    onChange(colors.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs text-zinc-600 dark:text-zinc-400">Ek Renkler</Label>
      
      {/* Existing colors */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {colors.map((color, index) => (
            <div 
              key={index}
              className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10"
            >
              <div 
                className="w-5 h-5 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300">{color}</span>
              <button
                type="button"
                onClick={() => removeColor(index)}
                className="text-zinc-400 hover:text-rose-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Add new */}
      <div className="flex gap-2">
        <div 
          className="w-9 h-9 rounded-lg border border-dashed border-zinc-300 dark:border-white/10 flex-shrink-0"
          style={{ backgroundColor: newColor || 'transparent' }}
        />
        <Input
          type="text"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          placeholder="#FF5733"
          className="font-mono text-sm h-9"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addColor}
          className="h-9 px-3"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export function BrandAssetsSection({ 
  colors, 
  fonts, 
  onChange,
  defaultExpanded = false 
}: BrandAssetsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const updateColor = (key: keyof BrandColors, value: string) => {
    if (key === 'extra') return // handled separately
    onChange({ ...colors, [key]: value || undefined }, fonts)
  }

  const updateExtraColors = (extraColors: string[]) => {
    onChange({ ...colors, extra: extraColors.length > 0 ? extraColors : undefined }, fonts)
  }

  const updateFont = (
    category: 'corporate' | 'web', 
    key: string, 
    value: string
  ) => {
    const newFonts = { ...fonts }
    if (!newFonts[category]) newFonts[category] = {}
    newFonts[category]![key as keyof typeof newFonts[typeof category]] = value || undefined
    
    // Clean empty objects
    if (newFonts[category] && Object.values(newFonts[category]!).every(v => !v)) {
      delete newFonts[category]
    }
    
    onChange(colors, newFonts)
  }

  // Calculate completion
  const filledColors = [colors.primary, colors.secondary, colors.accent].filter(Boolean).length
  const filledFonts = [fonts.corporate?.heading, fonts.web?.heading].filter(Boolean).length
  const totalFilled = filledColors + filledFonts
  const isComplete = totalFilled >= 3

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden transition-all",
      "bg-white dark:bg-zinc-900/50",
      "border-zinc-200 dark:border-white/10",
      isExpanded && "shadow-sm"
    )}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-pink-100 to-violet-100 dark:from-pink-500/10 dark:to-violet-500/10">
            <Palette className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-white">Marka Renkleri & Fontlar</h3>
            <p className="text-xs text-zinc-500">Kurumsal renkler ve tipografi</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-xs px-2.5 py-1 rounded-full font-medium",
            isComplete
              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
          )}>
            {isComplete ? 'Tamamlandı' : `${totalFilled}/3 alan`}
          </span>
          <ChevronDown className={cn(
            "w-5 h-5 text-zinc-400 transition-transform",
            isExpanded && "rotate-180"
          )} />
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-zinc-200 dark:border-white/5">
          <div className="pt-5 space-y-6">
            
            {/* Colors Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-pink-500" />
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Renkler</h4>
              </div>
              
              {/* Main colors grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <ColorInput
                  label="Ana Renk (Primary)"
                  value={colors.primary}
                  onChange={(v) => updateColor('primary', v)}
                  placeholder="#6366F1"
                />
                <ColorInput
                  label="İkincil Renk (Secondary)"
                  value={colors.secondary}
                  onChange={(v) => updateColor('secondary', v)}
                  placeholder="#8B5CF6"
                />
                <ColorInput
                  label="Vurgu Rengi (Accent)"
                  value={colors.accent}
                  onChange={(v) => updateColor('accent', v)}
                  placeholder="#22D3EE"
                />
              </div>
              
              {/* Tone colors */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <ColorInput
                  label="Açık Ton"
                  value={colors.light}
                  onChange={(v) => updateColor('light', v)}
                  placeholder="#F8FAFC"
                />
                <ColorInput
                  label="Koyu Ton"
                  value={colors.dark}
                  onChange={(v) => updateColor('dark', v)}
                  placeholder="#0F172A"
                />
                <ColorInput
                  label="Nötr"
                  value={colors.neutral}
                  onChange={(v) => updateColor('neutral', v)}
                  placeholder="#64748B"
                />
              </div>
              
              {/* Extra colors */}
              <ExtraColorsList
                colors={colors.extra || []}
                onChange={updateExtraColors}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200 dark:border-white/5" />

            {/* Fonts Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Type className="w-4 h-4 text-violet-500" />
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Fontlar</h4>
              </div>
              
              {/* Corporate fonts */}
              <div className="mb-4">
                <p className="text-xs text-zinc-500 mb-3">Kurumsal (Baskı, Logo)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-600 dark:text-zinc-400">Başlık Fontu</Label>
                    <Input
                      type="text"
                      value={fonts.corporate?.heading || ''}
                      onChange={(e) => updateFont('corporate', 'heading', e.target.value)}
                      placeholder="Montserrat"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-600 dark:text-zinc-400">Gövde Fontu</Label>
                    <Input
                      type="text"
                      value={fonts.corporate?.body || ''}
                      onChange={(e) => updateFont('corporate', 'body', e.target.value)}
                      placeholder="Open Sans"
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
              
              {/* Web fonts */}
              <div>
                <p className="text-xs text-zinc-500 mb-3">Web (Site, Sosyal Medya)</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-600 dark:text-zinc-400">Başlık</Label>
                    <Input
                      type="text"
                      value={fonts.web?.heading || ''}
                      onChange={(e) => updateFont('web', 'heading', e.target.value)}
                      placeholder="Inter"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-600 dark:text-zinc-400">Gövde</Label>
                    <Input
                      type="text"
                      value={fonts.web?.body || ''}
                      onChange={(e) => updateFont('web', 'body', e.target.value)}
                      placeholder="Inter"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-zinc-600 dark:text-zinc-400">Yedek (Fallback)</Label>
                    <Input
                      type="text"
                      value={fonts.web?.fallback || ''}
                      onChange={(e) => updateFont('web', 'fallback', e.target.value)}
                      placeholder="system-ui, sans-serif"
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
