import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';

import app from '../src/app.js';
import Vaga from '../src/models/vagasModel.js';
import {
  createVagaAsEmpresa,
  registerAndLoginCandidato,
  registerAndLoginEmpresa,
} from './helpers/auth.js';
import { clearTestDatabase, startTestDatabase, stopTestDatabase } from './helpers/database.js';
import { buildCandidato, buildVaga } from './helpers/factories.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await startTestDatabase();
});

afterEach(async () => {
  await clearTestDatabase();
});

afterAll(async () => {
  await stopTestDatabase(mongoServer);
});

describe('Fluxo de vagas', () => {
  it('deve permitir que empresa autenticada crie vaga e veja no dashboard', async () => {
    const { agent: companyAgent } = await registerAndLoginEmpresa(app);
    const vagaPayload = buildVaga(undefined, {
      nome: 'Analista Administrativo',
      area: 'Administrativa',
    });

    const createResponse = await companyAgent.post('/api/empresa/vagas/criar').send(vagaPayload);

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.vaga).toMatchObject({
      nome: vagaPayload.nome,
      area: vagaPayload.area,
      requisitos: vagaPayload.requisitos,
      status: 'Aberta',
    });
    expect(createResponse.body.vaga.createdAt).toBeDefined();

    const vagaNoDb = await Vaga.findById(createResponse.body.vaga._id);
    expect(vagaNoDb).not.toBeNull();

    const dashboardResponse = await companyAgent.get('/api/empresa/dashboard');
    expect(dashboardResponse.statusCode).toBe(200);
    expect(dashboardResponse.body.vagas).toHaveLength(1);
    expect(dashboardResponse.body.vagas[0].nome).toBe(vagaPayload.nome);
  });

  it('deve permitir que a empresa encerre e reabra apenas as próprias vagas', async () => {
    const { agent: companyAgent, vagaId } = await createVagaAsEmpresa(app);
    const { agent: otherCompanyAgent } = await registerAndLoginEmpresa(app);

    const forbiddenResponse = await otherCompanyAgent
      .patch(`/api/empresa/vagas/${vagaId}/status`)
      .send({ status: 'Fechada' });
    expect(forbiddenResponse.statusCode).toBe(404);

    const closeResponse = await companyAgent
      .patch(`/api/empresa/vagas/${vagaId}/status`)
      .send({ status: 'Fechada' });
    expect(closeResponse.statusCode).toBe(200);
    expect(closeResponse.body.vaga.status).toBe('Fechada');

    const reopenResponse = await companyAgent
      .patch(`/api/empresa/vagas/${vagaId}/status`)
      .send({ status: 'Aberta' });
    expect(reopenResponse.statusCode).toBe(200);
    expect(reopenResponse.body.vaga.status).toBe('Aberta');
  });

  it('deve bloquear criação de vaga para candidato ou usuário anônimo', async () => {
    const { agent: candidateAgent } = await registerAndLoginCandidato(app);

    const unauthenticatedResponse = await request(app)
      .post('/api/empresa/vagas/criar')
      .send(buildVaga());
    expect(unauthenticatedResponse.statusCode).toBe(401);

    const candidateResponse = await candidateAgent
      .post('/api/empresa/vagas/criar')
      .send(buildVaga());
    expect(candidateResponse.statusCode).toBe(403);
  });

  it('deve buscar vagas por palavra-chave e área', async () => {
    const { agent: companyAgent } = await createVagaAsEmpresa(app, {
      vagaOverrides: {
        nome: 'Desenvolvedor React',
        area: 'TI - Tecnologia da Informação',
      },
    });

    await companyAgent.post('/api/empresa/vagas/criar').send(
      buildVaga(undefined, {
        nome: 'Auxiliar Administrativo',
        area: 'Administrativa',
      })
    );

    const { agent: candidateAgent } = await registerAndLoginCandidato(app);

    const keywordResponse = await candidateAgent.get('/api/vagas?q=React');
    expect(keywordResponse.statusCode).toBe(200);
    expect(keywordResponse.body.vagas).toHaveLength(1);
    expect(keywordResponse.body.vagas[0].nome).toBe('Desenvolvedor React');

    const areaResponse = await candidateAgent.get('/api/vagas?area=Administrativa');
    expect(areaResponse.statusCode).toBe(200);
    expect(areaResponse.body.vagas).toHaveLength(1);
    expect(areaResponse.body.vagas[0].area).toBe('Administrativa');
  });

  it('deve listar áreas únicas disponíveis', async () => {
    const { agent: companyAgent } = await createVagaAsEmpresa(app, {
      vagaOverrides: { area: 'Administrativa' },
    });

    await companyAgent.post('/api/empresa/vagas/criar').send(
      buildVaga(undefined, {
        nome: 'Assistente Administrativo',
        area: 'Administrativa',
      })
    );
    await companyAgent.post('/api/empresa/vagas/criar').send(
      buildVaga(undefined, {
        nome: 'Vendedor Interno',
        area: 'Comercial/Vendas',
      })
    );

    const { agent: candidateAgent } = await registerAndLoginCandidato(app);
    const response = await candidateAgent.get('/api/areas');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(['Administrativa', 'Comercial/Vendas']));
    expect(response.body.filter((area) => area === 'Administrativa')).toHaveLength(1);
  });
});

describe('Busca de candidatos pela empresa', () => {
  it('deve buscar candidatos por nome, educação ou qualificação', async () => {
    const { agent: companyAgent } = await registerAndLoginEmpresa(app);
    const candidato = buildCandidato({
      nome: 'Marina UX Research',
      qualificacoes: 'Pesquisadora de Experiência do Usuário',
      educacao: 'Ensino Superior Completo',
    });

    await request(app).post('/api/candidato/cadastrar').send(candidato);

    const byNameResponse = await companyAgent.get('/api/empresa/candidatos/buscar?q=Marina');
    expect(byNameResponse.statusCode).toBe(200);
    expect(byNameResponse.body.candidatos).toHaveLength(1);
    expect(byNameResponse.body.candidatos[0].nome).toBe(candidato.nome);
    expect(byNameResponse.body.candidatos[0].senha).toBeUndefined();

    const byEducationResponse = await companyAgent.get('/api/empresa/candidatos/buscar?q=Superior');
    expect(byEducationResponse.statusCode).toBe(200);
    expect(byEducationResponse.body.candidatos).toHaveLength(1);
  });

  it('deve bloquear busca de candidatos para candidato ou usuário anônimo', async () => {
    const { agent: candidateAgent } = await registerAndLoginCandidato(app);

    const unauthenticatedResponse = await request(app).get('/api/empresa/candidatos/buscar?q=dev');
    expect(unauthenticatedResponse.statusCode).toBe(401);

    const candidateResponse = await candidateAgent.get('/api/empresa/candidatos/buscar?q=dev');
    expect(candidateResponse.statusCode).toBe(403);
  });
});
