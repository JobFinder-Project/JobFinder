import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BuscaVagasPage from '../BuscaVagas/BuscaVagasPage';
import CandidatoDashboard from '../CandidatoDashboard/CandidatoDashboardPage';
import EmpresaDashboard from '../EmpresaDashboard/EmpresaDashboardPage';
import GestaoCandidaturas from '../GestaoCandidaturas/GestaoCandidaturasPage';
import Login from '../Login/LoginPage';
import MinhasCandidaturasPage from '../MinhasCandidaturas/MinhasCandidaturasPage';
import SignupPage from '../Signup/SignupPage';
import { useAuth } from '../../contexts/AuthContext';
import { useVagasQuery } from '../../features/vagas/useVagasQuery';
import { candidatoService } from '../../services/candidatoService';
import { empresaService } from '../../services/empresaService';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../components/Layout/DashboardLayout/DashboardLayout', () => ({
  default: ({ children }) => <main data-testid="dashboard-layout">{children}</main>,
}));

vi.mock('../../features/vagas/useVagasQuery', () => ({
  useVagasQuery: vi.fn(),
}));

vi.mock('../../features/vagas/VagaDetalhesModal/VagaDetalhesModal', () => ({
  default: ({ vaga, onClose }) => (
    <div role="dialog" aria-label="Detalhes da Vaga">
      <span>{vaga?.nome}</span>
      <button onClick={onClose}>Fechar</button>
    </div>
  ),
}));

vi.mock('../../features/vagas/VagasModal/VagasModal', () => ({
  default: ({ onClose }) => (
    <div role="dialog" aria-label="Vagas">
      <button onClick={onClose}>Fechar</button>
    </div>
  ),
}));

vi.mock('../../features/vagas/CriarVagaModal/CriarVagaModal', () => ({
  default: ({ onClose }) => (
    <div role="dialog" aria-label="Criar Vaga">
      <button onClick={onClose}>Fechar</button>
    </div>
  ),
}));

vi.mock('../../features/empresa/PerfilEmpresaModal/PerfilEmpresaModal', () => ({
  default: ({ onClose }) => (
    <div role="dialog" aria-label="Perfil Empresa">
      <button onClick={onClose}>Fechar</button>
    </div>
  ),
}));

vi.mock('../../services/candidatoService', () => ({
  candidatoService: {
    cadastrar: vi.fn(),
    getDashboard: vi.fn(),
    getCandidaturas: vi.fn(),
    candidatarVaga: vi.fn(),
    cancelarCandidatura: vi.fn(),
  },
}));

vi.mock('../../services/empresaService', () => ({
  empresaService: {
    cadastrar: vi.fn(),
    getDashboard: vi.fn(),
    buscarCandidatos: vi.fn(),
    getCandidaturas: vi.fn(),
    atualizarStatusCandidatura: vi.fn(),
  },
}));

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname + location.search}</span>;
}

