import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/api-auth'
import { z } from 'zod'

// Zod schema for validation
const serviceProviderUpdateSchema = z.object({
  name: z.string().min(1, 'İsim zorunlu').optional(),
  service_type: z.enum(['hosting', 'domain', 'ssl', 'email']).optional(),
  base_price_usd: z.number().min(0, 'Fiyat 0 veya üzeri olmalı').optional(),
  billing_cycle: z.enum(['monthly', 'yearly']).optional(),
  is_active: z.boolean().optional(),
  notes: z.string().optional().nullable()
})

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET - Get single service provider
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  // Auth kontrolü
  const auth = await requireAuth()
  if (!auth.success) return auth.response

  try {
    const { id } = await context.params
    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('service_providers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Sağlayıcı bulunamadı' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update service provider
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  // Auth kontrolü
  const auth = await requireAuth()
  if (!auth.success) return auth.response

  try {
    const { id } = await context.params
    const body = await request.json()

    // Validation
    const parsed = serviceProviderUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 })
    }

    const updateData = {
      ...parsed.data,
      updated_at: new Date().toISOString()
    }

    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('service_providers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Sağlayıcı bulunamadı' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete service provider
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  // Auth kontrolü
  const auth = await requireAuth()
  if (!auth.success) return auth.response

  try {
    const { id } = await context.params
    const adminClient = createAdminClient()

    // Önce bu sağlayıcıya bağlı servis var mı kontrol et
    const { count } = await adminClient
      .from('technical_services')
      .select('*', { count: 'exact', head: true })
      .eq('provider_id', id)

    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Bu sağlayıcıya bağlı hizmetler var. Önce onları silin veya başka sağlayıcıya taşıyın.' },
        { status: 400 }
      )
    }

    const { error } = await adminClient
      .from('service_providers')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
