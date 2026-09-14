import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import { listPresencasDoIrmao } from '../services/presencaService'
import { getPerfil } from '../services/perfilService'

const PRESENCA_LABEL = {
  confirmado: { label: 'Confirmado', tone: 'success' },
  nao_comparecer: { label: 'Não poderá comparecer', tone: 'danger' },
  aguardando: { label: 'Aguardando resposta', tone: 'warning' },
}

function HistoricoIrmaoScreen() {
  const { perfilId } = useParams()
  const [perfil, setPerfil] = useState(null)
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [perfilRes, registrosRes] = await Promise.all([
        getPerfil(perfilId),
        listPresencasDoIrmao(perfilId),
      ])
      if (cancelled) return
      if (perfilRes.error || registrosRes.error) {
        setError(
          perfilRes.error?.message ?? registrosRes.error?.message,
        )
      } else {
        setPerfil(perfilRes.data)
        setRegistros(registrosRes.data ?? [])
      }
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [perfilId])

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  const confirmados = registros.filter((r) => r.status === 'confirmado').length
  const ausencias = registros.filter(
    (r) => r.status === 'nao_comparecer',
  ).length

  return (
    <div className="screen screen--wide">
      <h1>Histórico de presença</h1>

      {error && <p className="screen__error">{error}</p>}

      {perfil && (
        <div className="perfil">
          <Avatar
            name={perfil.full_name}
            src={perfil.photo_url || undefined}
            size={56}
          />
          <div>
            <p className="perfil__nome">{perfil.full_name || 'Sem nome'}</p>
            <p className="perfil__muted">{perfil.phone || 'Sem telefone'}</p>
          </div>
        </div>
      )}

      <div className="dashboard">
        <Card title="Confirmados">
          <p className="dashboard__numero presenca__num--confirmado">
            {confirmados}
          </p>
        </Card>
        <Card title="Ausências">
          <p className="dashboard__numero presenca__num--faltara">
            {ausencias}
          </p>
        </Card>
      </div>

      <Card title="Registros">
        {registros.length === 0 && (
          <p className="screen__muted">Nenhum registro de presença.</p>
        )}
        <ul className="escala-list">
          {registros.map((registro) => {
            const label = PRESENCA_LABEL[registro.status]
            const escala = registro.escalas
            return (
              <li key={registro.id} className="escala-item">
                <div className="escala-item__info">
                  <p className="escala-item__titulo">
                    {escala?.celebracao ?? 'Escala'} ·{' '}
                    {escala?.data ?? '—'} {escala?.horario ?? ''}
                  </p>
                  {escala?.descricao && (
                    <p className="escala-item__desc">{escala.descricao}</p>
                  )}
                  {registro.observacao && (
                    <p className="presenca__obs-texto">
                      Obs.: {registro.observacao}
                    </p>
                  )}
                </div>
                <Badge tone={label.tone}>{label.label}</Badge>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}

export default HistoricoIrmaoScreen