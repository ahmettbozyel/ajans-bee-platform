import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Untyped Supabase client for tables not in Database types
// Service role key ile RLS bypass - sadece server-side kullanım için
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not defined. Admin client cannot be created without service role key.'
    )
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  )
}
