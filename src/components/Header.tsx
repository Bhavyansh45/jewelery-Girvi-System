import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import {
  Menu,
  Bell,
  User,
  Settings,
  Sun,
  Moon,
  Palette,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface HeaderProps {
  onMenuClick: () => void
  user: any
  theme: string
  onThemeChange: (theme: string) => void
  onLogout: () => void
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  user,
  theme,
  onThemeChange,
  onLogout
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const themes = [
    { id: 'theme-pearl', name: 'Pearl Elegance', icon: '💎' },
    { id: 'theme-royal', name: 'Royal Gold', icon: '👑' },
    { id: 'theme-antique', name: 'Antique Mint', icon: '🏺' },
    { id: 'dark', name: 'Dark Mode', icon: '🌙' }
  ]

  const currentTheme = themes.find(t => t.id === theme) || themes[0]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="ml-4 lg:ml-0">
            <h2 className="text-lg font-semibold text-gray-900">
              Jewelry Girvi System
            </h2>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* Theme Switcher */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center space-x-2"
            >
              <Palette className="w-5 h-5" />
              <span className="text-sm">{currentTheme.icon}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>

            {showThemeMenu && (
              <Card className="absolute right-0 mt-2 w-48 z-50">
                <CardContent className="p-2">
                  {themes.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      onClick={() => {
                        onThemeChange(themeOption.id)
                        setShowThemeMenu(false)
                      }}
                      className={cn(
                        'flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors',
                        theme === themeOption.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      <span className="mr-2">{themeOption.icon}</span>
                      {themeOption.name}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:block text-sm font-medium">
                {user?.username}
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>

            {showUserMenu && (
              <Card className="absolute right-0 mt-2 w-48 z-50">
                <CardContent className="p-2">
                  <div className="px-3 py-2 border-b">
                    <div className="text-sm font-medium">{user?.username}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      // Navigate to settings
                      setShowUserMenu(false)
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      onLogout()
                      setShowUserMenu(false)
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors text-red-600"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showThemeMenu || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowThemeMenu(false)
            setShowUserMenu(false)
          }}
        />
      )}
    </header>
  )
}

export default Header 