function renderRoute(path, element) {
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
              {element}
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

const vagas = [
  {
    _id: 'vaga-1',
    nome: 'Desenvolvedor React',
    area: 'TI - Tecnologia da Informação',
    localizacao: 'Remoto',
    empresa: { nome: 'Tech Norte' },
    requisitos: 'Experiência com React.',
  },
  {
    _id: 'vaga-2',
    nome: 'Auxiliar Administrativo',
    area: 'Administrativa',
    localizacao: 'Itacoatiara',
    empresa: { nome: 'Comércio Local' },
    requisitos: 'Organização e atendimento.',
  },
];

const candidatura = {
  _id: 'cand-1',
  status: 'Pendente',
  createdAt: '2026-01-01T00:00:00.000Z',
  vaga: {
    _id: 'vaga-1',
    nome: 'Desenvolvedor React',
    empresa: { nome: 'Tech Norte' },
  },
  candidato: {
    nome: 'Ana Souza',
    email: 'ana@teste.com',
    telefone: '(92) 99999-9999',
    educacao: 'Ensino Superior Completo',
    qualificacao: 'Frontend',
  },
};

beforeEach(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  useAuth.mockReturnValue({
    user: { nome: 'Ana Souza', role: 'candidato' },
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
  });
  useVagasQuery.mockReturnValue({ data: vagas, isLoading: false });
  candidatoService.cadastrar.mockResolvedValue({ success: true });
  candidatoService.getDashboard.mockResolvedValue({
    candidatoId: 'candidato-1',
    candidato: { nome: 'Ana Souza' },
    areas: ['Administrativa', 'TI - Tecnologia da Informação'],
  });
  candidatoService.getCandidaturas.mockResolvedValue({ candidaturas: [candidatura] });
  candidatoService.cancelarCandidatura.mockResolvedValue({ success: true });
  empresaService.cadastrar.mockResolvedValue({ success: true });
  empresaService.getDashboard.mockResolvedValue({
    empresa: { _id: 'empresa-1', nome: 'Tech Norte' },
    vagas,
  });
  empresaService.buscarCandidatos.mockResolvedValue({
    candidatos: [candidatura.candidato],
  });
  empresaService.getCandidaturas.mockResolvedValue({
    candidaturas: [candidatura],
  });
  empresaService.atualizarStatusCandidatura.mockResolvedValue({ success: true });
});

