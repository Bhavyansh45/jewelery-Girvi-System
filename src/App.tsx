import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import Layout from './components/Layout'
import LicenseGuard from './components/auth/LicenseGuard'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Agents from './pages/Agents'
import Dealers from './pages/Dealers'
import Jewelry from './pages/Jewelry'
import Payments from './pages/Payments'
import Transfers from './pages/Transfers'
import Reports from './pages/Reports'
import Communication from './pages/Communication'
import Settings from './pages/Settings'
import AdminPanel from './pages/AdminPanel'
import LoadingSpinner from './components/ui/LoadingSpinner'

function App() {
  const { user, isLoading } = useAuth()
  const { theme } = useTheme()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Apply theme to document
    document.documentElement.className = theme
    setIsInitialized(true)
  }, [theme])

  if (!isInitialized || isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Login />
  }

  return (
    <LicenseGuard>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/jewelry" element={<Jewelry />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/settings" element={<Settings />} />
          {user.role === 'admin' && (
            <Route path="/admin" element={<AdminPanel />} />
          )}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </LicenseGuard>
  )
}

export default App 