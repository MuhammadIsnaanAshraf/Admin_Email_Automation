import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import BootLoader from '../components/ui/BootLoader.jsx'

export default function RequireAuth() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <BootLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
