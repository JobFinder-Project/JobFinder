const bcrypt = require('bcrypt');
const Empresa = require('../models/empresaModel');

/**
 * Cria uma empresa validando duplicidade de CNPJ e email.
 * @param {Object} data
 * @returns {Promise<Empresa>}
 */
async function createEmpresa(data) {
  const { nome, email, cnpj, senha, fone, bio, site } = data;

  const existingByCnpj = await Empresa.findOne({ cnpj });
  if (existingByCnpj) {
    const err = new Error('CNPJ já cadastrado.');
    err.status = 409;
    throw err;
  }
  const existingByEmail = await Empresa.findOne({ email });
  if (existingByEmail) {
    const err = new Error('E-mail já cadastrado.');
    err.status = 409;
    throw err;
  }
  const salt = await bcrypt.genSalt(12);
  const senhaHash = await bcrypt.hash(senha, salt);

  const empresa = new Empresa({ nome, email, cnpj, senha: senhaHash, fone, bio, site });
  try {
    await empresa.save();
  } catch (e) {
    if (e.name === 'ValidationError') {
      const msgs = Object.values(e.errors).map(er => er.message);
      const err = new Error(msgs.join(' | '));
      err.status = 400;
      throw err;
    }
    throw e;
  }
  return empresa;
}

module.exports = { createEmpresa };
