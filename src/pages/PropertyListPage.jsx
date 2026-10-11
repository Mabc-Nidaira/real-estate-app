import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { PROPERTIES } from '../data/properties'

// 家賃を「¥128,000」の形式で表示する
const formatRent = (rent) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(rent)

// 物件一覧画面(ログイン後に表示)
export default function PropertyListPage() {
  const { user, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    // ログアウトするとセッションが消え、ProtectedRoute がログイン画面へリダイレクトする
    await signOut()
  }

  return (
    <div className="property-page">
      <header className="app-header">
        <h1>物件一覧</h1>
        <div className="user-area">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? 'ログアウト中...' : 'ログアウト'}
          </button>
        </div>
      </header>

      <main>
        <ul className="property-grid">
          {PROPERTIES.map((property) => (
            <li key={property.id} className="property-card">
              <h2>{property.name}</h2>
              <p className="rent">
                {formatRent(property.rent)}
                <span>/月</span>
              </p>
              <p className="area">{property.area}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
