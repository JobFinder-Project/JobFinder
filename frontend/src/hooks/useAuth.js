import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services'

/**
 * Hook para gerenciar autenticação
 * @returns {Object} - Funções e estados de autenticação
 */
export function useAuth() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await authService.login(credentials)
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao fazer login'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async (redirectTo = '/login') => {
    setLoading(true)
    
    try {
      await authService.logout()
      navigate(redirectTo)
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
      // Mesmo com erro, redireciona para login
      navigate(redirectTo)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const recuperarSenha = useCallback(async (email) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await authService.recuperarSenha(email)
      return { success: true, message: data.message }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao enviar email de recuperação'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const redefinirSenha = useCallback(async (token, novaSenha) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await authService.redefinirSenha(token, novaSenha)
      return { success: true, message: data.message }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao redefinir senha'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading,
    error,
    login,
    logout,
    recuperarSenha,
    redefinirSenha,
    clearError
  }
}
