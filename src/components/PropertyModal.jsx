import { useState, useEffect } from 'react'
import styles from './PropertyModal.module.css'

// 間取りの選択肢
const FLOOR_PLAN_OPTIONS = ['ワンルーム', '1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3LDK', '4LDK以上']

// 新規登録・編集で共通に使うモーダルフォーム
// property に既存データが渡された場合は編集モード、null の場合は新規登録モード
export default function PropertyModal({ property, onSave, onClose }) {
  const isEdit = property !== null

  const [form, setForm] = useState({
    name: '',
    rent: '',
    area: '',
    floor_plan: '1LDK',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 編集モードのときは既存データをフォームにセットする
  useEffect(() => {
    if (isEdit) {
      setForm({
        name:       property.name,
        rent:       String(property.rent),
        area:       property.area,
        floor_plan: property.floor_plan,
      })
    }
  }, [property, isEdit])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.area.trim()) {
      setError('物件名とエリア名は必須です。')
      return
    }
    if (Number(form.rent) < 0 || isNaN(Number(form.rent))) {
      setError('家賃は0以上の数値を入力してください。')
      return
    }

    setLoading(true)
    try {
      await onSave(form)
    } catch (err) {
      setError('保存に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  // モーダル背景クリックで閉じる
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? '物件を編集' : '物件を新規登録'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="閉じる">×</button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">物件名 *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="例：グランドメゾン梅田"
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="rent">家賃（円） *</label>
              <input
                id="rent"
                name="rent"
                type="number"
                value={form.rent}
                onChange={handleChange}
                placeholder="例：120000"
                min="0"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="floor_plan">間取り *</label>
              <select
                id="floor_plan"
                name="floor_plan"
                value={form.floor_plan}
                onChange={handleChange}
              >
                {FLOOR_PLAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="area">エリア名 *</label>
            <input
              id="area"
              name="area"
              type="text"
              value={form.area}
              onChange={handleChange}
              placeholder="例：大阪市北区"
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? '保存中...' : isEdit ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
