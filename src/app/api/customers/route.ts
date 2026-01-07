import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - List all customers
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Auth kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const minimal = searchParams.get('minimal') === 'true'

    // Tüm müşterileri çek (pasif dahil - teknik hizmetler için gerekli)
    const selectFields = minimal
      ? 'id, name'
      : 'id, name, email, phone, notes, customer_type, created_at'

    const { data, error } = await supabase
      .from('customers')
      .select(selectFields)
      .order('name', { ascending: true })

    if (error) {
      console.error('Customers fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Customers API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
