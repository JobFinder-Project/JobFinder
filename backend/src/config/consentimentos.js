export const TERMOS_USO_VERSAO_ATUAL = '2026-09-21';
export const POLITICA_PRIVACIDADE_VERSAO_ATUAL = '2026-09-21';

export const obterConsentimentosPendentes = (usuario) => {
  const pendentes = [];

  if (!usuario?.termosUsoAceitoEm || usuario.termosUsoVersao !== TERMOS_USO_VERSAO_ATUAL) {
    pendentes.push('termosUso');
  }

  if (
    !usuario?.politicaPrivacidadeAceitaEm ||
    usuario.politicaPrivacidadeVersao !== POLITICA_PRIVACIDADE_VERSAO_ATUAL
  ) {
    pendentes.push('politicaPrivacidade');
  }

  return pendentes;
};
