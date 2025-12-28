import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Zod schema for validation
const technicalServiceSchema = z.object({
  brand_id: z.string().uuid('Geçersiz marka ID'),
  provider_id: z.string().uuid('Geçersiz sağlayıcı ID'),
  service_type: z.enum(['hosting', 'domain', 'ssl', 'email']),
  identifier: z.string().min(1, 'Tanımlayıcı zorunlu'),
  renewal_date: z.string().optional().nullable(),
  discount_percent: z.number().min(0).max(100).default(0),
  quantity: z.number().min(1).default(1),
  status: z.enum(['active', 'pending_renewal', 'expired', 'cancelled']).default('active'),
  auto_renew: z.boolean().default(false),
  notes: z.string().optional().nullable()
})

// GET - List all technical services with relations
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Auth kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('technical_services')
      .select(`
        *,
        provider:service_providers(id, name, base_price_usd, billing_cycle),
        brand:customers(id, name, brand_name)
      `)
      .order('renewal_date', { ascending: true, nullsFirst: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/technical-services error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new technical service
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Auth kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validation
    const parsed = technicalServiceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('technical_services')
      .insert(parsed.data as Record<string, unknown>)
      .select(`
        *,
        provider:service_providers(id, name, base_price_usd, billing_cycle),
        brand:customers(id, name, brand_name)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('POST /api/technical-services error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
