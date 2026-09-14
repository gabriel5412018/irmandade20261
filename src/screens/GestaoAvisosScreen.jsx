import { useEffect, useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Badge from '../components/Badge'
import {
  listAvisos,
  createAviso,
  updateAviso,
  deleteAviso,
} from '../services/avisoService'

function GestaoAvisosScreen() {
  const [avisos, setAvisos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mensagem, setMensagem] = useState('')

  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [data, setData] = useState('')
  const [importante, setImportante] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [saving, setSaving] = useState(false)

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

  function limparFormulario() {
    setTitulo('')
    setConteudo('')
    setData('')
    setImportante(false)
    setEditandoId(null)
  }

  function handleEditar(aviso) {
    setEditandoId(aviso.id)
    setTitulo(aviso.titulo)
    setConteudo(aviso.mensagem)
    setData(aviso.data)
    setImportante(aviso.importante)
    setError('')
    setMensagem('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMensagem('')
    setSaving(true)

    if (!titulo.trim() || !conteudo.trim() || !data) {
      setError('Preencha título, mensagem e data.')
      setSaving(false)
      return
    }

    const payload = {
      titulo: titulo.trim(),
      mensagem: conteudo.trim(),
      data,
      importante,
    }

    const { error: saveError } = editandoId
      ? await updateAviso(editandoId, payload)
      : await createAviso(payload)

    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }

    setMensagem(editandoId ? 'Aviso atualizado.' : 'Aviso publicado.')
    limparFormulario()

    const { data: avisosAtualizados } = await listAvisos()
    setAvisos(avisosAtualizados ?? [])
  }

  async function handleExcluir(aviso) {
    const confirmar = window.confirm(`Excluir o aviso "${aviso.titulo}"?`)
    if (!confirmar) return
    setError('')
    const { error: deleteError } = await deleteAviso(aviso.id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    const { data: avisosAtualizados } = await listAvisos()
    setAvisos(avisosAtualizados ?? [])
  }

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  return (
    <div className="screen screen--wide">
      <h1>Gerenciar avisos</h1>

      {error && <p className="screen__error">{error}</p>}
      {mensagem && <p className="screen__success">{mensagem}</p>}

      <Card title={editandoId ? 'Editar aviso' : 'Novo aviso'}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Ensaio de coroinhas"
            required
          />
          <Input
            label="Data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
          <Textarea
            label="Mensagem"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva a mensagem do aviso..."
            rows={4}
            required
          />
          <label className="aviso__importante-label">
            <input
              type="checkbox"
              checked={importante}
              onChange={(e) => setImportante(e.target.checked)}
            />
            Aviso importante (destacar)
          </label>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving
                ? 'Salvando...'
                : editandoId
                  ? 'Salvar alterações'
                  : 'Publicar aviso'}
            </Button>
            {editandoId && (
              <Button type="button" variant="secondary" onClick={limparFormulario}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card title={`Avisos publicados (${avisos.length})`}>
        {avisos.length === 0 && (
          <p className="screen__muted">Nenhum aviso publicado ainda.</p>
        )}
        <ul className="irmao-list">
          {avisos.map((aviso) => (
            <li
              key={aviso.id}
              className={`irmao-item ${aviso.importante ? 'aviso--importante' : ''}`}
            >
              <div className="irmao-item__info">
                <p className="irmao-item__name">{aviso.titulo}</p>
                <p className="irmao-item__muted">{aviso.data}</p>
              </div>
              {aviso.importante && <Badge tone="danger">Importante</Badge>}
              <div className="irmao-item__actions">
                <Button variant="secondary" onClick={() => handleEditar(aviso)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleExcluir(aviso)}>
                  Excluir
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export default GestaoAvisosScreen