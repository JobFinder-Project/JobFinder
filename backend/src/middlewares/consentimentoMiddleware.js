import Candidato from '../models/candidatoModel.js';
import Empresa from '../models/empresaModel.js';
import { obterConsentimentosPendentes } from '../config/consentimentos.js';
import Error404 from '../errors/Error404.js';

export const buscarUsuarioDaSessao = async (req) => {
  const { id, role } = req.session.user;
  const Model = role === 'candidato' ? Candidato : role === 'empresa' ? Empresa : null;
  return Model ? Model.findById(id) : null;
};

export const exigirConsentimentosVigentes = async (req, res, next) => {
  try {
    const usuario = await buscarUsuarioDaSessao(req);

    if (!usuario) {
      return next(new Error404('Perfil autenticado não encontrado.'));
    }

    const consentimentosPendentes = obterConsentimentosPendentes(usuario);
    if (consentimentosPendentes.length > 0) {
      return res.status(428).json({
        error: 'É necessário aceitar os consentimentos vigentes para continuar.',
        codigo: 'CONSENTIMENTOS_PENDENTES',
        consentimentosPendentes,
      });
    }

    return next();
  } catch (erro) {
    return next(erro);
  }
};
