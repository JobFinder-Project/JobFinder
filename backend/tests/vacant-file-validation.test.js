import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';

import app from '../src/app.js';
import Vaga from '../src/models/vagasModel.js';
import { registerAndLoginEmpresa } from './helpers/auth.js';
import { clearTestDatabase, startTestDatabase, stopTestDatabase } from './helpers/database.js';

let mongoServer;

const invalidNonImageFiles = [
  {
    filename: 'curriculo.pdf',
    contentType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4'),
  },
  {
    filename: 'video.mp4',
    contentType: 'video/mp4',
    buffer: Buffer.from([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70]),
  },
  {
    filename: 'video.mov',
    contentType: 'video/quicktime',
    buffer: Buffer.from('mov-fake'),
  },
  {
    filename: 'arquivo.zip',
    contentType: 'application/zip',
    buffer: Buffer.from([0x50, 0x4b, 0x03, 0x04]),
  },
  {
    filename: 'observacoes.txt',
    contentType: 'text/plain',
    buffer: Buffer.from('arquivo de texto'),
  },
  {
    filename: 'payload.json',
    contentType: 'application/json',
    buffer: Buffer.from('{"teste":true}'),
  },
];

const validImageFiles = [
  {
    filename: 'banner.svg',
    contentType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
  },
  {
    filename: 'banner.png',
    contentType: 'image/png',
    buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  },
  {
    filename: 'banner.jpg',
    contentType: 'image/jpeg',
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
  },
  {
    filename: 'banner.jpeg',
    contentType: 'image/jpeg',
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
  },
];

const postVagaWithImage = (agent, file) =>
  agent
    .post('/api/empresa/vagas/criar')
    .field('nome', 'Analista Administrativo')
    .field('area', 'Administrativa')
    .field('requisitos', 'Experiência com rotinas administrativas')
    .attach('imagem', file.buffer, {
      filename: file.filename,
      contentType: file.contentType,
    });

beforeAll(async () => {
  mongoServer = await startTestDatabase();
});

afterEach(async () => {
  await clearTestDatabase();
});

afterAll(async () => {
  await stopTestDatabase(mongoServer);
});

describe('Integração: Validação de Upload de Arquivos na Criação de Vagas', () => {
  it.each(invalidNonImageFiles)(
    'deve bloquear arquivo que não seja imagem: $filename',
    async (file) => {
      const { agent } = await registerAndLoginEmpresa(app);

      const response = await postVagaWithImage(agent, file);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/Formato de arquivo inválido/i);
      await expect(Vaga.countDocuments()).resolves.toBe(0);
    }
  );

  it('deve bloquear GIF mesmo sendo um tipo de imagem', async () => {
    const { agent } = await registerAndLoginEmpresa(app);

    const response = await postVagaWithImage(agent, {
      filename: 'banner.gif',
      contentType: 'image/gif',
      buffer: Buffer.from([0x47, 0x49, 0x46, 0x38]),
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/Formato de arquivo inválido/i);
    await expect(Vaga.countDocuments()).resolves.toBe(0);
  });

  it('deve bloquear arquivo com extensão não permitida mesmo se o MIME for de imagem', async () => {
    const { agent } = await registerAndLoginEmpresa(app);

    const response = await postVagaWithImage(agent, {
      filename: 'arquivo.pdf',
      contentType: 'image/png',
      buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/Formato de arquivo inválido/i);
    await expect(Vaga.countDocuments()).resolves.toBe(0);
  });

  it('deve bloquear arquivo com extensão permitida quando o MIME não for de imagem', async () => {
    const { agent } = await registerAndLoginEmpresa(app);

    const response = await postVagaWithImage(agent, {
      filename: 'banner.png',
      contentType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4'),
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/Formato de arquivo inválido/i);
    await expect(Vaga.countDocuments()).resolves.toBe(0);
  });

  it('deve bloquear arquivo com extensão e MIME permitidos quando o conteúdo não for imagem', async () => {
    const { agent } = await registerAndLoginEmpresa(app);

    const response = await postVagaWithImage(agent, {
      filename: 'banner.png',
      contentType: 'image/png',
      buffer: Buffer.from('%PDF-1.4'),
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/Formato de arquivo inválido/i);
    await expect(Vaga.countDocuments()).resolves.toBe(0);
  });

  it('deve bloquear imagem que excede o limite de 10MB e não criar a vaga', async () => {
    const { agent } = await registerAndLoginEmpresa(app);
    const imagemGigante = Buffer.alloc(11 * 1024 * 1024, 'a');

    const response = await agent
      .post('/api/empresa/vagas/criar')
      .field('nome', 'Analista de Suporte')
      .field('area', 'TI - Tecnologia da Informação')
      .field('requisitos', 'Experiência com redes e suporte técnico')
      .attach('imagem', imagemGigante, {
        filename: 'banner-gigante.png',
        contentType: 'image/png',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/excede o limite máximo de 10MB/i);
    await expect(Vaga.countDocuments()).resolves.toBe(0);
  });

  it.each(validImageFiles)('deve permitir imagem válida: $filename', async (file) => {
    const { agent } = await registerAndLoginEmpresa(app);

    const response = await postVagaWithImage(agent, file);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);

    const vaga = await Vaga.findById(response.body.vaga._id);
    expect(vaga.imagem.contentType).toBe(file.contentType);
  });
});
