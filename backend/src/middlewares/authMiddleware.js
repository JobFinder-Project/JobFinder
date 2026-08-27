import Error401 from '../errors/Error401.js';
import Error403 from '../errors/Error403.js';

// Verifica se o usuário está autenticado
export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return next(new Error401());
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
