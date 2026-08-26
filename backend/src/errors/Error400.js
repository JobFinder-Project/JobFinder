import ErrorBase from './ErrorBase.js';

class Error400 extends ErrorBase {
  constructor(message = 'Um ou mais dados fornecidos estão inválidos') {
    super(message, 400);
  }
}

export default Error400;
