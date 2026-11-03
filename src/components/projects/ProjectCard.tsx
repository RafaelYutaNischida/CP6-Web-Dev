import { Link } from 'react-router-dom'
import type { GithubRepo } from '../../types'
import { formatDate } from '../../utils/format'

export function ProjectCard({ repo }: { repo: GithubRepo }) {
  return (
    <article className="flex h-full min-h-60 flex-col rounded-md border border-line bg-surface p-6">
      <h3 className="text-xl font-semibold">
        <Link to={`/projetos/${encodeURIComponent(repo.name)}`} className="hover:text-accent">
          {repo.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-base text-muted">
        {repo.description ?? 'Sem descrição cadastrada no GitHub.'}
      </p>
      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-display text-sm text-muted">
        <div>
          <dt className="sr-only">Linguagem principal</dt>
          <dd>{repo.language ?? 'Linguagem não identificada'}</dd>
        </div>
        <div>
          <dt className="sr-only">Última atualização</dt>
          <dd>Atualizado em {formatDate(repo.updatedAt)}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-4 font-display text-base font-semibold">
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Repositório
        </a>
        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Demonstração
          </a>
        )}
      </div>
    </article>
  )
}
