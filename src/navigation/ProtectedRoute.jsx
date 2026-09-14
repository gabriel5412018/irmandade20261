import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../components/useAuth'

const ROLES = {
  IRMAO: 'irmao',
  COORDENADOR: 'coordenador',
}

function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation()
  const { user, perfil, loading } = useAuth()

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && !allowedRoles.includes(perfil?.role)) {
    return <Navigate to="/escalas" replace />
  }

  return children ?? <Outlet />
}

export { ProtectedRoute, ROLES }
export default ProtectedRoute