/**
 * Serviço de vagas
 */
import api from './api'

export const vagasService = {
  /**
   * Busca áreas disponíveis
   */
  getAreas: async () => {
    return api.get('/areas')
  },

  /**
   * Busca vagas com filtros opcionais
   */
  buscar: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.q) queryParams.append('q', params.q)
    if (params.area) queryParams.append('area', params.area)
    
    const queryString = queryParams.toString()
    return api.get(`/vagas${queryString ? `?${queryString}` : ''}`)
  },
}

export default vagasService
