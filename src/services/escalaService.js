import { supabase } from './supabaseClient'

export async function listEscalas({ publicadasOnly = false } = {}) {
  let query = supabase
    .from('escalas')
    .select(
      'id, celebracao, data, horario, descricao, status, created_at, created_by',
    )
    .order('data', { ascending: false })
    .order('horario', { ascending: false })

  if (publicadasOnly) {
    query = query.eq('status', 'publicada')
  }

  return query
}

export async function getEscala(id) {
  return supabase.rpc('obter_escala_completa', { p_escala_id: id })
}

export async function createEscala({ celebracao, data, horario, descricao }) {
  return supabase
    .from('escalas')
    .insert({ celebracao, data, horario, descricao, status: 'rascunho' })
    .select()
    .single()
}

export async function updateEscala(id, updates) {
  return supabase
    .from('escalas')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
}

export async function deleteEscala(id) {
  return supabase.from('escalas').delete().eq('id', id)
}

export async function addFuncao(escalaId, nome, ordem) {
  return supabase
    .from('funcoes')
    .insert({ escala_id: escalaId, nome, ordem })
    .select()
    .single()
}

export async function updateFuncao(id, updates) {
  return supabase.from('funcoes').update(updates).eq('id', id).select().single()
}

export async function deleteFuncao(id) {
  return supabase.from('funcoes').delete().eq('id', id)
}

export async function addIrmaoNaEscala(escalaId, funcaoId, perfilId, papel) {
  return supabase
    .from('escala_irmaos')
    .insert({ escala_id: escalaId, funcao_id: funcaoId, perfil_id: perfilId, papel: papel || null })
    .select()
    .single()
}

export async function updateIrmaoDaEscala(id, updates) {
  return supabase
    .from('escala_irmaos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export async function removeIrmaoDaEscala(id) {
  return supabase.from('escala_irmaos').delete().eq('id', id)
}

export async function listMinhasEscalas(perfilId) {
  return supabase
    .from('escala_irmaos')
    .select(
      'id, escala_id, escalas (id, celebracao, data, horario, descricao, status)',
    )
    .eq('perfil_id', perfilId)
    .order('escalas(data)', { ascending: false })
}