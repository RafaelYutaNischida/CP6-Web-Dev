import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '../utils/env'

/**
 * Leitura pública dos projetos em destaque via PostgREST (sem supabase-js, para manter
 * o JavaScript inicial pequeno). A tabela permite SELECT público por RLS.
 * Qualquer falha cai para a lista dos mais recentes, sem quebrar a página.
 */
export async function fetchFeaturedNames(signal?: AbortSignal): Promise<string[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/featured_projects?select=repo_name&order=position.asc`,
      {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        signal,
      },
    )
    if (!response.ok) return []
    const rows = (await response.json()) as { repo_name: string }[]
    return rows.map((r) => r.repo_name)
  } catch {
    return []
  }
}
