import bcrypt from 'bcrypt';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';

const sendMailMock = jest.fn().mockResolvedValue({ accepted: ['user@teste.com'] });
const createTransportMock = jest.fn(() => ({ sendMail: sendMailMock }));

jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

const { default: app } = await import('../src/app.js');
const { default: Candidato } = await import('../src/models/candidatoModel.js');
const { clearTestDatabase, startTestDatabase, stopTestDatabase } =
  await import('./helpers/database.js');
const { buildCandidato } = await import('./helpers/factories.js');

let mongoServer;

beforeAll(async () => {
  process.env.APP_EMAIL = 'jobfinder@teste.com';
  process.env.APP_PASS = 'senha-de-app';
  process.env.HOST_FRONTEND = 'localhost:5173';

  mongoServer = await startTestDatabase();
});

afterEach(async () => {
  sendMailMock.mockClear();
  createTransportMock.mockClear();
  await clearTestDatabase();
});

afterAll(async () => {
  await stopTestDatabase(mongoServer);
});

describe('Recuperação de senha', () => {
  it('deve enviar email de recuperação e armazenar token temporário', async () => {
    const candidato = buildCandidato();
    await request(app).post('/api/candidato/cadastrar').send(candidato);

    const response = await request(app)
      .post('/api/recuperar_senha')
      .send({ email: candidato.email });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(createTransportMock).toHaveBeenCalledWith({
      service: 'Gmail',
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASS,
      },
    });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock.mock.calls[0][0]).toMatchObject({
      from: process.env.APP_EMAIL,
      to: candidato.email,
      subject: 'Recuperar senha - App JobFinder',
    });
    expect(sendMailMock.mock.calls[0][0].html).toContain('localhost:5173/redefinir-senha/');

    const candidatoNoDb = await Candidato.findOne({ email: candidato.email });
    expect(candidatoNoDb.resetToken).toBeDefined();
    expect(candidatoNoDb.resetTokenExpiration.getTime()).toBeGreaterThan(Date.now());
  });

  it('deve retornar 404 quando email não existir', async () => {
    const response = await request(app)
      .post('/api/recuperar_senha')
      .send({ email: 'ausente@teste.com' });

    expect(response.statusCode).toBe(404);
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it('deve redefinir senha com token válido e limpar dados temporários', async () => {
    const candidato = buildCandidato();
    await request(app).post('/api/candidato/cadastrar').send(candidato);
    await request(app).post('/api/recuperar_senha').send({ email: candidato.email });

    const candidatoComToken = await Candidato.findOne({ email: candidato.email });
    const novaSenha = 'novaSenhaForte123';

    const response = await request(app)
      .post(`/api/redefinir_senha/${candidatoComToken.resetToken}`)
      .send({ senha: novaSenha });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const candidatoAtualizado = await Candidato.findOne({ email: candidato.email });
    expect(await bcrypt.compare(novaSenha, candidatoAtualizado.senha)).toBe(true);
    expect(candidatoAtualizado.resetToken).toBeUndefined();
    expect(candidatoAtualizado.resetTokenExpiration).toBeUndefined();
  });

  it('deve rejeitar token inexistente ou expirado', async () => {
    const candidato = new Candidato({
      ...buildCandidato(),
      resetToken: 'token-expirado',
      resetTokenExpiration: new Date(Date.now() - 1000),
    });
    await candidato.save();

    const expiredResponse = await request(app)
      .post('/api/redefinir_senha/token-expirado')
      .send({ senha: 'novaSenhaForte123' });
    expect(expiredResponse.statusCode).toBe(404);

    const missingResponse = await request(app)
      .post('/api/redefinir_senha/token-inexistente')
      .send({ senha: 'novaSenhaForte123' });
    expect(missingResponse.statusCode).toBe(404);
  });
});
