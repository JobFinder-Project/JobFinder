import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';

import app from '../src/app.js';
import Candidato from '../src/models/candidatoModel.js';
import { registerAndLoginCandidato } from './helpers/auth.js';
import { clearTestDatabase, startTestDatabase, stopTestDatabase } from './helpers/database.js';

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

describe('Edição de perfil do candidato', () => {
  it('deve persistir a nova qualificação enviada pelo formulário (campo "qualificacoes")', async () => {
    const { agent, candidato } = await registerAndLoginCandidato(app);

    const editResponse = await agent
      .put('/api/candidato/editar')
      .field('nome', candidato.nome)
      .field('email', candidato.email)
      .field('telefone', candidato.telefone)
      .field('educacao', candidato.educacao)
      .field('qualificacoes', 'Desenvolvedor Backend Sênior')
      .field('descricao', 'Nova descrição');

    expect(editResponse.statusCode).toBe(200);
    expect(editResponse.body.success).toBe(true);

    const candidatoNoDb = await Candidato.findOne({ email: candidato.email });
    expect(candidatoNoDb.qualificacao).toBe('Desenvolvedor Backend Sênior');

    const dashboardResponse = await agent.get('/api/candidato/dashboard');
    expect(dashboardResponse.statusCode).toBe(200);
    expect(dashboardResponse.body.candidato.qualificacoes).toBe('Desenvolvedor Backend Sênior');
  });

  it('deve manter a qualificação atualizada após logout e novo login', async () => {
    const { agent, candidato } = await registerAndLoginCandidato(app);

    await agent
      .put('/api/candidato/editar')
      .field('nome', candidato.nome)
      .field('email', candidato.email)
      .field('qualificacoes', 'Engenheiro de Dados');

    await agent.get('/api/logout');

    const loginResponse = await agent
      .post('/api/login')
      .send({ email: candidato.email, senha: candidato.senha });
    expect(loginResponse.statusCode).toBe(200);

    const dashboardResponse = await agent.get('/api/candidato/dashboard');
    expect(dashboardResponse.body.candidato.qualificacoes).toBe('Engenheiro de Dados');
  });
});
