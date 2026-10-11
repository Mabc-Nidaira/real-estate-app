import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import PropertyListPage from './pages/PropertyListPage'

// 画面のルーティング設定
export default function App() {
  return (
    <Routes>
      {/* 未ログイン向けの画面 */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><SignUpPage /></GuestRoute>} />

      {/* ログインが必要な画面 */}
      <Route
        path="/properties"
        element={<ProtectedRoute><PropertyListPage /></ProtectedRoute>}
      />

      {/* それ以外の URL は物件一覧へ(未ログインならさらにログイン画面へ) */}
      <Route path="*" element={<Navigate to="/properties" replace />} />
    </Routes>
  )
}
