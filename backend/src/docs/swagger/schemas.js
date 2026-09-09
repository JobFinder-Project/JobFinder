import { areasEnum } from './constants.js';

export const schemas = {
  ErrorResponse: {
    type: 'object',
    properties: {
      error: { type: 'string', example: 'Mensagem de erro' },
      message: { type: 'string', example: 'Mensagem de erro' },
      status: { type: 'number', example: 400 },
    },
  },

  LoginRequest: {
    type: 'object',
    required: ['email', 'senha'],
    properties: {
      email: { type: 'string', format: 'email' },
      senha: { type: 'string', minLength: 8 },
    },
  },

  RecuperarSenhaRequest: {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email' },
    },
  },

  RedefinirSenhaRequest: {
    type: 'object',
    required: ['senha'],
    properties: {
      senha: { type: 'string', minLength: 8 },
    },
  },

  CandidatoCadastroFormData: {
    type: 'object',
    required: ['nome', 'cpf', 'email', 'senha', 'telefone', 'educacao'],
    properties: {
      imagem: { type: 'string', format: 'binary' },
      nome: { type: 'string' },
      cpf: { type: 'string', example: '123.456.789-09' },
      email: { type: 'string', format: 'email' },
      senha: { type: 'string', minLength: 8 },
      telefone: { type: 'string', example: '(92) 99999-9999' },
      educacao: { type: 'string' },
      qualificacoes: { type: 'string' },
      cursos: { type: 'string' },
      descricao: { type: 'string' },
      habilidades: { type: 'string' },
      idiomas: { type: 'string' },
    },
  },

  CandidatoEditarFormData: {
    type: 'object',
    properties: {
      imagem: { type: 'string', format: 'binary' },
      nome: { type: 'string' },
      telefone: { type: 'string', example: '(92) 99999-9999' },
      educacao: { type: 'string' },
      qualificacoes: { type: 'string' },
      cursos: { type: 'string' },
      descricao: { type: 'string' },
      habilidades: { type: 'string' },
      idiomas: { type: 'string' },
      email: { type: 'string', format: 'email' },
    },
  },

  EmpresaCadastroRequest: {
    type: 'object',
    required: ['nome', 'cnpj', 'email', 'senha', 'fone'],
    properties: {
      nome: { type: 'string' },
      cnpj: { type: 'string', example: '12345678000199' },
      email: { type: 'string', format: 'email' },
      senha: { type: 'string', minLength: 8 },
      fone: { type: 'string', example: '(92) 99999-9999' },
      bio: { type: 'string' },
      site: { type: 'string', example: 'https://empresa.com' },
    },
  },

  EmpresaEditarRequest: {
    type: 'object',
    properties: {
      nome: { type: 'string' },
      email: { type: 'string', format: 'email' },
      fone: { type: 'string', example: '(92) 99999-9999' },
      bio: { type: 'string' },
      site: { type: 'string', example: 'https://empresa.com' },
    },
  },

  CandidaturaStatusUpdateRequest: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: ['Pendente', 'Aceita', 'Rejeitada'] },
    },
  },

  VagaCriarFormData: {
    type: 'object',
    required: ['nome', 'area', 'requisitos'],
    properties: {
      nome: { type: 'string', minLength: 3, maxLength: 120 },
      area: { type: 'string', enum: areasEnum },
      requisitos: { type: 'string', minLength: 10, maxLength: 1000 },
      imagem: { type: 'string', format: 'binary' },
    },
  },

  CandidatoPerfil: {
    type: 'object',
    description: 'Dados completos visíveis apenas ao próprio candidato autenticado.',
    properties: {
      nome: { type: 'string' },
      cpf: { type: 'string' },
      email: { type: 'string', format: 'email' },
      telefone: { type: 'string' },
      educacao: { type: 'string' },
      qualificacoes: { type: 'string' },
      cursos: { type: 'array', items: { type: 'string' } },
      descricao: { type: 'array', items: { type: 'string' } },
      habilidadesTecnicas: { type: 'array', items: { type: 'string' } },
      idiomas: { type: 'array', items: { type: 'string' } },
      imagem: {
        nullable: true,
        type: 'object',
        properties: {
          contentType: { type: 'string' },
          data: { type: 'string', format: 'byte' },
        },
      },
    },
  },

  CandidatoPublico: {
    type: 'object',
    description: 'Perfil profissional sem identificadores ou dados de contato.',
    properties: {
      nome: { type: 'string' },
      educacao: { type: 'string' },
      qualificacoes: { type: 'string' },
      cursos: { type: 'array', items: { type: 'string' } },
      descricao: { type: 'array', items: { type: 'string' } },
      habilidadesTecnicas: { type: 'array', items: { type: 'string' } },
      idiomas: { type: 'array', items: { type: 'string' } },
      imagem: { type: 'string', nullable: true, description: 'Data URL da imagem do perfil.' },
    },
  },

  CandidatoResumo: {
    type: 'object',
    description: 'Resumo mínimo de um candidato vinculado às vagas da empresa.',
    properties: {
      nome: { type: 'string' },
      qualificacoes: { type: 'string' },
      imagem: { type: 'string', nullable: true, description: 'Data URL da imagem do perfil.' },
    },
  },

  CandidatoContato: {
    allOf: [
      { $ref: '#/components/schemas/CandidatoPublico' },
      {
        type: 'object',
        description: 'Contato liberado no contexto de uma candidatura recebida.',
        properties: {
          email: { type: 'string', format: 'email' },
          telefone: { type: 'string' },
        },
      },
    ],
  },

  EmpresaPerfil: {
    type: 'object',
    description: 'Dados visíveis à própria empresa autenticada.',
    properties: {
      nome: { type: 'string' },
      cnpj: { type: 'string' },
      email: { type: 'string', format: 'email' },
      fone: { type: 'string' },
      bio: { type: 'string' },
      site: { type: 'string', format: 'uri' },
      imagem: { type: 'string', nullable: true, description: 'Data URL da imagem do perfil.' },
    },
  },

  EmpresaPublica: {
    type: 'object',
    description: 'Dados públicos da empresa, sem identificador interno, CNPJ, e-mail ou telefone.',
    properties: {
      nome: { type: 'string' },
      bio: { type: 'string' },
      site: { type: 'string', format: 'uri' },
      imagem: { type: 'string', nullable: true, description: 'Data URL da imagem do perfil.' },
    },
  },

  VagaEmpresa: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      nome: { type: 'string' },
      area: { type: 'string', enum: areasEnum },
      requisitos: { type: 'string' },
      status: { type: 'string', enum: ['Aberta', 'Fechada'] },
      imagem: { type: 'string', nullable: true, description: 'Data URL da imagem da vaga.' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  VagaPublica: {
    allOf: [
      { $ref: '#/components/schemas/VagaEmpresa' },
      {
        type: 'object',
        properties: {
          empresa: { $ref: '#/components/schemas/EmpresaPublica' },
        },
      },
    ],
  },

  VagaResumo: {
    type: 'object',
    description: 'Identificação mínima da vaga necessária para gerir uma candidatura.',
    properties: {
      _id: { type: 'string' },
      nome: { type: 'string' },
    },
  },

  CandidaturaBase: {
    type: 'object',
    properties: {
      _id: { type: 'string', description: 'Necessário para atualizar ou cancelar a candidatura.' },
      status: { type: 'string', enum: ['Pendente', 'Aceita', 'Rejeitada'] },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  CandidaturaEmpresa: {
    allOf: [
      { $ref: '#/components/schemas/CandidaturaBase' },
      {
        type: 'object',
        properties: {
          vaga: { $ref: '#/components/schemas/VagaResumo' },
          candidato: { $ref: '#/components/schemas/CandidatoContato' },
        },
      },
    ],
  },

  CandidaturaCandidato: {
    allOf: [
      { $ref: '#/components/schemas/CandidaturaBase' },
      {
        type: 'object',
        properties: {
          vaga: { $ref: '#/components/schemas/VagaPublica' },
        },
      },
    ],
  },

  EmpresaDashboardResponse: {
    type: 'object',
    properties: {
      empresa: { $ref: '#/components/schemas/EmpresaPerfil' },
      vagas: { type: 'array', items: { $ref: '#/components/schemas/VagaEmpresa' } },
      candidatosRecentes: {
        type: 'array',
        maxItems: 3,
        items: { $ref: '#/components/schemas/CandidatoResumo' },
      },
      totalCandidatos: { type: 'integer', minimum: 0 },
    },
  },

  CandidatoDashboardResponse: {
    type: 'object',
    properties: {
      candidato: { $ref: '#/components/schemas/CandidatoPerfil' },
      vagas: { type: 'array', items: { $ref: '#/components/schemas/VagaPublica' } },
      areas: { type: 'array', items: { type: 'string', enum: areasEnum } },
    },
  },

  BuscaCandidatosResponse: {
    type: 'object',
    properties: {
      candidatos: { type: 'array', items: { $ref: '#/components/schemas/CandidatoPublico' } },
    },
  },

  CandidaturasEmpresaResponse: {
    type: 'object',
    properties: {
      candidaturas: {
        type: 'array',
        items: { $ref: '#/components/schemas/CandidaturaEmpresa' },
      },
    },
  },

  CandidaturasCandidatoResponse: {
    type: 'object',
    properties: {
      candidaturas: {
        type: 'array',
        items: { $ref: '#/components/schemas/CandidaturaCandidato' },
      },
    },
  },

  VagasResponse: {
    type: 'object',
    properties: {
      vagas: { type: 'array', items: { $ref: '#/components/schemas/VagaPublica' } },
    },
  },

  VagaMutationResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      vaga: { $ref: '#/components/schemas/VagaEmpresa' },
    },
  },

  CandidaturaMutationResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      candidatura: { $ref: '#/components/schemas/CandidaturaBase' },
    },
  },
};
