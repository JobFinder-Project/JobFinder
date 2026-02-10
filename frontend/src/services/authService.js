import api from './api';

export const authService = {
  getMe: async () => {
    return api.get('/me');
  },

  login: async (credentials) => {
    return api.post('/login', credentials);
  },

  logout: async () => {
    try {
      return await api.get('/logout');
    } catch (error) {
      console.warn('Backend não respondeu ao logout, limpando localmente...');
      return { success: true };
    }
  },

  recuperarSenha: async (email) => {
    return api.post('/recuperar_senha', { email });
  },

  redefinirSenha: async (token, novaSenha) => {
    return api.post(`/redefinir_senha/${token}`, { novaSenha });
  },
};

export default authService;
