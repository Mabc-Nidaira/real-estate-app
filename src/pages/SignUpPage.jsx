import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { toJapaneseAuthError } from '../lib/authErrors'

// 会員登録画面
export default function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)

    const { data, error } = await signUp(email, password)
    setSubmitting(false)

    if (error) {
      setError(toJapaneseAuthError(error))
      return
    }

    if (data.session) {
      // メール確認が不要な設定なら、そのままログイン状態になるので物件一覧へ
      navigate('/properties', { replace: true })
    } else {
      // メール確認が必要な設定(Supabase の初期設定)の場合
      setNotice(
        '確認メールを送信しました。メール内のリンクを開いて登録を完了してから、ログインしてください。',
      )
      setPassword('')
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>会員登録</h1>

        <label>
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label>
          パスワード(6文字以上)
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>

        {error && <p className="message error">{error}</p>}
        {notice && <p className="message notice">{notice}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '登録する'}
        </button>

        <p className="switch">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </form>
    </main>
  )
}
