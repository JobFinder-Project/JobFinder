class ErrorBase extends Error {
  constructor(message = 'Erro interno do servidor', status = 500) {
    super();
    this.message = message;
    this.status = status;
  }

  enviarResposta(res) {
    res.status(this.status).json({
      message: this.message,
      status: this.status,
    });
  }
}

export default ErrorBase;
