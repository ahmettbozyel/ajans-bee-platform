import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const N8N_WEBHOOK_URL = 'https://n8n.beeswebsite.com/webhook/meta-performance'

// POST - Meta verilerini senkronize et
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { customer_id, meta_ad_account_id } = body

    if (!customer_id) {
      return NextResponse.json({ error: 'customer_id gerekli' }, { status: 400 })
    }

    if (!meta_ad_account_id) {
      return NextResponse.json({ error: 'meta_ad_account_id gerekli' }, { status: 400 })
    }

    // n8n webhook'a istek at
    const n8nPayload = {
      endpoint: `act_${meta_ad_account_id.replace('act_', '')}/insights?fields=spend,impressions,clicks,reach&date_preset=last_30d`,
      customer_id,
      ad_account_id: meta_ad_account_id
    }

    console.log('n8n webhook isteği gönderiliyor:', n8nPayload)

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload),
    })

    const n8nData = await n8nResponse.json().catch(() => null)

    console.log('n8n response status:', n8nResponse.status)
    console.log('n8n response data:', n8nData)

    if (!n8nResponse.ok) {
      return NextResponse.json({
        error: 'n8n webhook hatası',
        status: n8nResponse.status,
        details: n8nData
      }, { status: 500 })
    }

    // meta_last_sync güncelle
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        meta_last_sync: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', customer_id)

    if (updateError) {
      console.error('meta_last_sync güncelleme hatası:', updateError)
    }

    // TODO: performance_ads tablosuna kaydet (tablo oluşturulunca)
    // if (n8nData?.data) {
    //   await supabase.from('performance_ads').insert({
    //     customer_id,
    //     ...n8nData.data
    //   })
    // }

    return NextResponse.json({
      success: true,
      message: 'Meta verileri senkronize edildi',
      data: n8nData,
      synced_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('POST /api/meta/sync error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
