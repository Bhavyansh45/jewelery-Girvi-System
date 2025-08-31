import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Gem,
  CreditCard,
  Truck,
  FileText,
  MessageSquare,
  Settings,
  Shield,
  X,
  LogOut
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      shortcut: 'Ctrl + D'
    },
    {
      path: '/customers',
      icon: Users,
      label: 'Customers',
      shortcut: 'Ctrl + C'
    },
    {
      path: '/agents',
      icon: UserCheck,
      label: 'Agents',
      shortcut: 'Ctrl + A'
    },
    {
      path: '/dealers',
      icon: Building2,
      label: 'Dealers',
      shortcut: 'Ctrl + Shift + D'
    },
    {
      path: '/jewelry',
      icon: Gem,
      label: 'Jewelry',
      shortcut: 'Ctrl + J'
    },
    {
      path: '/payments',
      icon: CreditCard,
      label: 'Payments',
      shortcut: 'Ctrl + I'
    },
    {
      path: '/transfers',
      icon: Truck,
      label: 'Transfers',
      shortcut: 'Ctrl + T'
    },
    {
      path: '/reports',
      icon: FileText,
      label: 'Reports',
      shortcut: 'Ctrl + R'
    },
    {
      path: '/communication',
      icon: MessageSquare,
      label: 'Communication',
      shortcut: 'Ctrl + M'
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings',
      shortcut: 'Ctrl + ,'
    }
  ]

  const adminItems = [
    {
      path: '/admin',
      icon: Shield,
      label: 'Admin Panel',
      shortcut: 'Ctrl + Shift + A'
    }
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Jewelry Girvi</h1>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-4">
          <div className="px-4 py-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main Menu
            </div>
          </div>
          
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )
              }
              onClick={onClose}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="flex-1">{item.label}</span>
              <span className="text-xs text-gray-400">{item.shortcut}</span>
            </NavLink>
          ))}
          
          {user?.role === 'admin' && (
            <>
              <div className="px-4 py-2 mt-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin
                </div>
              </div>
              
              {adminItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )
                  }
                  onClick={onClose}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.shortcut}</span>
                </NavLink>
              ))}
            </>
          )}
          
          <div className="mt-auto p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white shadow-lg">
            <div className="flex items-center h-16 px-4 border-b">
              <h1 className="text-xl font-bold text-gray-800">Jewelry Girvi</h1>
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-1">
              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Main Menu
                </div>
              </div>
              
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.shortcut}</span>
                </NavLink>
              ))}
              
              {user?.role === 'admin' && (
                <>
                  <div className="px-4 py-2 mt-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Admin
                    </div>
                  </div>
                  
                  {adminItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        )
                      }
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="flex-1">{item.label}</span>
                      <span className="text-xs text-gray-400">{item.shortcut}</span>
                    </NavLink>
                  ))}
                </>
              )}
            </nav>
            
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors rounded-md"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar 