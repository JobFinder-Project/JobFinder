export const candidatoPaths = {
  '/candidato/cadastrar': {
    post: {
      tags: ['Candidato'],
      summary: 'Cadastrar candidato',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CandidatoCadastroFormData' },
          },
        },
      },
      responses: {
        201: { description: 'Candidato cadastrado' },
        400: { description: 'Dados inválidos' },
      },
    },
  },

  '/candidato/dashboard': {
    get: {
      tags: ['Candidato'],
      summary: 'Dashboard do candidato',
      security: [{ sessionAuth: [] }],
      responses: {
        200: { description: 'Dashboard carregado' },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
      },
    },
  },

  '/candidato/editar': {
    put: {
      tags: ['Candidato'],
      summary: 'Editar perfil do candidato',
      security: [{ sessionAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CandidatoEditarFormData' },
          },
        },
      },
      responses: {
        200: { description: 'Perfil atualizado com sucesso' },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
      },
    },
  },

  '/candidato/candidaturas': {
    get: {
      tags: ['Candidaturas'],
      summary: 'Listar candidaturas do candidato autenticado',
      security: [{ sessionAuth: [] }],
      responses: {
        200: { description: 'Lista de candidaturas' },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
      },
    },
  },

  '/candidato/vagas/{vagaId}': {
    post: {
      tags: ['Candidaturas'],
      summary: 'Candidatar-se a uma vaga',
      security: [{ sessionAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'vagaId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        201: { description: 'Candidatura realizada' },
        400: { description: 'Já candidatado ou dados inválidos' },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
        404: { description: 'Vaga não encontrada' },
      },
    },
  },

  '/candidato/candidaturas/delete/{candidaturaId}': {
    delete: {
      tags: ['Candidaturas'],
      summary: 'Cancelar candidatura',
      security: [{ sessionAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'candidaturaId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Candidatura removida' },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
        404: { description: 'Candidatura não encontrada' },
      },
    },
  },
};
