import { NavLink } from 'react-router-dom'

const ITENS = [
  { to: '/coordenador/escala/nova', label: '📅 Montar escala' },
  { to: '/coordenador', label: '📋 Escalas', end: true },
  { to: '/coordenador/irmaos', label: '👥 Gerenciar irmãos' },
  { to: '/coordenador/presencas', label: '📊 Controle de presença' },
  { to: '/coordenador/avisos', label: '📢 Gerenciar avisos' },
]

function CoordenadorMenu() {
  return (
    <nav className="coord-menu">
      {ITENS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `coord-menu__link ${
              isActive ? 'coord-menu__link--active' : ''
            }`.trim()
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default CoordenadorMenu