import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Textarea from '../components/Textarea'
import EscalaVisual from '../components/EscalaVisual'
import { getEscala } from '../services/escalaService'
import { getPresenca, upsertPresenca } from '../services/presencaService'
import { useAuth } from '../components/useAuth'

const PRESENCA_LABEL = {
  confirmado: { label: 'Confirmado', tone: 'success' },
  nao_comparecer: { label: 'Não poderá comparecer', tone: 'danger' },
  aguardando: { label: 'Aguardando resposta', tone: 'warning' },
}

function DetalheEscalaScreen() {
  const { id } = useParams()
  const { user } = useAuth()
  const [escala, setEscala] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [minhaPresenca, setMinhaPresenca] = useState(null)
  const [saving, setSaving] = useState(false)
  const [observacao, setObservacao] = useState('')
  const [mensagem, setMensagem] = useState('')

  const estouEscalado = Boolean(
    escala?.escala_irmaos?.some((ei) => ei.perfil_id === user?.id),
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error: loadError } = await getEscala(id)
      if (cancelled) return
      if (loadError || !data) {
        setError(loadError?.message ?? 'Escala não encontrada.')
        setLoading(false)
        return
      }
      setEscala(data)

      const { data: presenca } = await getPresenca(id, user.id)
      if (!cancelled && presenca) {
        setMinhaPresenca(presenca)
        setObservacao(presenca.observacao ?? '')
      }
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id, user.id])

  async function handleResponder(status) {
    setError('')
    setMensagem('')
    setSaving(true)
    const { error: saveError } = await upsertPresenca({
      escalaId: id,
      perfilId: user.id,
      status,
      observacao: status === 'nao_comparecer' ? observacao : null,
    })
    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }
    setMinhaPresenca((prev) => ({
      ...prev,
      escala_id: id,
      perfil_id: user.id,
      status,
      observacao: status === 'nao_comparecer' ? observacao : null,
    }))
    setMensagem('Resposta registrada.')
  }

  async function handleSalvarObservacao() {
    setError('')
    setMensagem('')
    setSaving(true)
    const { error: saveError } = await upsertPresenca({
      escalaId: id,
      perfilId: user.id,
      status: minhaPresenca?.status ?? 'aguardando',
      observacao,
    })
    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }
    setMinhaPresenca((prev) => ({
      ...prev,
      escala_id: id,
      perfil_id: user.id,
      status: prev?.status ?? 'aguardando',
      observacao,
    }))
    setMensagem('Observação atualizada.')
  }

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  if (error || !escala) {
    return <p className="screen__error">{error}</p>
  }

  const funcoes = (escala.funcoes ?? []).map((f) => ({
    id: f.id,
    nome: f.nome,
    irmaos: (escala.escala_irmaos ?? [])
      .filter((ei) => ei.funcao_id === f.id)
      .map((ei) => ({
        id: ei.id,
        nome: ei.perfis?.full_name ?? 'Sem nome',
        papel: ei.papel,
        perfil_id: ei.perfil_id,
      })),
  }))

  const minhasFuncoes = funcoes
    .map((f) => ({
      ...f,
      irmaos: f.irmaos.filter((i) => i.perfil_id === user?.id),
    }))
    .filter((f) => f.irmaos.length > 0)

  const presencaLabel = minhaPresenca
    ? PRESENCA_LABEL[minhaPresenca.status]
    : PRESENCA_LABEL.aguardando

  return (
    <div className="screen screen--wide">
      <Card title="Escala completa">
        <EscalaVisual
          celebracao={escala.celebracao}
          data={escala.data}
          horario={escala.horario}
          descricao={escala.descricao}
          funcoes={funcoes}
        />
        <div className="detalhe__badge">
          {escala.status === 'publicada' && (
            <Badge tone="success">Publicada</Badge>
          )}
        </div>
      </Card>

      {minhasFuncoes.length > 0 && (
        <Card title="Minhas funções nesta escala">
          <EscalaVisual
            celebracao={escala.celebracao}
            data={escala.data}
            horario={escala.horario}
            descricao={escala.descricao}
            funcoes={minhasFuncoes}
          />

          <div className="presenca">
            <div className="presenca__status">
              <Badge tone={presencaLabel.tone}>{presencaLabel.label}</Badge>
            </div>

            {estouEscalado && (
              <div className="presenca__acoes">
                <Button
                  variant="success"
                  disabled={saving || minhaPresenca?.status === 'confirmado'}
                  onClick={() => handleResponder('confirmado')}
                >
                  VOU COMPARECER
                </Button>
                <Button
                  variant="danger"
                  disabled={saving}
                  onClick={() => handleResponder('nao_comparecer')}
                >
                  NÃO VOU COMPARECER
                </Button>
              </div>
            )}

            {minhaPresenca?.status === 'nao_comparecer' && (
              <div className="presenca__observacao">
                <Textarea
                  label="Observação (visível ao coordenador)"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Não poderei comparecer porque..."
                  rows={3}
                />
                <Button
                  variant="secondary"
                  disabled={saving}
                  onClick={handleSalvarObservacao}
                >
                  Salvar observação
                </Button>
              </div>
            )}

            {minhaPresenca?.observacao &&
              minhaPresenca.status !== 'nao_comparecer' && (
                <div className="presenca__observacao-visual">
                  <p className="screen__muted">Observação registrada:</p>
                  <p className="presenca__obs-texto">
                    {minhaPresenca.observacao}
                  </p>
                </div>
              )}

            {mensagem && <p className="screen__success">{mensagem}</p>}
            {error && <p className="screen__error">{error}</p>}
          </div>
        </Card>
      )}
    </div>
  )
}

export default DetalheEscalaScreen