import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getSupabase } from '../services/supabaseClient'
import type { AuthUser } from '../types'
import { AuthContext } from './auth-context'

interface AuthState {
  user: AuthUser | null
  isAdmin: boolean
  loading: boolean
}

async function checkAdmin(userId: string): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from('admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()
  return !error && data !== null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isAdmin: false, loading: true })

  useEffect(() => {
    let active = true
    const supabase = getSupabase()

    async function apply(session: { user: { id: string; email?: string } } | null) {
      if (!session) {
        if (active) setState({ user: null, isAdmin: false, loading: false })
        return
      }
      const isAdmin = await checkAdmin(session.user.id)
      if (active) {
        setState({
          user: { id: session.user.id, email: session.user.email ?? '' },
          isAdmin,
          loading: false,
        })
      }
    }

    void supabase.auth.getSession().then(({ data }) => apply(data.session))
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      // Evita chamar o Supabase dentro do callback (risco de deadlock); adia para o próximo tick.
      setTimeout(() => void apply(session), 0)
    })
    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (error) throw new Error('E-mail ou senha incorretos.')
  }, [])

  const signOut = useCallback(async () => {
    await getSupabase().auth.signOut()
  }, [])

  const value = useMemo(() => ({ ...state, signIn, signOut }), [state, signIn, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
