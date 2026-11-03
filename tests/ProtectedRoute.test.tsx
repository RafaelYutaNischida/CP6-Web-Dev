import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../src/contexts/auth-context'
import { ProtectedRoute } from '../src/routes/ProtectedRoute'

function renderAt(auth: Partial<AuthContextValue>) {
  const value: AuthContextValue = {
    user: null,
    isAdmin: false,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    ...auth,
  }
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/login" element={<p>Tela de login</p>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <p>Conteúdo do dashboard</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('ProtectedRoute', () => {
  it('redireciona para o login quando não autenticado', () => {
    renderAt({ user: null })
    expect(screen.getByText('Tela de login')).toBeInTheDocument()
    expect(screen.queryByText('Conteúdo do dashboard')).not.toBeInTheDocument()
  })

  it('libera o dashboard para o administrador autenticado', () => {
    renderAt({ user: { id: '1', email: 'admin@exemplo.com' }, isAdmin: true })
    expect(screen.getByText('Conteúdo do dashboard')).toBeInTheDocument()
  })

  it('nega acesso a usuário autenticado que não é administrador', () => {
    renderAt({ user: { id: '2', email: 'outro@exemplo.com' }, isAdmin: false })
    expect(screen.getByText('Acesso negado')).toBeInTheDocument()
    expect(screen.queryByText('Conteúdo do dashboard')).not.toBeInTheDocument()
  })

  it('mostra indicador enquanto verifica a sessão', () => {
    renderAt({ loading: true })
    expect(screen.getByRole('status')).toHaveTextContent('Verificando acesso')
    expect(screen.queryByText('Tela de login')).not.toBeInTheDocument()
  })
})
