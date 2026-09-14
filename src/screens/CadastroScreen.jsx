import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { signUp } from '../services/authService'

const ROLES = {
  IRMAO: 'irmao',
  COORDENADOR: 'coordenador',
}

function CadastroScreen() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(ROLES.IRMAO)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const { data, error: authError } = await signUp({
      email,
      password,
      fullName: name,
      role,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setMessage(
      data.session
        ? 'Conta criada com sucesso! Você será redirecionado.'
        : 'Conta criada! Verifique seu e-mail para confirmar o cadastro.',
    )

    if (data.session) {
      navigate(role === ROLES.COORDENADOR ? '/coordenador' : '/escalas', {
        replace: true,
      })
    }
  }

  return (
    <div className="screen">
      <Card title="Criar conta">
        <form onSubmit={handleSubmit}>
          <Input
            label="Nome completo"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="role-selector">
            <span className="role-selector__label">
              Escolha seu perfil:
            </span>
            <div className="role-selector__options">
              <button
                type="button"
                className={`role-card ${
                  role === ROLES.IRMAO ? 'role-card--active' : ''
                }`}
                onClick={() => setRole(ROLES.IRMAO)}
              >
                <span className="role-card__titulo">SOU IRMÃO</span>
                <span className="role-card__desc">
                  Participo das escalas, confirmo presença e vejo os avisos.
                </span>
              </button>
              <button
                type="button"
                className={`role-card ${
                  role === ROLES.COORDENADOR ? 'role-card--active' : ''
                }`}
                onClick={() => setRole(ROLES.COORDENADOR)}
              >
                <span className="role-card__titulo">SOU COORDENADOR</span>
                <span className="role-card__desc">
                  Administro irmãos, escalas, presenças e avisos.
                </span>
              </button>
            </div>
            {role === ROLES.COORDENADOR && (
              <p className="role-selector__aviso">
                O acesso à área do coordenador depende da confirmação do
                responsável. Você será direcionado à área do coordenador.
              </p>
            )}
          </div>

          {error && <p className="screen__error">{error}</p>}
          {message && <p className="screen__success">{message}</p>}
          <Button type="submit" className="screen__full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
        <p className="screen__muted">
          Já tem conta?{' '}
          <Link to="/login" className="screen__link">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default CadastroScreen