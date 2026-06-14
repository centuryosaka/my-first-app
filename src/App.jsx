import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PropertyListPage from './pages/PropertyListPage'

export default function App() {
  return (
    <BrowserRouter>
      {/* アプリ全体を AuthProvider で囲み、認証情報をどこでも参照できるようにする */}
      <AuthProvider>
        <Routes>
          {/* ルートへのアクセスはログイン画面にリダイレクト */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* /properties は認証済みユーザーのみアクセス可能 */}
          <Route
            path="/properties"
            element={
              <PrivateRoute>
                <PropertyListPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
