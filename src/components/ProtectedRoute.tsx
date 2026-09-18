import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-concrete">
        <p className="font-display text-blueprint">Carregando…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/entrar" replace />
  }

  return <Outlet />
}
