import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider from '../components/AuthProvider'
import Layout from '../components/Layout'
import LoginScreen from '../screens/LoginScreen'
import CadastroScreen from '../screens/CadastroScreen'
import RecuperarSenhaScreen from '../screens/RecuperarSenhaScreen'
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
import ControlePresencaScreen from '../screens/ControlePresencaScreen'
import { ProtectedRoute, ROLES } from './ProtectedRoute'

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/cadastro" element={<CadastroScreen />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaScreen />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
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

          <Route path="/" element={<Navigate to="/escalas" replace />} />
          <Route path="*" element={<Navigate to="/escalas" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default AppRouter