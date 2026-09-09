import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BuscaCandidatos from '../BuscaCandidatosPage';
import { empresaService } from '../../../services/empresaService';

vi.mock('../../../components/Layout/DashboardLayout/DashboardLayout', () => ({
  default: ({ children }) => <main>{children}</main>,
}));

vi.mock('../../../features/candidato/CandidateCard', () => ({
  default: ({ candidato }) => <article>{candidato.nome}</article>,
}));

vi.mock('../../../services/empresaService', () => ({
  empresaService: {
    buscarCandidatos: vi.fn(),
  },
}));

const renderPage = (route = '/empresa/candidatos/buscar') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <BuscaCandidatos />
    </MemoryRouter>,
  );

describe('BuscaCandidatosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    empresaService.buscarCandidatos.mockResolvedValue({
      candidatos: [{ nome: 'Marina Souza', qualificacoes: 'UX Researcher' }],
    });
  });

  it('não consulta todos os perfis quando não há critério de busca', () => {
    renderPage();

    expect(screen.getByText('Pesquise por um perfil profissional')).toBeInTheDocument();
    expect(empresaService.buscarCandidatos).not.toHaveBeenCalled();
  });

  it('exige dois caracteres antes de realizar uma busca global', async () => {
    renderPage();
    const input = screen.getByPlaceholderText(/buscar por nome/i);

    await userEvent.type(input, 'a');
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByText('Informe ao menos 2 caracteres para pesquisar.')).toBeInTheDocument();
    expect(empresaService.buscarCandidatos).not.toHaveBeenCalled();
  });

  it('consulta e renderiza resumos profissionais quando o termo é válido', async () => {
    renderPage();
    const input = screen.getByPlaceholderText(/buscar por nome/i);

    await userEvent.type(input, 'Marina');
    await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));

    await waitFor(() => expect(empresaService.buscarCandidatos).toHaveBeenCalledWith('Marina', null));
    expect(await screen.findByText('Marina Souza')).toBeInTheDocument();
  });

  it('permite listar somente os candidatos vinculados quando há vaga na URL', async () => {
    renderPage('/empresa/candidatos/buscar?vagaId=vaga-1');

    await waitFor(() => expect(empresaService.buscarCandidatos).toHaveBeenCalledWith('', 'vaga-1'));
  });
});
