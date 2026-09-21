import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';

import app from '../src/app.js';
import Candidato from '../src/models/candidatoModel.js';
import Candidatura from '../src/models/candidaturaModel.js';
import Empresa from '../src/models/empresaModel.js';
import Vaga from '../src/models/vagasModel.js';
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

afterEach(async () => {
  await clearTestDatabase();
});

afterAll(async () => {
  await stopTestDatabase(mongoServer);
});

const candidatar = async (agent, vagaId) => {
  const response = await agent.post(`/api/candidato/vagas/${vagaId}`);
  expect(response.statusCode).toBe(201);
};

const sessaoFoiLimpa = (response) =>
  (response.headers['set-cookie'] ?? []).some(
    (cookie) => cookie.startsWith('connect.sid=;') && /expires=/i.test(cookie)
  );

describe('Exclusão da própria conta de candidato', () => {
  it('deve excluir a conta com a senha correta, remover as candidaturas e encerrar a sessão', async () => {
    const { vagaId } = await createVagaAsEmpresa(app);
    const { agent, candidato } = await registerAndLoginCandidato(app);
    const { agent: agenteOutro } = await registerAndLoginCandidato(app);
    await candidatar(agent, vagaId);
    await candidatar(agenteOutro, vagaId);

    const response = await agent.delete('/api/candidato/conta').send({ senha: candidato.senha });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(sessaoFoiLimpa(response)).toBe(true);

    await expect(Candidato.findOne({ email: candidato.email })).resolves.toBeNull();
    await expect(Candidato.countDocuments()).resolves.toBe(1);

    await expect(Candidatura.countDocuments()).resolves.toBe(1);
    await expect(Vaga.countDocuments()).resolves.toBe(1);

    const me = await agent.get('/api/me');
    expect(me.body.authenticated).toBe(false);
    const dashboard = await agent.get('/api/candidato/dashboard');
    expect(dashboard.statusCode).toBe(401);

    const login = await request(app)
      .post('/api/login')
      .send({ email: candidato.email, senha: candidato.senha });
    expect(login.statusCode).toBe(400);
  });

  it('deve rejeitar senha incorreta sem excluir a conta nem encerrar a sessão', async () => {
    const { agent, candidato } = await registerAndLoginCandidato(app);

    const response = await agent.delete('/api/candidato/conta').send({ senha: 'senhaerrada123' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/Senha incorreta/i);
    await expect(Candidato.findOne({ email: candidato.email })).resolves.not.toBeNull();

    const dashboard = await agent.get('/api/candidato/dashboard');
    expect(dashboard.statusCode).toBe(200);
  });

  it.each([
    ['sem corpo', undefined],
    ['senha vazia', { senha: '' }],
    ['senha que não é texto', { senha: { $ne: null } }],
  ])('deve exigir a senha de confirmação (%s)', async (_descricao, corpo) => {
    const { agent, candidato } = await registerAndLoginCandidato(app);

    const pedido = agent.delete('/api/candidato/conta');
    const response = await (corpo ? pedido.send(corpo) : pedido);

    expect(response.statusCode).toBe(400);
    await expect(Candidato.findOne({ email: candidato.email })).resolves.not.toBeNull();
  });

  it('deve exigir autenticação', async () => {
    const response = await request(app)
      .delete('/api/candidato/conta')
      .send({ senha: 'qualquer123' });

    expect(response.statusCode).toBe(401);
  });

  it('deve invalidar as sessões da conta excluída abertas em outros dispositivos', async () => {
    const { agent, candidato } = await registerAndLoginCandidato(app);
    const outroDispositivo = request.agent(app);
    await outroDispositivo
      .post('/api/login')
      .send({ email: candidato.email, senha: candidato.senha });
    expect((await outroDispositivo.get('/api/candidato/dashboard')).statusCode).toBe(200);

    await agent.delete('/api/candidato/conta').send({ senha: candidato.senha });

    const dashboard = await outroDispositivo.get('/api/candidato/dashboard');
    expect(dashboard.statusCode).toBe(401);
    const me = await outroDispositivo.get('/api/me');
    expect(me.body.authenticated).toBe(false);
  });
});

describe('Exclusão da própria conta de empresa', () => {
  it('deve excluir a conta, as vagas e as candidaturas recebidas, preservando dados de terceiros', async () => {
    const { agent, empresa, vagaId } = await createVagaAsEmpresa(app);
    const { vagaId: vagaDeOutraEmpresaId } = await createVagaAsEmpresa(app);
    const { agent: agenteCandidato, candidato } = await registerAndLoginCandidato(app);
    await candidatar(agenteCandidato, vagaId);
    await candidatar(agenteCandidato, vagaDeOutraEmpresaId);

    const response = await agent.delete('/api/empresa/conta').send({ senha: empresa.senha });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(sessaoFoiLimpa(response)).toBe(true);

    await expect(Empresa.findOne({ email: empresa.email })).resolves.toBeNull();
    await expect(Vaga.findById(vagaId)).resolves.toBeNull();
    await expect(Candidatura.countDocuments({ vaga: vagaId })).resolves.toBe(0);
    await expect(Empresa.countDocuments()).resolves.toBe(1);
    await expect(Vaga.findById(vagaDeOutraEmpresaId)).resolves.not.toBeNull();
    await expect(Candidatura.countDocuments({ vaga: vagaDeOutraEmpresaId })).resolves.toBe(1);
    await expect(Candidato.findOne({ email: candidato.email })).resolves.not.toBeNull();

    expect((await agent.get('/api/me')).body.authenticated).toBe(false);
    expect((await agent.get('/api/empresa/dashboard')).statusCode).toBe(401);
  });

  it('deve rejeitar senha incorreta sem excluir a conta nem as vagas', async () => {
    const { agent, empresa, vagaId } = await createVagaAsEmpresa(app);

    const response = await agent.delete('/api/empresa/conta').send({ senha: 'senhaerrada123' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/Senha incorreta/i);
    await expect(Empresa.findOne({ email: empresa.email })).resolves.not.toBeNull();
    await expect(Vaga.findById(vagaId)).resolves.not.toBeNull();
    expect((await agent.get('/api/empresa/dashboard')).statusCode).toBe(200);
  });

  it('deve exigir a senha de confirmação', async () => {
    const { agent, empresa } = await registerAndLoginEmpresa(app);

    const response = await agent.delete('/api/empresa/conta').send({});

    expect(response.statusCode).toBe(400);
    await expect(Empresa.findOne({ email: empresa.email })).resolves.not.toBeNull();
  });

  it('deve exigir autenticação', async () => {
    const response = await request(app).delete('/api/empresa/conta').send({ senha: 'qualquer123' });

    expect(response.statusCode).toBe(401);
  });
});

describe('Exclusão de conta: bloqueios entre usuários', () => {
  it('não deve permitir que empresa exclua conta de candidato, nem o inverso', async () => {
    const { agent: agenteEmpresa, empresa } = await registerAndLoginEmpresa(app);
    const { agent: agenteCandidato, candidato } = await registerAndLoginCandidato(app);

    const empresaExcluindoCandidato = await agenteEmpresa
      .delete('/api/candidato/conta')
      .send({ senha: candidato.senha });
    const candidatoExcluindoEmpresa = await agenteCandidato
      .delete('/api/empresa/conta')
      .send({ senha: empresa.senha });

    expect(empresaExcluindoCandidato.statusCode).toBe(403);
    expect(candidatoExcluindoEmpresa.statusCode).toBe(403);
    await expect(Candidato.countDocuments()).resolves.toBe(1);
    await expect(Empresa.countDocuments()).resolves.toBe(1);
  });

  it('deve ignorar identificadores de terceiros enviados no corpo, na query ou na URL (candidato)', async () => {
    const { agent, candidato } = await registerAndLoginCandidato(app);
    const { candidato: alvo } = await registerAndLoginCandidato(app);
    const alvoNoDb = await Candidato.findOne({ email: alvo.email });

    const comIdNoCorpoENaQuery = await agent
      .delete(`/api/candidato/conta?id=${alvoNoDb._id}&candidatoId=${alvoNoDb._id}`)
      .send({ senha: candidato.senha, id: alvoNoDb._id, candidatoId: alvoNoDb._id });

    expect(comIdNoCorpoENaQuery.statusCode).toBe(200);
    await expect(Candidato.findOne({ email: candidato.email })).resolves.toBeNull();
    await expect(Candidato.findOne({ email: alvo.email })).resolves.not.toBeNull();

    const { agent: outroAgente, candidato: outro } = await registerAndLoginCandidato(app);
    const porUrl = await outroAgente
      .delete(`/api/candidato/conta/${alvoNoDb._id}`)
      .send({ senha: outro.senha });

    expect(porUrl.statusCode).toBe(404);
    await expect(Candidato.findOne({ email: alvo.email })).resolves.not.toBeNull();
    await expect(Candidato.findOne({ email: outro.email })).resolves.not.toBeNull();
  });

  it('deve ignorar identificadores de terceiros enviados no corpo, na query ou na URL (empresa)', async () => {
    const { agent, empresa } = await registerAndLoginEmpresa(app);
    const { empresa: alvo } = await createVagaAsEmpresa(app);
    const alvoNoDb = await Empresa.findOne({ email: alvo.email });

    const response = await agent
      .delete(`/api/empresa/conta?id=${alvoNoDb._id}&empresaId=${alvoNoDb._id}`)
      .send({ senha: empresa.senha, id: alvoNoDb._id, empresaId: alvoNoDb._id });

    expect(response.statusCode).toBe(200);
    await expect(Empresa.findOne({ email: empresa.email })).resolves.toBeNull();
    await expect(Empresa.findOne({ email: alvo.email })).resolves.not.toBeNull();
    await expect(Vaga.countDocuments({ empresa: alvoNoDb._id })).resolves.toBe(1);

    const { agent: outroAgente, empresa: outra } = await registerAndLoginEmpresa(app);
    const porUrl = await outroAgente
      .delete(`/api/empresa/conta/${alvoNoDb._id}`)
      .send({ senha: outra.senha });

    expect(porUrl.statusCode).toBe(404);
    await expect(Empresa.findOne({ email: alvo.email })).resolves.not.toBeNull();
    await expect(Empresa.findOne({ email: outra.email })).resolves.not.toBeNull();
  });
});
