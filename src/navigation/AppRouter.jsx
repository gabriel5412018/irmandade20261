import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider from '../components/AuthProvider'
import Layout from '../components/Layout'
import { useAuth } from '../components/useAuth'
import { homePorRole } from '../utils/roles'
import LoginScreen from '../screens/LoginScreen'
import RecuperarSenhaScreen from '../screens/RecuperarSenhaScreen'
import AtivarContaScreen from '../screens/AtivarContaScreen'
import HomeScreen from '../screens/HomeScreen'
import PerfilScreen from '../screens/PerfilScreen'
import EscalasScreen from '../screens/EscalasScreen'
import DetalheEscalaScreen from '../screens/DetalheEscalaScreen'
import AvisosScreen from '../screens/AvisosScreen'
import AreaCoordenadorScreen from '../screens/AreaCoordenadorScreen'
import CriarEscalaScreen from '../screens/CriarEscalaScreen'
import PresencasEscalaScreen from '../screens/PresencasEscalaScreen'
import GestaoAvisosScreen from '../screens/GestaoAvisosScreen'
import HistoricoPresencaScreen from '../screens/HistoricoPresencaScreen'
import HistoricoIrmaoScreen from '../screens/HistoricoIrmaoScreen'
import GerenciarIrmaosScreen from '../screens/GerenciarIrmaosScreen'
import AdicionarIrmaoScreen from '../screens/AdicionarIrmaoScreen'
import ControlePresencaScreen from '../screens/ControlePresencaScreen'
import AdminScreen from '../screens/AdminScreen'
import { ProtectedRoute, ROLES } from './ProtectedRoute'

function HomeRedirect() {
  const { user, perfil, loading } = useAuth()

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (perfil && perfil.status !== 'ativo') {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={homePorRole(perfil)} replace />
}

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaScreen />} />
          <Route
            path="/ativar-conta/:token"
            element={<AtivarContaScreen />}
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/inicio" element={<HomeScreen />} />
              <Route path="/escalas" element={<EscalasScreen />} />
              <Route
                path="/escalas/:id"
                element={<DetalheEscalaScreen />}
              />
              <Route path="/avisos" element={<AvisosScreen />} />
              <Route path="/perfil" element={<PerfilScreen />} />
              <Route
                path="/historico-presenca"
                element={<HistoricoPresencaScreen />}
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMINISTRADOR]}>
                    <AdminScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coordenador/irmao/:perfilId/historico"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.COORDENADOR]}>
                    <HistoricoIrmaoScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coordenador"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.COORDENADOR]}>
                    <AreaCoordenadorScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coordenador/irmaos"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.COORDENADOR]}>
                    <GerenciarIrmaosScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coordenador/irmaos/novo"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.COORDENADOR]}>
                    <AdicionarIrmaoScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coordenador/presencas"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.COORDENADOR]}>
                    <ControlePresencaScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coordenador/avisos"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.COORDENADOR]}>
                    <GestaoAvisosScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coordenador/escala/nova"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.COORDENADOR]}>
                    <CriarEscalaScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coordenador/escala/:id"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.COORDENADOR]}>
                    <CriarEscalaScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coordenador/escala/:id/presencas"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.COORDENADOR]}>
                    <PresencasEscalaScreen />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>

          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default AppRouter