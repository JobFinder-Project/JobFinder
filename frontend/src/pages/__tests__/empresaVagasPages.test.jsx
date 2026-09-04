import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import EmpresaDashboard from '../EmpresaDashboard/EmpresaDashboardPage';
import GerenciarVagas from '../GerenciarVagas/GerenciarVagasPage';
import { useAuth } from '../../contexts/AuthContext';
import { empresaService } from '../../services/empresaService';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../components/Layout/DashboardLayout/DashboardLayout', () => ({
  default: ({ children }) => <main data-testid="dashboard-layout">{children}</main>,
}));

vi.mock('../../features/vagas/VagasModal/VagasModal', () => ({
  default: () => null,
}));

vi.mock('../../features/vagas/CriarVagaModal/CriarVagaModal', () => ({
  default: () => null,
}));

vi.mock('../../features/empresa/PerfilEmpresaModal/PerfilEmpresaModal', () => ({
  default: () => null,
}));

vi.mock('../../services/empresaService', () => ({
  empresaService: {
    getDashboard: vi.fn(),
    buscarCandidatos: vi.fn(),
    atualizarStatusVaga: vi.fn(),
  },
}));

const vagas = [
  {
    _id: 'vaga-1',
    nome: 'Desenvolvedor React',
    area: 'TI - Tecnologia da Informação',
    requisitos: 'Experiência com React e testes automatizados.',
    status: 'Aberta',
    createdAt: '2026-08-20T12:00:00.000Z',
  },
  {
    _id: 'vaga-2',
    nome: 'Analista de Suporte',
    area: 'TI - Tecnologia da Informação',
    requisitos: 'Experiência com atendimento e redes.',
    status: 'Aberta',
    createdAt: '2026-08-21T12:00:00.000Z',
  },
  {
    _id: 'vaga-3',
    nome: 'Assistente Administrativo',
    area: 'Administrativa',
    requisitos: 'Organização e conhecimento do pacote Office.',
    status: 'Aberta',
    createdAt: '2026-08-22T12:00:00.000Z',
  },
  {
    _id: 'vaga-4',
    nome: 'Consultor de Vendas',
    area: 'Comercial/Vendas',
    requisitos: 'Experiência com negociação e atendimento.',
    status: 'Aberta',
    createdAt: '2026-08-23T12:00:00.000Z',
  },
];

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname + location.search}</span>;
}

function renderPage(path, page) {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route
          path="*"
          element={
            <>
              {page}
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  useAuth.mockReturnValue({
    user: { nome: 'Gestor Norte', role: 'empresa' },
    isAuthenticated: true,
    logout: vi.fn(),
  });

  empresaService.getDashboard.mockResolvedValue({
    empresa: { _id: 'empresa-1', nome: 'Tech Norte' },
    vagas,
  });
  empresaService.buscarCandidatos.mockResolvedValue({ candidatos: [] });
  empresaService.atualizarStatusVaga.mockImplementation(async (vagaId, status) => ({
    success: true,
    vaga: { ...vagas.find((vaga) => vaga._id === vagaId), status },
  }));
});

describe('dashboard de vagas da empresa', () => {
  it('deve exibir uma prévia de três vagas e abrir os detalhes do card selecionado', async () => {
    renderPage('/empresa/dashboard', <EmpresaDashboard />);

    await waitFor(() =>
      expect(screen.getByText(/bem-vindo de volta, tech norte/i)).toBeInTheDocument()
    );

    const cards = screen.getAllByRole('button', { name: /ver detalhes da vaga/i });
    expect(cards).toHaveLength(3);
    expect(screen.getByRole('button', { name: /\+ 1 vaga ativa.*ver todas as vagas/i })).toBeInTheDocument();
    expect(screen.queryByText('Consultor de Vendas')).not.toBeInTheDocument();

    await userEvent.click(cards[0]);

    const dialog = screen.getByRole('dialog', { name: /detalhes da vaga/i });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Desenvolvedor React' })).toBeInTheDocument();
    expect(within(dialog).getByText('Experiência com React e testes automatizados.')).toBeInTheDocument();
  });

  it('deve acessar a lista completa pela indicação de vagas adicionais', async () => {
    renderPage('/empresa/dashboard', <EmpresaDashboard />);

    const moreJobsButton = await screen.findByRole('button', {
      name: /\+ 1 vaga ativa.*ver todas as vagas/i,
    });
    await userEvent.click(moreJobsButton);

    expect(screen.getByTestId('location')).toHaveTextContent('/empresa/vagas');
  });

  it('deve manter o acesso à lista completa pelo botão Ver Todas do cabeçalho', async () => {
    renderPage('/empresa/dashboard', <EmpresaDashboard />);

    await userEvent.click(await screen.findByRole('button', { name: /^ver todas$/i }));

    expect(screen.getByTestId('location')).toHaveTextContent('/empresa/vagas');
  });
});

describe('gerenciamento de vagas da empresa', () => {
  it('deve reutilizar o modal de detalhes e atualizar o status da vaga', async () => {
    renderPage('/empresa/vagas', <GerenciarVagas />);

    await waitFor(() => expect(screen.getByText('Gerenciar Vagas')).toBeInTheDocument());
    await userEvent.click(screen.getAllByRole('button', { name: /detalhes/i })[0]);

    const dialog = screen.getByRole('dialog', { name: /detalhes da vaga/i });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Desenvolvedor React' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /encerrar vaga/i }));

    await waitFor(() =>
      expect(empresaService.atualizarStatusVaga).toHaveBeenCalledWith('vaga-1', 'Fechada')
    );
    expect(await within(dialog).findByText('Fechada')).toBeInTheDocument();
  });
});
