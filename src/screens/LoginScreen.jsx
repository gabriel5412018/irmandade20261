import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { signIn, resetPassword } from '../services/authService'

function LoginScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRecovery, setShowRecovery] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryMessage, setRecoveryMessage] = useState('')

  const from = location.state?.from?.pathname ?? '/escalas'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await signIn({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    navigate(from, { replace: true })
  }

  async function handleRecovery(event) {
    event.preventDefault()
    setError('')
    setRecoveryMessage('')
    setLoading(true)

    const redirectTo = `${window.location.origin}/recuperar-senha`
    const { error: resetError } = await resetPassword(recoveryEmail, redirectTo)

    setLoading(false)
    if (resetError) {
      setError(resetError.message)
      return
    }

    setRecoveryMessage('Enviamos um link de recuperação para o seu e-mail.')
    setShowRecovery(false)
  }

  return (
    <div className="screen">
      <Card title="Entrar">
        <form onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="screen__error">{error}</p>}
          {recoveryMessage && <p className="screen__success">{recoveryMessage}</p>}
          <Button type="submit" className="screen__full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {showRecovery ? (
          <form onSubmit={handleRecovery}>
            <Input
              label="E-mail da conta"
              type="email"
              autoComplete="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="Informe seu e-mail cadastrado"
              required
            />
            <Button
              type="submit"
              variant="secondary"
              className="screen__full"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </Button>
          </form>
        ) : (
          <button
            type="button"
            className="screen__link screen__recovery-link"
            onClick={() => {
              setShowRecovery(true)
              setError('')
            }}
          >
            Esqueceu a senha?
          </button>
        )}

        <p className="screen__muted">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="screen__link">
            Cadastre-se
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default LoginScreen