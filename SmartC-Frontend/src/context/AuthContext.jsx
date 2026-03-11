import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const email = localStorage.getItem('email')
    if (!token) return null
    return { token, role: role || '', email: email || '' }
  })

  const login = useCallback((token, role, email) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('email', email)
    setUser({ token, role, email })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'Admin'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
