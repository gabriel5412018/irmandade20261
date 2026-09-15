import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../components/useAuth'
import { ROLES, homePorRole } from '../utils/roles'

function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation()
  const { user, perfil, loading } = useAuth()

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (perfil && perfil.status !== 'ativo') {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(perfil?.role)) {
    const rolesEfetivos =
      perfil?.role === ROLES.ADMINISTRADOR
        ? [ROLES.ADMINISTRADOR, ROLES.COORDENADOR]
        : [perfil?.role]
    if (!allowedRoles.some((role) => rolesEfetivos.includes(role))) {
      return <Navigate to={homePorRole(perfil)} replace />
    }
  }

  return children ?? <Outlet />
}

export { ProtectedRoute, ROLES }
export default ProtectedRoute