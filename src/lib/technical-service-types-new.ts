// Technical Service Types (Yeni Yapı)
import type { ServiceType } from './service-provider-types'

export type ServiceStatus = 'active' | 'pending_renewal' | 'expired' | 'cancelled'
export type PaymentStatus = 'paid' | 'pending' | 'overdue'

export interface TechnicalService {
  id: string
  brand_id: string
  provider_id: string
  service_type: ServiceType
  identifier: string
  renewal_date: string | null
  discount_percent: number
  quantity: number
  status: ServiceStatus
  auto_renew: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface TechnicalServiceWithRelations extends TechnicalService {
  provider?: {
    id: string
    name: string
    base_price_usd: number
    billing_cycle: string
  }
  brand?: {
    id: string
    name: string
  }
}

export interface TechnicalServiceFormData {
  brand_id: string
  provider_id: string
  service_type: ServiceType
  identifier: string
  renewal_date?: string
  discount_percent?: number
  quantity?: number
  status?: ServiceStatus
  auto_renew?: boolean
  notes?: string
}

export interface RenewalHistory {
  id: string
  service_id: string
  renewed_at: string
  price_usd: number
  exchange_rate: number | null
  price_try: number | null
  payment_status: PaymentStatus
  invoice_no: string | null
  notes: string | null
  created_at: string
}

export interface RenewalHistoryFormData {
  service_id: string
  renewed_at?: string
  price_usd: number
  exchange_rate?: number
  price_try?: number
  payment_status?: PaymentStatus
  invoice_no?: string
  notes?: string
}

// Constants
export const SERVICE_STATUSES: { value: ServiceStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Aktif', color: 'emerald' },
  { value: 'pending_renewal', label: 'Yenileme Bekliyor', color: 'amber' },
  { value: 'expired', label: 'Süresi Doldu', color: 'rose' },
  { value: 'cancelled', label: 'İptal', color: 'zinc' }
]

export const PAYMENT_STATUSES: { value: PaymentStatus; label: string; color: string }[] = [
  { value: 'paid', label: 'Ödendi', color: 'emerald' },
  { value: 'pending', label: 'Bekliyor', color: 'amber' },
  { value: 'overdue', label: 'Gecikmiş', color: 'rose' }
]
