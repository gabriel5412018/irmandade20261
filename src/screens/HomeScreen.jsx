import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import { useAuth } from '../components/useAuth'

function HomeScreen() {
  const { user, perfil } = useAuth()

  return (
    <div className="screen">
      <div className="perfil">
        <Avatar
          name={perfil?.full_name || '?'}
          src={perfil?.photo_url || undefined}
          size={64}
        />
        <div>
          <h1 className="inicio__titulo">
            Bem-vindo, {perfil?.full_name?.split(' ')[0] || 'Irmão'}!
          </h1>
          <p className="perfil__muted">{user?.email}</p>
        </div>
      </div>

      <div className="inicio__atalhos">
        <Link to="/escalas">
          <Card title="Escalas">
            <p className="screen__muted">
              Veja suas escalas e a escala completa das celebrações.
            </p>
            <Button variant="primary">Ver escalas</Button>
          </Card>
        </Link>
        <Link to="/avisos">
          <Card title="Avisos">
            <p className="screen__muted">
              Acompanhe os avisos publicados pela coordenação.
            </p>
            <Button variant="secondary">Ver avisos</Button>
          </Card>
        </Link>
        <Link to="/perfil">
          <Card title="Perfil">
            <p className="screen__muted">
              Confira e edite suas informações pessoais.
            </p>
            <Button variant="secondary">Ver perfil</Button>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default HomeScreen