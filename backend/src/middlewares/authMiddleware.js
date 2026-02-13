// Verifica se o usuário está autenticado
export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ error: 'Não autenticado. Faça login.' });
};

// Verifica se a sessão do usuário é de Candidato
export const isCandidato = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'candidato') {
    return next();
  }
  return res.status(403).json({ error: 'Acesso negado. Apenas candidatos.' });
};

// Verifica se a sessão do usuário é de Empresa
export const isEmpresa = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'empresa') {
    return next();
  }
  return res.status(403).json({ error: 'Acesso negado. Apenas empresas.' });
};
