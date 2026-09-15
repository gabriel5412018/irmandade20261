import { useEffect, useState } from 'react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import { useAuth } from '../components/useAuth'
import { updatePerfilByCoordenador } from '../services/perfilService'
import { listarUsuarios, definirRole } from '../services/conviteService'
import { getPerfilStatusLabel } from '../utils/status'

const ROLE_LABEL = {
  administrador: { label: 'Administrador', tone: 'danger' },
  coordenador: { label: 'Coordenador', tone: 'info' },
  irmao: { label: 'Irmão', tone: 'neutral' },
}

function AdminScreen() {
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    const { data, error: loadError } = await listarUsuarios()
    if (loadError) {
      setError(loadError.message)
    } else {
      setUsuarios(data ?? [])
    }
  }

  useEffect(() => {
    let cancelled = false

    async function init() {
      const { data, error: loadError } = await listarUsuarios()
      if (cancelled) return
      if (loadError) {
        setError(loadError.message)
      } else {
        setUsuarios(data ?? [])
      }
      setLoading(false)
    }

    init()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleStatus(usuario, newStatus) {
    setError('')
    setMessage('')
    const { error: updateError } = await updatePerfilByCoordenador(
      usuario.id,
      { status: newStatus },
    )
    if (updateError) {
      setError(updateError.message)
      return
    }
    setMessage('Status atualizado.')
    load()
  }

  async function handleRole(usuario, novoRole) {
    setError('')
    setMessage('')
    const { error: roleError } = await definirRole(usuario.id, novoRole)
    if (roleError) {
      setError(roleError.message)
      return
    }
    setMessage('Permissão atualizada.')
    load()
  }

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  return (
    <div className="screen screen--wide">
      <h1>Área Administrativa</h1>

      {error && <p className="screen__error">{error}</p>}
      {message && <p className="screen__success">{message}</p>}

      <Card title={`Usuários (${usuarios.length})`}>
        {usuarios.length === 0 && (
          <p className="screen__muted">Nenhum usuário cadastrado ainda.</p>
        )}
        <ul className="irmao-list">
          {usuarios.map((usuario) => {
            const role = ROLE_LABEL[usuario.role] ?? ROLE_LABEL.irmao
            const status = getPerfilStatusLabel(usuario.status)
            const ehProprio = usuario.id === user?.id
            return (
              <li key={usuario.id} className="irmao-item">
                <Avatar
                  name={usuario.full_name}
                  src={usuario.photo_url || undefined}
                  size={44}
                />
                <div className="irmao-item__info">
                  <p className="irmao-item__name">
                    {usuario.full_name || 'Sem nome'}
                    {ehProprio && <span> (você)</span>}
                  </p>
                  <p className="irmao-item__muted">{usuario.email}</p>
                </div>
                <Badge tone={role.tone}>{role.label}</Badge>
                <Badge tone={status.tone}>{status.label}</Badge>
                <div className="irmao-item__actions">
                  {usuario.status === 'ativo' ? (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatus(usuario, 'inativo')}
                    >
                      Desativar
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatus(usuario, 'ativo')}
                    >
                      Ativar
                    </Button>
                  )}
                  {!ehProprio && usuario.role === 'irmao' && (
                    <Button
                      variant="primary"
                      onClick={() => handleRole(usuario, 'coordenador')}
                    >
                      Autorizar coordenador
                    </Button>
                  )}
                  {!ehProprio && usuario.role === 'coordenador' && (
                    <Button
                      variant="secondary"
                      onClick={() => handleRole(usuario, 'irmao')}
                    >
                      Remover coordenação
                    </Button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}

export default AdminScreen