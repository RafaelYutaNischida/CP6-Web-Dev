import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '../utils/env'

let client: SupabaseClient | null = null

/** Importado apenas pelo código do dashboard (chunk separado). */
export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
  }
  client ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  return client
}
