import api from "./api";

export const candidatoService = {
	cadastrar: async (dados) => {
		if (dados instanceof FormData) {
			return api.post("/candidato/cadastrar", dados);
		}

		const formData = new FormData();
		Object.keys(dados).forEach((key) => {
			if (dados[key] !== null && dados[key] !== undefined) {
				formData.append(key, dados[key]);
			}
		});

		return api.post("/candidato/cadastrar", formData);
	},

	getDashboard: async () => {
		return api.get("/candidato/dashboard");
	},

	atualizarPerfil: async (dados) => {
		return api.put(`/candidato/editar`, dados);
	},

	getCandidaturas: async () => {
		return api.get("/candidato/candidaturas");
	},

	candidatarVaga: async (vagaId) => {
		return api.post(`/candidato/vagas/${vagaId}`, {});
	},

	cancelarCandidatura: async (candidaturaId) => {
		return api.delete(`/candidato/candidaturas/delete/${candidaturaId}`);
	},
};

export default candidatoService;
