import { describe, it, expect } from 'vitest'
import {
  PRESENCA_LABEL,
  PERFIL_STATUS_LABEL,
  getPresencaLabel,
  getPerfilStatusLabel,
} from './status'

describe('getPresencaLabel', () => {
  it('retorna o rótulo de confirmado', () => {
    expect(getPresencaLabel('confirmado')).toEqual(PRESENCA_LABEL.confirmado)
    expect(getPresencaLabel('confirmado').label).toBe('Confirmado')
    expect(getPresencaLabel('confirmado').tone).toBe('success')
  })

  it('retorna o rótulo de nao_comparecer', () => {
    expect(getPresencaLabel('nao_comparecer').label).toBe(
      'Não poderá comparecer',
    )
    expect(getPresencaLabel('nao_comparecer').tone).toBe('danger')
  })

  it('retorna aguardando como padrão', () => {
    expect(getPresencaLabel('aguardando').label).toBe('Aguardando resposta')
    expect(getPresencaLabel(undefined).label).toBe('Aguardando resposta')
    expect(getPresencaLabel('status-desconhecido').label).toBe(
      'Aguardando resposta',
    )
  })
})

describe('getPerfilStatusLabel', () => {
  it('retorna o rótulo de aprovado', () => {
    expect(getPerfilStatusLabel('aprovado')).toEqual(
      PERFIL_STATUS_LABEL.aprovado,
    )
    expect(getPerfilStatusLabel('aprovado').label).toBe('Aprovado')
  })

  it('retorna o rótulo de ativo', () => {
    expect(getPerfilStatusLabel('ativo').label).toBe('Ativo')
    expect(getPerfilStatusLabel('ativo').tone).toBe('success')
  })

  it('retorna o rótulo de convite pendente', () => {
    expect(getPerfilStatusLabel('convite_pendente').label).toBe(
      'Convite pendente',
    )
    expect(getPerfilStatusLabel('convite_pendente').tone).toBe('warning')
  })

  it('retorna convite pendente como padrão', () => {
    expect(getPerfilStatusLabel('pendente').label).toBe('Cadastro pendente')
    expect(getPerfilStatusLabel(undefined).label).toBe('Convite pendente')
  })
})