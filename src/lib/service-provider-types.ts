// Service Provider Types
export type ServiceType = 'hosting' | 'domain' | 'ssl' | 'email'
export type BillingCycle = 'monthly' | 'yearly'

export interface ServiceProvider {
  id: string
  name: string
  service_type: ServiceType
  base_price_usd: number
  billing_cycle: BillingCycle
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ServiceProviderFormData {
  name: string
  service_type: ServiceType
  base_price_usd: number
  billing_cycle: BillingCycle
  is_active: boolean
  notes?: string
}

// Constants
export const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
  { value: 'hosting', label: 'Hosting' },
  { value: 'domain', label: 'Domain' },
  { value: 'ssl', label: 'SSL' },
  { value: 'email', label: 'E-posta' }
]

export const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: 'monthly', label: 'Aylık' },
  { value: 'yearly', label: 'Yıllık' }
]

export const SERVICE_TYPE_COLORS: Record<ServiceType, { bg: string; text: string; border: string }> = {
  hosting: {
    bg: 'bg-cyan-100 dark:bg-cyan-500/10',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-500/20'
  },
  domain: {
    bg: 'bg-violet-100 dark:bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-500/20'
  },
  ssl: {
    bg: 'bg-emerald-100 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-500/20'
  },
  email: {
    bg: 'bg-amber-100 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-500/20'
  }
}
