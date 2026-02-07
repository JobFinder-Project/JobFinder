import api from './api';

export const empresaService = {
  cadastrar: async (formData) => {
    return api.post('/empresa/cadastrar', formData);
  },

  getDashboard: async () => {
    return api.get('/empresa/dashboard');
  },

  atualizarPerfil: async (empresaId, dados) => {
    return api.post(`/empresa/${empresaId}/editar`, dados);
  },

  buscarCandidatos: async (query) => {
    return api.get(`/empresa/candidatos/buscar?q=${encodeURIComponent(query)}`);
  },

  criarVaga: async (empresaId, formData) => {
    return api.post(`/empresa/${empresaId}/vagas/criar`, formData);
  },
};

export default empresaService;
