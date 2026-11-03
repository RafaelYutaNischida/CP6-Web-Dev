import { Navigate, Route, Routes } from 'react-router-dom'
import { Notice } from '../components/ui/Notice'
import { AuthProvider } from '../contexts/AuthProvider'
import { ProtectedRoute } from '../routes/ProtectedRoute'
import { isSupabaseConfigured } from '../utils/env'
import DashboardPage from './DashboardPage'
import LoginPage from './LoginPage'

/** Carregado sob demanda (React.lazy): supabase-js só entra no bundle ao abrir /admin. */
export default function AdminApp() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24">
        <Notice tone="error" title="Supabase não configurado">
          Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (veja docs/SETUP.md).
        </Notice>
      </div>
    )
  }
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          index
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  )
}
