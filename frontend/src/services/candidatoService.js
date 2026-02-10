import api from './api';

export const candidatoService = {
  cadastrar: async (dados) => {
    if (dados instanceof FormData) {
      return api.post('/candidato/cadastrar', dados);
    }

    const formData = new FormData();
    Object.keys(dados).forEach((key) => {
      if (dados[key] !== null && dados[key] !== undefined) {
        formData.append(key, dados[key]);
      }
    });

    return api.post('/candidato/cadastrar', formData);
  },

  getDashboard: async () => {
    return api.get('/candidato/dashboard');
  },

  atualizarPerfil: async (candidatoId, dados) => {
    return api.post(`/candidato/${candidatoId}/editar`, dados);
  },

  getCandidaturas: async () => {
    return api.get('/candidato/candidaturas');
  },

  candidatarVaga: async (candidatoId, vagaId) => {
    return api.post(`/candidato/${candidatoId}/vagas/${vagaId}`, {});
  },

  cancelarCandidatura: async (candidatoId, candidaturaId) => {
    return api.post(
      `/candidato/${candidatoId}/vagas/delete/${candidaturaId}`,
      {},
    );
  },
};

export default candidatoService;
