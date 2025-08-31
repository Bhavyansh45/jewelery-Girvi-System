import React, { useState, useEffect, createContext, useContext } from 'react'
import { User, loginUser, verifyToken } from '@/lib/auth/index'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isFirstUser: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('auth_token')
    if (token) {
      const userData = verifyToken(token)
      if (userData) {
        setUser(userData)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await loginUser({ username, password })
      if (result) {
        setUser(result.user)
        localStorage.setItem('auth_token', result.token)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_token')
  }

  const isFirstUser = async (): Promise<boolean> => {
    // This would typically call the backend to check if any users exist
    // For now, we'll return false as a placeholder
    return false
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isFirstUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 