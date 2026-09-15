import { supabase } from './supabaseClient'

export async function signUp({ email, password, fullName = '' }) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'irmao',
      },
    },
  })
}

export async function signIn({ email, password }) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export function getSession() {
  return supabase.auth.getSession()
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session)
  })
}

export function getCurrentUser() {
  return supabase.auth.getUser()
}

export async function resetPassword(email, redirectTo) {
  return supabase.auth.resetPasswordForEmail(email, { redirectTo })
}

export async function updatePassword(newPassword) {
  return supabase.auth.updateUser({ password: newPassword })
}