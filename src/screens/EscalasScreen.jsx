import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import { listEscalas, deleteEscala } from '../services/escalaService'
import { useAuth } from '../components/useAuth'
import { isCoordenador, isAdministrador } from '../utils/roles'

function EscalasScreen() {
  const { user, perfil } = useAuth()
  const [escalas, setEscalas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [excluirEscala, setExcluirEscala] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const podeExcluir = isCoordenador(perfil) || isAdministrador(perfil)

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

  async function handleConfirmarExclusao() {
    if (!excluirEscala) return
    setDeleting(true)
    setError('')
    const { error: deleteError } = await deleteEscala(excluirEscala.id)
    setDeleting(false)
    if (deleteError) {
      setError(deleteError.message)
      setExcluirEscala(null)
      return
    }
    setEscalas((prev) => prev.filter((e) => e.id !== excluirEscala.id))
    setExcluirEscala(null)
  }

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  const hoje = new Date().toISOString().slice(0, 10)
  const proximas = escalas.filter((e) => e.data >= hoje)
  const anteriores = escalas.filter((e) => e.data < hoje)

  function renderItem(escala) {
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
        <Badge tone="success">Publicada</Badge>
        <Link to={`/escalas/${escala.id}`}>
          <Badge tone="info">Ver detalhes</Badge>
        </Link>
        {podeExcluir && (
          <Button variant="danger" onClick={() => setExcluirEscala(escala)}>
            Excluir
          </Button>
        )}
      </li>
    )
  }

  return (
    <div className="screen">
      <h1>Escalas</h1>

      {error && <p className="screen__error">{error}</p>}

      <Card title="Próximas escalas">
        {proximas.length === 0 && (
          <p className="screen__muted">Nenhuma escala publicada em breve.</p>
        )}
        <ul className="escala-list">{proximas.map(renderItem)}</ul>
      </Card>

      {anteriores.length > 0 && (
        <Card title="Escalas já realizadas">
          <ul className="escala-list">{anteriores.map(renderItem)}</ul>
        </Card>
      )}

      <ConfirmDialog
        open={Boolean(excluirEscala)}
        title="Excluir escala"
        message="Esta escala já foi publicada e pode possuir respostas de presença. Tem certeza que deseja excluí-la? Essa ação não poderá ser desfeita."
        confirmLabel={deleting ? 'Excluindo...' : 'Excluir'}
        onConfirm={handleConfirmarExclusao}
        onCancel={() => setExcluirEscala(null)}
      />

      <p className="screen__muted">Logado como: {user?.email}</p>
    </div>
  )
}

export default EscalasScreen