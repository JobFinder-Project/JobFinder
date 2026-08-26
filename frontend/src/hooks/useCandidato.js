import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { candidatoService } from '../services'
import { logout } from '../contexts/AuthContext'


export function useCandidato() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [candidato, setCandidato] = useState(null)
  const [candidaturas, setCandidaturas] = useState([])

  const cadastrar = useCallback(async (formData) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await candidatoService.cadastrar(formData)
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao cadastrar candidato'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const getDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await candidatoService.getDashboard()
      setCandidato(data.candidato)
      return { success: true, data }
    } catch (err) {
      if (err.status === 401) {
        await logout();
        navigate('/login')
        return { success: false, error: 'Sessão expirada' }
      }
      const errorMessage = err.data?.error || 'Erro ao carregar dashboard'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const atualizarPerfil = useCallback(async (candidatoId, dados) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await candidatoService.atualizarPerfil(candidatoId, dados)
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao atualizar perfil'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const getCandidaturas = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await candidatoService.getCandidaturas()
      setCandidaturas(data.candidaturas || [])
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao carregar candidaturas'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const candidatarVaga = useCallback(async (candidatoId, vagaId) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await candidatoService.candidatarVaga(candidatoId, vagaId)
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao se candidatar'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const cancelarCandidatura = useCallback(async (candidatoId, candidaturaId) => {
    setLoading(true)
    setError(null)
    
    try {
      await candidatoService.cancelarCandidatura(candidatoId, candidaturaId)
      
      setCandidaturas(prev => prev.filter(c => c._id !== candidaturaId))
      return { success: true }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao cancelar candidatura'
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
    candidato,
    candidaturas,
    cadastrar,
    getDashboard,
    atualizarPerfil,
    getCandidaturas,
    candidatarVaga,
    cancelarCandidatura,
    clearError
  }
}
