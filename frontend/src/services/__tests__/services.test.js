import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authService } from '../authService';
import { candidatoService } from '../candidatoService';
import { empresaService } from '../empresaService';
import { vagasService } from '../vagasService';

const createJsonResponse = (body, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  headers: {
    get: () => 'application/json',
  },
  json: async () => body,
});

let fetchMock;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

describe('services', () => {
  it('deve enviar credenciais de login para a API', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({ success: true, redirectUrl: '/candidato/dashboard' })
    );

    const response = await authService.login({
      email: 'ana@teste.com',
      senha: 'senha123',
    });

    expect(response.redirectUrl).toBe('/candidato/dashboard');
    expect(fetchMock).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ana@teste.com',
        senha: 'senha123',
      }),
    });
  });

  it('deve enviar nova senha no formato esperado pelo backend', async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({ success: true }));

    await authService.redefinirSenha('token-123', 'novaSenhaForte123');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/redefinir_senha/token-123',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ senha: 'novaSenhaForte123' }),
      })
    );
  });

  it('deve montar query de busca de vagas e retornar a lista normalizada', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse({
        vagas: [{ _id: 'vaga-1', nome: 'Desenvolvedor React' }],
      })
    );

    const vagas = await vagasService.buscar({
      q: 'React',
      area: 'TI - Tecnologia da Informação',
    });

    expect(vagas).toEqual([{ _id: 'vaga-1', nome: 'Desenvolvedor React' }]);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/vagas?q=React&area=TI+-+Tecnologia+da+Informa%C3%A7%C3%A3o',
      expect.objectContaining({ method: 'GET', credentials: 'include' })
    );
  });

  it('deve chamar endpoints de candidato com métodos corretos', async () => {
    fetchMock
      .mockResolvedValueOnce(createJsonResponse({ success: true }))
      .mockResolvedValueOnce(createJsonResponse({ success: true }));

    await candidatoService.candidatarVaga('vaga-1');
    await candidatoService.cancelarCandidatura('candidatura-1');

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/candidato/vagas/vaga-1',
      expect.objectContaining({ method: 'POST' })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/candidato/candidaturas/delete/candidatura-1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('deve buscar candidatos com query codificada e filtro opcional de vaga', async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({ candidatos: [] }));

    await empresaService.buscarCandidatos('React Native', 'vaga-1');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/empresa/candidatos/buscar?q=React%20Native&vagaId=vaga-1',
      expect.objectContaining({ method: 'GET', credentials: 'include' })
    );
  });

  it('deve propagar status e payload quando a API retornar erro', async () => {
    fetchMock.mockResolvedValueOnce(
      createJsonResponse(
        { message: 'Não autenticado. Faça login.', status: 401 },
        { ok: false, status: 401 }
      )
    );

    await expect(authService.getMe()).rejects.toMatchObject({
      status: 401,
      data: {
        message: 'Não autenticado. Faça login.',
        status: 401,
      },
    });
  });
});
