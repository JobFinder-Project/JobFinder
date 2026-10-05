import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CandidatosFavoritosPage from '../CandidatosFavoritosPage';
import { empresaService } from '../../../services/empresaService';

vi.mock('../../../components/Layout/DashboardLayout/DashboardLayout', () => ({
  default: ({ children }) => <main>{children}</main>,
}));

vi.mock('../../../features/candidato/CandidateCard', () => ({
  default: ({ candidato, onToggleFavorito }) => (
    <article>
      <span>{candidato.nome}</span>
      <button type="button" onClick={() => onToggleFavorito?.(candidato)}>
        Remover favorito
      </button>
    </article>
  ),
}));

vi.mock('../../../services/empresaService', () => ({
  empresaService: {
    listarCandidatosFavoritos: vi.fn(),
    desfavoritarCandidato: vi.fn(),
  },
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <CandidatosFavoritosPage />
    </MemoryRouter>
  );

describe('CandidatosFavoritosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    empresaService.listarCandidatosFavoritos.mockResolvedValue({
      candidatos: [
        { id: 'candidato-1', nome: 'Marina Souza', favoritado: true },
        { id: 'candidato-2', nome: 'Carlos Lima', favoritado: true },
      ],
    });
    empresaService.desfavoritarCandidato.mockResolvedValue({ success: true });
  });

  it('lista candidatos favoritos da empresa autenticada', async () => {
    renderPage();

    expect(screen.getByText('Carregando favoritos...')).toBeInTheDocument();
    expect(await screen.findByText('Marina Souza')).toBeInTheDocument();
    expect(screen.getByText('Carlos Lima')).toBeInTheDocument();
    expect(empresaService.listarCandidatosFavoritos).toHaveBeenCalled();
  });

  it('remove candidato da lista ao desfavoritar', async () => {
    renderPage();
    await screen.findByText('Marina Souza');

    await userEvent.click(screen.getAllByRole('button', { name: 'Remover favorito' })[0]);

    await waitFor(() =>
      expect(empresaService.desfavoritarCandidato).toHaveBeenCalledWith('candidato-1')
    );
    expect(screen.queryByText('Marina Souza')).not.toBeInTheDocument();
    expect(screen.getByText('Carlos Lima')).toBeInTheDocument();
  });

  it('filtra favoritos por nome dentro da própria página', async () => {
    renderPage();
    await screen.findByText('Marina Souza');

    await userEvent.type(screen.getByLabelText('Pesquisar favoritos'), 'Carlos');

    expect(screen.queryByText('Marina Souza')).not.toBeInTheDocument();
    expect(screen.getByText('Carlos Lima')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Limpar' }));

    expect(screen.getByText('Marina Souza')).toBeInTheDocument();
    expect(screen.getByText('Carlos Lima')).toBeInTheDocument();
  });

  it('mostra mensagem quando nenhum favorito corresponde à pesquisa', async () => {
    renderPage();
    await screen.findByText('Marina Souza');

    await userEvent.type(screen.getByLabelText('Pesquisar favoritos'), 'Joana');

    expect(screen.getByText('Nenhum favorito encontrado para "Joana".')).toBeInTheDocument();
    expect(screen.queryByText('Marina Souza')).not.toBeInTheDocument();
  });

  it('mostra estado vazio quando não há favoritos', async () => {
    empresaService.listarCandidatosFavoritos.mockResolvedValueOnce({ candidatos: [] });

    renderPage();

    expect(await screen.findByText('Nenhum candidato favorito ainda')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /buscar candidatos/i })).toHaveAttribute(
      'href',
      '/empresa/candidatos/buscar'
    );
  });
});
