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

const STATUS_LABEL = {
  pendente: { label: 'Pendente', tone: 'warning' },
  aprovado: { label: 'Aprovado', tone: 'success' },
  inativo: { label: 'Inativo', tone: 'neutral' },
}

function GerenciarIrmaosScreen() {
  const [irmaos, setIrmaos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function reload() {
    const { data, error: listError } = await listPerfis()
    if (listError) {
      setError(listError.message)
      return
    }
    setIrmaos(data ?? [])
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error: listError } = await listPerfis()
      if (cancelled) return
      if (listError) {
        setError(listError.message)
      } else {
        setIrmaos(data ?? [])
      }
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleStatus(irmao, newStatus) {
    setError('')
    const { error: updateError } = await updatePerfilByCoordenador(irmao.id, {
      status: newStatus,
    })
    if (updateError) {
      setError(updateError.message)
      return
    }
    reload()
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
    reload()
  }

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  const pendentes = irmaos.filter((i) => i.status === 'pendente')

  return (
    <div className="screen screen--wide">
      <h1>Gerenciar irmãos</h1>
      <CoordenadorMenu />

      {error && <p className="screen__error">{error}</p>}

      <div className="dashboard">
        <Card title="Total">
          <p className="dashboard__numero">{irmaos.length}</p>
        </Card>
        <Card title="Aguardando aprovação">
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
            const status = STATUS_LABEL[irmao.status] ?? STATUS_LABEL.pendente
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
                  {irmao.status === 'pendente' && (
                    <Button
                      variant="success"
                      onClick={() => handleStatus(irmao, 'aprovado')}
                    >
                      Aprovar
                    </Button>
                  )}
                  {irmao.status === 'aprovado' && (
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
                      onClick={() => handleStatus(irmao, 'aprovado')}
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