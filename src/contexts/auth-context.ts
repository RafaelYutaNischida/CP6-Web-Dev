import { createContext } from 'react'
import type { AuthUser } from '../types'

export interface AuthContextValue {
  user: AuthUser | null
  /** true somente se o usuário logado existe na tabela `admins`. */
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
