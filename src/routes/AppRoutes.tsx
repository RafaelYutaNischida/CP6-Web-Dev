import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from '../components/layout/SiteLayout'
import { Spinner } from '../components/ui/Spinner'
import DataErrorPage from '../pages/DataErrorPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'

const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'))
const AdminApp = lazy(() => import('../pages/AdminApp'))

const fallback = (
  <div className="grid min-h-[60vh] place-items-center">
    <Spinner />
  </div>
)

export function AppRoutes() {
  return (
    <Suspense fallback={fallback}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="projetos/:name" element={<ProjectDetailPage />} />
          <Route path="erro" element={<DataErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="admin/*" element={<AdminApp />} />
      </Routes>
    </Suspense>
  )
}
