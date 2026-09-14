import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import CoordenadorMenu from '../components/CoordenadorMenu'
import { listEscalas } from '../services/escalaService'
import { listPresencasDaEscala } from '../services/presencaService'

function ControlePresencaScreen() {
  const [escalas, setEscalas] = useState([])
  const [contagens, setContagens] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error: listError } = await listEscalas()
      if (cancelled) return
      if (listError) {
        setError(listError.message)
        setLoading(false)
        return
      }
      setEscalas(data ?? [])

      const mapa = {}
      for (const escala of data ?? []) {
        const { data: presencas } = await listPresencasDaEscala(escala.id)
        const counts = { confirmado: 0, nao_comparecer: 0, aguardando: 0 }
        for (const p of presencas ?? []) {
          if (counts[p.status] !== undefined) counts[p.status] += 1
        }
        mapa[escala.id] = counts
      }
      if (!cancelled) setContagens(mapa)
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

  return (
    <div className="screen screen--wide">
      <h1>Controle de presença</h1>
      <CoordenadorMenu />

      {error && <p className="screen__error">{error}</p>}

      <Card title="Escalas e presenças">
        {escalas.length === 0 && (
          <p className="screen__muted">
            Nenhuma escala cadastrada ainda.
          </p>
        )}
        <ul className="escala-list">
          {escalas.map((escala) => {
            const c = contagens[escala.id] ?? {
              confirmado: 0,
              nao_comparecer: 0,
              aguardando: 0,
            }
            return (
              <li key={escala.id} className="escala-item">
                <div className="escala-item__info">
                  <p className="escala-item__titulo">
                    {escala.celebracao} · {escala.data} {escala.horario}
                  </p>
                  {escala.descricao && (
                    <p className="escala-item__desc">{escala.descricao}</p>
                  )}
                </div>
                <div className="presenca-resumo">
                  <Badge tone="success">{c.confirmado} confirmado</Badge>
                  <Badge tone="danger">{c.nao_comparecer} faltará</Badge>
                  <Badge tone="neutral">{c.aguardando} aguardando</Badge>
                </div>
                <Link to={`/coordenador/escala/${escala.id}/presencas`}>
                  <Button variant="secondary">Ver presenças</Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}

export default ControlePresencaScreen