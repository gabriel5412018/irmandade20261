import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Badge from '../components/Badge'
import EscalaVisual from '../components/EscalaVisual'
import {
  createEscala,
  getEscala,
  updateEscala,
  deleteEscala,
  addFuncao,
  deleteFuncao,
  addIrmaoNaEscala,
} from '../services/escalaService'
import { listPerfis } from '../services/perfilService'
import { FUNCOES_PADRAO, IRMAOS_MOCK } from '../data/irmaosMock'

function criarFuncaoVazia(nome, ordem, permiteVarios = false, papeis = []) {
  return {
    id: `novo-${Date.now()}-${ordem}`,
    nome,
    ordem,
    papeis,
    permiteVarios,
    irmaos: [],
  }
}

function CriarEscalaScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [celebracao, setCelebracao] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [descricao, setDescricao] = useState('')
  const [status, setStatus] = useState('rascunho')
  const [funcoes, setFuncoes] = useState([])
  const [irmaosDisponiveis, setIrmaosDisponiveis] = useState([])
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      const { data: perfis, error: perfisError } = await listPerfis()

      const aprovados = (perfis ?? []).filter((p) => p.status === 'aprovado')
      const origemMock = perfisError || aprovados.length === 0
      setIrmaosDisponiveis(origemMock ? IRMAOS_MOCK : aprovados)

      if (!isEditing) {
        setFuncoes(
          FUNCOES_PADRAO.map((f, index) =>
            criarFuncaoVazia(
              f.nome,
              index,
              f.nome === 'SALÃO E APOIO',
              f.papeis,
            ),
          ),
        )
        setLoading(false)
        return
      }

      const { data: escala, error: escalaError } = await getEscala(id)
      if (escalaError) {
        setError(escalaError.message)
        setLoading(false)
        return
      }
      if (escala) {
        setCelebracao(escala.celebracao)
        setData(escala.data)
        setHorario(escala.horario)
        setDescricao(escala.descricao ?? '')
        setStatus(escala.status)
        setFuncoes(
          (escala.funcoes ?? []).map((f) => {
            const padrao = FUNCOES_PADRAO.find((p) => p.nome === f.nome)
            return {
              id: f.id,
              nome: f.nome,
              ordem: f.ordem,
              papeis: padrao?.papeis ?? [],
              permiteVarios: padrao?.nome === 'SALÃO E APOIO',
              irmaos: (escala.escala_irmaos ?? [])
                .filter((ei) => ei.funcao_id === f.id)
                .map((ei) => ({
                  id: ei.id,
                  perfil_id: ei.perfil_id,
                  papel: ei.papel,
                  nome: ei.perfis?.full_name ?? 'Sem nome',
                })),
            }
          }),
        )
      }
      setLoading(false)
    }

    load()
  }, [id, isEditing])

  const irmãosPorId = useMemo(
    () => Object.fromEntries(irmaosDisponiveis.map((i) => [i.id, i.full_name])),
    [irmaosDisponiveis],
  )

  function handleAddFuncao() {
    setFuncoes((prev) => [
      ...prev,
      criarFuncaoVazia('', prev.length, false),
    ])
  }

  function handleFuncaoNome(funcaoId, nome) {
    setFuncoes((prev) =>
      prev.map((f) => (f.id === funcaoId ? { ...f, nome } : f)),
    )
  }

  function handleRemoveFuncao(funcaoId) {
    setFuncoes((prev) => prev.filter((f) => f.id !== funcaoId))
  }

  function setIrmaoNaFuncao(funcaoId, papel, perfilId) {
    if (!perfilId) return
    setFuncoes((prev) =>
      prev.map((f) => {
        if (f.id !== funcaoId) return f
        const existente = f.irmaos.find((i) => i.papel === papel)
        if (existente) {
          return {
            ...f,
            irmaos: f.irmaos.map((i) =>
              i.papel === papel
                ? { ...i, perfil_id: perfilId, nome: irmãosPorId[perfilId] }
                : i,
            ),
          }
        }
        return {
          ...f,
          irmaos: [
            ...f.irmaos,
            {
              id: `novo-${Date.now()}`,
              perfil_id: perfilId,
              papel: papel || null,
              nome: irmãosPorId[perfilId] ?? 'Sem nome',
            },
          ],
        }
      }),
    )
  }

  function handleAddIrmaoSimples(funcaoId, perfilId) {
    if (!perfilId) return
    setFuncoes((prev) =>
      prev.map((f) => {
        if (f.id !== funcaoId) return f
        if (f.irmaos.some((i) => i.perfil_id === perfilId)) return f
        return {
          ...f,
          irmaos: [
            ...f.irmaos,
            {
              id: `novo-${Date.now()}`,
              perfil_id: perfilId,
              papel: null,
              nome: irmãosPorId[perfilId] ?? 'Sem nome',
            },
          ],
        }
      }),
    )
  }

  function handleRemoveIrmao(funcaoId, irmaoId) {
    setFuncoes((prev) =>
      prev.map((f) =>
        f.id === funcaoId
          ? { ...f, irmaos: f.irmaos.filter((i) => i.id !== irmaoId) }
          : f,
      ),
    )
  }

  async function save(publish = false) {
    setError('')
    setMessage('')
    setSaving(true)

    if (!celebracao || !data || !horario) {
      setError('Preencha celebração, data e horário.')
      setSaving(false)
      return
    }

    const funcoesValidas = funcoes.filter((f) => f.nome.trim())
    if (funcoesValidas.length === 0) {
      setError('Adicione pelo menos uma função com nome.')
      setSaving(false)
      return
    }

    const nextStatus = publish ? 'publicada' : 'rascunho'

    let escalaId = id
    if (!isEditing) {
      const { data: nova, error: createError } = await createEscala({
        celebracao,
        data,
        horario,
        descricao,
      })
      if (createError) {
        setError(createError.message)
        setSaving(false)
        return
      }
      escalaId = nova.id
    } else {
      const { error: updateError } = await updateEscala(id, {
        celebracao,
        data,
        horario,
        descricao,
        status: nextStatus,
      })
      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }
    }

    if (isEditing) {
      const { data: atual } = await getEscala(escalaId)
      for (const f of atual?.funcoes ?? []) {
        await deleteFuncao(f.id)
      }
    }

    for (const f of funcoesValidas) {
      const { data: funcao, error: funcaoError } = await addFuncao(
        escalaId,
        f.nome.trim(),
        f.ordem,
      )
      if (funcaoError) continue
      for (const irmao of f.irmaos) {
        await addIrmaoNaEscala(
          escalaId,
          funcao.id,
          irmao.perfil_id,
          irmao.papel,
        )
      }
    }

    setSaving(false)
    setMessage(
      publish ? 'Escala publicada com sucesso!' : 'Escala salva como rascunho.',
    )

    if (!isEditing) {
      navigate(`/coordenador/escala/${escalaId}`, { replace: true })
    }
  }

  async function handleExcluir() {
    if (!isEditing) return
    const confirmar = window.confirm('Excluir esta escala?')
    if (!confirmar) return
    const { error: deleteError } = await deleteEscala(id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    navigate('/coordenador', { replace: true })
  }

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  return (
    <div className="screen screen--wide">
      <h1>{isEditing ? 'Editar escala' : 'Criar nova escala'}</h1>

      {error && <p className="screen__error">{error}</p>}
      {message && <p className="screen__success">{message}</p>}

      <Card title="Dados da escala">
        <div className="form-grid">
          <Input
            label="Celebração"
            value={celebracao}
            onChange={(e) => setCelebracao(e.target.value)}
            placeholder="Santa Missa"
            required
          />
          <Input
            label="Data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
          <Input
            label="Horário"
            type="time"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            required
          />
        </div>
        <Input
          label="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="1° Domingo Mês - Noite"
        />
      </Card>

      <Card title="Funções e irmãos">
        {funcoes.map((funcao, index) => (
          <div key={funcao.id} className="funcao">
            <div className="funcao__header">
              <Input
                label={`Função ${index + 1}`}
                value={funcao.nome}
                onChange={(e) => handleFuncaoNome(funcao.id, e.target.value)}
                placeholder="CRUZ, AMBÃO, CONSAGRAÇÃO..."
              />
              <Button
                variant="danger"
                onClick={() => handleRemoveFuncao(funcao.id)}
              >
                Remover função
              </Button>
            </div>

            {funcao.papeis.length > 0 ? (
              <div className="funcao__papeis">
                {funcao.papeis.map((papel) => {
                  const irmao = funcao.irmaos.find((i) => i.papel === papel)
                  return (
                    <div key={papel} className="funcao__papel">
                      <label className="funcao__papel-label">{papel}</label>
                      <select
                        className="add-irmao__select"
                        value={irmao?.perfil_id ?? ''}
                        onChange={(e) =>
                          setIrmaoNaFuncao(funcao.id, papel, e.target.value)
                        }
                      >
                        <option value="">Selecionar irmão ▼</option>
                        {irmaosDisponiveis.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.full_name || 'Sem nome'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                })}
              </div>
            ) : (
              <>
                {funcao.irmaos.length > 0 && (
                  <ul className="irmao-list">
                    {funcao.irmaos.map((irmao) => (
                      <li key={irmao.id} className="irmao-item">
                        <div className="irmao-item__info">
                          <p className="irmao-item__name">{irmao.nome}</p>
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() => handleRemoveIrmao(funcao.id, irmao.id)}
                        >
                          Remover
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                <AdicionarIrmaoForm
                  funcaoId={funcao.id}
                  irmaosDisponiveis={irmaosDisponiveis}
                  jaEscalados={funcao.irmaos.map((i) => i.perfil_id)}
                  permiteVarios={funcao.permiteVarios}
                  onAdd={handleAddIrmaoSimples}
                />
              </>
            )}
          </div>
        ))}

        <div className="funcao__add">
          <Button variant="secondary" onClick={handleAddFuncao}>
            + Adicionar função
          </Button>
        </div>
      </Card>

      <Card title="Pré-visualização da escala">
        <EscalaVisual
          celebracao={celebracao}
          data={data}
          horario={horario}
          descricao={descricao}
          funcoes={funcoes.filter((f) => f.nome.trim())}
        />
      </Card>

      <div className="form-actions">
        <Button variant="primary" disabled={saving} onClick={() => save(false)}>
          {saving ? 'Salvando...' : 'Salvar escala'}
        </Button>
        <Button variant="success" disabled={saving} onClick={() => save(true)}>
          {saving ? 'Publicando...' : 'Publicar escala'}
        </Button>
        {isEditing && (
          <Button variant="danger" onClick={handleExcluir}>
            Excluir
          </Button>
        )}
        {status === 'publicada' && <Badge tone="success">Publicada</Badge>}
      </div>
    </div>
  )
}

function AdicionarIrmaoForm({
  funcaoId,
  irmaosDisponiveis,
  jaEscalados,
  permiteVarios,
  onAdd,
}) {
  const [perfilId, setPerfilId] = useState('')

  const disponiveis = irmaosDisponiveis.filter(
    (i) => !jaEscalados.includes(i.id),
  )

  function handleSubmit(event) {
    event.preventDefault()
    onAdd(funcaoId, perfilId)
    setPerfilId('')
  }

  return (
    <form className="add-irmao" onSubmit={handleSubmit}>
      <select
        className="add-irmao__select"
        value={perfilId}
        onChange={(e) => setPerfilId(e.target.value)}
        required
      >
        <option value="">Selecionar irmão ▼</option>
        {disponiveis.map((i) => (
          <option key={i.id} value={i.id}>
            {i.full_name || 'Sem nome'}
          </option>
        ))}
      </select>
      <Button type="submit">
        {permiteVarios ? '+ Adicionar irmão' : 'Adicionar irmão'}
      </Button>
    </form>
  )
}

export default CriarEscalaScreen