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
};
