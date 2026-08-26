import request from 'supertest';
import mongoose from 'mongoose';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import app from '../src/app.js';
import Candidatura from '../src/models/candidaturaModel.js';
import {
  createVagaAsEmpresa,
  registerAndLoginCandidato,
  registerAndLoginEmpresa,
} from './helpers/auth.js';
import { clearTestDatabase, startTestDatabase, stopTestDatabase } from './helpers/database.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await startTestDatabase();
});

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(async () => {
  jest.restoreAllMocks();
  await clearTestDatabase();
});

afterAll(async () => {
  await stopTestDatabase(mongoServer);
});

const createCandidaturaForStatusUpdate = async () => {
  const { agent: candidateAgent } = await registerAndLoginCandidato(app);
  const { agent: companyAgent, vagaId } = await createVagaAsEmpresa(app);

  const candidaturaResponse = await candidateAgent.post(`/api/candidato/vagas/${vagaId}`).send({});
  expect(candidaturaResponse.statusCode).toBe(201);
  expect(candidaturaResponse.body?.candidatura?._id).toBeDefined();

  return {
    candidateAgent,
    companyAgent,
    vagaId,
    candidaturaId: candidaturaResponse.body.candidatura._id,
  };
};

describe('Fluxo de candidaturas do candidato', () => {
  it('deve realizar candidatura com sucesso', async () => {
    const { agent: candidateAgent } = await registerAndLoginCandidato(app);
    const { vagaId } = await createVagaAsEmpresa(app);

    const candidaturaResponse = await candidateAgent
      .post(`/api/candidato/vagas/${vagaId}`)
      .send({});

    expect(candidaturaResponse.statusCode).toBe(201);
    expect(candidaturaResponse.body.success).toBe(true);
    expect(candidaturaResponse.body.candidatura.status).toBe('Pendente');

    const candidaturaNoDb = await Candidatura.findOne({ vaga: vagaId });
    expect(candidaturaNoDb).not.toBeNull();
    expect(candidaturaNoDb.status).toBe('Pendente');
  });

  it('deve listar apenas candidaturas do candidato autenticado', async () => {
    const { agent: candidateAgent } = await registerAndLoginCandidato(app);
    const { agent: outroCandidateAgent } = await registerAndLoginCandidato(app);
    const { vagaId } = await createVagaAsEmpresa(app);

    await candidateAgent.post(`/api/candidato/vagas/${vagaId}`).send({});

    const responseCandidato = await candidateAgent.get('/api/candidato/candidaturas');
    expect(responseCandidato.statusCode).toBe(200);
    expect(responseCandidato.body.candidaturas).toHaveLength(1);
    expect(String(responseCandidato.body.candidaturas[0].vaga._id)).toBe(String(vagaId));

    const responseOutroCandidato = await outroCandidateAgent.get('/api/candidato/candidaturas');
    expect(responseOutroCandidato.statusCode).toBe(200);
    expect(responseOutroCandidato.body.candidaturas).toHaveLength(0);
  });

  it('deve impedir candidatura duplicada na mesma vaga', async () => {
    const { agent: candidateAgent } = await registerAndLoginCandidato(app);
    const { vagaId } = await createVagaAsEmpresa(app);

    const firstResponse = await candidateAgent.post(`/api/candidato/vagas/${vagaId}`).send({});
    expect(firstResponse.statusCode).toBe(201);

    const duplicateResponse = await candidateAgent.post(`/api/candidato/vagas/${vagaId}`).send({});
    expect(duplicateResponse.statusCode).toBe(400);
  });

  it('deve retornar 404 ao candidatar em vaga inexistente', async () => {
    const { agent: candidateAgent } = await registerAndLoginCandidato(app);
    const vagaInexistenteId = new mongoose.Types.ObjectId();

    const response = await candidateAgent
      .post(`/api/candidato/vagas/${vagaInexistenteId}`)
      .send({});

    expect(response.statusCode).toBe(404);
  });

  it('deve bloquear candidatura sem autenticação ou feita por empresa', async () => {
    const { agent: companyAgent, vagaId } = await createVagaAsEmpresa(app);

    const unauthenticatedResponse = await request(app)
      .post(`/api/candidato/vagas/${vagaId}`)
      .send({});
    expect(unauthenticatedResponse.statusCode).toBe(401);

    const companyResponse = await companyAgent.post(`/api/candidato/vagas/${vagaId}`).send({});
    expect(companyResponse.statusCode).toBe(403);
  });

  it('deve cancelar candidatura existente', async () => {
    const { agent: candidateAgent } = await registerAndLoginCandidato(app);
    const { vagaId } = await createVagaAsEmpresa(app);

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

describe('Fluxo de gestão de candidaturas pela empresa', () => {
  it('deve listar candidaturas recebidas nas vagas da empresa autenticada', async () => {
    const { agent: candidateAgent } = await registerAndLoginCandidato(app);
    const { agent: companyAgent, vagaId } = await createVagaAsEmpresa(app);
    await createVagaAsEmpresa(app);

    await candidateAgent.post(`/api/candidato/vagas/${vagaId}`).send({});

    const response = await companyAgent.get('/api/empresa/candidaturas');

    expect(response.statusCode).toBe(200);
    expect(response.body.candidaturas).toHaveLength(1);
    expect(response.body.candidaturas[0].status).toBe('Pendente');
    expect(String(response.body.candidaturas[0].vaga._id)).toBe(String(vagaId));
  });

  it('deve atualizar status para Aceita pela empresa dona da vaga', async () => {
    const { companyAgent, candidaturaId } = await createCandidaturaForStatusUpdate();

    const response = await companyAgent
      .put(`/api/empresa/candidatura/${candidaturaId}`)
      .send({ status: 'Aceita' });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.candidatura.status).toBe('Aceita');

    const candidaturaNoDb = await Candidatura.findById(candidaturaId);
    expect(candidaturaNoDb).not.toBeNull();
    expect(candidaturaNoDb.status).toBe('Aceita');
  });

  it('deve falhar ao enviar status inválido', async () => {
    const { companyAgent, candidaturaId } = await createCandidaturaForStatusUpdate();

    const response = await companyAgent
      .put(`/api/empresa/candidatura/${candidaturaId}`)
      .send({ status: 'Em análise' });

    expect(response.statusCode).toBe(400);
  });

  it('deve retornar 404 para candidatura inexistente', async () => {
    const { agent: companyAgent } = await registerAndLoginEmpresa(app);
    const candidaturaInexistenteId = new mongoose.Types.ObjectId();

    const response = await companyAgent
      .put(`/api/empresa/candidatura/${candidaturaInexistenteId}`)
      .send({ status: 'Aceita' });

    expect(response.statusCode).toBe(404);
  });

  it('deve impedir atualização por empresa que não é dona da vaga', async () => {
    const { candidaturaId } = await createCandidaturaForStatusUpdate();
    const { agent: outraEmpresaAgent } = await registerAndLoginEmpresa(app);

    const response = await outraEmpresaAgent
      .put(`/api/empresa/candidatura/${candidaturaId}`)
      .send({ status: 'Rejeitada' });

    expect(response.statusCode).toBe(400);
  });

  it('deve bloquear atualização sem autenticação ou feita por candidato', async () => {
    const { candidateAgent, candidaturaId } = await createCandidaturaForStatusUpdate();

    const unauthenticatedResponse = await request(app)
      .put(`/api/empresa/candidatura/${candidaturaId}`)
      .send({ status: 'Aceita' });
    expect(unauthenticatedResponse.statusCode).toBe(401);

    const candidateResponse = await candidateAgent
      .put(`/api/empresa/candidatura/${candidaturaId}`)
      .send({ status: 'Aceita' });
    expect(candidateResponse.statusCode).toBe(403);
  });
});
