/**
 * Serviço de empresa
 */
import api from './api'

export const empresaService = {
  /**
   * Cadastra nova empresa
   */
  cadastrar: async (formData) => {
    return api.post('/empresa/cadastrar', formData)
  },

  /**
   * Busca dados do dashboard da empresa
   */
  getDashboard: async () => {
    return api.get('/empresa/dashboard')
  },

  /**
   * Atualiza perfil da empresa
   */
  atualizarPerfil: async (empresaId, dados) => {
    return api.post(`/empresa/${empresaId}/editar`, dados)
  },

  /**
   * Busca candidatos
   */
  buscarCandidatos: async (query) => {
    return api.get(`/empresa/candidatos/buscar?q=${encodeURIComponent(query)}`)
  },

  /**
   * Cria nova vaga
   */
  criarVaga: async (empresaId, formData) => {
    return api.post(`/empresa/${empresaId}/vagas/criar`, formData)
  },
}

export default empresaService
