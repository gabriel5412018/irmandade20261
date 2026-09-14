import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { getSession, updatePassword } from '../services/authService'

function RecuperarSenhaScreen() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function check() {
      const { data } = await getSession()
      if (!cancelled && data.session?.user) {
        setReady(true)
      }
      setLoading(false)
    }

    check()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    const { error: updateError } = await updatePassword(password)
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setMessage('Senha atualizada com sucesso. Agora faça login com a nova senha.')
    setPassword('')
    setConfirm('')
  }

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  if (!ready) {
    return (
      <div className="screen">
        <Card title="Recuperar senha">
          <p className="screen__muted">
            Link de recuperação inválido ou expirado. Peça um novo link na tela
            de login em "Esqueceu a senha?".
          </p>
          <Link to="/login" className="screen__link">
            Voltar para o login
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="screen">
      <Card title="Definir nova senha">
        <p className="screen__muted">
          Informe a nova senha para a sua conta.
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirmar nova senha"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {error && <p className="screen__error">{error}</p>}
          {message && <p className="screen__success">{message}</p>}
          <Button type="submit" className="screen__full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </Button>
        </form>
        <p className="screen__muted">
          <Link to="/login" className="screen__link">
            Voltar para o login
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default RecuperarSenhaScreen