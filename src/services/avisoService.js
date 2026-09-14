import { supabase } from './supabaseClient'

export async function listAvisos() {
  return supabase
    .from('avisos')
    .select('*')
    .order('data', { ascending: false })
    .order('created_at', { ascending: false })
}

export async function createAviso({ titulo, mensagem, data, importante }) {
  return supabase
    .from('avisos')
    .insert({ titulo, mensagem, data, importante })
    .select()
    .single()
}

export async function updateAviso(id, updates) {
  return supabase
    .from('avisos')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
}

export async function deleteAviso(id) {
  return supabase.from('avisos').delete().eq('id', id)
}