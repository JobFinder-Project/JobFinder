import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';

import app from '../src/app.js';
import Empresa from '../src/models/empresaModel.js';
import { registerAndLoginEmpresa } from './helpers/auth.js';
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

describe('Perfil público de empresa', () => {
  it('deve expor perfil público ampliado sem autenticação e sem dados sensíveis', async () => {
    const { agent } = await registerAndLoginEmpresa(app, {
      nome: 'Manaus Tech Labs',
      email: 'contato@manaustech.test',
      fone: '(92) 98888-7777',
      bio: 'Criamos produtos digitais para empresas da região Norte.',
      site: 'https://manaustech.example',
      segmento: 'Tecnologia',
      localizacao: 'Manaus, AM',
      tamanhoEmpresa: '11-50 colaboradores',
      anoFundacao: 2018,
      missao: 'Conectar talentos locais a produtos digitais de alto impacto.',
      valores: 'Transparência, Aprendizado contínuo',
      beneficios: 'Plano de saúde, Trabalho híbrido',
    });

    const dashboardResponse = await agent.get('/empresa/dashboard');
    expect(dashboardResponse.statusCode).toBe(200);

    const { slug } = dashboardResponse.body.empresa;
    expect(slug).toBe('manaus-tech-labs');

    const publicResponse = await request(app).get(`/empresa/publica/${slug}`);

    expect(publicResponse.statusCode).toBe(200);
    expect(publicResponse.body.empresa).toMatchObject({
      nome: 'Manaus Tech Labs',
      slug,
      bio: 'Criamos produtos digitais para empresas da região Norte.',
      site: 'https://manaustech.example',
      segmento: 'Tecnologia',
      localizacao: 'Manaus, AM',
      tamanhoEmpresa: '11-50 colaboradores',
      anoFundacao: 2018,
      missao: 'Conectar talentos locais a produtos digitais de alto impacto.',
      valores: ['Transparência', 'Aprendizado contínuo'],
      beneficios: ['Plano de saúde', 'Trabalho híbrido'],
    });
    expect(publicResponse.body.empresa).not.toHaveProperty('_id');
    expect(publicResponse.body.empresa).not.toHaveProperty('id');
    expect(publicResponse.body.empresa).not.toHaveProperty('cnpj');
    expect(publicResponse.body.empresa).not.toHaveProperty('email');
    expect(publicResponse.body.empresa).not.toHaveProperty('fone');
    expect(publicResponse.body.empresa).not.toHaveProperty('senha');
    expect(publicResponse.body.empresa).not.toHaveProperty('resetToken');
  });

  it('deve listar empresas públicas sem exigir login e sem expor dados sensíveis', async () => {
    await registerAndLoginEmpresa(app, {
      nome: 'Empresa Listada',
      email: 'listada@empresa.test',
      fone: '(92) 97777-6666',
      segmento: 'Tecnologia',
      localizacao: 'Manaus, AM',
    });
    await registerAndLoginEmpresa(app, {
      nome: 'Empresa Antiga Sem Slug',
      email: 'antiga@empresa.test',
    });
    await Empresa.updateOne({ email: 'antiga@empresa.test' }, { $unset: { slug: '' } });

    const response = await request(app).get('/empresas/publicas');

    expect(response.statusCode).toBe(200);
    expect(response.body.empresas).toHaveLength(2);
    expect(response.body.empresas).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nome: 'Empresa Antiga Sem Slug',
          slug: 'empresa-antiga-sem-slug',
        }),
      ])
    );
    expect(response.body.empresas).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nome: 'Empresa Listada',
          slug: 'empresa-listada',
          segmento: 'Tecnologia',
          localizacao: 'Manaus, AM',
        }),
      ])
    );

    response.body.empresas.forEach((empresa) => {
      expect(empresa).not.toHaveProperty('_id');
      expect(empresa).not.toHaveProperty('cnpj');
      expect(empresa).not.toHaveProperty('email');
      expect(empresa).not.toHaveProperty('fone');
      expect(empresa).not.toHaveProperty('senha');
    });
  });

  it('deve refletir no perfil público os campos ampliados atualizados pela empresa', async () => {
    const { agent } = await registerAndLoginEmpresa(app, {
      nome: 'Perfil Atualizável',
      segmento: 'Serviços',
    });

    const updateResponse = await agent.put('/empresa/editar').send({
      nome: 'Perfil Público Atualizado',
      segmento: 'Educação',
      localizacao: 'Belém, PA',
      tamanhoEmpresa: '51-200 colaboradores',
      anoFundacao: '2020',
      missao: 'Preparar profissionais para novas oportunidades.',
      valores: ['Inclusão', 'Qualidade'],
      beneficios: ['Bolsa de estudos', 'Horário flexível'],
    });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.empresa.slug).toBe('perfil-publico-atualizado');

    const publicResponse = await request(app).get('/empresa/publica/perfil-publico-atualizado');

    expect(publicResponse.statusCode).toBe(200);
    expect(publicResponse.body.empresa).toMatchObject({
      nome: 'Perfil Público Atualizado',
      segmento: 'Educação',
      localizacao: 'Belém, PA',
      tamanhoEmpresa: '51-200 colaboradores',
      anoFundacao: 2020,
      missao: 'Preparar profissionais para novas oportunidades.',
      valores: ['Inclusão', 'Qualidade'],
      beneficios: ['Bolsa de estudos', 'Horário flexível'],
    });
  });

  it('deve retornar 404 para perfil público inexistente', async () => {
    const response = await request(app).get('/empresa/publica/empresa-inexistente');

    expect(response.statusCode).toBe(404);
  });
});
