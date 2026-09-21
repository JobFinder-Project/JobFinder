import mongoose from 'mongoose';
import Candidato from '../models/candidatoModel.js';
import Empresa from '../models/empresaModel.js';
import Error401 from '../errors/Error401.js';
import Error403 from '../errors/Error403.js';

const modelPorRole = {
  candidato: Candidato,
  empresa: Empresa,
};

// Confirma que a conta da sessão ainda existe (ex.: sessão de outro dispositivo após exclusão da conta)
export const usuarioDaSessaoExiste = async (usuario) => {
  const Model = modelPorRole[usuario?.role];

  if (!Model || !mongoose.isValidObjectId(usuario.id)) return false;

  return Boolean(await Model.exists({ _id: usuario.id }));
};

// Verifica se o usuário está autenticado
export const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.session?.user) {
      return next(new Error401());
    }

    if (await usuarioDaSessaoExiste(req.session.user)) {
      return next();
    }

    return req.session.destroy(() => {
      res.clearCookie('connect.sid');
      next(new Error401());
    });
  } catch (erro) {
    return next(erro);
  }
};

// Verifica se a sessão do usuário é de Candidato
export const isCandidato = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'candidato') {
    return next();
  }
  return next(new Error403('Acesso negado. Apenas candidatos.'));
};

// Verifica se a sessão do usuário é de Empresa
export const isEmpresa = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'empresa') {
    return next();
  }
  return next(new Error403('Acesso negado. Apenas empresas.'));
};
