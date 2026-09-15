import { supabase } from './supabaseClient'

export async function getPerfil(userId) {
  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error?.code === 'PGRST116') {
    return { data: null, error: null }
  }
  return { data, error }
}

export async function updatePerfil(userId, updates) {
  return supabase
    .from('perfis')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
}

export async function listPerfis() {
  return supabase
    .from('perfis')
    .select('*')
    .order('created_at', { ascending: true })
}

export async function updatePerfilByCoordenador(userId, updates) {
  return supabase
    .from('perfis')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
}

export async function deletePerfil(userId) {
  return supabase.from('perfis').delete().eq('id', userId)
}

export async function uploadFotoPerfil(userId, file) {
  const ext = file.name.split('.').pop().toLowerCase()
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (uploadError) return { data: null, error: uploadError }

  const { data: publicData } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  return { data: publicData.publicUrl, error: null }
}