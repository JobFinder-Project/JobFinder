export const empresaPaths = {
  '/empresa/cadastrar': {
    post: {
      tags: ['Empresa'],
      summary: 'Cadastrar empresa',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/EmpresaCadastroRequest' },
          },
        },
      },
      responses: {
        201: { description: 'Empresa cadastrada' },
        400: { description: 'Dados inválidos' },
      },
    },
  },

  '/empresa/dashboard': {
    get: {
      tags: ['Empresa'],
      summary: 'Dashboard da empresa',
      security: [{ sessionAuth: [] }],
      responses: {
        200: { description: 'Dashboard carregado' },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
      },
    },
  },

  '/empresa/editar': {
    put: {
      tags: ['Empresa'],
      summary: 'Editar perfil da empresa',
      security: [{ sessionAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/EmpresaEditarRequest' },
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

  '/empresa/vagas/criar': {
    post: {
      tags: ['Empresa'],
      summary: 'Criar vaga',
      security: [{ sessionAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/VagaCriarFormData' },
          },
        },
      },
      responses: {
        201: { description: 'Vaga criada' },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
        404: { description: 'Empresa não encontrada' },
      },
    },
  },

  '/empresa/candidaturas': {
    get: {
      tags: ['Empresa'],
      summary: 'Buscar candidaturas das vagas da empresa',
      security: [{ sessionAuth: [] }],
      responses: {
        200: { description: 'Candidaturas encontradas' },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
      },
    },
  },

  '/empresa/candidatura/{candidaturaId}': {
    put: {
      tags: ['Empresa'],
      summary: 'Atualizar status de uma candidatura',
      security: [{ sessionAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'candidaturaId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CandidaturaStatusUpdateRequest' },
          },
        },
      },
      responses: {
        200: { description: 'Status da candidatura atualizado' },
        400: { description: 'Dados inválidos ou vaga não pertence à empresa' },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
        404: { description: 'Candidatura não encontrada' },
      },
    },
  },

  '/empresa/candidatos/buscar': {
    get: {
      tags: ['Empresa'],
      summary: 'Buscar candidatos por texto',
      security: [{ sessionAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'q',
          required: false,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Lista de candidatos' },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
      },
    },
  },
};
