import { useEffect, useState } from 'react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { listAvisos } from '../services/avisoService'

function AvisosScreen() {
  const [avisos, setAvisos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error: listError } = await listAvisos()
      if (cancelled) return
      if (listError) {
        setError(listError.message)
      } else {
        setAvisos(data ?? [])
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

  return (
    <div className="screen">
      <h1>Avisos</h1>

      {error && <p className="screen__error">{error}</p>}

      {avisos.length === 0 && (
        <Card>
          <p className="screen__muted">Nenhum aviso publicado ainda.</p>
        </Card>
      )}

      <div className="avisos-list">
        {avisos.map((aviso) => (
          <Card
            key={aviso.id}
            className={aviso.importante ? 'aviso aviso--importante' : 'aviso'}
          >
            <div className="aviso__header">
              <h3 className="aviso__titulo">{aviso.titulo}</h3>
              {aviso.importante && (
                <Badge tone="danger">Importante</Badge>
              )}
            </div>
            <p className="aviso__data">{aviso.data}</p>
            <p className="aviso__mensagem">{aviso.mensagem}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AvisosScreen