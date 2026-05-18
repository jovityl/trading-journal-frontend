import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Toaster } from 'react-hot-toast'
import DashboardPage from './pages/DashboardPage'
import TradesPage from './pages/TradesPage'
import TradeDetailPage from './pages/TradeDetailPage'
import SettingsPage from './pages/SettingsPage'
import AdminPromptsPage from './pages/AdminPromptsPage'
import LoginPage from './pages/LoginPage'
import Layout from './layout/Layout'

function App() {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#fff', border: '1px solid #374151' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="trades" element={<TradesPage />} />
          <Route path="trades/:id" element={<TradeDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admin" element={<AdminPromptsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
