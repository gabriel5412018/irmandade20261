import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../components/useAuth'
import {
  getPerfil,
  updatePerfil,
  uploadFotoPerfil,
} from '../services/perfilService'

const STATUS_LABEL = {
  pendente: { label: 'Cadastro pendente', tone: 'warning' },
  aprovado: { label: 'Aprovado', tone: 'success' },
  inativo: { label: 'Inativo', tone: 'neutral' },
}

function PerfilScreen() {
  const { user } = useAuth()
  const [perfil, setPerfil] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      if (!user) return
      const { data, error: loadError } = await getPerfil(user.id)
      if (loadError) {
        setError(loadError.message)
      } else if (data) {
        setPerfil(data)
        setName(data.full_name)
        setPhone(data.phone)
        setPhotoUrl(data.photo_url ?? '')
      }
      setLoading(false)
    }
    load()
  }, [user])

  async function handleSave(event) {
    event.preventDefault()
    setMessage('')
    setError('')
    setSaving(true)

    const { error: saveError } = await updatePerfil(user.id, {
      full_name: name,
      phone,
      photo_url: photoUrl || null,
    })

    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }

    setMessage('Perfil atualizado com sucesso.')
  }

  async function handleUploadPhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setMessage('')
    setError('')
    setUploading(true)

    const { data: publicUrl, error: uploadError } = await uploadFotoPerfil(
      user.id,
      file,
    )

    setUploading(false)
    if (uploadError) {
      setError(uploadError.message)
      return
    }
    setPhotoUrl(publicUrl)
    setMessage('Foto enviada. Clique em "Salvar perfil" para confirmar.')
  }

  if (loading) {
    return <p className="screen__muted">Carregando...</p>
  }

  const status = perfil ? STATUS_LABEL[perfil.status] ?? STATUS_LABEL.pendente : null

  return (
    <div className="screen">
      <Card title="Meu Perfil">
        <div className="perfil">
          <Avatar name={name || '?'} src={photoUrl || undefined} size={72} />
          <div>
            <p className="perfil__nome">{name || 'Sem nome'}</p>
            <p className="perfil__muted">{user?.email}</p>
            {status && <Badge tone={status.tone}>{status.label}</Badge>}
          </div>
        </div>

        <form onSubmit={handleSave} className="perfil__form">
          <Input
            label="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(00) 00000-0000"
          />
          <div className="perfil__foto-acoes">
            <label className="button button--secondary">
              {uploading ? 'Enviando...' : '📷 Enviar foto'}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={handleUploadPhoto}
              />
            </label>
          </div>
          <Input
            label="Foto (URL)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://exemplo.com/foto.jpg"
          />
          {error && <p className="screen__error">{error}</p>}
          {message && <p className="screen__success">{message}</p>}
          <Button type="submit" className="screen__full" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar perfil'}
          </Button>
        </form>

        <p className="screen__muted">
          Você pode enviar uma foto do seu dispositivo ou informar um link de
          imagem (URL).
        </p>
      </Card>

      <div className="perfil__link">
        <Link to="/historico-presenca">
          <Button variant="secondary">Meu histórico de presença</Button>
        </Link>
      </div>
    </div>
  )
}

export default PerfilScreen