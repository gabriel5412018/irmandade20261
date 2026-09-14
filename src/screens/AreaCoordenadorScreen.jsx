import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import CoordenadorMenu from '../components/CoordenadorMenu'
import { listEscalas, updateEscala } from '../services/escalaService'
import { listPresencasDaEscala } from '../services/presencaService'

function PresencaResumo({ escalaId }) {
  const [contagens, setContagens] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data } = await listPresencasDaEscala(escalaId)
      if (cancelled) return
      const counts = { confirmado: 0, nao_comparecer: 0, aguardando: 0 }
      for (const p of data ?? []) {
        if (counts[p.status] !== undefined) counts[p.status] += 1
      }
      setContagens(counts)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [escalaId])

  if (!contagens) {
    return <span className="screen__muted">—</span>
  }

  return (
    <div className="presenca-resumo">
      <Badge tone="success">{contagens.confirmado} confirmado</Badge>
      <Badge tone="danger">{contagens.nao_comparecer} faltará</Badge>
      <Badge tone="neutral">{contagens.aguardando} aguardando</Badge>
    </div>
  )
}

function AreaCoordenadorScreen() {
  const [escalas, setEscalas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error: listError } = await listEscalas()
      if (cancelled) return
      if (listError) {
        setError(listError.message)
      } else {
        setEscalas(data ?? [])
      }
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  const publicadas = escalas.filter((e) => e.status === 'publicada')
  const rascunhos = escalas.filter((e) => e.status === 'rascunho')

  async function handlePublicar(escala) {
    setError('')
    const { error: updateError } = await updateEscala(escala.id, {
      status: 'publicada',
    })
    if (updateError) {
      setError(updateError.message)
      return
    }
    const { data } = await listEscalas()
    setEscalas(data ?? [])
  }

  return (
    <div className="screen screen--wide">
      <h1>Área do Coordenador</h1>
      <CoordenadorMenu />

      {error && <p className="screen__error">{error}</p>}

      <div className="montar-escala-destaque">
        <div>
          <h2 className="montar-escala-destaque__titulo">
            Montar nova escala
          </h2>
          <p className="screen__muted">
            Crie uma escala com celebração, data, horário e as funções da
            celebração.
          </p>
        </div>
        <Link to="/coordenador/escala/nova">
          <Button variant="primary" className="montar-escala-destaque__btn">
            📅 Montar escala
          </Button>
        </Link>
      </div>

      <Card title={`Escalas cadastradas (${escalas.length})`}>
        {escalas.length === 0 && (
          <p className="screen__muted">
            Nenhuma escala cadastrada ainda. Use "Montar escala" para criar a
            primeira.
          </p>
        )}
        <ul className="escala-list">
          {escalas.map((escala) => (
            <li key={escala.id} className="escala-item">
              <div className="escala-item__info">
                <p className="escala-item__titulo">
                  {escala.celebracao} · {escala.data} {escala.horario}
                </p>
                {escala.descricao && (
                  <p className="escala-item__desc">{escala.descricao}</p>
                )}
              </div>
              <Badge
                tone={escala.status === 'publicada' ? 'success' : 'warning'}
              >
                {escala.status === 'publicada' ? 'Publicada' : 'Rascunho'}
              </Badge>
              <PresencaResumo escalaId={escala.id} />
              {escala.status === 'rascunho' && (
                <Button variant="success" onClick={() => handlePublicar(escala)}>
                  Publicar
                </Button>
              )}
              <Link to={`/coordenador/escala/${escala.id}`}>
                <Button variant="secondary">Editar</Button>
              </Link>
              <Link to={`/coordenador/escala/${escala.id}/presencas`}>
                <Button variant="secondary">Presenças</Button>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <div className="dashboard">
        <Card title="Publicadas">
          <p className="dashboard__numero presenca__num--confirmado">
            {publicadas.length}
          </p>
        </Card>
        <Card title="Rascunhos">
          <p className="dashboard__numero presenca__num--aguardando">
            {rascunhos.length}
          </p>
        </Card>
      </div>
    </div>
  )
}

export default AreaCoordenadorScreen