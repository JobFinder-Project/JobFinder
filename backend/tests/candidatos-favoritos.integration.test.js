import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';

import app from '../src/app.js';
import FavoritoCandidato from '../src/models/favoritoCandidatoModel.js';
import { registerAndLoginCandidato, registerAndLoginEmpresa } from './helpers/auth.js';
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

describe('Favoritos de candidatos por empresa', () => {
  it('deve favoritar, refletir estado na busca, listar e desfavoritar candidato com idempotência', async () => {
    await registerAndLoginCandidato(app, {
      nome: 'Marina Favorita',
      qualificacoes: 'Product Designer',
      qualificacao: 'Product Designer',
    });
    const { agent: companyAgent } = await registerAndLoginEmpresa(app);

    const searchResponse = await companyAgent.get('/empresa/candidatos/buscar?q=Marina');
    expect(searchResponse.statusCode).toBe(200);
    expect(searchResponse.body.candidatos).toHaveLength(1);
    expect(searchResponse.body.candidatos[0]).toMatchObject({
      nome: 'Marina Favorita',
      favoritado: false,
    });
    expect(searchResponse.body.candidatos[0].id).toBeDefined();
    expect(searchResponse.body.candidatos[0]).not.toHaveProperty('_id');
    expect(searchResponse.body.candidatos[0]).not.toHaveProperty('email');
    expect(searchResponse.body.candidatos[0]).not.toHaveProperty('telefone');

    const candidatoId = searchResponse.body.candidatos[0].id;

    const firstFavorite = await companyAgent.post(`/empresa/candidatos/${candidatoId}/favorito`);
    expect(firstFavorite.statusCode).toBe(200);
    expect(firstFavorite.body.candidato).toMatchObject({
      id: candidatoId,
      favoritado: true,
    });

    const secondFavorite = await companyAgent.post(`/empresa/candidatos/${candidatoId}/favorito`);
    expect(secondFavorite.statusCode).toBe(200);
    expect(await FavoritoCandidato.countDocuments()).toBe(1);

    const searchAfterFavorite = await companyAgent.get('/empresa/candidatos/buscar?q=Marina');
    expect(searchAfterFavorite.body.candidatos[0].favoritado).toBe(true);

    const listResponse = await companyAgent.get('/empresa/candidatos/favoritos');
    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body.candidatos).toHaveLength(1);
    expect(listResponse.body.candidatos[0]).toMatchObject({
      id: candidatoId,
      nome: 'Marina Favorita',
      favoritado: true,
    });

    const firstRemove = await companyAgent.delete(`/empresa/candidatos/${candidatoId}/favorito`);
    expect(firstRemove.statusCode).toBe(200);
    expect(firstRemove.body).toMatchObject({
      candidatoId,
      favoritado: false,
    });

    const secondRemove = await companyAgent.delete(`/empresa/candidatos/${candidatoId}/favorito`);
    expect(secondRemove.statusCode).toBe(200);
    expect(await FavoritoCandidato.countDocuments()).toBe(0);
  });

  it('deve isolar favoritos por empresa autenticada', async () => {
    await registerAndLoginCandidato(app, { nome: 'Candidato Compartilhado' });
    const { agent: firstCompanyAgent } = await registerAndLoginEmpresa(app, {
      nome: 'Empresa A Favoritos',
    });
    const { agent: secondCompanyAgent } = await registerAndLoginEmpresa(app, {
      nome: 'Empresa B Favoritos',
    });

    const searchResponse = await firstCompanyAgent.get(
      '/empresa/candidatos/buscar?q=Compartilhado'
    );
    const candidatoId = searchResponse.body.candidatos[0].id;

    await firstCompanyAgent.post(`/empresa/candidatos/${candidatoId}/favorito`);

    const firstList = await firstCompanyAgent.get('/empresa/candidatos/favoritos');
    expect(firstList.statusCode).toBe(200);
    expect(firstList.body.candidatos).toHaveLength(1);

    const secondList = await secondCompanyAgent.get('/empresa/candidatos/favoritos');
    expect(secondList.statusCode).toBe(200);
    expect(secondList.body.candidatos).toHaveLength(0);

    const secondSearch = await secondCompanyAgent.get('/empresa/candidatos/buscar?q=Compartilhado');
    expect(secondSearch.body.candidatos[0].favoritado).toBe(false);
  });

  it('deve bloquear favoritos para usuário anônimo ou candidato autenticado', async () => {
    const { agent: candidateAgent } = await registerAndLoginCandidato(app);

    const unauthenticatedList = await request(app).get('/empresa/candidatos/favoritos');
    expect(unauthenticatedList.statusCode).toBe(401);

    const candidateList = await candidateAgent.get('/empresa/candidatos/favoritos');
    expect(candidateList.statusCode).toBe(403);

    const unauthenticatedFavorite = await request(app).post(
      '/empresa/candidatos/64b7f0f0f0f0f0f0f0f0f0f0/favorito'
    );
    expect(unauthenticatedFavorite.statusCode).toBe(401);
  });
});
