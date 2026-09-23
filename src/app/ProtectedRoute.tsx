import { Navigate, Outlet } from 'react-router-dom'

/** Stub auth check — wired to useAuthStore in Story 1.3 */
const isAuthenticated = false

export function ProtectedRoute() {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
