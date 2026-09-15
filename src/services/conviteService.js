import { supabase } from './supabaseClient'

const FN = 'convites'

export async function criarConvite({ full_name, email, phone, photo_url }) {
  const { data, error } = await supabase.functions.invoke(FN, {
    method: 'POST',
    body: { full_name, email, phone, photo_url },
  })
  return { data, error }
}

export async function obterConvite(token) {
  const { data, error } = await supabase.functions.invoke(`${FN}/${token}`, {
    method: 'GET',
  })
  return { data, error }
}

export async function ativarConta(token, senha) {
  const { data, error } = await supabase.functions.invoke(
    `${FN}/ativar-conta`,
    {
      method: 'POST',
      body: { token, senha },
    },
  )
  return { data, error }
}

export async function reenviarConvite(user_id) {
  const { data, error } = await supabase.functions.invoke(`${FN}/reenviar`, {
    method: 'POST',
    body: { user_id },
  })
  return { data, error }
}

export async function definirRole(user_id, novo_role) {
  const { data, error } = await supabase.functions.invoke(`${FN}/definir-role`, {
    method: 'POST',
    body: { user_id, novo_role },
  })
  return { data, error }
}

export async function listarUsuarios() {
  const { data, error } = await supabase.functions.invoke(
    `${FN}/listar-usuarios`,
    { method: 'POST' },
  )
  return { data, error }
}

export function linkDoConvite(token) {
  return `${window.location.origin}/ativar-conta/${token}`
}