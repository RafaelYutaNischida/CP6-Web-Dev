import { SITE } from '../../config/site'
import { useGithubRepos } from '../../hooks/useGithubRepos'
import { Placeholder } from '../ui/Placeholder'
import { Section } from '../ui/Section'
import { Skeleton } from '../ui/Skeleton'

export function SkillsSection() {
  const { state } = useGithubRepos()

  // Linguagens reais, contadas a partir dos repositórios do GitHub.
  const counts = new Map<string, number>()
  if (state.status === 'success') {
    for (const repo of state.data.data) {
      if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
    }
  }
  const languages = [...counts.entries()].sort((a, b) => b[1] - a[1])

  return (
    <Section id="habilidades" title="Habilidades e tecnologias">
      <div className="space-y-10">
        <div>
          <h3 className="mb-3 text-xl font-semibold">Linguagens nos meus repositórios</h3>
          {state.status === 'loading' && <Skeleton className="h-9 w-full max-w-md" />}
          {state.status === 'error' && (
            <p className="text-base text-muted">
              Indisponível: não foi possível consultar o GitHub.
            </p>
          )}
          {state.status === 'success' && languages.length === 0 && (
            <p className="text-base text-muted">Nenhuma linguagem identificada nos repositórios.</p>
          )}
          {languages.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {languages.map(([name, count]) => (
                <li
                  key={name}
                  className="rounded-md border border-line bg-surface px-3 py-1.5 font-display text-base"
                >
                  {name} <span className="text-muted">({count})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {SITE.skills.length > 0 ? (
          SITE.skills.map((g) => (
            <div key={g.group}>
              <h3 className="mb-3 text-xl font-semibold">{g.group}</h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-line px-3 py-1.5 font-display text-base"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <Placeholder field="skills (habilidades por grupo)" />
        )}
      </div>
    </Section>
  )
}
