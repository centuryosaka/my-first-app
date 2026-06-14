import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// 未ログインユーザーをログイン画面にリダイレクトするガードコンポーネント
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // セッション確認中はローディング表示
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: '#888', fontSize: '1rem' }}>読み込み中...</p>
      </div>
    )
  }

  // 未ログインの場合はログイン画面へリダイレクト
  return user ? children : <Navigate to="/login" replace />
}
