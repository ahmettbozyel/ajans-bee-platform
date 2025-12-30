// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin client - RLS bypass
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const N8N_WEBHOOK_URL = 'https://n8n.beeswebsite.com/webhook/meta-performance'

interface MetaAdsResponse {
  data: Array<{
    spend: string
    impressions: string
    clicks: string
    reach: string
    date_start: string
    date_stop: string
  }>
}

interface MetaInsightsResponse {
  data: Array<{
    name: string
    period: string
    values: Array<{
      value: number
      end_time: string
    }>
    title: string
    id: string
  }>
}

// POST - Fetch Meta data and save to DB
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      customer_id, 
      ad_account_id,
      fb_page_id,
      ig_account_id,
      date_preset = 'last_30d',
      fetch_type = 'all' // 'ads', 'social', 'all'
    } = body

    if (!customer_id) {
      return NextResponse.json({ error: 'customer_id is required' }, { status: 400 })
    }

    const results: {
      ads?: any
      facebook?: any
      instagram?: any
      errors: string[]
    } = { errors: [] }

    // 1. Fetch Meta Ads Data
    if ((fetch_type === 'all' || fetch_type === 'ads') && ad_account_id) {
      try {
        const adsEndpoint = `${ad_account_id}/insights?fields=spend,impressions,clicks,reach&date_preset=${date_preset}`
        
        const adsResponse = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: adsEndpoint })
        })

        if (adsResponse.ok) {
          const adsData: MetaAdsResponse = await adsResponse.json()
          
          if (adsData.data && adsData.data.length > 0) {
            const adMetrics = adsData.data[0]
            
            // Calculate CPC and CTR
            const spend = parseFloat(adMetrics.spend) || 0
            const clicks = parseInt(adMetrics.clicks) || 0
            const impressions = parseInt(adMetrics.impressions) || 0
            const cpc = clicks > 0 ? spend / clicks : 0
            const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0

            // Save to performance_ads
            const { data: savedAds, error: adsError } = await supabaseAdmin
              .from('performance_ads')
              .upsert({
                customer_id,
                platform: 'meta',
                ad_account_id: ad_account_id.replace('act_', ''),
                period_start: adMetrics.date_start,
                period_end: adMetrics.date_stop,
                period_type: 'monthly',
                spend,
                currency: 'EUR',
                impressions,
                reach: parseInt(adMetrics.reach) || 0,
                clicks,
                cpc: parseFloat(cpc.toFixed(2)),
                ctr: parseFloat(ctr.toFixed(2)),
                data_source: 'api',
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'customer_id,platform,period_start,period_end'
              })
              .select()
              .single()

            if (adsError) {
              results.errors.push(`Ads save error: ${adsError.message}`)
            } else {
              results.ads = savedAds
            }
          }
        } else {
          results.errors.push(`Ads fetch failed: ${adsResponse.statusText}`)
        }
      } catch (err: any) {
        results.errors.push(`Ads error: ${err.message}`)
      }
    }

    // 2. Fetch Facebook Page Insights
    if ((fetch_type === 'all' || fetch_type === 'social') && fb_page_id) {
      try {
        const fbEndpoint = `${fb_page_id}/insights?metric=page_impressions,page_engaged_users,page_fans,page_views_total&period=month`
        
        const fbResponse = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: fbEndpoint })
        })

        if (fbResponse.ok) {
          const fbData: MetaInsightsResponse = await fbResponse.json()
          
          if (fbData.data && fbData.data.length > 0) {
            // Parse metrics
            const metrics: Record<string, number> = {}
            fbData.data.forEach((metric) => {
              if (metric.values && metric.values.length > 0) {
                metrics[metric.name] = metric.values[0].value
              }
            })

            // Get date range (last 30 days)
            const endDate = new Date()
            const startDate = new Date()
            startDate.setDate(startDate.getDate() - 30)

            // Save to performance_social
            const { data: savedFb, error: fbError } = await supabaseAdmin
              .from('performance_social')
              .upsert({
                customer_id,
                platform: 'facebook',
                period_start: startDate.toISOString().split('T')[0],
                period_end: endDate.toISOString().split('T')[0],
                period_type: 'monthly',
                impressions: metrics.page_impressions || 0,
                engagements: metrics.page_engaged_users || 0,
                followers: metrics.page_fans || 0,
                profile_visits: metrics.page_views_total || 0,
                data_source: 'api',
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'customer_id,platform,period_start,period_end'
              })
              .select()
              .single()

            if (fbError) {
              results.errors.push(`Facebook save error: ${fbError.message}`)
            } else {
              results.facebook = savedFb
            }
          }
        } else {
          results.errors.push(`Facebook fetch failed: ${fbResponse.statusText}`)
        }
      } catch (err: any) {
        results.errors.push(`Facebook error: ${err.message}`)
      }
    }

    // 3. Fetch Instagram Insights
    if ((fetch_type === 'all' || fetch_type === 'social') && ig_account_id) {
      try {
        const igEndpoint = `${ig_account_id}/insights?metric=impressions,reach,follower_count,profile_views&period=day&metric_type=total_value`
        
        const igResponse = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: igEndpoint })
        })

        if (igResponse.ok) {
          const igData: MetaInsightsResponse = await igResponse.json()
          
          if (igData.data && igData.data.length > 0) {
            // Parse metrics
            const metrics: Record<string, number> = {}
            igData.data.forEach((metric) => {
              if (metric.values && metric.values.length > 0) {
                metrics[metric.name] = metric.values[0].value
              }
            })

            // Get date range
            const endDate = new Date()
            const startDate = new Date()
            startDate.setDate(startDate.getDate() - 30)

            // Save to performance_social
            const { data: savedIg, error: igError } = await supabaseAdmin
              .from('performance_social')
              .upsert({
                customer_id,
                platform: 'instagram',
                period_start: startDate.toISOString().split('T')[0],
                period_end: endDate.toISOString().split('T')[0],
                period_type: 'monthly',
                impressions: metrics.impressions || 0,
                reach: metrics.reach || 0,
                followers: metrics.follower_count || 0,
                profile_visits: metrics.profile_views || 0,
                data_source: 'api',
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'customer_id,platform,period_start,period_end'
              })
              .select()
              .single()

            if (igError) {
              results.errors.push(`Instagram save error: ${igError.message}`)
            } else {
              results.instagram = savedIg
            }
          }
        } else {
          results.errors.push(`Instagram fetch failed: ${igResponse.statusText}`)
        }
      } catch (err: any) {
        results.errors.push(`Instagram error: ${err.message}`)
      }
    }

    // Return results
    const hasData = results.ads || results.facebook || results.instagram
    
    return NextResponse.json({
      success: hasData,
      message: hasData 
        ? `Data fetched successfully${results.errors.length > 0 ? ' with some errors' : ''}`
        : 'No data fetched',
      data: results,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Meta Performance API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// GET - Fetch saved performance data from DB
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customer_id = searchParams.get('customer_id')
    const platform = searchParams.get('platform') // 'meta', 'facebook', 'instagram', 'all'
    const period = searchParams.get('period') // 'last_30d', 'last_month', etc.

    if (!customer_id) {
      return NextResponse.json({ error: 'customer_id is required' }, { status: 400 })
    }

    const results: {
      ads?: any[]
      social?: any[]
      campaigns?: any[]
    } = {}

    // Fetch ads data
    if (!platform || platform === 'meta' || platform === 'all') {
      const { data: adsData, error: adsError } = await supabaseAdmin
        .from('performance_ads')
        .select('*')
        .eq('customer_id', customer_id)
        .order('period_end', { ascending: false })
        .limit(12)

      if (!adsError) {
        results.ads = adsData
      }
    }

    // Fetch social data
    if (!platform || platform === 'facebook' || platform === 'instagram' || platform === 'all') {
      let query = supabaseAdmin
        .from('performance_social')
        .select('*')
        .eq('customer_id', customer_id)
        .order('period_end', { ascending: false })
        .limit(12)

      if (platform && platform !== 'all') {
        query = query.eq('platform', platform)
      }

      const { data: socialData, error: socialError } = await query

      if (!socialError) {
        results.social = socialData
      }
    }

    // Fetch campaign data if ads exist
    if (results.ads && results.ads.length > 0) {
      const adsIds = results.ads.map(ad => ad.id)
      
      const { data: campaignData, error: campaignError } = await supabaseAdmin
        .from('performance_campaigns')
        .select('*')
        .in('performance_ads_id', adsIds)
        .order('spend', { ascending: false })

      if (!campaignError) {
        results.campaigns = campaignData
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Meta Performance GET Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
