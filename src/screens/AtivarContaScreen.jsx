import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { obterConvite, ativarConta } from '../services/conviteService'

function AtivarContaScreen() {
  const { token } = useParams()
  const [convite, setConvite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [saving, setSaving] = useState(false)
  const [ativado, setAtivado] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error: loadError } = await obterConvite(token)
      if (cancelled) return
      if (loadError) {
        setError(loadError.message)
      } else if (data) {
        setConvite(data)
      }
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [token])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!senha || senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (senha !== confirmacao) {
      setError('As senhas não coincidem.')
      return
    }

    setSaving(true)
    const { error: saveError } = await ativarConta(token, senha)
    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    setAtivado(true)
  }

  if (loading) {
    return (
      <div className="screen">
        <Card title="Bem-vindo à Irmandade do Santíssimo">
          <p className="screen__muted">Carregando convite...</p>
        </Card>
      </div>
    )
  }

  if (error && !convite) {
    return (
      <div className="screen">
        <Card title="Bem-vindo à Irmandade do Santíssimo">
          <p className="screen__error">{error}</p>
          <Link to="/login" className="screen__link">
            Voltar para o login
          </Link>
        </Card>
      </div>
    )
  }

  if (ativado) {
    return (
      <div className="screen">
        <Card title="Conta ativada!">
          <p className="screen__success">
            Sua conta foi ativada. Agora você pode fazer login com seu e-mail e
            a senha que acabou de criar.
          </p>
          <Link to="/login">
            <Button variant="primary" className="screen__full">
              Ir para o login
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="screen">
      <Card title="Bem-vindo à Irmandade do Santíssimo">
        <p className="screen__muted">
          Ative sua conta e crie a sua senha pessoal.
        </p>

        <div className="perfil">
          <div>
            <p className="perfil__nome">{convite.full_name || 'Sem nome'}</p>
            <p className="perfil__muted">{convite.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="perfil__form">
          <input
            type="text"
            autoComplete="username"
            value={convite.email || ''}
            readOnly
            tabIndex={-1}
            aria-hidden="true"
            style={{ display: 'none' }}
          />
          <Input
            label="Criar senha"
            type="password"
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <Input
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            required
          />
          {error && <p className="screen__error">{error}</p>}
          <Button type="submit" className="screen__full" disabled={saving}>
            {saving ? 'Ativando...' : 'Ativar conta'}
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

export default AtivarContaScreen