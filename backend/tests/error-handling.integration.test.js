import request from 'supertest';
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
import { registerAndLoginCandidato, registerAndLoginEmpresa } from './helpers/auth.js';
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

describe('Tratamento de erros da API', () => {
  it('deve retornar 400 para dados inválidos', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'nao-existe@teste.com', senha: 'senhaerrada123' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      status: 400,
      message: 'Email ou senha incorretos',
    });
  });

  it('deve retornar 401 para rota protegida sem sessão', async () => {
    const response = await request(app).get('/api/vagas');

    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject({
      status: 401,
      message: 'Não autenticado. Faça login.',
    });
  });

  it('deve retornar 403 para rota protegida por perfil incorreto', async () => {
    const { agent } = await registerAndLoginCandidato(app);
    const response = await agent.get('/api/empresa/dashboard');

    expect(response.statusCode).toBe(403);
    expect(response.body).toMatchObject({
      status: 403,
      message: 'Acesso negado. Apenas empresas.',
    });
  });

  it('deve retornar 404 para rota inexistente', async () => {
    const { agent } = await registerAndLoginCandidato(app);
    const response = await agent.get('/api/rota-inexistente');

    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({
      status: 404,
      message: 'Página não encontrada',
    });
  });

  it('deve converter CastError do Mongoose em resposta 400', async () => {
    const { agent } = await registerAndLoginCandidato(app);
    const response = await agent.post('/api/candidato/vagas/id-invalido').send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      status: 400,
      message: 'Um ou mais dados fornecidos estão inválidos',
    });
  });

  it('deve retornar 404 quando o perfil autenticado não existir mais no banco', async () => {
    const { agent, empresa } = await registerAndLoginEmpresa(app);
    await agent.get('/api/logout');

    const freshAgent = request.agent(app);
    await freshAgent.post('/api/login').send({ email: empresa.email, senha: empresa.senha });
    await clearTestDatabase();

    const response = await freshAgent.get('/api/empresa/dashboard');
    expect(response.statusCode).toBe(404);
  });
});
