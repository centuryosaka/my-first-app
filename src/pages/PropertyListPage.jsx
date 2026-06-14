import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './PropertyListPage.module.css'

// ダミーの物件データ
const PROPERTIES = [
  { id: 1, name: 'グランドメゾン梅田', rent: 120000, area: '大阪市北区', type: '1LDK', floor: '8F', age: 3 },
  { id: 2, name: 'サンシャイン心斎橋', rent: 98000, area: '大阪市中央区', type: '1K', floor: '5F', age: 7 },
  { id: 3, name: 'パークレジデンス天王寺', rent: 145000, area: '大阪市阿倍野区', type: '2LDK', floor: '12F', age: 1 },
  { id: 4, name: 'コスモス難波', rent: 82000, area: '大阪市浪速区', type: '1K', floor: '3F', age: 15 },
  { id: 5, name: 'ハーモニー本町', rent: 135000, area: '大阪市西区', type: '1LDK', floor: '10F', age: 5 },
  { id: 6, name: 'リバーサイド天満', rent: 78000, area: '大阪市北区', type: 'ワンルーム', floor: '2F', age: 20 },
]

export default function PropertyListPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
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
          <h2 className={styles.sectionTitle}>物件一覧</h2>
          <span className={styles.count}>{PROPERTIES.length} 件</span>
        </div>

        {/* 物件カード一覧 */}
        <div className={styles.grid}>
          {PROPERTIES.map((property) => (
            <div key={property.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.type}>{property.type}</span>
                <span className={styles.age}>築 {property.age} 年</span>
              </div>
              <h3 className={styles.propertyName}>{property.name}</h3>
              <p className={styles.area}>📍 {property.area} · {property.floor}</p>
              <p className={styles.rent}>
                <span className={styles.rentAmount}>¥{property.rent.toLocaleString()}</span>
                <span className={styles.rentUnit}> / 月</span>
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
