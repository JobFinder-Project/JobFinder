const rootServer = [{ url: 'http://localhost:3000', description: 'Ambiente local' }];

const loginOperation = {
  tags: ['Auth'],
  summary: 'Login de candidato/empresa',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/LoginRequest' },
      },
    },
  },
  responses: {
    200: { description: 'Login realizado com sucesso' },
    400: { description: 'Credenciais inválidas' },
  },
};

const meOperation = {
  tags: ['Auth'],
  summary: 'Retorna usuário autenticado',
  responses: {
    200: { description: 'Estado de autenticação retornado com sucesso' },
  },
};

const logoutOperation = {
  tags: ['Auth'],
  summary: 'Encerra sessão do usuário',
  security: [{ sessionAuth: [] }],
  responses: {
    200: { description: 'Logout realizado com sucesso' },
    401: { description: 'Não autenticado' },
  },
};

const recuperarSenhaOperation = {
  tags: ['Auth'],
  summary: 'Enviar e-mail de recuperação de senha (token seguro)',
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/RecuperarSenhaRequest' },
      },
    },
  },
  responses: {
    200: { description: 'E-mail enviado com sucesso' },
    404: { description: 'E-mail não encontrado' },
  },
};

const redefinirSenhaOperation = {
  tags: ['Auth'],
  summary: 'Redefinir senha com token',
  parameters: [
    {
      in: 'path',
      name: 'token',
      required: true,
      schema: { type: 'string' },
    },
  ],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/RedefinirSenhaRequest' },
      },
    },
  },
  responses: {
    200: { description: 'Senha redefinida com sucesso' },
    404: { description: 'Token inválido, alterado ou expirado' },
  },
};

export const authPaths = {
  '/auth/login': {
    servers: rootServer,
    post: loginOperation,
  },

  '/auth/me': {
    servers: rootServer,
    get: meOperation,
  },

  '/auth/logout': {
    servers: rootServer,
    post: logoutOperation,
  },

  '/auth/recuperar-senha': {
    servers: rootServer,
    post: recuperarSenhaOperation,
  },

  '/auth/redefinir-senha/{token}': {
    servers: rootServer,
    post: redefinirSenhaOperation,
  },
};
