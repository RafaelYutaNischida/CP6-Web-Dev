import { useState } from 'react'
import { GITHUB_USER } from '../../config/site'
import { useResource } from '../../hooks/useResource'
import { listFeaturedNames, saveFeaturedNames } from '../../services/admin'
import { fetchRepos } from '../../services/github'
import { Notice } from '../ui/Notice'
import { Spinner } from '../ui/Spinner'

export function FeaturedPanel() {
  const { state, reload } = useResource(async () => {
    const [repos, featured] = await Promise.all([fetchRepos(GITHUB_USER), listFeaturedNames()])
    return { repos: repos.data, featured }
  }, 'featured-admin')
  // Seleção local (null = ainda não editada; usa o que veio do servidor).
  const [draft, setDraft] = useState<string[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)

  if (state.status === 'loading') return <Spinner label="Carregando repositórios…" />
  if (state.status === 'error') {
    return (
      <Notice
        tone="error"
        title="Erro ao carregar"
        action={
          <button className="btn btn-ghost" onClick={reload}>
            Tentar novamente
          </button>
        }
      >
        {state.error.message}
      </Notice>
    )
  }
  const { repos, featured } = state.data
  if (repos.length === 0) {
    return (
      <Notice title="Sem repositórios">Nenhum repositório público disponível para destacar.</Notice>
    )
  }
  const selection = draft ?? featured

  function toggle(name: string) {
    setFeedback(null)
    setDraft(selection.includes(name) ? selection.filter((n) => n !== name) : [...selection, name])
  }

  async function save() {
    setSaving(true)
    setFeedback(null)
    try {
      await saveFeaturedNames(selection)
      setFeedback({ tone: 'success', text: 'Destaques salvos.' })
    } catch (err) {
      setFeedback({ tone: 'error', text: err instanceof Error ? err.message : 'Falha ao salvar.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <p className="mb-4 text-muted">
        Marque os projetos que aparecem na página inicial. Sem seleção, a home mostra os mais
        recentes.
      </p>
      <ul className="divide-y divide-line rounded-md border border-line bg-surface">
        {repos.map((repo) => (
          <li key={repo.id}>
            <label className="flex cursor-pointer items-start gap-3 px-4 py-3">
              <input
                type="checkbox"
                className="mt-1.5 size-4 accent-[rgb(var(--accent))]"
                checked={selection.includes(repo.name)}
                onChange={() => toggle(repo.name)}
              />
              <span className="font-display">
                <span className="block font-semibold">{repo.name}</span>
                <span className="block text-sm text-muted">
                  {repo.description ?? 'Sem descrição'}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          className="btn btn-primary"
          disabled={saving}
          onClick={() => void save()}
        >
          {saving ? 'Salvando…' : 'Salvar destaques'}
        </button>
        <span className="text-sm text-muted">{selection.length} selecionado(s)</span>
      </div>
      {feedback && (
        <div className="mt-4">
          <Notice tone={feedback.tone}>{feedback.text}</Notice>
        </div>
      )}
    </div>
  )
}
