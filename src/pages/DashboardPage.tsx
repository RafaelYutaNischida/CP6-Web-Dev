import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FeaturedPanel } from '../components/admin/FeaturedPanel'
import { MessagesPanel } from '../components/admin/MessagesPanel'
import { ThemeToggle } from '../components/layout/ThemeToggle'
import { useAuth } from '../hooks/useAuth'

type Tab = 'messages' | 'featured'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('messages')

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="btn btn-ghost">
            Ver site
          </Link>
          <ThemeToggle />
          <button type="button" className="btn btn-ghost" onClick={() => void signOut()}>
            Sair
          </button>
        </div>
      </header>

      <div
        role="tablist"
        aria-label="Seções do dashboard"
        className="mt-8 flex gap-2 border-b border-line"
      >
        {(
          [
            ['messages', 'Mensagens'],
            ['featured', 'Projetos em destaque'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`-mb-px border-b-2 px-4 py-2.5 font-display font-semibold ${tab === id ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-8">
        {tab === 'messages' ? <MessagesPanel /> : <FeaturedPanel />}
      </div>
    </div>
  )
}
