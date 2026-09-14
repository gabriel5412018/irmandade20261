import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { listEscalas, deleteEscala } from '../services/escalaService'
import { useAuth } from '../components/useAuth'

function EscalasScreen() {
  const { user, perfil } = useAuth()
  const [escalas, setEscalas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isCoordenador = perfil?.role === 'coordenador'

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error: listError } = await listEscalas({
        publicadasOnly: true,
      })
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

  const hoje = new Date().toISOString().slice(0, 10)
  const proximas = escalas.filter((e) => e.data >= hoje)
  const anteriores = escalas.filter((e) => e.data < hoje)

  async function handleExcluir(escala) {
    if (!window.confirm(`Excluir a escala "${escala.celebracao}" de ${escala.data}?`)) {
      return
    }
    setError('')
    const { error: deleteError } = await deleteEscala(escala.id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    setEscalas((prev) => prev.filter((e) => e.id !== escala.id))
  }

  return (
    <div className="screen">
      <h1>Escalas</h1>

      {error && <p className="screen__error">{error}</p>}

      <Card title="Próximas escalas">
        {proximas.length === 0 && (
          <p className="screen__muted">Nenhuma escala publicada em breve.</p>
        )}
        <ul className="escala-list">
          {proximas.map((escala) => (
            <li key={escala.id} className="escala-item">
              <div className="escala-item__info">
                <p className="escala-item__titulo">
                  {escala.celebracao} · {escala.data} {escala.horario}
                </p>
                {escala.descricao && (
                  <p className="escala-item__desc">{escala.descricao}</p>
                )}
              </div>
              <Badge tone="success">Publicada</Badge>
              <Link to={`/escalas/${escala.id}`}>
                <Badge tone="info">Ver detalhes</Badge>
              </Link>
              {isCoordenador && (
                <Button
                  variant="danger"
                  onClick={() => handleExcluir(escala)}
                >
                  Excluir
                </Button>
              )}
            </li>
          ))}
        </ul>
      </Card>

      {anteriores.length > 0 && (
        <Card title="Escalas já realizadas">
          <ul className="escala-list">
            {anteriores.map((escala) => (
              <li key={escala.id} className="escala-item">
                <div className="escala-item__info">
                  <p className="escala-item__titulo">
                    {escala.celebracao} · {escala.data} {escala.horario}
                  </p>
                  {escala.descricao && (
                    <p className="escala-item__desc">{escala.descricao}</p>
                  )}
                </div>
                <Badge tone="success">Publicada</Badge>
                <Link to={`/escalas/${escala.id}`}>
                  <Badge tone="info">Ver detalhes</Badge>
                </Link>
                {isCoordenador && (
                  <Button
                    variant="danger"
                    onClick={() => handleExcluir(escala)}
                  >
                    Excluir
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p className="screen__muted">
        Logado como: {user?.email}
      </p>
    </div>
  )
}

export default EscalasScreen