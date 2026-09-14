import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import {
  notificationsSupported,
  getPermission,
  requestPermission,
  notificarNovaEscala,
  notificarLembretePresenca,
  notificarNovoAviso,
} from '../services/notificationService'
import { listMinhasEscalas } from '../services/escalaService'
import { getPresenca } from '../services/presencaService'
import { listAvisos } from '../services/avisoService'

function NotificacoesAtivador() {
  const { user } = useAuth()
  const [permission, setPermission] = useState(() => {
    if (!user || !notificationsSupported()) return null
    return getPermission()
  })

  async function handleAtivar() {
    const result = await requestPermission()
    setPermission(result)
  }

  useEffect(() => {
    if (permission !== 'granted' || !user) return

    let cancelled = false

    async function verificarNotificacoes() {
      const hoje = new Date().toISOString().slice(0, 10)

      const { data: minhasEscalas } = await listMinhasEscalas(user.id)
      if (cancelled) return
      const escalas = (minhasEscalas ?? [])
        .map((ei) => ei.escalas)
        .filter(Boolean)

      for (const escala of escalas) {
        if (escala.status !== 'publicada') continue

        notificarNovaEscala(escala)

        const { data: presenca } = await getPresenca(escala.id, user.id)
        const semResposta = !presenca || presenca.status === 'aguardando'
        if (semResposta && escala.data >= hoje) {
          notificarLembretePresenca({
            ...escala,
            escala_irmao_id: escala.id,
          })
        }
      }

      const { data: avisos } = await listAvisos()
      for (const aviso of avisos ?? []) {
        notificarNovoAviso(aviso)
      }
    }

    verificarNotificacoes()

    return () => {
      cancelled = true
    }
  }, [permission, user])

  if (!notificationsSupported() || permission === 'granted' || !user) {
    return null
  }

  return (
    <div className="notif-banner">
      <span className="notif-banner__text">
        Ative as notificações para receber lembretes de presença, novas
        escalas e avisos.
      </span>
      <button
        type="button"
        className="notif-banner__btn"
        onClick={handleAtivar}
      >
        Ativar notificações
      </button>
    </div>
  )
}

export default NotificacoesAtivador