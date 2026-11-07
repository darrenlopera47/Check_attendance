import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      setUser({ id: 'demo-user', email: 'demo@checkattend.io', role: 'admin' })
      setProfile({ id: 'demo-user', role: 'admin', full_name: 'Demo User', department: 'Engineering', position: 'Operations Lead' })
      return
    }

    const restoreSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (currentSession?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()

        setProfile(profileData)
      }

      setLoading(false)
    }

    restoreSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      if (nextSession?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', nextSession.user.id)
          .single()
          .then(({ data }) => setProfile(data))
      } else {
        setProfile(null)
      }
    })

    return () => authListener?.subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: { user: { id: 'demo-user', email } }, error: null }
    }

    return supabase.auth.signInWithPassword({ email, password })
  }

  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(null)
      setProfile(null)
      setSession(null)
      return { error: null }
    }

    return supabase.auth.signOut()
  }

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      loading,
      signIn,
      signOut,
      setProfile,
    }),
    [session, user, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
