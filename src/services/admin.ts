import type { ContactMessage } from '../types'
import { getSupabase } from './supabaseClient'

interface MessageRow {
  id: string
  name: string
  email: string
  subject: string
  message: string
  replied: boolean
  replied_at: string | null
  created_at: string
}

function toMessage(row: MessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    replied: row.replied,
    repliedAt: row.replied_at,
    createdAt: row.created_at,
  }
}

export async function listMessages(): Promise<ContactMessage[]> {
  const { data, error } = await getSupabase()
    .from('messages')
    .select('id,name,email,subject,message,replied,replied_at,created_at')
    .order('created_at', { ascending: false })
  if (error) throw new Error('Não foi possível carregar as mensagens.')
  return (data as MessageRow[]).map(toMessage)
}

export async function setMessageReplied(id: string, replied: boolean): Promise<void> {
  const { error } = await getSupabase()
    .from('messages')
    .update({ replied, replied_at: replied ? new Date().toISOString() : null })
    .eq('id', id)
  if (error) throw new Error('Não foi possível atualizar a mensagem.')
}

export async function listFeaturedNames(): Promise<string[]> {
  const { data, error } = await getSupabase()
    .from('featured_projects')
    .select('repo_name')
    .order('position', { ascending: true })
  if (error) throw new Error('Não foi possível carregar os destaques.')
  return (data as { repo_name: string }[]).map((r) => r.repo_name)
}

/** Substitui a seleção de destaques (a ordem do array define a posição). */
export async function saveFeaturedNames(names: string[]): Promise<void> {
  const supabase = getSupabase()
  const current = await listFeaturedNames()
  const toRemove = current.filter((n) => !names.includes(n))

  if (toRemove.length > 0) {
    const { error } = await supabase.from('featured_projects').delete().in('repo_name', toRemove)
    if (error) throw new Error('Não foi possível salvar os destaques.')
  }
  if (names.length > 0) {
    const { error } = await supabase
      .from('featured_projects')
      .upsert(names.map((repo_name, position) => ({ repo_name, position })))
    if (error) throw new Error('Não foi possível salvar os destaques.')
  }
}
