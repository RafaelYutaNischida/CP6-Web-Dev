import { useState } from 'react'
import { useResource } from '../../hooks/useResource'
import { listMessages, setMessageReplied } from '../../services/admin'
import { formatDateTime } from '../../utils/format'
import { Notice } from '../ui/Notice'
import { Spinner } from '../ui/Spinner'

export function MessagesPanel() {
  const { state, reload } = useResource(() => listMessages(), 'messages')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  if (state.status === 'loading') return <Spinner label="Carregando mensagens…" />
  if (state.status === 'error') {
    return (
      <Notice
        tone="error"
        title="Erro ao carregar"
        action={
          <button className="btn btn-ghost" onClick={reload}>
            Tentar novamente
          </button>
        }
      >
        {state.error.message}
      </Notice>
    )
  }
  const messages = state.data
  if (messages.length === 0) {
    return (
      <Notice title="Nenhuma mensagem ainda">
        As mensagens enviadas pelo formulário aparecem aqui.
      </Notice>
    )
  }
  const selected = messages.find((m) => m.id === selectedId) ?? null

  async function toggleReplied(id: string, replied: boolean) {
    setBusy(true)
    setActionError(null)
    try {
      await setMessageReplied(id, replied)
      reload()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Falha ao atualizar.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <ul className="max-h-[32rem] divide-y divide-line overflow-auto rounded-md border border-line bg-surface">
        {messages.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => setSelectedId(m.id)}
              aria-current={m.id === selectedId}
              className={`block w-full px-4 py-3 text-left font-display ${m.id === selectedId ? 'bg-accent/10' : 'hover:bg-accent/5'}`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="truncate font-semibold">{m.subject}</span>
                <span className={`shrink-0 text-xs ${m.replied ? 'text-ok' : 'text-danger'}`}>
                  {m.replied ? 'Respondida' : 'Pendente'}
                </span>
              </span>
              <span className="block truncate text-sm text-muted">
                {m.name} · {formatDateTime(m.createdAt)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="rounded-md border border-line bg-surface p-6">
        {!selected ? (
          <p className="text-muted">Selecione uma mensagem para ver os detalhes.</p>
        ) : (
          <article>
            <h3 className="text-xl font-semibold">{selected.subject}</h3>
            <p className="mt-1 font-display text-sm text-muted">
              {selected.name} ·{' '}
              <a className="text-accent hover:underline" href={`mailto:${selected.email}`}>
                {selected.email}
              </a>{' '}
              · {formatDateTime(selected.createdAt)}
            </p>
            <p className="mt-5 whitespace-pre-wrap text-base">{selected.message}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy}
                onClick={() => void toggleReplied(selected.id, !selected.replied)}
              >
                {selected.replied ? 'Marcar como pendente' : 'Marcar como respondida'}
              </button>
              <a
                className="btn btn-ghost"
                href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
              >
                Responder por e-mail
              </a>
              {selected.repliedAt && (
                <span className="text-sm text-muted">
                  Respondida em {formatDateTime(selected.repliedAt)}
                </span>
              )}
            </div>
            {actionError && (
              <div className="mt-4">
                <Notice tone="error">{actionError}</Notice>
              </div>
            )}
          </article>
        )}
      </div>
    </div>
  )
}
