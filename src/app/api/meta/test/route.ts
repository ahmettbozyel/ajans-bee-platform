import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const N8N_WEBHOOK_URL = 'https://n8n.beeswebsite.com/webhook/meta-performance'

// POST - Meta bağlantısını test et
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { meta_page_id, meta_ig_id, meta_ad_account_id } = body

    // En az bir ID olmalı
    if (!meta_page_id && !meta_ig_id && !meta_ad_account_id) {
      return NextResponse.json({
        success: false,
        error: 'En az bir Meta ID gerekli (Page ID, IG ID veya Ad Account ID)'
      }, { status: 400 })
    }

    // n8n webhook'a test isteği at
    const testPayload = {
      action: 'test_connection',
      meta_page_id: meta_page_id || null,
      meta_ig_id: meta_ig_id || null,
      meta_ad_account_id: meta_ad_account_id || null,
      timestamp: new Date().toISOString()
    }

    const startTime = Date.now()

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    })

    const responseTime = Date.now() - startTime
    const n8nData = await n8nResponse.json().catch(() => null)

    if (!n8nResponse.ok) {
      return NextResponse.json({
        success: false,
        error: 'n8n webhook bağlantısı başarısız',
        status: n8nResponse.status,
        response_time_ms: responseTime,
        details: n8nData
      }, { status: 200 }) // 200 döndür ama success: false
    }

    return NextResponse.json({
      success: true,
      message: 'Bağlantı başarılı!',
      response_time_ms: responseTime,
      n8n_status: n8nResponse.status,
      data: n8nData
    })

  } catch (error) {
    console.error('POST /api/meta/test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Bağlantı testi başarısız',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 }) // 200 döndür ama success: false
  }
}
