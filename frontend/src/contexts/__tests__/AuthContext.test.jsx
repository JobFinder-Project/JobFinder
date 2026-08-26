import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AuthProvider, { useAuth } from '../AuthContext';
import { authService } from '../../services/authService';

vi.mock('../../services/authService', () => ({
  authService: {
    getMe: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

function AuthProbe() {
  const auth = useAuth();

  return (
    <div>
      <span data-testid="loading">{String(auth.loading)}</span>
      <span data-testid="user">{auth.user?.nome || 'Sem usuário'}</span>
      <span data-testid="role">{auth.user?.role || 'Sem perfil'}</span>
      <span data-testid="is-authenticated">{String(auth.isAuthenticated)}</span>
      <span data-testid="is-candidato">{String(auth.isCandidato)}</span>
      <span data-testid="is-empresa">{String(auth.isEmpresa)}</span>
      <span data-testid="error">{auth.error || 'Sem erro'}</span>
      <button onClick={() => auth.login({ email: 'ana@teste.com', senha: 'senha123' })}>
        Fazer login
      </button>
      <button onClick={() => auth.logout()}>Sair</button>
      <button onClick={() => auth.clearError()}>Limpar erro</button>
    </div>
  );
}

function renderAuthProbe() {
  return render(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('AuthContext', () => {
  it('deve carregar usuário autenticado ao iniciar', async () => {
    authService.getMe.mockResolvedValue({
      authenticated: true,
      user: { id: '1', nome: 'Ana Souza', email: 'ana@teste.com', role: 'candidato' },
    });

    renderAuthProbe();

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('user')).toHaveTextContent('Ana Souza');
    expect(screen.getByTestId('role')).toHaveTextContent('candidato');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('is-candidato')).toHaveTextContent('true');
    expect(screen.getByTestId('is-empresa')).toHaveTextContent('false');
  });

  it('deve manter sessão anônima quando /me não autenticar', async () => {
    authService.getMe.mockResolvedValue({ authenticated: false });

    renderAuthProbe();

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('user')).toHaveTextContent('Sem usuário');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('deve executar login, atualizar sessão e limpar erro manualmente', async () => {
    authService.getMe
      .mockResolvedValueOnce({ authenticated: false })
      .mockResolvedValueOnce({
        authenticated: true,
        user: { id: '2', nome: 'Empresa Teste', email: 'empresa@teste.com', role: 'empresa' },
      });
    authService.login.mockResolvedValue({ redirectUrl: '/empresa/dashboard' });

    renderAuthProbe();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));

    await userEvent.click(screen.getByRole('button', { name: /fazer login/i }));

    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('Empresa Teste'));
    expect(authService.login).toHaveBeenCalledWith({
      email: 'ana@teste.com',
      senha: 'senha123',
    });
    expect(screen.getByTestId('is-empresa')).toHaveTextContent('true');
  });

  it('deve expor erro quando login falhar', async () => {
    authService.getMe.mockResolvedValue({ authenticated: false });
    authService.login.mockRejectedValue({ data: { error: 'Email ou senha incorretos' } });

    renderAuthProbe();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));

    await userEvent.click(screen.getByRole('button', { name: /fazer login/i }));

    await waitFor(() =>
      expect(screen.getByTestId('error')).toHaveTextContent('Email ou senha incorretos')
    );

    await userEvent.click(screen.getByRole('button', { name: /limpar erro/i }));
    expect(screen.getByTestId('error')).toHaveTextContent('Sem erro');
  });

  it('deve limpar usuário ao sair', async () => {
    authService.getMe.mockResolvedValue({
      authenticated: true,
      user: { id: '3', nome: 'Ana Souza', email: 'ana@teste.com', role: 'candidato' },
    });
    authService.logout.mockResolvedValue({ success: true });

    renderAuthProbe();
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('Ana Souza'));

    await userEvent.click(screen.getByRole('button', { name: /sair/i }));

    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('Sem usuário'));
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('deve falhar de forma explícita quando useAuth for usado fora do provider', () => {
    function InvalidConsumer() {
      useAuth();
      return null;
    }

    expect(() => render(<InvalidConsumer />)).toThrow('useAuth deve ser usado dentro de um AuthProvider');
  });
});
