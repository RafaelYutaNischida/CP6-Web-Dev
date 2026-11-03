import { Link, useParams } from 'react-router-dom'
import { githubErrorMessage } from '../components/projects/githubErrorMessage'
import { Skeleton } from '../components/ui/Skeleton'
import { GITHUB_USER } from '../config/site'
import { useResource } from '../hooks/useResource'
import { fetchRepo, fetchRepoLanguages, GithubError } from '../services/github'
import { formatDate } from '../utils/format'
import DataErrorPage from './DataErrorPage'
import NotFoundPage from './NotFoundPage'

export default function ProjectDetailPage() {
  const { name = '' } = useParams()
  const { state, reload } = useResource(async () => {
    const [repo, languages] = await Promise.all([
      fetchRepo(GITHUB_USER, name),
      fetchRepoLanguages(GITHUB_USER, name).catch(() => ({}) as Record<string, number>),
    ])
    return { repo: repo.data, languages }
  }, `repo:${name}`)

  if (state.status === 'loading') {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-5 py-20" aria-busy="true">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }
  if (state.status === 'error') {
    if (state.error instanceof GithubError && state.error.kind === 'not-found') {
      return <NotFoundPage />
    }
    return <DataErrorPage message={githubErrorMessage(state.error)} onRetry={reload} />
  }

  const { repo, languages } = state.data
  const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <Link to="/#projetos" className="font-display text-base text-muted hover:text-accent">
        Voltar aos projetos
      </Link>
      <h1 className="mt-6 text-4xl font-bold md:text-5xl">{repo.name}</h1>
      <p className="mt-4 text-lg">{repo.description ?? 'Sem descrição cadastrada no GitHub.'}</p>

      <dl className="mt-8 grid gap-4 border-y border-line py-6 font-display sm:grid-cols-3">
        <div>
          <dt className="text-sm text-muted">Linguagem principal</dt>
          <dd>{repo.language ?? 'Não identificada'}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Última atualização</dt>
          <dd>{formatDate(repo.updatedAt)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Estrelas</dt>
          <dd>{repo.stars}</dd>
        </div>
      </dl>

      {total > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">Linguagens</h2>
          <ul className="flex flex-wrap gap-2">
            {Object.entries(languages)
              .sort((a, b) => b[1] - a[1])
              .map(([lang, bytes]) => (
                <li
                  key={lang}
                  className="rounded-md border border-line bg-surface px-3 py-1.5 font-display text-base"
                >
                  {lang} <span className="text-muted">{Math.round((bytes / total) * 100)}%</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {repo.topics.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2 font-display text-sm text-muted">
          {repo.topics.map((t) => (
            <li key={t}>#{t}</li>
          ))}
        </ul>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Ver repositório
        </a>
        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Abrir demonstração
          </a>
        )}
      </div>
    </article>
  )
}
