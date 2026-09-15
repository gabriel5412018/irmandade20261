import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import {
  getSession,
  getCurrentUser,
  onAuthStateChange,
  signOut,
} from '../services/authService'
import { getPerfil } from '../services/perfilService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let subscription
    let cancelled = false

    async function init() {
      const { data: listener } = onAuthStateChange(async (session) => {
        const nextUser = session?.user ?? null
        setUser(nextUser)
        if (nextUser) {
          const { data: perfilData } = await getPerfil(nextUser.id)
          if (perfilData) {
            setPerfil(perfilData)
          }
        } else {
          setPerfil(null)
        }
      })
      subscription = listener.subscription

      const { data } = await getSession()
      const sessionUser = data.session?.user ?? null

      if (sessionUser) {
        const { data: userData, error: userError } = await getCurrentUser()
        if (cancelled) return
        if (userError || !userData?.user) {
          setUser(null)
          setPerfil(null)
          setLoading(false)
          return
        }
        setUser(userData.user)
        const { data: perfilData } = await getPerfil(userData.user.id)
        if (!cancelled && perfilData) {
          setPerfil(perfilData)
        }
      }

      if (!cancelled) {
        setLoading(false)
      }
    }

    init()

    return () => {
      cancelled = true
      subscription?.unsubscribe()
    }
  }, [])

  async function handleSignOut() {
    await signOut()
    setPerfil(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, perfil, loading, signOut: handleSignOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider