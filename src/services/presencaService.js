import { supabase } from './supabaseClient'

export async function getPresenca(escalaId, perfilId) {
  return supabase
    .from('presencas')
    .select('*')
    .eq('escala_id', escalaId)
    .eq('perfil_id', perfilId)
    .maybeSingle()
}

export async function upsertPresenca({ escalaId, perfilId, status, observacao }) {
  return supabase
    .from('presencas')
    .upsert(
      {
        escala_id: escalaId,
        perfil_id: perfilId,
        status,
        observacao: observacao || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'escala_id,perfil_id' },
    )
    .select()
    .single()
}

export async function listPresencasDaEscala(escalaId) {
  return supabase
    .from('presencas')
    .select('id, perfil_id, status, observacao, updated_at')
    .eq('escala_id', escalaId)
}

export async function listPresencasDoIrmao(perfilId) {
  return supabase
    .from('presencas')
    .select(
      'id, status, observacao, updated_at, escala_id, escalas (celebracao, data, horario, descricao)',
    )
    .eq('perfil_id', perfilId)
    .order('created_at', { ascending: false })
}