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

	buscarCandidatos: async (query) => {
		return api.get(`/empresa/candidatos/buscar?q=${encodeURIComponent(query)}`);
	},

	criarVaga: async (formData) => {
		return api.post(`/empresa/vagas/criar`, formData);
	},
};

export default empresaService;
