import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearGithubCache, fetchRepos, GithubError, sortRepos } from '../src/services/github'

const raw = (over: Record<string, unknown>) => ({
  id: 1,
  name: 'repo',
  description: null,
  language: null,
  updated_at: '2025-01-01T00:00:00Z',
  html_url: 'https://github.com/u/repo',
  homepage: null,
  stargazers_count: 0,
  fork: false,
  archived: false,
  ...over,
})

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), { status: 200, ...init })
}

describe('serviço do GitHub', () => {
  beforeEach(() => clearGithubCache())
  afterEach(() => vi.unstubAllGlobals())

  it('filtra forks/arquivados e trata repositórios sem descrição ou linguagem', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse([
            raw({ id: 1, name: 'a' }),
            raw({ id: 2, name: 'fork', fork: true }),
            raw({ id: 3, name: 'old', archived: true }),
          ]),
        ),
    )
    const { data } = await fetchRepos('u')
    expect(data).toHaveLength(1)
    expect(data[0]).toMatchObject({ name: 'a', description: null, language: null })
  })

  it('usa o cache e não repete a chamada', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([raw({})]))
    vi.stubGlobal('fetch', fetchMock)
    await fetchRepos('u')
    await fetchRepos('u')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('informa limite de requisições quando não há cache', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('{}', {
          status: 403,
          headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1900000000' },
        }),
      ),
    )
    await expect(fetchRepos('u')).rejects.toMatchObject({ kind: 'rate-limit' })
    await expect(fetchRepos('u')).rejects.toBeInstanceOf(GithubError)
  })

  it('ordena por data, nome e estrelas', () => {
    const base = {
      id: 0,
      description: null,
      language: null,
      htmlUrl: '',
      homepage: null,
      topics: [],
    }
    const repos = [
      { ...base, name: 'b', stars: 1, updatedAt: '2025-01-01' },
      { ...base, name: 'a', stars: 5, updatedAt: '2024-01-01' },
    ]
    expect(sortRepos(repos, 'recent')[0]?.name).toBe('b')
    expect(sortRepos(repos, 'name')[0]?.name).toBe('a')
    expect(sortRepos(repos, 'stars')[0]?.name).toBe('a')
  })
})
