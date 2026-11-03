import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('rasad_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('rasad_user') }
    }
    setLoading(false)
  }, [])

  const login = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('rasad_user', JSON.stringify(userData))
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    setUser(null)
    localStorage.removeItem('rasad_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
