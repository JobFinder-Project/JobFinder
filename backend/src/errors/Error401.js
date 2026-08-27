import ErrorBase from './ErrorBase.js';

class Error401 extends ErrorBase {
  constructor(message = 'Não autenticado. Faça login.') {
    super(message, 401);
  }
}

export default Error401;
