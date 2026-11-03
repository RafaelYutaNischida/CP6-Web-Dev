import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spinner } from '../components/ui/Spinner'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner label="Verificando acesso…" />
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24" role="alert">
        <h1 className="text-2xl font-semibold">Acesso negado</h1>
        <p className="mt-2 text-muted">Esta conta não tem permissão de administrador.</p>
        <button type="button" className="btn btn-ghost mt-6" onClick={() => void signOut()}>
          Sair
        </button>
      </div>
    )
  }
  return <>{children}</>
}
