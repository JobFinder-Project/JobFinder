import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verifica sessão ao carregar a aplicação
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const data = await authService.getMe()
      if (data.authenticated) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      // 401 é esperado quando não está logado
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (credentials) => {
    setError(null)
    
    try {
      const data = await authService.login(credentials)
      // Após login, busca dados do usuário
      await checkAuth()
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao fazer login'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      setUser(null)
    }
  }, [])

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isCandidato: user?.role === 'candidato',
    isEmpresa: user?.role === 'empresa',
    login,
    logout,
    checkAuth,
    clearError: () => setError(null)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export default AuthContext
