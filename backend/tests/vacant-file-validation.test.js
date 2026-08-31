import request from 'supertest';
import app from '../server.js';

describe('Integração: Validação de Upload de Arquivos na Criação de Vagas', () => {
  it('Deve bloquear arquivo com formato inválido (PDF) e retornar status 400', async () => {
    const response = await request(app)
      .post('/vagas/criar')
      .field('nome', 'Desenvolvedor Frontend')
      .field('area', 'TI - Tecnologia da Informação')
      .field('requisitos', 'React, Node.js')
      .attach('imagem', Buffer.from('conteudo-fake-pdf'), 'curriculo.pdf', {
        contentType: 'application/pdf',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Formato de arquivo inválido/i);
  });

  it('Deve bloquear imagem que excede o limite de 10MB e retornar status 400', async () => {
    const imagemGigante = Buffer.alloc(11 * 1024 * 1024, 'a');

    const response = await request(app)
      .post('/vagas/criar')
      .field('nome', 'Analista de Suporte')
      .field('area', 'TI - Tecnologia da Informação')
      .field('requisitos', 'Redes, Linux')
      .attach('imagem', imagemGigante, 'banner-gigante.png', {
        contentType: 'image/png',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/excede o limite máximo de 10MB/i);
  });
});