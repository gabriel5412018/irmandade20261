import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Textarea from '../components/Textarea'
import Avatar from '../components/Avatar'
import { getEscala } from '../services/escalaService'
import { listPresencasDaEscala, upsertPresenca } from '../services/presencaService'
import { getPerfil } from '../services/perfilService'

const PRESENCA_LABEL = {
  confirmado: { label: 'Confirmado', tone: 'success' },
  nao_comparecer: { label: 'Não poderá comparecer', tone: 'danger' },
  aguardando: { label: 'Aguardando resposta', tone: 'warning' },
}

function PresencasEscalaScreen() {
  const { id } = useParams()
  const [escala, setEscala] = useState(null)
  const [presencas, setPresencas] = useState([])
  const [perfis, setPerfis] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(null)
  const [observacao, setObservacao] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

async function load() {
      const [escalaRes, presencasRes] = await Promise.all([
        getEscala(id),
        listPresencasDaEscala(id),
      ])
      if (cancelled) return

      if (escalaRes.error || presencasRes.error) {
        setError(escalaRes.error?.message ?? presencasRes.error?.message)
        setLoading(false)
        return
      }

      setEscala(escalaRes.data)
      setPresencas(presencasRes.data ?? [])

      const ids = new Set(
        (escalaRes.data?.escala_irmaos ?? []).map((ei) => ei.perfil_id),
      )
      const perfisMap = {}
      for (const pid of ids) {
        const { data } = await getPerfil(pid)
        if (data) perfisMap[pid] = data
      }
      if (!cancelled) setPerfis(perfisMap)
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id])

  function handleEdit(p) {
    setEditando(p.id)
    setObservacao(p.observacao ?? '')
    setError('')
  }

  async function handleSalvarObservacao() {
    setSaving(true)
    const { error: saveError } = await upsertPresenca({
      escalaId: id,
      perfilId: editando,
      status:
        presencas.find((p) => p.id === editando)?.status ?? 'aguardando',
      observacao,
    })
    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }
    setPresencas((prev) =>
      prev.map((p) =>
        p.id === editando ? { ...p, observacao } : p,
      ),
    )
    setEditando(null)
  }

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  const escalados = (escala?.escala_irmaos ?? []).map((ei) => {
    const presenca = presencas.find((p) => p.perfil_id === ei.perfil_id)
    return {
      id: ei.id,
      perfil_id: ei.perfil_id,
      funcao: escala.funcoes?.find((f) => f.id === ei.funcao_id)?.nome ?? '—',
      papel: ei.papel,
      nome: perfis[ei.perfil_id]?.full_name ?? 'Sem nome',
      status: presenca?.status ?? 'aguardando',
      observacao: presenca?.observacao ?? null,
      presencaId: presenca?.id ?? null,
    }
  })

  const filtros = {
    confirmado: escalados.filter((e) => e.status === 'confirmado'),
    nao_comparecer: escalados.filter((e) => e.status === 'nao_comparecer'),
    aguardando: escalados.filter((e) => e.status === 'aguardando'),
  }

  return (
    <div className="screen screen--wide">
      <h1>Presenças da escala</h1>
      {escala && (
        <p className="screen__muted">
          {escala.celebracao} · {escala.data} {escala.horario}
          {escala.descricao && ` — ${escala.descricao}`}
        </p>
      )}

      {error && <p className="screen__error">{error}</p>}

      <div className="dashboard">
        <Card title="Confirmado">
          <p className="dashboard__numero presenca__num--confirmado">
            {filtros.confirmado.length}
          </p>
        </Card>
        <Card title="Não poderá comparecer">
          <p className="dashboard__numero presenca__num--faltara">
            {filtros.nao_comparecer.length}
          </p>
        </Card>
        <Card title="Aguardando resposta">
          <p className="dashboard__numero presenca__num--aguardando">
            {filtros.aguardando.length}
          </p>
        </Card>
      </div>

      <Card title="Respostas dos irmãos">
        {escalados.length === 0 && (
          <p className="screen__muted">
            Nenhum irmão escalado nesta escala.
          </p>
        )}
        <ul className="irmao-list">
          {escalados.map((e) => {
            const label = PRESENCA_LABEL[e.status]
            const ehEditando = editando === e.perfil_id
            return (
              <li key={e.id} className="irmao-item presenca-item">
                <Avatar
                  name={e.nome}
                  src={perfis[e.perfil_id]?.photo_url || undefined}
                  size={44}
                />
                <div className="irmao-item__info">
                  <p className="irmao-item__name">{e.nome}</p>
                  <p className="irmao-item__muted">
                    {e.funcao}
                    {e.papel && ` · ${e.papel}`}
                  </p>
                  {e.observacao && !ehEditando && (
                    <p className="presenca__obs-texto">
                      Obs.: {e.observacao}
                    </p>
                  )}
                  {ehEditando && (
                    <div className="presenca__edit">
                      <Textarea
                        label="Observação"
                        value={observacao}
                        onChange={(ev) => setObservacao(ev.target.value)}
                        rows={2}
                      />
                      <div className="presenca__edit-acoes">
                        <Button
                          variant="primary"
                          disabled={saving}
                          onClick={handleSalvarObservacao}
                        >
                          Salvar
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setEditando(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <Badge tone={label.tone}>{label.label}</Badge>
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(e)}
                >
                  Obs.
                </Button>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}

export default PresencasEscalaScreen