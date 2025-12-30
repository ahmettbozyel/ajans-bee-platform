// @ts-nocheck
import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface MetaAdsData {
  id: string
  customer_id: string
  platform: string
  ad_account_id: string
  period_start: string
  period_end: string
  spend: number
  currency: string
  impressions: number
  reach: number
  clicks: number
  cpc: number
  ctr: number
  conversions: number
  leads: number
  cpl: number
  data_source: string
  updated_at: string
}

interface MetaSocialData {
  id: string
  customer_id: string
  platform: string
  period_start: string
  period_end: string
  impressions: number
  reach: number
  engagements: number
  followers: number
  profile_visits: number
  data_source: string
  updated_at: string
}

interface SocialConnection {
  id: string
  platform: string
  platform_account_id: string
  platform_account_name: string
  is_active: boolean
}

interface UseMetaPerformanceReturn {
  // Data
  adsData: MetaAdsData | null
  socialData: MetaSocialData[]
  connections: SocialConnection[]
  
  // State
  isLoading: boolean
  isFetching: boolean
  error: string | null
  lastFetched: Date | null
  
  // Actions
  fetchFromAPI: () => Promise<void>
  loadFromDB: () => Promise<void>
  
  // Helpers
  formatNumber: (num: number) => string
  formatCurrency: (num: number, currency?: string) => string
}

export function useMetaPerformance(customerId: string): UseMetaPerformanceReturn {
  const [adsData, setAdsData] = useState<MetaAdsData | null>(null)
  const [socialData, setSocialData] = useState<MetaSocialData[]>([])
  const [connections, setConnections] = useState<SocialConnection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const supabase = createClient()

  // Load existing data from DB
  const loadFromDB = useCallback(async () => {
    if (!customerId) return
    
    setIsLoading(true)
    setError(null)

    try {
      // Load connections
      const { data: connectionsData } = await supabase
        .from('social_connections')
        .select('*')
        .eq('customer_id', customerId)
        .eq('is_active', true)

      if (connectionsData) {
        setConnections(connectionsData)
      }

      // Load ads data
      const { data: ads } = await supabase
        .from('performance_ads')
        .select('*')
        .eq('customer_id', customerId)
        .order('period_end', { ascending: false })
        .limit(1)
        .single()

      if (ads) {
        setAdsData(ads)
        setLastFetched(new Date(ads.updated_at))
      }

      // Load social data
      const { data: social } = await supabase
        .from('performance_social')
        .select('*')
        .eq('customer_id', customerId)
        .order('period_end', { ascending: false })

      if (social) {
        setSocialData(social)
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [customerId, supabase])

  // Fetch fresh data from Meta API via n8n
  const fetchFromAPI = useCallback(async () => {
    if (!customerId) return

    setIsFetching(true)
    setError(null)

    try {
      // Get connection IDs from state
      const metaAdsConnection = connections.find(c => c.platform === 'meta_ads')
      const fbConnection = connections.find(c => c.platform === 'facebook')
      const igConnection = connections.find(c => c.platform === 'instagram')

      if (!metaAdsConnection && !fbConnection && !igConnection) {
        setError('Bu müşteri için Meta bağlantısı bulunamadı')
        return
      }

      // Call our API
      const response = await fetch('/api/performance/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          ad_account_id: metaAdsConnection?.platform_account_id,
          fb_page_id: fbConnection?.platform_account_id,
          ig_account_id: igConnection?.platform_account_id,
          date_preset: 'last_30d'
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'API hatası')
      }

      // Update local state with new data
      if (result.data?.ads) {
        setAdsData(result.data.ads)
      }

      if (result.data?.facebook || result.data?.instagram) {
        const newSocial = []
        if (result.data.facebook) newSocial.push(result.data.facebook)
        if (result.data.instagram) newSocial.push(result.data.instagram)
        setSocialData(prev => [...newSocial, ...prev.filter(s => 
          !newSocial.find(n => n.platform === s.platform)
        )])
      }

      setLastFetched(new Date())

      // Show partial errors if any
      if (result.data?.errors?.length > 0) {
        console.warn('Partial errors:', result.data.errors)
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsFetching(false)
    }
  }, [customerId, connections])

  // Helpers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString('tr-TR')
  }

  const formatCurrency = (num: number, currency = 'EUR'): string => {
    const symbol = currency === 'EUR' ? '€' : currency === 'TRY' ? '₺' : '$'
    return `${symbol}${num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return {
    adsData,
    socialData,
    connections,
    isLoading,
    isFetching,
    error,
    lastFetched,
    fetchFromAPI,
    loadFromDB,
    formatNumber,
    formatCurrency
  }
}
