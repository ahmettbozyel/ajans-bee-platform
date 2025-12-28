import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Zod schema for update validation
const technicalServiceUpdateSchema = z.object({
  brand_id: z.string().uuid('Geçersiz marka ID').optional(),
  provider_id: z.string().uuid('Geçersiz sağlayıcı ID').optional(),
  service_type: z.enum(['hosting', 'domain', 'ssl', 'email']).optional(),
  identifier: z.string().min(1, 'Tanımlayıcı zorunlu').optional(),
  renewal_date: z.string().optional().nullable(),
  discount_percent: z.number().min(0).max(100).optional(),
  quantity: z.number().min(1).optional(),
  status: z.enum(['active', 'pending_renewal', 'expired', 'cancelled']).optional(),
  auto_renew: z.boolean().optional(),
  notes: z.string().optional().nullable()
})

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET - Get single technical service
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
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
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Hizmet bulunamadı' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/technical-services/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update technical service
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    
    // Auth kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validation
    const parsed = technicalServiceUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 })
    }

    const updateData = { ...parsed.data, updated_at: new Date().toISOString() }

    // @ts-expect-error - Update types not matching
    const { data, error } = await supabase
      .from('technical_services')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        provider:service_providers(id, name, base_price_usd, billing_cycle),
        brand:customers(id, name, brand_name)
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Hizmet bulunamadı' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('PATCH /api/technical-services/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete technical service
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const supabase = await createClient()
    
    // Auth kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('technical_services')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/technical-services/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
