/**
 * Serviço de candidato
 */
import api from './api'

export const candidatoService = {
  /**
   * Cadastra novo candidato
   */
  cadastrar: async (formData) => {
    return api.post('/candidato/cadastrar', formData)
  },

  /**
   * Busca dados do dashboard do candidato
   */
  getDashboard: async () => {
    return api.get('/candidato/dashboard')
  },

  /**
   * Atualiza perfil do candidato
   */
  atualizarPerfil: async (candidatoId, dados) => {
    return api.post(`/candidato/${candidatoId}/editar`, dados)
  },

  /**
   * Busca candidaturas do candidato
   */
  getCandidaturas: async () => {
    return api.get('/candidato/candidaturas')
  },

  /**
   * Realiza candidatura a uma vaga
   */
  candidatarVaga: async (candidatoId, vagaId) => {
    return api.post(`/candidato/${candidatoId}/vagas/${vagaId}`, {})
  },

  /**
   * Cancela candidatura
   */
  cancelarCandidatura: async (candidatoId, candidaturaId) => {
    return api.post(`/candidato/${candidatoId}/vagas/delete/${candidaturaId}`, {})
  },
}

export default candidatoService
