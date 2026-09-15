import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import CoordenadorMenu from '../components/CoordenadorMenu'
import { criarConvite, linkDoConvite } from '../services/conviteService'

function AdicionarIrmaoScreen() {
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [foto, setFoto] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [linkConvite, setLinkConvite] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLinkConvite('')
    setSaving(true)

    const { data, error: saveError } = await criarConvite({
      full_name: nomeCompleto.trim(),
      email: email.trim(),
      phone: telefone.trim(),
      photo_url: foto.trim(),
    })

    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }

    setMessage(
      'Irmão cadastrado. Um convite foi enviado para que ele ative sua conta e crie sua própria senha.',
    )
    setLinkConvite(linkDoConvite(data.token))
    setNomeCompleto('')
    setEmail('')
    setTelefone('')
    setFoto('')
  }

  async function handleCopiar() {
    if (!linkConvite) return
    try {
      await navigator.clipboard.writeText(linkConvite)
    } catch {
      window.prompt('Copie o link do convite:', linkConvite)
    }
  }

  return (
    <div className="screen screen--wide">
      <h1>Adicionar irmão</h1>
      <CoordenadorMenu />

      {error && <p className="screen__error">{error}</p>}
      {message && <p className="screen__success">{message}</p>}

      <Card title="Novo irmão">
        <form onSubmit={handleSubmit}>
          <Input
            label="Nome completo"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            required
          />
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(00) 00000-0000"
          />
          <Input
            label="Foto (URL opcional)"
            value={foto}
            onChange={(e) => setFoto(e.target.value)}
            placeholder="https://exemplo.com/foto.jpg"
          />

          <div className="form-actions">
            <Button type="submit" className="screen__full" disabled={saving}>
              {saving ? 'Salvando...' : 'Cadastrar e enviar convite'}
            </Button>
          </div>
        </form>

        <p className="screen__muted">
          O role será definido automaticamente como irmão e o status inicial
          será convite pendente. O coordenador não cria nem visualiza a senha
          do irmão — ele mesmo define a senha ao ativar a conta.
        </p>
      </Card>

      {linkConvite && (
        <Card title="Link do convite">
          <p className="screen__muted">
            Envie este link para o irmão ativar a conta (o envio automático por
            e-mail depende da configuração do Supabase):
          </p>
          <p className="convite__link">{linkConvite}</p>
          <Button variant="secondary" onClick={handleCopiar}>
            Copiar link
          </Button>
        </Card>
      )}

      <p className="screen__muted">
        <Link to="/coordenador/irmaos" className="screen__link">
          Voltar para gerenciar irmãos
        </Link>
      </p>
    </div>
  )
}

export default AdicionarIrmaoScreen