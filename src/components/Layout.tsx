import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import Sidebar from './Sidebar'
import Header from './Header'
import { Button } from './ui/button'
import { Menu, X } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not in input fields
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'd':
            event.preventDefault()
            navigate('/dashboard')
            break
          case 'c':
            event.preventDefault()
            navigate('/customers')
            break
          case 'a':
            event.preventDefault()
            navigate('/agents')
            break
          case 'l':
            event.preventDefault()
            logout()
            navigate('/login')
            break
          case 'j':
            event.preventDefault()
            navigate('/jewelry')
            break
          case 't':
            event.preventDefault()
            navigate('/transfers')
            break
          case 'i':
            event.preventDefault()
            navigate('/payments')
            break
          case 'f':
            event.preventDefault()
            navigate('/jewelry?action=release')
            break
          case 'r':
            event.preventDefault()
            navigate('/reports')
            break
          case 'm':
            event.preventDefault()
            navigate('/communication')
            break
          case 'b':
            event.preventDefault()
            // Backup functionality
            break
          case 'p':
            event.preventDefault()
            window.print()
            break
          case 'e':
            event.preventDefault()
            // Export functionality
            break
          case 's':
            event.preventDefault()
            // Save functionality
            break
          case '/':
            event.preventDefault()
            // Show shortcuts help
            break
        }
      } else if (event.key === 'Escape') {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, logout, setSidebarOpen])

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          theme={theme}
          onThemeChange={setTheme}
          onLogout={logout}
        />
        
        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout 