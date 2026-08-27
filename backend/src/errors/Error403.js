import ErrorBase from './ErrorBase.js';

class Error403 extends ErrorBase {
  constructor(message = 'Acesso negado.') {
    super(message, 403);
  }
}

export default Error403;
