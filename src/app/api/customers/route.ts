import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    
    const selectFields = minimal ? 'id, name, brand_name' : '*'
    
    // RLS politikası authenticated kullanıcılara izin veriyor
    const { data, error } = await supabase
      .from('customers')
      .select(selectFields)
      .eq('status', 'active')
      .order('name', { ascending: true })

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
