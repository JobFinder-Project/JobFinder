export const authPaths = {
  '/login': {
    post: {
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
    },
  },

  '/me': {
    get: {
      tags: ['Auth'],
      summary: 'Retorna usuário autenticado',
      responses: {
        200: { description: 'Estado de autenticação retornado com sucesso' },
      },
    },
  },

  '/logout': {
    get: {
      tags: ['Auth'],
      summary: 'Encerra sessão do usuário',
      security: [{ sessionAuth: [] }],
      responses: {
        200: { description: 'Logout realizado com sucesso' },
        401: { description: 'Não autenticado' },
      },
    },
  },

  '/recuperar_senha': {
    post: {
      tags: ['Auth'],
      summary: 'Enviar e-mail de recuperação de senha',
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
    },
  },

  '/redefinir_senha/{token}': {
    post: {
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
        404: { description: 'Token inválido ou expirado' },
      },
    },
  },
};
