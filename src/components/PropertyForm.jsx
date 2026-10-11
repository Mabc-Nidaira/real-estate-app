import { useState } from 'react'

// 間取りの入力候補(自由入力も可能)
const LAYOUT_OPTIONS = ['1R', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3LDK', '4LDK']

// 物件の新規登録・編集で共通して使うフォーム
// initialValues があれば編集、なければ新規登録として動く
export default function PropertyForm({ initialValues, onSubmit, onCancel }) {
  const isEdit = Boolean(initialValues)
  const [name, setName] = useState(initialValues?.name ?? '')
  const [rent, setRent] = useState(initialValues?.rent?.toString() ?? '')
  const [area, setArea] = useState(initialValues?.area ?? '')
  const [layout, setLayout] = useState(initialValues?.layout ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // 前後の空白を取り除き、家賃は数値に変換する
    const values = {
      name: name.trim(),
      rent: Number(rent),
      area: area.trim(),
      layout: layout.trim(),
    }

    if (!values.name || !values.area || !values.layout) {
      setError('すべての項目を入力してください。')
      return
    }
    if (!Number.isInteger(values.rent) || values.rent < 0) {
      setError('家賃は0以上の整数(円)で入力してください。')
      return
    }

    setSubmitting(true)
    // 保存に失敗した場合はエラーメッセージが返ってくる
    const message = await onSubmit(values)
    setSubmitting(false)
    if (message) setError(message)
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? '物件を編集' : '物件を新規登録'}</h2>

      <div className="form-grid">
        <label>
          物件名
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
          />
        </label>

        <label>
          家賃(円)
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            min={0}
            step={1}
            inputMode="numeric"
            required
          />
        </label>

        <label>
          エリア名
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="例: 東京都渋谷区"
            maxLength={100}
            required
          />
        </label>

        <label>
          間取り
          <input
            type="text"
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
            placeholder="例: 1LDK"
            list="layout-options"
            maxLength={20}
            required
          />
          <datalist id="layout-options">
            {LAYOUT_OPTIONS.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </label>
      </div>

      {error && <p className="message error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel} disabled={submitting}>
          キャンセル
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : isEdit ? '更新する' : '登録する'}
        </button>
      </div>
    </form>
  )
}
