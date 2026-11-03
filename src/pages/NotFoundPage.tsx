import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-28">
      <p className="font-display text-7xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-3xl font-semibold">Página não encontrada</h1>
      <p className="mt-3 text-muted">O endereço não existe ou foi movido.</p>
      <Link to="/" className="btn btn-primary mt-8">
        Voltar ao início
      </Link>
    </div>
  )
}
