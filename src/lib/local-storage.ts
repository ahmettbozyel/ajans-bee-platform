// Local storage utilities for recent customers

export interface RecentCustomer {
  id: string
  name: string
  sector: string
  lastUsed: number
}

const STORAGE_KEY = 'recent_customers'
const LAST_CUSTOMER_KEY = 'last_customer_id'
const MAX_RECENT = 5

export function getRecentCustomers(): RecentCustomer[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function addToRecentCustomers(customer: Omit<RecentCustomer, 'lastUsed'>): void {
  if (typeof window === 'undefined') return
  
  try {
    const recent = getRecentCustomers()
    
    // Remove if already exists
    const filtered = recent.filter(c => c.id !== customer.id)
    
    // Add to beginning with timestamp
    const updated: RecentCustomer[] = [
      { ...customer, lastUsed: Date.now() },
      ...filtered
    ].slice(0, MAX_RECENT)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    
    // Also save as last used customer
    localStorage.setItem(LAST_CUSTOMER_KEY, customer.id)
  } catch {
    // Ignore storage errors
  }
}

export function removeFromRecentCustomers(customerId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const recent = getRecentCustomers()
    const filtered = recent.filter(c => c.id !== customerId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch {
    // Ignore storage errors
  }
}

export function clearRecentCustomers(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(LAST_CUSTOMER_KEY)
  } catch {
    // Ignore storage errors
  }
}

export function getLastCustomerId(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    // First try the dedicated last customer key
    const lastId = localStorage.getItem(LAST_CUSTOMER_KEY)
    if (lastId) return lastId
    
    // Fallback: get from recent customers (most recent one)
    const recent = getRecentCustomers()
    if (recent.length > 0) {
      return recent[0].id
    }
    
    return null
  } catch {
    return null
  }
}

export function setLastCustomerId(customerId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(LAST_CUSTOMER_KEY, customerId)
  } catch {
    // Ignore storage errors
  }
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'Az önce'
  if (minutes < 60) return `${minutes} dk önce`
  if (hours < 24) return `${hours} saat önce`
  if (days < 7) return `${days} gün önce`
  
  return new Date(timestamp).toLocaleDateString('tr-TR')
}
