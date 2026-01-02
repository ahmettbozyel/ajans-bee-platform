import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET - List customers (brands)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const minimal = searchParams.get('minimal') === 'true'
    const includeInactive = searchParams.get('all') === 'true'

    const selectFields = minimal ? 'id, name, brand_name' : '*'

    // Admin client kullan (RLS bypass)
    const adminClient = createAdminClient()

    let query = adminClient
      .from('customers')
      .select(selectFields)
      .order('name', { ascending: true })

    // Sadece aktif olanları getir (all=true değilse)
    if (!includeInactive) {
      query = query.eq('status', 'active')
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('GET /api/customers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
