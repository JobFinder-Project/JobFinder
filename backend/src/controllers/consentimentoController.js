import Error400 from '../errors/Error400.js';
import {
  POLITICA_PRIVACIDADE_VERSAO_ATUAL,
  TERMOS_USO_VERSAO_ATUAL,
  obterConsentimentosPendentes,
} from '../config/consentimentos.js';
import { buscarUsuarioDaSessao } from '../middlewares/consentimentoMiddleware.js';

class ConsentimentoController {
  static async aceitar(req, res, next) {
    try {
      const usuario = await buscarUsuarioDaSessao(req);
      if (!usuario) {
        return res.status(401).json({ error: 'Sessão inválida ou usuário não encontrado.' });
      }

      const pendentes = obterConsentimentosPendentes(usuario);
      const aceiteTermos = req.body.aceiteTermosUso === true;
      const aceitePrivacidade = req.body.aceitePoliticaPrivacidade === true;

      if (pendentes.includes('termosUso') && !aceiteTermos) {
        return next(new Error400('É obrigatório aceitar os Termos de Uso vigentes.'));
      }

      if (pendentes.includes('politicaPrivacidade') && !aceitePrivacidade) {
        return next(new Error400('É obrigatório aceitar a Política de Privacidade vigente.'));
      }

      const aceitoEm = new Date();
      if (aceiteTermos) {
        usuario.termosUsoAceitoEm = aceitoEm;
        usuario.termosUsoVersao = TERMOS_USO_VERSAO_ATUAL;
      }
      if (aceitePrivacidade) {
        usuario.politicaPrivacidadeAceitaEm = aceitoEm;
        usuario.politicaPrivacidadeVersao = POLITICA_PRIVACIDADE_VERSAO_ATUAL;
      }

      await usuario.save();

      return res.status(200).json({
        success: true,
        message: 'Consentimentos registrados com sucesso.',
        consentimentosPendentes: obterConsentimentosPendentes(usuario),
      });
    } catch (erro) {
      return next(erro);
    }
  }
}

export default ConsentimentoController;
