import request from 'supertest';
import { expect } from '@jest/globals';

import { buildCandidato, buildEmpresa, buildVaga } from './factories.js';

export const registerAndLoginCandidato = async (app, overrides = {}) => {
  const agent = request.agent(app);
  const candidato = buildCandidato(overrides);

  const cadastroResponse = await agent.post('/api/candidato/cadastrar').send(candidato);
  expect(cadastroResponse.statusCode).toBe(201);

  const loginResponse = await agent
    .post('/api/login')
    .send({ email: candidato.email, senha: candidato.senha });
  expect(loginResponse.statusCode).toBe(200);

  return { agent, candidato, loginResponse };
};

export const registerAndLoginEmpresa = async (app, overrides = {}) => {
  const agent = request.agent(app);
  const empresa = buildEmpresa(overrides);

  const cadastroResponse = await agent.post('/api/empresa/cadastrar').send(empresa);
  expect(cadastroResponse.statusCode).toBe(201);

  const loginResponse = await agent
    .post('/api/login')
    .send({ email: empresa.email, senha: empresa.senha });
  expect(loginResponse.statusCode).toBe(200);

  return { agent, empresa, loginResponse };
};

export const createVagaAsEmpresa = async (
  app,
  { empresaOverrides = {}, vagaOverrides = {} } = {}
) => {
  const { agent, empresa } = await registerAndLoginEmpresa(app, empresaOverrides);

  const createVagaResponse = await agent
    .post('/api/empresa/vagas/criar')
    .send(buildVaga(undefined, vagaOverrides));

  expect(createVagaResponse.statusCode).toBe(201);
  expect(createVagaResponse.body?.vaga?._id).toBeDefined();

  return {
    agent,
    empresa,
    vaga: createVagaResponse.body.vaga,
    vagaId: createVagaResponse.body.vaga._id,
  };
};