describe('páginas críticas', () => {
  it('deve renderizar login e navegar após autenticação bem-sucedida', async () => {
    const loginMock = vi.fn().mockResolvedValue({
      success: true,
      data: { redirectUrl: '/candidato/dashboard' },
    });
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: loginMock,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter
        initialEntries={['/login']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/candidato/dashboard" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /bem-vindo de volta/i })).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/e-mail/i), 'ana@teste.com');
    await userEvent.type(screen.getByPlaceholderText(/digite sua senha/i), 'senha123');
    await userEvent.click(screen.getByRole('button', { name: /^entrar$/i }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/candidato/dashboard'));
    expect(loginMock).toHaveBeenCalledWith({ email: 'ana@teste.com', senha: 'senha123' });
  });

  it('deve renderizar cadastro de candidato e enviar formulário multi-etapas', async () => {
    renderRoute('/candidato/cadastrar', <SignupPage />);

    expect(screen.getByRole('heading', { name: /criar conta de candidato/i })).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText(/seu nome completo/i), 'Ana Souza');
    await userEvent.type(screen.getByPlaceholderText(/seu@email.com/i), 'ana@teste.com');
    await userEvent.type(screen.getByPlaceholderText(/mínimo de 8 caracteres/i), 'senha12345');
    await userEvent.click(screen.getByRole('button', { name: /próximo passo/i }));

    await userEvent.type(screen.getByPlaceholderText('000.000.000-00'), '12345678909');
    await userEvent.type(screen.getByPlaceholderText('(00) 00000-0000'), '92999999999');
    await userEvent.click(screen.getByRole('button', { name: /próximo passo/i }));

    await userEvent.selectOptions(screen.getByRole('combobox'), 'Ensino Superior Completo');
    await userEvent.type(screen.getByPlaceholderText(/sua principal ocupação/i), 'Frontend');
    await userEvent.click(screen.getByRole('button', { name: /próximo passo/i }));

    await userEvent.type(screen.getByPlaceholderText(/React, Node.js, Excel/i), 'React, Node.js');
    await userEvent.click(screen.getByRole('button', { name: /finalizar cadastro/i }));

    await waitFor(() => expect(candidatoService.cadastrar).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login?cadastro=sucesso'));
  });

  it('deve renderizar cadastro de empresa e chamar service de empresa', async () => {
    renderRoute('/empresa/cadastrar', <SignupPage />);

    expect(screen.getByRole('heading', { name: /criar conta de empresa/i })).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText(/razão social ou nome fantasia/i), 'Tech Norte');
    await userEvent.type(screen.getByPlaceholderText(/seu@email.com/i), 'empresa@teste.com');
    await userEvent.type(screen.getByPlaceholderText(/mínimo de 8 caracteres/i), 'senha12345');
    await userEvent.click(screen.getByRole('button', { name: /próximo passo/i }));

    await userEvent.type(screen.getByPlaceholderText('00.000.000/0000-00'), '12345678000199');
    await userEvent.type(screen.getByPlaceholderText('(00) 00000-0000'), '92999999999');
    await userEvent.click(screen.getByRole('button', { name: /próximo passo/i }));

    await userEvent.type(screen.getByPlaceholderText(/www.suaempresa.com.br/i), 'https://empresa.com.br');
    await userEvent.click(screen.getByRole('button', { name: /finalizar cadastro/i }));

    await waitFor(() =>
      expect(empresaService.cadastrar).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'Tech Norte',
          email: 'empresa@teste.com',
          cnpj: '12.345.678/0001-99',
          fone: '(92) 99999-9999',
        })
      )
    );
  });

  it('deve renderizar busca de vagas e filtrar resultados visualmente', async () => {
    renderRoute('/candidato/vagas', <BuscaVagasPage />);

    expect(screen.getByRole('heading', { name: /buscar vagas/i })).toBeInTheDocument();
    expect(screen.getByText('2 vagas encontradas')).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText(/cargo, palavra-chave ou empresa/i), 'React');

    expect(screen.getByText('1 vaga encontrada')).toBeInTheDocument();
    expect(screen.getByText('Desenvolvedor React')).toBeInTheDocument();
    expect(screen.queryByText('Auxiliar Administrativo')).not.toBeInTheDocument();
  });

  it('deve renderizar dashboard do candidato com dados da API', async () => {
    useAuth.mockReturnValue({
      user: { nome: 'Ana Souza', role: 'candidato' },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    renderRoute('/candidato/dashboard', <CandidatoDashboard />);

    await waitFor(() => expect(screen.getByText(/bem-vindo, ana/i)).toBeInTheDocument());
    expect(screen.getByText('Encontre Sua Próxima Vaga')).toBeInTheDocument();
    expect(screen.getByText('Vagas Recomendadas')).toBeInTheDocument();
    expect(screen.getByText('Desenvolvedor React')).toBeInTheDocument();
  });

  it('deve renderizar dashboard da empresa com vagas e candidatos', async () => {
    useAuth.mockReturnValue({
      user: { nome: 'Gestor Norte', role: 'empresa' },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    renderRoute('/empresa/dashboard', <EmpresaDashboard />);

    await waitFor(() => expect(screen.getByText(/bem-vindo de volta, tech norte/i)).toBeInTheDocument());
    expect(screen.getAllByText('Vagas Ativas').length).toBeGreaterThan(0);
    expect(screen.getByText('Candidatos Recentes')).toBeInTheDocument();
    expect(screen.getByText('Desenvolvedor React')).toBeInTheDocument();
  });

  it('deve renderizar página de candidaturas do candidato', async () => {
    renderRoute('/candidato/candidaturas', <MinhasCandidaturasPage />);

    await waitFor(() => expect(screen.getByText('Minhas Candidaturas')).toBeInTheDocument());
    expect(screen.getByText('Total de Candidaturas')).toBeInTheDocument();
    expect(screen.getByText('Desenvolvedor React')).toBeInTheDocument();
    expect(screen.getAllByText('Pendente').length).toBeGreaterThan(0);
  });

  it('deve renderizar gestão de candidaturas da empresa e atualizar status', async () => {
    renderRoute('/empresa/candidaturas', <GestaoCandidaturas />);

    await waitFor(() => expect(screen.getByText('Gestão de Candidaturas')).toBeInTheDocument());
    expect(screen.getByText('Novos / Pendentes')).toBeInTheDocument();
    expect(screen.getByText('Ana Souza')).toBeInTheDocument();

    await userEvent.click(screen.getByTitle('Aprovar'));

    expect(empresaService.atualizarStatusCandidatura).toHaveBeenCalledWith('cand-1', 'Aceita');
  });
});
