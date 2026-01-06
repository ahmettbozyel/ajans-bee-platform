import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types'

// Singleton pattern - tek bir client instance kullan
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (!supabaseClient) {
    console.log('[Supabase] Creating browser client...')
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    console.log('[Supabase] Browser client created')
  }
  return supabaseClient
}
