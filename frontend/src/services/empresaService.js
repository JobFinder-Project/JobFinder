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
		let url = `/empresa/candidatos/buscar?q=${encodeURIComponent(query || '')}`;
		if (vagaId) {
			url += `&vagaId=${vagaId}`;
		}
		return api.get(url);
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
