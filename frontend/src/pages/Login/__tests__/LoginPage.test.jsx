import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import Login from '../LoginPage';

const mockLogin = vi.fn();

vi.mock('../../../contexts/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin,
        isAuthenticated: false,
        user: null,
    }),
}));

const renderLogin = (route = '/login') =>
    render(
        <MemoryRouter initialEntries={[route]}>
            <Login />
        </MemoryRouter>
    );

describe('LoginPage — correções de usabilidade (H4.4, H5.3)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockLogin.mockResolvedValue({ success: true, data: { redirectUrl: '/candidato/dashboard' } });
    });

    it('H5.3: não exibe o checkbox "Lembrar-me" (affordance falsa removida)', () => {
        renderLogin();
        expect(screen.queryByText(/lembrar-me/i)).not.toBeInTheDocument();
        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });

    it('H4.4: exibe banner inline de sucesso quando vem da URL ?cadastro=sucesso', () => {
        renderLogin('/login?cadastro=sucesso');
        expect(screen.getByText(/cadastro realizado com sucesso/i)).toBeInTheDocument();
    });

    it('H4.4: não usa alert() nativo para o sucesso do cadastro', () => {
        const alertSpy = vi.spyOn(window, 'alert');
        renderLogin('/login?cadastro=sucesso');
        expect(alertSpy).not.toHaveBeenCalled();
        alertSpy.mockRestore();
    });

    it('exibe mensagem de erro via banner inline ao falhar no login', async () => {
        mockLogin.mockResolvedValue({ success: false });

        renderLogin();
        await userEvent.type(screen.getByLabelText(/e-mail/i), 'erro@teste.com');
        await userEvent.type(screen.getByPlaceholderText(/digite sua senha/i), 'senhaerrada');
        await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

        expect(await screen.findByText(/email ou senha incorretos/i)).toBeInTheDocument();
        expect(screen.queryAllByRole('alertdialog')).toHaveLength(0);
    });
});
