const STORAGE_KEY = 'irmandade:notificacoes:exibidas'

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getPermission() {
  if (!notificationsSupported()) return 'unsupported'
  return Notification.permission
}

export async function requestPermission() {
  if (!notificationsSupported()) return 'unsupported'
  return Notification.requestPermission()
}

function getExibidas() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function setExibida(chave) {
  const exibidas = getExibidas()
  exibidas[chave] = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(exibidas))
}

export function jaExibida(chave) {
  return Boolean(getExibidas()[chave])
}

export function enviarNotificacao({ titulo, corpo, chave, reexibir = false }) {
  if (getPermission() !== 'granted') return false
  if (chave && !reexibir && jaExibida(chave)) return false

  if (chave) {
    setExibida(chave)
  }

  if (navigator.serviceWorker?.ready) {
    navigator.serviceWorker.ready
      .then((registration) =>
        registration.showNotification(titulo, {
          body: corpo,
          icon: '/favicon.svg',
        }),
      )
      .catch(() => {
        new Notification(titulo, { body: corpo, icon: '/favicon.svg' })
      })
  } else if (typeof Notification !== 'undefined') {
    new Notification(titulo, { body: corpo, icon: '/favicon.svg' })
  }

  return true
}

export function notificarNovaEscala(escala) {
  return enviarNotificacao({
    titulo: `Nova escala: ${escala.celebracao}`,
    corpo: `${escala.data} - ${escala.horario}${escala.descricao ? ` — ${escala.descricao}` : ''}`,
    chave: `escala-${escala.id}`,
  })
}

export function notificarLembretePresenca(escala) {
  return enviarNotificacao({
    titulo: 'Confirme sua presença',
    corpo: `${escala.celebracao} ${escala.data} - ${escala.horario}`,
    chave: `presenca-${escala.id}-${escala.escala_irmao_id ?? ''}`,
  })
}

export function notificarNovoAviso(aviso) {
  return enviarNotificacao({
    titulo: aviso.importante
      ? `⚠️ Aviso importante: ${aviso.titulo}`
      : `Novo aviso: ${aviso.titulo}`,
    corpo: aviso.mensagem,
    chave: `aviso-${aviso.id}`,
  })
}