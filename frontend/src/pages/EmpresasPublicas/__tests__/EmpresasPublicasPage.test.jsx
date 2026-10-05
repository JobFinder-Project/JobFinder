import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import EmpresasPublicasPage from '../EmpresasPublicasPage';
import empresaService from '../../../services/empresaService';

vi.mock('../../../components/Navbar/Navbar', () => ({
  default: () => <header>Navbar</header>,
}));

vi.mock('../../../components/Footer/Footer', () => ({
  default: () => <footer>Footer</footer>,
}));

vi.mock('../../../services/empresaService', () => ({
  default: {
    listarPerfisPublicos: vi.fn(),
  },
}));

const renderPage = () =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <EmpresasPublicasPage />
    </MemoryRouter>
  );

describe('EmpresasPublicasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve listar empresas públicas com link para o perfil ampliado', async () => {
    empresaService.listarPerfisPublicos.mockResolvedValue({
      empresas: [
        {
          nome: 'Manaus Tech Labs',
          slug: 'manaus-tech-labs',
          bio: 'Criamos produtos digitais para empresas da região Norte.',
          segmento: 'Tecnologia',
          localizacao: 'Manaus, AM',
          tamanhoEmpresa: '11-50 colaboradores',
        },
      ],
    });

    renderPage();

    await waitFor(() => expect(empresaService.listarPerfisPublicos).toHaveBeenCalled());

    expect(screen.getByRole('heading', { name: 'Manaus Tech Labs' })).toBeInTheDocument();
    expect(screen.getAllByText('Tecnologia')).toHaveLength(2);
    expect(screen.getByText('Manaus, AM')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver perfil/i })).toHaveAttribute(
      'href',
      '/empresas/manaus-tech-labs'
    );
    expect(screen.queryByText(/cnpj/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/@/i)).not.toBeInTheDocument();
  });
});
