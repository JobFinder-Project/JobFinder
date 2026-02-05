import { useState, useCallback } from 'react'
import { vagasService } from '../services'

/**
 * Hook para gerenciar busca de vagas
 * @returns {Object} - Funções e estados de vagas
 */
export function useVagas() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [vagas, setVagas] = useState([])
  const [areas, setAreas] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  const getAreas = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await vagasService.getAreas()
      setAreas(data.areas || [])
      return { success: true, areas: data.areas }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao carregar áreas'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const buscar = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await vagasService.buscar(params)
      setVagas(data.vagas || [])
      setTotalPages(data.totalPages || 1)
      setCurrentPage(data.currentPage || 1)
      return { 
        success: true, 
        vagas: data.vagas,
        totalPages: data.totalPages,
        currentPage: data.currentPage
      }
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao buscar vagas'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearVagas = useCallback(() => {
    setVagas([])
    setTotalPages(1)
    setCurrentPage(1)
  }, [])

  return {
    loading,
    error,
    vagas,
    areas,
    totalPages,
    currentPage,
    getAreas,
    buscar,
    clearError,
    clearVagas
  }
}
