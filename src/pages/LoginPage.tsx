import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Notice } from '../components/ui/Notice'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { user, isAdmin, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user && isAdmin) return <Navigate to="/admin" replace />

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? '/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-24">
      <h1 className="text-3xl font-semibold">Acesso administrativo</h1>
      <form onSubmit={onSubmit} className="mt-8 grid gap-5">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block font-display font-semibold">
            E-mail
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="username"
            className="field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-1.5 block font-display font-semibold">
            Senha
          </label>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>
        {error && <Notice tone="error">{error}</Notice>}
        {user && !isAdmin && <Notice tone="error">Esta conta não é de administrador.</Notice>}
      </form>
    </div>
  )
}
