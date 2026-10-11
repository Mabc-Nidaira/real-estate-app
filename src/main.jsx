import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { supabaseConfigError } from './lib/supabase'
import App from './App.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {supabaseConfigError ? (
      // 接続情報の設定ミスがある場合は、アプリを起動せずに原因を表示する
      <main className="auth-page">
        <p className="message error">{supabaseConfigError}</p>
      </main>
    ) : (
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    )}
  </StrictMode>,
)
