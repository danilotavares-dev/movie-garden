import { Navigate, Outlet } from 'react-router-dom'

export function PrivateRoute() {
  const hasToken = Boolean(localStorage.getItem('token'))
  const isAuthenticated =
    localStorage.getItem('isAuthenticated') === 'true' || hasToken

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
