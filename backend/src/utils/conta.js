import bcrypt from 'bcrypt';
import Error400 from '../errors/Error400.js';

export const validarSenhaDeConfirmacao = async (senha, senhaHash) => {
  if (typeof senha !== 'string' || senha.length === 0) {
    return new Error400('Informe sua senha para confirmar a exclusão da conta.');
  }

  if (!(await bcrypt.compare(senha, senhaHash))) {
    return new Error400('Senha incorreta.');
  }

  return null;
};

export const encerrarSessao = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy((erro) => {
      if (erro) return reject(erro);

      res.clearCookie('connect.sid');
      resolve();
    });
  });
