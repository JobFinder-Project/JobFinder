/**
 * Serviço de autenticação
 */
import api from './api'

export const authService = {
  /**
   * Verifica sessão atual
   */
  getMe: async () => {
    return api.get('/me')
  },

  /**
   * Realiza login
   */
  login: async (credentials) => {
    return api.post('/login', credentials)
  },

  /**
   * Realiza logout
   */
  logout: async () => {
    return api.get('/logout')
  },

  /**
   * Solicita recuperação de senha
   */
  recuperarSenha: async (email) => {
    return api.post('/recuperar_senha', { email })
  },

  /**
   * Redefine a senha com token
   */
  redefinirSenha: async (token, novaSenha) => {
    return api.post(`/redefinir_senha/${token}`, { novaSenha })
  },
}

export default authService
