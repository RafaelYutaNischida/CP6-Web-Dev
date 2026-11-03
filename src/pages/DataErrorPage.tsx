import { Link } from 'react-router-dom'

interface DataErrorPageProps {
  message?: string
  onRetry?: () => void
}

export default function DataErrorPage({
  message = 'Não foi possível carregar os dados desta página.',
  onRetry,
}: DataErrorPageProps) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-28">
      <h1 className="text-3xl font-semibold">Erro ao carregar dados</h1>
      <p role="alert" className="mt-3 text-muted">
        {message}
      </p>
      <div className="mt-8 flex gap-3">
        {onRetry && (
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            Tentar novamente
          </button>
        )}
        <Link to="/" className="btn btn-ghost">
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
