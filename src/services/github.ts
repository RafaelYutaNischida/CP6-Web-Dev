import type { GithubRepo } from '../types'

const API_URL = 'https://api.github.com'
const CACHE_PREFIX = 'gh-cache:v1:'
export const CACHE_TTL_MS = 10 * 60 * 1000

export type GithubErrorKind = 'rate-limit' | 'not-found' | 'network' | 'http'

export class GithubError extends Error {
  readonly kind: GithubErrorKind
  readonly resetAt?: Date

  constructor(kind: GithubErrorKind, message: string, resetAt?: Date) {
    super(message)
    this.name = 'GithubError'
    this.kind = kind
    this.resetAt = resetAt
  }
}

interface CacheEntry<T> {
  etag: string | null
  fetchedAt: number
  data: T
}

export interface Cached<T> {
  data: T
  /** true quando a API falhou/limitou e os dados vieram de um cache vencido. */
  stale: boolean
}

interface RawRepo {
  id: number
  name: string
  description: string | null
  language: string | null
  updated_at: string
  pushed_at?: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  topics?: string[]
  fork: boolean
  archived: boolean
}

function readCache<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    return raw ? (JSON.parse(raw) as CacheEntry<T>) : null
  } catch {
    return null
  }
}

function writeCache<T>(key: string, entry: CacheEntry<T>): void {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch {
    // Storage cheio ou indisponível: segue sem cache.
  }
}

/** Evita chamadas simultâneas idênticas (ex.: duas seções pedindo a mesma lista). */
const inflight = new Map<string, Promise<Cached<unknown>>>()

export function clearGithubCache(): void {
  inflight.clear()
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    // ignora
  }
}

async function request<T>(path: string): Promise<Cached<T>> {
  const cached = readCache<T>(path)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return { data: cached.data, stale: false }
  }

  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
  if (cached?.etag) headers['If-None-Match'] = cached.etag

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { headers })
  } catch {
    if (cached) return { data: cached.data, stale: true }
    throw new GithubError('network', 'Não foi possível conectar ao GitHub.')
  }

  // 304: nada mudou. Não consome o limite de requisições.
  if (response.status === 304 && cached) {
    writeCache(path, { ...cached, fetchedAt: Date.now() })
    return { data: cached.data, stale: false }
  }

  if (response.status === 404) {
    throw new GithubError('not-found', 'Recurso não encontrado no GitHub.')
  }

  const rateLimited =
    response.status === 429 ||
    (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0')
  if (rateLimited) {
    if (cached) return { data: cached.data, stale: true }
    const reset = Number(response.headers.get('x-ratelimit-reset'))
    throw new GithubError(
      'rate-limit',
      'Limite de requisições da API do GitHub atingido.',
      reset ? new Date(reset * 1000) : undefined,
    )
  }

  if (!response.ok) {
    if (cached) return { data: cached.data, stale: true }
    throw new GithubError('http', `GitHub respondeu com status ${response.status}.`)
  }

  const data = (await response.json()) as T
  writeCache(path, { etag: response.headers.get('etag'), fetchedAt: Date.now(), data })
  return { data, stale: false }
}

function cachedRequest<T>(path: string): Promise<Cached<T>> {
  const existing = inflight.get(path)
  if (existing) return existing as Promise<Cached<T>>
  const promise = request<T>(path).finally(() => inflight.delete(path))
  inflight.set(path, promise)
  return promise
}

export function normalizeRepo(raw: RawRepo): GithubRepo {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description?.trim() || null,
    language: raw.language || null,
    updatedAt: raw.pushed_at ?? raw.updated_at,
    htmlUrl: raw.html_url,
    homepage: raw.homepage?.trim() || null,
    stars: raw.stargazers_count,
    topics: raw.topics ?? [],
  }
}

/** Lista os repositórios públicos próprios (sem forks, arquivados ou o repo de perfil). */
export async function fetchRepos(user: string): Promise<Cached<GithubRepo[]>> {
  const result = await cachedRequest<RawRepo[]>(
    `/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`,
  )
  const repos = result.data
    .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== user.toLowerCase())
    .map(normalizeRepo)
  return { data: sortRepos(repos, 'recent'), stale: result.stale }
}

export async function fetchRepo(user: string, name: string): Promise<Cached<GithubRepo>> {
  const result = await cachedRequest<RawRepo>(
    `/repos/${encodeURIComponent(user)}/${encodeURIComponent(name)}`,
  )
  return { data: normalizeRepo(result.data), stale: result.stale }
}

export async function fetchRepoLanguages(
  user: string,
  name: string,
): Promise<Record<string, number>> {
  const result = await cachedRequest<Record<string, number>>(
    `/repos/${encodeURIComponent(user)}/${encodeURIComponent(name)}/languages`,
  )
  return result.data
}

export type RepoSort = 'recent' | 'name' | 'stars'

export function sortRepos(repos: readonly GithubRepo[], sort: RepoSort): GithubRepo[] {
  const copy = [...repos]
  switch (sort) {
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    case 'stars':
      return copy.sort((a, b) => b.stars - a.stars || b.updatedAt.localeCompare(a.updatedAt))
    default:
      return copy.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }
}
