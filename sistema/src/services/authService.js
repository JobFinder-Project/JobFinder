const bcrypt = require('bcrypt');
const Candidato = require('../models/candidatoModel');
const Empresa = require('../models/empresaModel');

/**
 * Autentica um usuário (candidato ou empresa) pelo email e senha.
 * @param {string} email
 * @param {string} senha
 * @returns {Promise<{user: any, type: 'candidato'|'empresa'}>} lança erro se inválido
 */
async function authenticate(email, senha) {
  // Tenta candidato primeiro
  let user = await Candidato.findOne({ email });
  let type = 'candidato';
  if (!user) {
    user = await Empresa.findOne({ email });
    type = 'empresa';
  }
  if (!user) {
    const err = new Error('E-mail ou senha inválidos.');
    err.status = 401;
    throw err;
  }
  const isValid = await bcrypt.compare(senha, user.senha);
  if (!isValid) {
    const err = new Error('E-mail ou senha inválidos.');
    err.status = 401;
    throw err;
  }
  return { user, type };
}

module.exports = { authenticate };
