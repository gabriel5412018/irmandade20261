import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { getSession, onAuthStateChange, signOut } from '../services/authService'
import { getPerfil } from '../services/perfilService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let subscription
    let cancelled = false

    async function init() {
      const { data } = await getSession()
      const sessionUser = data.session?.user ?? null
      setUser(sessionUser)

      if (sessionUser) {
        const { data: perfilData } = await getPerfil(sessionUser.id)
        if (!cancelled && perfilData) {
          setPerfil(perfilData)
        }
      }

      if (!cancelled) {
        setLoading(false)
      }

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