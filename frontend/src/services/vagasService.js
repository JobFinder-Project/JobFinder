import api from './api';

export const vagasService = {
  getAreas: async () => {
    return api.get('/areas');
  },

  buscar: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.append('q', params.q);
    if (params.area) queryParams.append('area', params.area);

    const queryString = queryParams.toString();
    const response = await api.get(`/vagas${queryString ? `?${queryString}` : ''}`);
    return response.vagas || [];
  },
};

export default vagasService;
