// localStorage keys
const RECENT_CUSTOMERS_KEY = 'ajans-bee-recent-customers'
const LAST_CUSTOMER_KEY = 'ajans-bee-last-customer'

export interface RecentCustomer {
  id: string
  name: string
  sector: string
  lastUsed: string // ISO date string
}

// Get recent customers (max 5)
export function getRecentCustomers(): RecentCustomer[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(RECENT_CUSTOMERS_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch {
    return []
  }
}

// Add customer to recent list
export function addToRecentCustomers(customer: { id: string; name: string; sector: string }) {
  if (typeof window === 'undefined') return
  
  try {
    const recent = getRecentCustomers()
    
    // Remove if already exists
    const filtered = recent.filter(c => c.id !== customer.id)
    
    // Add to beginning with current timestamp
    const updated: RecentCustomer[] = [
      {
        id: customer.id,
        name: customer.name,
        sector: customer.sector,
        lastUsed: new Date().toISOString()
      },
      ...filtered
    ].slice(0, 5) // Keep only 5
    
    localStorage.setItem(RECENT_CUSTOMERS_KEY, JSON.stringify(updated))
    localStorage.setItem(LAST_CUSTOMER_KEY, customer.id)
  } catch (error) {
    console.error('Failed to save recent customer:', error)
  }
}

// Get last used customer ID
export function getLastCustomerId(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    return localStorage.getItem(LAST_CUSTOMER_KEY)
  } catch {
    return null
  }
}

// Format relative time (e.g., "3 gün önce")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  if (diffMinutes < 1) return 'Az önce'
  if (diffMinutes < 60) return `${diffMinutes} dk önce`
  if (diffHours < 24) return `${diffHours} saat önce`
  if (diffDays === 1) return 'Dün'
  if (diffDays < 7) return `${diffDays} gün önce`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
  return `${Math.floor(diffDays / 30)} ay önce`
}
