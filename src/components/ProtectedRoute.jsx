import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ログインしている場合だけ中身を表示し、未ログインならログイン画面へリダイレクトする
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return <p className="loading">読み込み中...</p>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}
