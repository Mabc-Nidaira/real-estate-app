import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// ログイン状態(セッション)をアプリ全体に共有するプロバイダー
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // 初回のセッション確認が終わるまでは true(この間にリダイレクトしないため)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 起動時に、保存済みのセッションがあるか確認する
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // ログイン・ログアウトなどで状態が変わったら反映する
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// コンポーネントからログイン状態を取得するためのフック
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth は AuthProvider の内側で使ってください')
  }
  return context
}
