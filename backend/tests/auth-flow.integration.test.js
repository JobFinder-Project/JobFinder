/* eslint-disable no-undef */
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../src/app.js';
import Candidato from '../src/models/candidatoModel.js';
import Empresa from '../src/models/empresaModel.js';

let mongoServer;
let agent;
let uniqueId = 0;

const nextId = () => {
  uniqueId += 1;
  return uniqueId;
};

const generateValidCPF = (seed = 0) => {
  const n = Array.from({ length: 9 }, (_, idx) => ((seed + idx * 7) % 9) + 1);

  const calcDigit = (baseDigits, factorStart) => {
    const sum = baseDigits.reduce((acc, digit, idx) => acc + digit * (factorStart - idx), 0);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calcDigit(n, 10);
  const d2 = calcDigit([...n, d1], 11);
  const digits = [...n, d1, d2].join('');

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const buildMockCandidato = () => {
  const id = nextId();
  return {
    nome: `Joana da Silva Teste ${id}`,
    cpf: generateValidCPF(id),
    email: `joana.teste.${id}@exemplo.com`,
    senha: 'senhaforte123',
    telefone: '(92) 99999-9999',
    educacao: 'Ensino Superior Completo em Análise de Sistemas',
  };
};

const buildMockEmpresa = () => {
  const id = nextId();
  return {
    nome: `Empresa de Teste LTDA ${id}`,
    cnpj: `12345678000${String(100 + id).padStart(3, '0')}`, // 14 dígitos
    email: `contato.empresa.${id}@empresa.com`,
    senha: 'senhaempresaforte',
    fone: '(92) 99999-9999',
  };
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  await Candidato.init();
  await Empresa.init();
});

beforeEach(() => {
  agent = request.agent(app);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// FLUXO DE AUTENICAÇÃO DO CANDIDATO

describe('Fluxo de Autenticação do Candidato', () => {
  it('deve cadastrar candidato, salvar no banco e permitir login', async () => {
    const mockCandidato = buildMockCandidato();

    const cadastroResponse = await agent.post('/api/candidato/cadastrar').send(mockCandidato);
    expect([200, 201]).toContain(cadastroResponse.statusCode);

    const candidatoNoDb = await Candidato.findOne({ email: mockCandidato.email });
    expect(candidatoNoDb).not.toBeNull();
    expect(candidatoNoDb.nome).toBe(mockCandidato.nome);
    expect(candidatoNoDb.senha).not.toBe(mockCandidato.senha); // hash

    const loginResponse = await agent
      .post('/api/login')
      .send({ email: mockCandidato.email, senha: mockCandidato.senha });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.redirectUrl).toBe('/candidato/dashboard');
  });

  it('deve permitir acesso ao dashboard do candidato após login', async () => {
    const mockCandidato = buildMockCandidato();

    await agent.post('/api/candidato/cadastrar').send(mockCandidato);
    await agent.post('/api/login').send({ email: mockCandidato.email, senha: mockCandidato.senha });

    const dashboardResponse = await agent.get('/api/candidato/dashboard');

    expect(dashboardResponse.statusCode).toBe(200);
    expect(dashboardResponse.body).toHaveProperty('candidatoId');
  });

  it('deve bloquear candidato no dashboard da empresa (403)', async () => {
    const mockCandidato = buildMockCandidato();

    await agent.post('/api/candidato/cadastrar').send(mockCandidato);
    await agent.post('/api/login').send({ email: mockCandidato.email, senha: mockCandidato.senha });

    const response = await agent.get('/api/empresa/dashboard');
    expect(response.statusCode).toBe(403);
  });

  it('deve retornar erro para login com senha inválida', async () => {
    const mockCandidato = buildMockCandidato();

    await agent.post('/api/candidato/cadastrar').send(mockCandidato);

    const loginResponse = await agent
      .post('/api/login')
      .send({ email: mockCandidato.email, senha: 'senhaerrada123' });

    expect(loginResponse.statusCode).toBe(400);
  });

  it('deve invalidar sessão após logout', async () => {
    const mockCandidato = buildMockCandidato();

    await agent.post('/api/candidato/cadastrar').send(mockCandidato);
    await agent.post('/api/login').send({ email: mockCandidato.email, senha: mockCandidato.senha });

    const logoutResponse = await agent.get('/api/logout');
    expect(logoutResponse.statusCode).toBe(200);

    const afterLogoutResponse = await agent.get('/api/candidato/dashboard');
    expect(afterLogoutResponse.statusCode).toBe(401);
  });
});

// FLUXO DE AUTENICAÇÃO DA EMPRESA

describe('Fluxo de Autenticação da Empresa', () => {
  it('deve cadastrar empresa e permitir login', async () => {
    const mockEmpresa = buildMockEmpresa();

    const cadastroResponse = await agent.post('/api/empresa/cadastrar').send(mockEmpresa);
    expect([200, 201]).toContain(cadastroResponse.statusCode);
    expect(cadastroResponse.body.success).toBe(true);

    const empresaNoDb = await Empresa.findOne({ email: mockEmpresa.email });
    expect(empresaNoDb).not.toBeNull();
    expect(empresaNoDb.senha).not.toBe(mockEmpresa.senha); // hash

    const loginResponse = await agent
      .post('/api/login')
      .send({ email: mockEmpresa.email, senha: mockEmpresa.senha });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.redirectUrl).toBe('/empresa/dashboard');
  });

  it('deve permitir acesso ao dashboard da empresa após login', async () => {
    const mockEmpresa = buildMockEmpresa();

    await agent.post('/api/empresa/cadastrar').send(mockEmpresa);
    await agent.post('/api/login').send({ email: mockEmpresa.email, senha: mockEmpresa.senha });

    const dashboardResponse = await agent.get('/api/empresa/dashboard');
    expect(dashboardResponse.statusCode).toBe(200);
    expect(dashboardResponse.body).toHaveProperty('empresa');
  });

  it('deve bloquear empresa no dashboard do candidato (403)', async () => {
    const mockEmpresa = buildMockEmpresa();

    await agent.post('/api/empresa/cadastrar').send(mockEmpresa);
    await agent.post('/api/login').send({ email: mockEmpresa.email, senha: mockEmpresa.senha });

    const response = await agent.get('/api/candidato/dashboard');
    expect(response.statusCode).toBe(403);
  });

  it('deve exigir autenticação para acessar dashboard da empresa (401)', async () => {
    const response = await agent.get('/api/empresa/dashboard');
    expect(response.statusCode).toBe(401);
  });

  it('deve impedir cadastro com email já usado por candidato', async () => {
    const mockCandidato = buildMockCandidato();
    const mockEmpresa = buildMockEmpresa();
    mockEmpresa.email = mockCandidato.email;

    await agent.post('/api/candidato/cadastrar').send(mockCandidato);
    const response = await agent.post('/api/empresa/cadastrar').send(mockEmpresa);

    expect(response.statusCode).toBe(400);
  });
});
