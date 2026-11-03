export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== ''
}
