import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'
import { isCoordenador, isAdministrador, isIrmao } from '../utils/roles'
import Button from './Button'
import NotificacoesAtivador from './NotificacoesAtivador'

function Layout() {
  const { user, perfil, signOut } = useAuth()

  const linkClass = ({ isActive }) =>
    `layout__link ${isActive ? 'layout__link--active' : ''}`.trim()

  const coord = isCoordenador(perfil)
  const admin = isAdministrador(perfil)

  return (
    <div className="layout">
      <nav className="layout__nav">
        <span className="layout__brand">
        <img
          src="/irmandade-logo.png"
          alt="Logo Irmandade do Santíssimo"
          className="layout__brand-logo"
        />
        Irmandade do Santíssimo
      </span>
        <div className="layout__links">
          {isIrmao(perfil) && (
            <NavLink to="/inicio" className={linkClass}>
              Início
            </NavLink>
          )}
          <NavLink to="/escalas" className={linkClass}>
            Escalas
          </NavLink>
          <NavLink to="/avisos" className={linkClass}>
            Avisos
          </NavLink>
          <NavLink to="/perfil" className={linkClass}>
            Perfil
          </NavLink>
          {coord && (
            <NavLink to="/coordenador" className={linkClass}>
              Coordenador
            </NavLink>
          )}
          {admin && (
            <NavLink to="/admin" className={linkClass}>
              Administração
            </NavLink>
          )}
        </div>
        <div className="layout__actions">
          {user && (
            <span className="layout__user">
              {perfil?.full_name || user.email}
            </span>
          )}
          <Button variant="secondary" onClick={signOut}>
            Sair
          </Button>
        </div>
      </nav>
      <NotificacoesAtivador />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout