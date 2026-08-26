import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';

import app from '../src/app.js';
import Candidato from '../src/models/candidatoModel.js';
import Empresa from '../src/models/empresaModel.js';
import { registerAndLoginCandidato, registerAndLoginEmpresa } from './helpers/auth.js';
import { clearTestDatabase, startTestDatabase, stopTestDatabase } from './helpers/database.js';
import { buildCandidato, buildEmpresa } from './helpers/factories.js';

let mongoServer;
let agent;

beforeAll(async () => {
  mongoServer = await startTestDatabase();
});

beforeEach(() => {
  agent = request.agent(app);
});

afterEach(async () => {
  await clearTestDatabase();
});

afterAll(async () => {
  await stopTestDatabase(mongoServer);
});

describe('Fluxo de autenticação', () => {
  it('deve informar sessão anônima quando não houver usuário autenticado', async () => {
    const response = await agent.get('/api/me');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ authenticated: false });
  });

  it('deve cadastrar candidato, salvar senha com hash e autenticar sessão', async () => {
    const candidato = buildCandidato();

    const cadastroResponse = await agent.post('/api/candidato/cadastrar').send(candidato);
    expect(cadastroResponse.statusCode).toBe(201);
    expect(cadastroResponse.body.success).toBe(true);

    const candidatoNoDb = await Candidato.findOne({ email: candidato.email });
    expect(candidatoNoDb).not.toBeNull();
    expect(candidatoNoDb.nome).toBe(candidato.nome);
    expect(candidatoNoDb.senha).not.toBe(candidato.senha);

    const loginResponse = await agent
      .post('/api/login')
      .send({ email: candidato.email, senha: candidato.senha });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.redirectUrl).toBe('/candidato/dashboard');
    expect(loginResponse.body.user).toMatchObject({
      nome: candidato.nome,
      email: candidato.email,
      role: 'candidato',
    });

    const meResponse = await agent.get('/api/me');
    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.body.authenticated).toBe(true);
    expect(meResponse.body.user.role).toBe('candidato');
  });

  it('deve cadastrar empresa, salvar senha com hash e autenticar sessão', async () => {
    const empresa = buildEmpresa();

    const cadastroResponse = await agent.post('/api/empresa/cadastrar').send(empresa);
    expect(cadastroResponse.statusCode).toBe(201);
    expect(cadastroResponse.body.success).toBe(true);

    const empresaNoDb = await Empresa.findOne({ email: empresa.email });
    expect(empresaNoDb).not.toBeNull();
    expect(empresaNoDb.nome).toBe(empresa.nome);
    expect(empresaNoDb.senha).not.toBe(empresa.senha);

    const loginResponse = await agent
      .post('/api/login')
      .send({ email: empresa.email, senha: empresa.senha });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.redirectUrl).toBe('/empresa/dashboard');
    expect(loginResponse.body.user).toMatchObject({
      nome: empresa.nome,
      email: empresa.email,
      role: 'empresa',
    });
  });

  it('deve rejeitar login com email inexistente ou senha inválida', async () => {
    const candidato = buildCandidato();
    await agent.post('/api/candidato/cadastrar').send(candidato);

    const senhaInvalida = await agent
      .post('/api/login')
      .send({ email: candidato.email, senha: 'senhaerrada123' });
    expect(senhaInvalida.statusCode).toBe(400);

    const emailInexistente = await agent
      .post('/api/login')
      .send({ email: 'inexistente@teste.com', senha: candidato.senha });
    expect(emailInexistente.statusCode).toBe(400);
  });

  it('deve invalidar a sessão após logout', async () => {
    const { agent: candidatoAgent } = await registerAndLoginCandidato(app);

    const logoutResponse = await candidatoAgent.get('/api/logout');
    expect(logoutResponse.statusCode).toBe(200);
    expect(logoutResponse.body.success).toBe(true);

    const meResponse = await candidatoAgent.get('/api/me');
    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.body.authenticated).toBe(false);

    const dashboardResponse = await candidatoAgent.get('/api/candidato/dashboard');
    expect(dashboardResponse.statusCode).toBe(401);
  });
});

describe('Permissões por perfil', () => {
  it('deve permitir candidato acessar apenas rotas de candidato', async () => {
    const { agent: candidatoAgent } = await registerAndLoginCandidato(app);

    const candidatoDashboard = await candidatoAgent.get('/api/candidato/dashboard');
    expect(candidatoDashboard.statusCode).toBe(200);

    const empresaDashboard = await candidatoAgent.get('/api/empresa/dashboard');
    expect(empresaDashboard.statusCode).toBe(403);
  });

  it('deve permitir empresa acessar apenas rotas de empresa', async () => {
    const { agent: empresaAgent } = await registerAndLoginEmpresa(app);

    const empresaDashboard = await empresaAgent.get('/api/empresa/dashboard');
    expect(empresaDashboard.statusCode).toBe(200);

    const candidatoDashboard = await empresaAgent.get('/api/candidato/dashboard');
    expect(candidatoDashboard.statusCode).toBe(403);
  });

  it('deve exigir autenticação para rotas internas', async () => {
    const responses = await Promise.all([
      request(app).get('/api/candidato/dashboard'),
      request(app).get('/api/empresa/dashboard'),
      request(app).get('/api/vagas'),
    ]);

    responses.forEach((response) => {
      expect(response.statusCode).toBe(401);
    });
  });

  it('deve impedir reutilização de email entre candidato e empresa', async () => {
    const candidato = buildCandidato();
    const empresa = buildEmpresa({ email: candidato.email });

    const candidatoResponse = await agent.post('/api/candidato/cadastrar').send(candidato);
    expect(candidatoResponse.statusCode).toBe(201);

    const empresaResponse = await agent.post('/api/empresa/cadastrar').send(empresa);
    expect(empresaResponse.statusCode).toBe(400);
  });
});
