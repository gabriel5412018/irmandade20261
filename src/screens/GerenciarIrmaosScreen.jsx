import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import CoordenadorMenu from '../components/CoordenadorMenu'
import {
  listPerfis,
  updatePerfilByCoordenador,
  deletePerfil,
} from '../services/perfilService'
import { reenviarConvite, linkDoConvite } from '../services/conviteService'
import { getPerfilStatusLabel } from '../utils/status'

function GerenciarIrmaosScreen() {
  const [irmaos, setIrmaos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [conviteLink, setConviteLink] = useState('')

  async function load() {
    const { data, error: listError } = await listPerfis()
    if (listError) {
      setError(listError.message)
    } else {
      setIrmaos(data ?? [])
    }
  }

  useEffect(() => {
    let cancelled = false

    async function init() {
      const { data, error: listError } = await listPerfis()
      if (cancelled) return
      if (listError) {
        setError(listError.message)
      } else {
        setIrmaos(data ?? [])
      }
      setLoading(false)
    }

    init()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleStatus(irmao, newStatus) {
    setError('')
    setMessage('')
    setConviteLink('')
    const { error: updateError } = await updatePerfilByCoordenador(
      irmao.id,
      { status: newStatus },
    )
    if (updateError) {
      setError(updateError.message)
      return
    }
    load()
  }

  async function handleReenviar(irmao) {
    setError('')
    setMessage('')
    setConviteLink('')
    const { data, error: resendError } = await reenviarConvite(irmao.id)
    if (resendError) {
      setError(resendError.message)
      return
    }
    setMessage('Convite reenviado.')
    setConviteLink(linkDoConvite(data.token))
    load()
  }

  async function handleCopiar() {
    if (!conviteLink) return
    try {
      await navigator.clipboard.writeText(conviteLink)
    } catch {
      window.prompt('Copie o link do convite:', conviteLink)
    }
  }

  async function handleRemove(irmao) {
    const confirmar = window.confirm(
      `Remover o irmão "${irmao.full_name || irmao.id}"?`,
    )
    if (!confirmar) return
    setError('')
    const { error: deleteError } = await deletePerfil(irmao.id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    load()
  }

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  const pendentes = irmaos.filter((i) => i.status === 'convite_pendente')

  return (
    <div className="screen screen--wide">
      <h1>Gerenciar irmãos</h1>
      <CoordenadorMenu />

      <div className="montar-escala-destaque">
        <div>
          <h2 className="montar-escala-destaque__titulo">Adicionar irmão</h2>
          <p className="screen__muted">
            Cadastre um novo irmão para que ele receba um convite e ative sua
            conta.
          </p>
        </div>
        <Link to="/coordenador/irmaos/novo">
          <Button variant="primary" className="montar-escala-destaque__btn">
            + Adicionar irmão
          </Button>
        </Link>
      </div>

      {error && <p className="screen__error">{error}</p>}
      {message && <p className="screen__success">{message}</p>}

      {conviteLink && (
        <Card title="Link do convite">
          <p className="screen__muted">
            Envie este link para o irmão ativar a conta:
          </p>
          <p className="convite__link">{conviteLink}</p>
          <Button variant="secondary" onClick={handleCopiar}>
            Copiar link
          </Button>
        </Card>
      )}

      <div className="dashboard">
        <Card title="Total">
          <p className="dashboard__numero">{irmaos.length}</p>
        </Card>
        <Card title="Convites pendentes">
          <p className="dashboard__numero presenca__num--aguardando">
            {pendentes.length}
          </p>
        </Card>
      </div>

      <Card title={`Irmãos (${irmaos.length})`}>
        {irmaos.length === 0 && (
          <p className="screen__muted">Nenhum irmão cadastrado ainda.</p>
        )}
        <ul className="irmao-list">
          {irmaos.map((irmao) => {
            const status = getPerfilStatusLabel(irmao.status)
            return (
              <li key={irmao.id} className="irmao-item">
                <Avatar
                  name={irmao.full_name}
                  src={irmao.photo_url || undefined}
                  size={44}
                />
                <div className="irmao-item__info">
                  <p className="irmao-item__name">
                    {irmao.full_name || 'Sem nome'}
                  </p>
                  <p className="irmao-item__muted">
                    {irmao.phone || 'Sem telefone'}
                  </p>
                </div>
                <Badge tone={status.tone}>{status.label}</Badge>
                <div className="irmao-item__actions">
                  {irmao.status === 'convite_pendente' && (
                    <Button
                      variant="secondary"
                      onClick={() => handleReenviar(irmao)}
                    >
                      Reenviar convite
                    </Button>
                  )}
                  {irmao.status === 'ativo' && (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatus(irmao, 'inativo')}
                    >
                      Desativar
                    </Button>
                  )}
                  {irmao.status === 'inativo' && (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatus(irmao, 'ativo')}
                    >
                      Reativar
                    </Button>
                  )}
                  <Button variant="danger" onClick={() => handleRemove(irmao)}>
                    Remover
                  </Button>
                  <Link to={`/coordenador/irmao/${irmao.id}/historico`}>
                    <Button variant="secondary">Histórico</Button>
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}

export default GerenciarIrmaosScreen