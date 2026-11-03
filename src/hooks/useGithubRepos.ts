import { GITHUB_USER } from '../config/site'
import { fetchRepos } from '../services/github'
import { useResource } from './useResource'

export function useGithubRepos() {
  return useResource(() => fetchRepos(GITHUB_USER), `repos:${GITHUB_USER}`)
}
