import mongoose from 'mongoose';
import Error400 from '../errors/Error400.js';
import ErrorBase from '../errors/ErrorBase.js';
import ValidationError from '../errors/ValidationError.js';
import Error404 from '../errors/Error404.js';
import Error401 from '../errors/Error401.js';
import Error403 from '../errors/Error403.js';

// eslint-disable-next-line no-unused-vars
export const globalError = (erro, req, res, next) => {
  if (erro instanceof mongoose.Error.CastError) return new Error400().enviarResposta(res);
  if (erro instanceof mongoose.Error.ValidationError)
    return new ValidationError(erro).enviarResposta(res);
  if (erro instanceof Error400) return erro.enviarResposta(res);
  if (erro instanceof Error401) return erro.enviarResposta(res);
  if (erro instanceof Error403) return erro.enviarResposta(res);
  if (erro instanceof Error404) return erro.enviarResposta(res);
  return new ErrorBase().enviarResposta(res);
};

export const notFound = (req, res, next) => {
  const erro404 = new Error404();
  next(erro404);
};
