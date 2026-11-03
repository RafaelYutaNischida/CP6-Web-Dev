import { useCallback, useEffect, useRef, useState } from 'react'

export type ResourceState<T> =
  { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: Error }

interface Settled<T> {
  requestId: string
  state: Exclude<ResourceState<T>, { status: 'loading' }>
}

/**
 * Carrega um recurso assíncrono expondo loading / success / error.
 * "Vazio" é decidido por quem consome (data.length === 0).
 * Recarrega quando `key` muda ou quando `reload()` é chamado.
 */
export function useResource<T>(loader: (signal: AbortSignal) => Promise<T>, key: string) {
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled<T> | null>(null)
  const loaderRef = useRef(loader)
  const requestId = `${key}#${attempt}`

  useEffect(() => {
    loaderRef.current = loader
  })

  useEffect(() => {
    const controller = new AbortController()
    loaderRef
      .current(controller.signal)
      .then((data) => setSettled({ requestId, state: { status: 'success', data } }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const err = error instanceof Error ? error : new Error('Erro desconhecido')
        setSettled({ requestId, state: { status: 'error', error: err } })
      })
    return () => controller.abort()
  }, [requestId])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])
  const state: ResourceState<T> =
    settled && settled.requestId === requestId ? settled.state : { status: 'loading' }
  return { state, reload }
}
