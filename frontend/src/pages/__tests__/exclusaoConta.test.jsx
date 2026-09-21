import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PerfilPage from '../Perfil/PerfilPage';
import PerfilEmpresaModal from '../../features/empresa/PerfilEmpresaModal/PerfilEmpresaModal';
import { useAuth } from '../../contexts/AuthContext';
import { candidatoService } from '../../services/candidatoService';
import { empresaService } from '../../services/empresaService';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../components/Layout/DashboardLayout/DashboardLayout', () => ({
  default: ({ children }) => <main data-testid="dashboard-layout">{children}</main>,
}));

vi.mock('../../services/candidatoService', () => ({
  candidatoService: {
    getDashboard: vi.fn(),
    atualizarPerfil: vi.fn(),
    excluirConta: vi.fn(),
  },
}));

vi.mock('../../services/empresaService', () => ({
  empresaService: {
    atualizarPerfil: vi.fn(),
    excluirConta: vi.fn(),
  },
}));

const logout = vi.fn();

const renderComPaginaInicial = (element) =>
  render(
    <MemoryRouter initialEntries={['/perfil']}>
      <Routes>
        <Route path="/perfil" element={element} />
        <Route path="/" element={<h1>Página inicial pública</h1>} />
      </Routes>
    </MemoryRouter>
  );

const confirmarExclusao = async (user, senha) => {
  await user.click(screen.getAllByRole('button', { name: /excluir (minha )?conta/i })[0]);

  // O modal de confirmação é sempre o último diálogo aberto
  const confirmacao = within(screen.getAllByRole('dialog').at(-1));
  await user.type(confirmacao.getByLabelText(/confirme sua senha/i), senha);
  await user.click(confirmacao.getByRole('button', { name: /excluir minha conta/i }));
};

beforeEach(() => {
  logout.mockResolvedValue(undefined);
  vi.mocked(useAuth).mockReturnValue({ logout });
});

describe('Exclusão de conta no perfil do candidato', () => {
  beforeEach(() => {
    vi.mocked(candidatoService.getDashboard).mockResolvedValue({
      candidato: { nome: 'Ana Souza', email: 'ana@teste.com', qualificacoes: 'Analista' },
    });
  });

  it('deve excluir a conta, encerrar a sessão local e redirecionar para a tela pública', async () => {
    const user = userEvent.setup();
    vi.mocked(candidatoService.excluirConta).mockResolvedValue({ success: true });
    renderComPaginaInicial(<PerfilPage />);

    await screen.findByText('Zona de Perigo');
    await confirmarExclusao(user, 'senhaForte123');

    await waitFor(() => expect(candidatoService.excluirConta).toHaveBeenCalledWith('senhaForte123'));
    expect(logout).toHaveBeenCalled();
    expect(await screen.findByText('Página inicial pública')).toBeInTheDocument();
  });

  it('deve exibir erro de senha incorreta sem encerrar a sessão nem sair da página', async () => {
    const user = userEvent.setup();
    vi.mocked(candidatoService.excluirConta).mockRejectedValue(
      Object.assign(new Error('Erro na requisição'), {
        status: 400,
        data: { message: 'Senha incorreta.' },
      })
    );
    renderComPaginaInicial(<PerfilPage />);

    await screen.findByText('Zona de Perigo');
    await confirmarExclusao(user, 'senhaerrada');

    expect(await screen.findByRole('alert')).toHaveTextContent('Senha incorreta.');
    expect(logout).not.toHaveBeenCalled();
    expect(screen.queryByText('Página inicial pública')).not.toBeInTheDocument();
  });
});

describe('Exclusão de conta no perfil da empresa', () => {
  const empresa = {
    nome: 'Empresa Teste',
    cnpj: '12345678000199',
    email: 'contato@empresa.com',
    fone: '(92) 99999-9999',
  };

  it('deve excluir a conta, encerrar a sessão local e redirecionar para a tela pública', async () => {
    const user = userEvent.setup();
    vi.mocked(empresaService.excluirConta).mockResolvedValue({ success: true });
    renderComPaginaInicial(<PerfilEmpresaModal empresa={empresa} onClose={vi.fn()} onUpdate={vi.fn()} />);

    await confirmarExclusao(user, 'senhaempresaforte');

    await waitFor(() => expect(empresaService.excluirConta).toHaveBeenCalledWith('senhaempresaforte'));
    expect(logout).toHaveBeenCalled();
    expect(await screen.findByText('Página inicial pública')).toBeInTheDocument();
  });

  it('deve manter a conta quando o usuário cancelar a confirmação', async () => {
    const user = userEvent.setup();
    renderComPaginaInicial(<PerfilEmpresaModal empresa={empresa} onClose={vi.fn()} onUpdate={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /excluir conta/i }));
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(empresaService.excluirConta).not.toHaveBeenCalled();
    expect(screen.queryByLabelText(/confirme sua senha/i)).not.toBeInTheDocument();
  });
});
