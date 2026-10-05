import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import SignupPage from '../SignupPage';

vi.mock('../../../services/candidatoService', () => ({
    candidatoService: { cadastrar: vi.fn().mockResolvedValue({}) },
}));

vi.mock('../../../services/empresaService', () => ({
    empresaService: { cadastrar: vi.fn().mockResolvedValue({}) },
}));

vi.mock('../../../components/ui/TagInput/TagInput', () => ({
    default: ({ value, onChange, placeholder, id }) => (
        <input
            id={id}
            data-testid={`tag-input-${id}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    ),
}));

const renderSignup = (path = '/candidato/cadastrar') =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <SignupPage />
        </MemoryRouter>
    );

describe('SignupPage — correções de usabilidade (H5.1, H6.1)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('H5.1 — indicador de força de senha', () => {
        it('não exibe o indicador quando a senha está vazia', () => {
            renderSignup();
            expect(screen.queryByText(/fraca|média|forte/i)).not.toBeInTheDocument();
        });

        it('exibe "Fraca" para senha com somente letras minúsculas', async () => {
            renderSignup();
            await userEvent.type(screen.getByPlaceholderText(/mínimo de 8/i), 'aaaaaaaa');
            expect(screen.getByText('Fraca')).toBeInTheDocument();
        });

        it('exibe "Média" para senha com letras e números', async () => {
            renderSignup();
            await userEvent.type(screen.getByPlaceholderText(/mínimo de 8/i), 'Senha123');
            expect(screen.getByText('Média')).toBeInTheDocument();
        });

        it('exibe "Forte" para senha com letras, números e símbolo', async () => {
            renderSignup();
            await userEvent.type(screen.getByPlaceholderText(/mínimo de 8/i), 'Senha@123');
            expect(screen.getByText('Forte')).toBeInTheDocument();
        });
    });

    describe('H6.1 — TagInput para habilidades, idiomas e cursos', () => {
        const avancarAteStep4 = async () => {
            renderSignup();

            // Step 1
            await userEvent.type(screen.getByPlaceholderText(/seu nome completo/i), 'Teste');
            await userEvent.type(screen.getByPlaceholderText(/seu@email.com/i), 'teste@email.com');
            await userEvent.type(screen.getByPlaceholderText(/mínimo de 8/i), 'Senha@123');
            await userEvent.click(screen.getByRole('button', { name: /próximo passo/i }));

            // Step 2
            await userEvent.type(screen.getByPlaceholderText(/000\.000\.000-00/i), '123.456.789-09');
            await userEvent.type(screen.getByPlaceholderText(/\(00\)/i), '(92) 99999-9999');
            await userEvent.click(screen.getByRole('button', { name: /próximo passo/i }));

            // Step 3
            const selectEscolaridade = screen.getByRole('combobox');
            await userEvent.selectOptions(selectEscolaridade, 'Ensino Superior Completo');
            await userEvent.click(screen.getByRole('button', { name: /próximo passo/i }));
        };

        it('exibe TagInput para habilidades no step 4', async () => {
            await avancarAteStep4();
            expect(screen.getByTestId('tag-input-habilidades')).toBeInTheDocument();
        });

        it('exibe TagInput para idiomas no step 4', async () => {
            await avancarAteStep4();
            expect(screen.getByTestId('tag-input-idiomas')).toBeInTheDocument();
        });

        it('exibe TagInput para cursos no step 4', async () => {
            await avancarAteStep4();
            expect(screen.getByTestId('tag-input-cursos')).toBeInTheDocument();
        });
    });
});
