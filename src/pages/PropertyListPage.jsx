import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { fetchProperties, insertProperty, updateProperty, deleteProperty } from '../lib/propertiesApi'
import PropertyModal from '../components/PropertyModal'
import styles from './PropertyListPage.module.css'

export default function PropertyListPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // モーダルの表示制御
  // null = 非表示、undefined = 新規登録モード、object = 編集モード
  const [modalTarget, setModalTarget] = useState(null)

  // 削除確認中の物件 ID
  const [deletingId, setDeletingId] = useState(null)

  // Supabase から物件一覧を取得する
  const loadProperties = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchProperties()
      setProperties(data)
    } catch (err) {
      setError('物件の取得に失敗しました。ページを再読み込みしてください。')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  // ログアウトしてログイン画面へ遷移する
  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // モーダルから保存ボタンが押されたときに INSERT または UPDATE を実行する
  const handleSave = async (formData) => {
    if (modalTarget === undefined) {
      // 新規登録モード
      const newItem = await insertProperty(formData)
      setProperties((prev) => [newItem, ...prev])
    } else {
      // 編集モード
      const updated = await updateProperty(modalTarget.id, formData)
      setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    }
    setModalTarget(null)
  }

  // 削除を実行する（confirmで二重確認を回避するため、カード上にインライン確認を表示する）
  const handleDelete = async (id) => {
    try {
      await deleteProperty(id)
      setProperties((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setError('削除に失敗しました。')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className={styles.page}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.headerTitle}>🏢 不動産管理システム</h1>
          <div className={styles.headerRight}>
            <span className={styles.userEmail}>{user?.email}</span>
            <button onClick={handleSignOut} className={styles.logoutButton}>
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        <div className={styles.titleRow}>
          <div>
            <h2 className={styles.sectionTitle}>物件一覧</h2>
            {!loading && (
              <span className={styles.count}>{properties.length} 件</span>
            )}
          </div>
          {/* 新規登録ボタン：クリックでモーダルを新規登録モードで開く */}
          <button
            className={styles.addButton}
            onClick={() => setModalTarget(undefined)}
          >
            ＋ 物件を登録
          </button>
        </div>

        {/* エラー表示 */}
        {error && <p className={styles.errorBanner}>{error}</p>}

        {/* ローディング表示 */}
        {loading && (
          <div className={styles.loadingWrap}>
            <p className={styles.loadingText}>読み込み中...</p>
          </div>
        )}

        {/* 物件が0件のときの案内 */}
        {!loading && properties.length === 0 && !error && (
          <div className={styles.emptyWrap}>
            <p className={styles.emptyText}>物件が登録されていません。</p>
            <p className={styles.emptyHint}>「＋ 物件を登録」ボタンから追加してください。</p>
          </div>
        )}

        {/* 物件カード一覧 */}
        {!loading && properties.length > 0 && (
          <div className={styles.grid}>
            {properties.map((property) => (
              <div key={property.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.floorPlan}>{property.floor_plan}</span>
                  {/* 削除確認のインライン表示 */}
                  {deletingId === property.id ? (
                    <div className={styles.confirmRow}>
                      <span className={styles.confirmText}>削除しますか？</span>
                      <button
                        className={styles.confirmYes}
                        onClick={() => handleDelete(property.id)}
                      >
                        はい
                      </button>
                      <button
                        className={styles.confirmNo}
                        onClick={() => setDeletingId(null)}
                      >
                        いいえ
                      </button>
                    </div>
                  ) : (
                    <div className={styles.cardActions}>
                      {/* 編集ボタン：クリックでモーダルを編集モードで開く */}
                      <button
                        className={styles.editBtn}
                        onClick={() => setModalTarget(property)}
                        aria-label="編集"
                      >
                        ✏️
                      </button>
                      {/* 削除ボタン：クリックでインライン確認を表示する */}
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeletingId(property.id)}
                        aria-label="削除"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>

                <h3 className={styles.propertyName}>{property.name}</h3>
                <p className={styles.area}>📍 {property.area}</p>
                <p className={styles.rent}>
                  <span className={styles.rentAmount}>
                    ¥{property.rent.toLocaleString()}
                  </span>
                  <span className={styles.rentUnit}> / 月</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 新規登録・編集モーダル（modalTarget が null 以外のとき表示） */}
      {modalTarget !== null && (
        <PropertyModal
          property={modalTarget === undefined ? null : modalTarget}
          onSave={handleSave}
          onClose={() => setModalTarget(null)}
        />
      )}
    </div>
  )
}
