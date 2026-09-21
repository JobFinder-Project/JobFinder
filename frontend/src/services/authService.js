import api from './api';

export const authService = {
  getMe: async () => {
    return api.get('/auth/me');
  },

  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },

  logout: async () => {
    try {
      return await api.post('/auth/logout', {});
    } catch (error) {
      console.warn('Backend não respondeu ao logout, limpando localmente...');
      return { success: true };
    }
  },

  aceitarConsentimentos: async (consentimentos) => {
    return api.post('/consentimentos/aceitar', consentimentos);
  },

  recuperarSenha: async (email) => {
    return api.post('/auth/recuperar-senha', { email });
  },

  redefinirSenha: async (token, novaSenha) => {
    return api.post(`/auth/redefinir-senha/${token}`, { senha: novaSenha });
  },
};

export default authService;
