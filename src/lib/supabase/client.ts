import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types'

// Her çağrıda yeni client oluştur - projeye özel storage key ile
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: 'ajans-bee-auth'
      }
    }
  )
}
