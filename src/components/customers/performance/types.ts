// Performance Tab Types
// Bu dosya customer-performance-tab.tsx'den refactor edildi

import type { Customer } from '@/lib/customer-types'

// ==================== PROPS INTERFACES ====================

export interface CustomerPerformanceTabProps {
  customer: Customer
  onUpdate?: () => void
}

export interface AyarlarTabProps {
  customer: Customer
  onUpdate?: () => void
}

export interface PlatformCardProps {
  platform: string
  subtitle: string
  icon: React.ReactNode
  iconLetter: string
  gradient: string
  spend: string
  spendTrend?: number
  reach: string
  reachTrend?: number
  clicks: string
  cpc?: string
  ctr?: string
  ctrTrend?: number
  leads?: string
  dataSource: 'api' | 'manual'
  lastUpdate: string
}

export interface SocialPlatformCardProps {
  platform: string
  icon: React.ReactNode
  gradient: string
  followers: string
  views: number
  engagement: number
  shares: number
}

export interface SummaryCardProps {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  value: string
  label: string
  subValue?: string
  trend?: { value: number; direction: 'up' | 'down' }
  glowColor: string
  small?: boolean
}

export interface CampaignRowProps {
  name: string
  reach: string
  clicks: string
  spend: string
  cpc: string
  change: number
  performance: 'best' | 'good' | 'average' | 'low'
}

export interface TrafficRowProps {
  source: string
  sessions: number
  share: number
  bounceRate: number
  quality: 'high' | 'medium' | 'low'
}

export interface ConversionCardProps {
  label: string
  value: number
  change: number
}

export interface ModalProps {
  onClose: () => void
}

// ==================== TYPE ALIASES ====================

export type PerformanceTab = 'reklamlar' | 'sosyal-medya' | 'web-analytics' | 'ayarlar'

export type SaveMessageType = {
  type: 'success' | 'error'
  text: string
} | null

export type AutoSyncFrequency = 'disabled' | 'daily' | 'weekly'
