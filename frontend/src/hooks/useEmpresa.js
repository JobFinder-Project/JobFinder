import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { empresaService } from '../services'

/**
 * Hook para gerenciar dados e operações da empresa
 * @returns {Object} - Funções e estados da empresa
 */
export function useEmpresa() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [empresa, setEmpresa] = useState(null)
  const [vagas, setVagas] = useState([])
  const [candidatos, setCandidatos] = useState([])

  const cadastrar = useCallback(async (formData) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await empresaService.cadastrar(formData)
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao cadastrar empresa'
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
      const data = await empresaService.getDashboard()
      setEmpresa(data.empresa)
      setVagas(data.vagas || [])
      return { success: true, data }
    } catch (err) {
      if (err.status === 401) {
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

  const atualizarPerfil = useCallback(async (empresaId, dados) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await empresaService.atualizarPerfil(empresaId, dados)
      // Atualiza estado local da empresa
      if (data.empresa) {
        setEmpresa(data.empresa)
      }
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao atualizar perfil'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const buscarCandidatos = useCallback(async (query) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await empresaService.buscarCandidatos(query)
      setCandidatos(data.candidatos || [])
      return { success: true, data }
    } catch (err) {
      if (err.status === 401) {
        navigate('/login')
        return { success: false, error: 'Sessão expirada' }
      }
      const errorMessage = err.data?.error || 'Erro ao buscar candidatos'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const criarVaga = useCallback(async (empresaId, formData) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await empresaService.criarVaga(empresaId, formData)
      // Adiciona nova vaga à lista local
      if (data.vaga) {
        setVagas(prev => [...prev, data.vaga])
      }
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao criar vaga'
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
    empresa,
    vagas,
    candidatos,
    cadastrar,
    getDashboard,
    atualizarPerfil,
    buscarCandidatos,
    criarVaga,
    clearError
  }
}
