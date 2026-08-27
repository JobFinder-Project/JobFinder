import Error400 from './Error400.js';

class ValidationError extends Error400 {
  constructor(error) {
    const mensageError = Object.values(error.errors)
      .map((erro) => erro.message)
      .join(', ');
    super(`Erros de validação: ${mensageError}`);
  }
}

export default ValidationError;
