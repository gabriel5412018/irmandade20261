export const PRESENCA_LABEL = {
  confirmado: { label: 'Confirmado', tone: 'success' },
  nao_comparecer: { label: 'Não poderá comparecer', tone: 'danger' },
  aguardando: { label: 'Aguardando resposta', tone: 'warning' },
}

export const PERFIL_STATUS_LABEL = {
  convite_pendente: { label: 'Convite pendente', tone: 'warning' },
  ativo: { label: 'Ativo', tone: 'success' },
  inativo: { label: 'Inativo', tone: 'neutral' },
  pendente: { label: 'Cadastro pendente', tone: 'warning' },
  aprovado: { label: 'Aprovado', tone: 'success' },
}

export function getPresencaLabel(status) {
  return PRESENCA_LABEL[status] ?? PRESENCA_LABEL.aguardando
}

export function getPerfilStatusLabel(status) {
  return PERFIL_STATUS_LABEL[status] ?? PERFIL_STATUS_LABEL.convite_pendente
}