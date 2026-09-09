import api from "./api";

export const empresaService = {
	cadastrar: async (formData) => {
		return api.post("/empresa/cadastrar", formData);
	},

	getDashboard: async () => {
		return api.get("/empresa/dashboard");
	},

	atualizarPerfil: async (dados) => {
		return api.put(`/empresa/editar`, dados);
	},

	buscarCandidatos: async (query, vagaId) => {
		const params = [];
		if (query?.trim()) params.push(`q=${encodeURIComponent(query.trim())}`);
		if (vagaId) params.push(`vagaId=${encodeURIComponent(vagaId)}`);

		const queryString = params.join('&');
		return api.get(`/empresa/candidatos/buscar${queryString ? `?${queryString}` : ''}`);
	},

	criarVaga: async (formData) => {
		return api.post(`/empresa/vagas/criar`, formData);
	},
	atualizarStatusVaga: async (vagaId, status) => {
		return api.patch(`/empresa/vagas/${vagaId}/status`, { status });
	},
	getCandidaturas: async () => {
		return api.get(`/empresa/candidaturas`);
	},
	atualizarStatusCandidatura: async (candidaturaId, status) => {
		return api.put(`/empresa/candidatura/${candidaturaId}`, { status });
	},
};

export default empresaService;
