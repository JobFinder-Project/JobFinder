import ErrorBase from './ErrorBase.js';

class Error404 extends ErrorBase {
  constructor(message = 'Página não encontrada') {
    super(message, 404);
  }
}

export default Error404;
