import { useMemo, useState } from 'react'
import { DEFAULT_FEATURED_COUNT, GITHUB_USER } from '../../config/site'
import { useGithubRepos } from '../../hooks/useGithubRepos'
import { useResource } from '../../hooks/useResource'
import { fetchFeaturedNames } from '../../services/featured'
import { sortRepos, type RepoSort } from '../../services/github'
import { Notice } from '../ui/Notice'
import { Section } from '../ui/Section'
import { githubErrorMessage } from './githubErrorMessage'
import { ProjectCard } from './ProjectCard'
import { ProjectCardSkeleton } from './ProjectCardSkeleton'

export function ProjectsSection() {
  const { state, reload } = useGithubRepos()
  const { state: featured } = useResource((signal) => fetchFeaturedNames(signal), 'featured')
  const [showAll, setShowAll] = useState(false)
  const [sort, setSort] = useState<RepoSort>('recent')

  const repos = state.status === 'success' ? state.data.data : null
  const featuredData = featured.status === 'success' ? featured.data : null

  const visible = useMemo(() => {
    if (!repos) return []
    if (showAll) return sortRepos(repos, sort)
    const picked = (featuredData ?? [])
      .map((name) => repos.find((r) => r.name === name))
      .filter((r): r is NonNullable<typeof r> => r !== undefined)
    return picked.length > 0 ? picked : repos.slice(0, DEFAULT_FEATURED_COUNT)
  }, [repos, featuredData, showAll, sort])

  return (
    <Section id="projetos" title="Projetos">
      <p className="mb-8 max-w-prose text-muted">
        Lista carregada automaticamente do GitHub de{' '}
        <a className="text-accent hover:underline" href={`https://github.com/${GITHUB_USER}`}>
          {GITHUB_USER}
        </a>
        .
      </p>

      {state.status === 'loading' && (
        <div
          className="grid gap-5 sm:grid-cols-2"
          aria-busy="true"
          aria-label="Carregando projetos"
        >
          {Array.from({ length: 4 }, (_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      )}

      {state.status === 'error' && (
        <Notice
          tone="error"
          title="Não foi possível carregar os projetos"
          action={
            <button type="button" className="btn btn-ghost" onClick={reload}>
              Tentar novamente
            </button>
          }
        >
          {githubErrorMessage(state.error)}
        </Notice>
      )}

      {repos && repos.length === 0 && (
        <Notice title="Nenhum projeto público encontrado">
          Quando houver repositórios públicos no GitHub, eles aparecem aqui automaticamente.
        </Notice>
      )}

      {repos && repos.length > 0 && (
        <>
          {state.status === 'success' && state.data.stale && (
            <div className="mb-5">
              <Notice>Exibindo dados salvos: o GitHub não respondeu agora.</Notice>
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            {visible.map((repo) => (
              <ProjectCard key={repo.id} repo={repo} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" className="btn btn-ghost" onClick={() => setShowAll((v) => !v)}>
              {showAll ? 'Mostrar só os destaques' : `Ver todos (${repos.length})`}
            </button>
            {showAll && (
              <label className="flex items-center gap-2 font-display text-base text-muted">
                Ordenar por
                <select
                  className="field w-auto py-1.5"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as RepoSort)}
                >
                  <option value="recent">Mais recentes</option>
                  <option value="name">Nome</option>
                  <option value="stars">Estrelas</option>
                </select>
              </label>
            )}
          </div>
        </>
      )}
    </Section>
  )
}
