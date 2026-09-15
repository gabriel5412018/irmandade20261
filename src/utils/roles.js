export const ROLES = {
  IRMAO: 'irmao',
  COORDENADOR: 'coordenador',
  ADMINISTRADOR: 'administrador',
}

export function isCoordenador(perfil) {
  return perfil?.role === ROLES.COORDENADOR
}

export function isIrmao(perfil) {
  return perfil?.role === ROLES.IRMAO
}

export function isAdministrador(perfil) {
  return perfil?.role === ROLES.ADMINISTRADOR
}

export function homePorRole(perfil) {
  if (isAdministrador(perfil)) return '/admin'
  if (isCoordenador(perfil)) return '/coordenador'
  return '/inicio'
}