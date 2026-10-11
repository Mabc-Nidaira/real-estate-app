import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import PropertyForm from '../components/PropertyForm'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  toJapaneseDbError,
  updateProperty,
} from '../lib/propertiesApi'

// 家賃を「¥128,000」の形式で表示する
const formatRent = (rent) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(rent)

// 物件一覧画面(ログイン後に表示)
export default function PropertyListPage() {
  const { user, signOut } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // フォームの表示状態: null = 非表示 / 'new' = 新規登録 / 物件オブジェクト = その物件を編集
  const [formTarget, setFormTarget] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [signingOut, setSigningOut] = useState(false)

  // 画面を開いたときに物件一覧を取得する(SELECT)
  useEffect(() => {
    let ignore = false

    fetchProperties()
      .then((data) => {
        if (!ignore) setProperties(data)
      })
      .catch((err) => {
        if (!ignore) setError(toJapaneseDbError(err))
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    // 画面を離れた後に結果が返ってきても反映しない
    return () => {
      ignore = true
    }
  }, [])

  // フォームの保存処理。成功なら何も返さず、失敗ならエラーメッセージを返す
  const handleSubmit = async (values) => {
    try {
      if (formTarget === 'new') {
        // 新規登録(INSERT): 登録した物件を一覧の先頭に追加
        const created = await createProperty(values)
        setProperties((prev) => [created, ...prev])
      } else {
        // 更新(UPDATE): 一覧の該当物件を置き換える
        const updated = await updateProperty(formTarget.id, values)
        setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      }
      setFormTarget(null)
    } catch (err) {
      return toJapaneseDbError(err)
    }
  }

  // 削除(DELETE): 確認ダイアログで OK のときだけ削除する
  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか?この操作は取り消せません。`)) {
      return
    }

    setError('')
    setDeletingId(property.id)
    try {
      await deleteProperty(property.id)
      setProperties((prev) => prev.filter((p) => p.id !== property.id))
      // 編集中の物件を削除した場合はフォームを閉じる
      if (formTarget?.id === property.id) setFormTarget(null)
    } catch (err) {
      setError(toJapaneseDbError(err))
    } finally {
      setDeletingId(null)
    }
  }

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
          <button className="secondary" onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? 'ログアウト中...' : 'ログアウト'}
          </button>
        </div>
      </header>

      <main className="property-main">
        <div className="toolbar">
          <p className="count">{loading ? '' : `${properties.length} 件`}</p>
          {formTarget === null && (
            <button onClick={() => setFormTarget('new')}>+ 物件を登録</button>
          )}
        </div>

        {formTarget !== null && (
          <PropertyForm
            // 編集対象が変わったらフォームの中身を作り直す
            key={formTarget === 'new' ? 'new' : formTarget.id}
            initialValues={formTarget === 'new' ? null : formTarget}
            onSubmit={handleSubmit}
            onCancel={() => setFormTarget(null)}
          />
        )}

        {error && <p className="message error">{error}</p>}

        {loading ? (
          <p className="loading">読み込み中...</p>
        ) : properties.length === 0 ? (
          !error && <p className="empty">物件はまだ登録されていません。</p>
        ) : (
          <ul className="property-grid">
            {properties.map((property) => (
              <li key={property.id} className="property-card">
                <div className="card-head">
                  <h2>{property.name}</h2>
                  <span className="layout">{property.layout}</span>
                </div>
                <p className="rent">
                  {formatRent(property.rent)}
                  <span>/月</span>
                </p>
                <p className="area">{property.area}</p>

                <div className="card-actions">
                  <button
                    className="secondary"
                    onClick={() => {
                      setFormTarget(property)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    disabled={deletingId === property.id}
                  >
                    編集
                  </button>
                  <button
                    className="danger"
                    onClick={() => handleDelete(property)}
                    disabled={deletingId === property.id}
                  >
                    {deletingId === property.id ? '削除中...' : '削除'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
