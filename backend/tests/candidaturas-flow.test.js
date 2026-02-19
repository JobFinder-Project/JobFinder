/* eslint-disable no-undef */
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../src/app.js';
import Candidato from '../src/models/candidatoModel.js';
import Empresa from '../src/models/empresaModel.js';
import Vaga from '../src/models/vagasModel.js';
import Candidatura from '../src/models/candidaturaModel.js';

let mongoServer;
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
    nome: `Candidato Fluxo ${id}`,
    cpf: generateValidCPF(id),
    email: `candidato.fluxo.${id}@teste.com`,
    senha: 'senhaforte123',
    telefone: '(92) 99999-9999',
    educacao: 'Ensino Superior Completo',
  };
};

const buildMockEmpresa = () => {
  const id = nextId();
  return {
    nome: `Empresa Fluxo ${id}`,
    cnpj: `12345678000${String(100 + id).padStart(3, '0')}`,
    email: `empresa.fluxo.${id}@teste.com`,
    senha: 'senhaempresaforte',
    fone: '(92) 99999-9999',
  };
};

const buildMockVaga = () => ({
  nome: 'Desenvolvedor Full Stack',
  area: 'TI - Tecnologia da Informação',
  requisitos: 'Experiência com Node.js, React, testes automatizados e boas práticas.',
});

const loginAsCandidato = async () => {
  const candidato = buildMockCandidato();
  const candidateAgent = request.agent(app);

  await candidateAgent.post('/api/candidato/cadastrar').send(candidato);
  const loginResponse = await candidateAgent
    .post('/api/login')
    .send({ email: candidato.email, senha: candidato.senha });

  expect(loginResponse.statusCode).toBe(200);
  return { candidateAgent, candidato };
};

const createVagaAsEmpresa = async () => {
  const empresa = buildMockEmpresa();
  const companyAgent = request.agent(app);

  await companyAgent.post('/api/empresa/cadastrar').send(empresa);
  const loginResponse = await companyAgent
    .post('/api/login')
    .send({ email: empresa.email, senha: empresa.senha });

  expect(loginResponse.statusCode).toBe(200);

  const createVagaResponse = await companyAgent
    .post('/api/empresa/vagas/criar')
    .send(buildMockVaga());

  expect(createVagaResponse.statusCode).toBe(201);
  expect(createVagaResponse.body?.vaga?._id).toBeDefined();

  return { companyAgent, empresa, vagaId: createVagaResponse.body.vaga._id };
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  await Candidato.init();
  await Empresa.init();
  await Vaga.init();
  await Candidatura.init();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Fluxo de Candidaturas', () => {
  it('deve realizar candidatura com sucesso', async () => {
    const { candidateAgent } = await loginAsCandidato();
    const { vagaId } = await createVagaAsEmpresa();

    const candidaturaResponse = await candidateAgent
      .post(`/api/candidato/vagas/${vagaId}`)
      .send({});

    expect(candidaturaResponse.statusCode).toBe(201);
    expect(candidaturaResponse.body.success).toBe(true);

    const candidaturaNoDb = await Candidatura.findOne({ vaga: vagaId });
    expect(candidaturaNoDb).not.toBeNull();
    expect(candidaturaNoDb.status).toBe('Pendente');
  });

  it('deve listar candidaturas do candidato autenticado', async () => {
    const { candidateAgent } = await loginAsCandidato();
    const { vagaId } = await createVagaAsEmpresa();

    await candidateAgent.post(`/api/candidato/vagas/${vagaId}`).send({});

    const listResponse = await candidateAgent.get('/api/candidato/candidaturas');

    expect(listResponse.statusCode).toBe(200);
    expect(Array.isArray(listResponse.body.candidaturas)).toBe(true);
    expect(listResponse.body.candidaturas).toHaveLength(1);
    expect(String(listResponse.body.candidaturas[0].vaga._id)).toBe(String(vagaId));
  });

  it('deve impedir candidatura duplicada na mesma vaga', async () => {
    const { candidateAgent } = await loginAsCandidato();
    const { vagaId } = await createVagaAsEmpresa();

    const firstResponse = await candidateAgent.post(`/api/candidato/vagas/${vagaId}`).send({});
    expect(firstResponse.statusCode).toBe(201);

    const duplicateResponse = await candidateAgent.post(`/api/candidato/vagas/${vagaId}`).send({});
    expect(duplicateResponse.statusCode).toBe(400);
  });

  it('deve retornar 404 ao candidatar em vaga inexistente', async () => {
    const { candidateAgent } = await loginAsCandidato();
    const vagaInexistenteId = new mongoose.Types.ObjectId();

    const response = await candidateAgent
      .post(`/api/candidato/vagas/${vagaInexistenteId}`)
      .send({});

    expect(response.statusCode).toBe(404);
  });

  it('deve bloquear candidatura sem autenticação (401)', async () => {
    const { vagaId } = await createVagaAsEmpresa();

    const response = await request(app).post(`/api/candidato/vagas/${vagaId}`).send({});

    expect(response.statusCode).toBe(401);
  });

  it('deve bloquear empresa tentando candidatar-se (403)', async () => {
    const { companyAgent, vagaId } = await createVagaAsEmpresa();

    const response = await companyAgent.post(`/api/candidato/vagas/${vagaId}`).send({});

    expect(response.statusCode).toBe(403);
  });

  it('deve deletar candidatura existente', async () => {
    const { candidateAgent } = await loginAsCandidato();
    const { vagaId } = await createVagaAsEmpresa();

    await candidateAgent.post(`/api/candidato/vagas/${vagaId}`).send({});

    const listBeforeDelete = await candidateAgent.get('/api/candidato/candidaturas');
    const candidaturaId = listBeforeDelete.body.candidaturas[0]._id;

    const deleteResponse = await candidateAgent.delete(
      `/api/candidato/candidaturas/delete/${candidaturaId}`
    );

    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body.success).toBe(true);

    const listAfterDelete = await candidateAgent.get('/api/candidato/candidaturas');
    expect(listAfterDelete.statusCode).toBe(200);
    expect(listAfterDelete.body.candidaturas).toHaveLength(0);
  });
});
