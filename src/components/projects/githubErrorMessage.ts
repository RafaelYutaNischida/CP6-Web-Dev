import { GithubError } from '../../services/github'

export function githubErrorMessage(error: Error): string {
  if (error instanceof GithubError && error.kind === 'rate-limit') {
    const when = error.resetAt
      ? ` Tente novamente após ${error.resetAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`
      : ' Tente novamente em alguns minutos.'
    return `${error.message}${when}`
  }
  return error instanceof GithubError ? error.message : 'Erro inesperado ao buscar os dados.'
}
