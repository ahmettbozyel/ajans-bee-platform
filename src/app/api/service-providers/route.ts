import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Zod schema for validation
const serviceProviderSchema = z.object({
  name: z.string().min(1, 'İsim zorunlu'),
  service_type: z.enum(['hosting', 'domain', 'ssl', 'email']),
  base_price_usd: z.number().min(0, 'Fiyat 0 veya üzeri olmalı'),
  billing_cycle: z.enum(['monthly', 'yearly']),
  is_active: z.boolean().default(true),
  notes: z.string().optional().nullable()
})

// GET - List all service providers
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Auth kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('service_providers')
      .select('*')
      .order('service_type')
      .order('name')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/service-providers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new service provider
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
    const parsed = serviceProviderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertData: any = parsed.data

    const { data, error } = await supabase
      .from('service_providers')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('POST /api/service-providers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
