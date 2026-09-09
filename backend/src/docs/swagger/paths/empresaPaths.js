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
        200: {
          description: 'Dashboard carregado com candidatos vinculados às vagas da empresa',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EmpresaDashboardResponse' },
            },
          },
        },
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
        201: {
          description: 'Vaga criada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VagaMutationResponse' },
            },
          },
        },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
        404: { description: 'Empresa não encontrada' },
      },
    },
  },

  '/empresa/vagas/{vagaId}/status': {
    patch: {
      tags: ['Empresa'],
      summary: 'Atualizar o status de uma vaga da empresa',
      security: [{ sessionAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'vagaId',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status'],
              properties: {
                status: { type: 'string', enum: ['Aberta', 'Fechada'] },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Status da vaga atualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VagaMutationResponse' },
            },
          },
        },
        400: { description: 'Status inválido' },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
        404: { description: 'Vaga não encontrada ou não pertence à empresa' },
      },
    },
  },

  '/empresa/candidaturas': {
    get: {
      tags: ['Empresa'],
      summary: 'Buscar candidaturas das vagas da empresa',
      security: [{ sessionAuth: [] }],
      responses: {
        200: {
          description: 'Candidaturas encontradas com contato do candidato vinculado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CandidaturasEmpresaResponse' },
            },
          },
        },
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
        200: {
          description: 'Status da candidatura atualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CandidaturaMutationResponse' },
            },
          },
        },
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
      summary: 'Buscar perfis profissionais de candidatos',
      description:
        'A busca global exige ao menos 2 caracteres. Sem termo, vagaId é obrigatório e limita o resultado a candidatos vinculados à vaga da empresa. Dados de contato não são retornados neste endpoint.',
      security: [{ sessionAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'q',
          required: false,
          description: 'Termo de busca global. Obrigatório quando vagaId não for informado.',
          schema: { type: 'string', minLength: 2, maxLength: 80 },
        },
        {
          in: 'query',
          name: 'vagaId',
          required: false,
          description:
            'Restringe a busca aos candidatos que se candidataram a uma vaga da empresa.',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'Lista de perfis profissionais sem contato ou identificadores internos',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BuscaCandidatosResponse' },
            },
          },
        },
        400: { description: 'Critério de busca ausente ou inválido' },
        401: { description: 'Não autenticado' },
        403: { description: 'Acesso negado' },
        404: { description: 'Vaga não encontrada ou não pertence à empresa' },
      },
    },
  },
};
