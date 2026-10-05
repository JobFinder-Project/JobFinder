import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import EmpresaPublicaPage from '../EmpresaPublicaPage';
import empresaService from '../../../services/empresaService';

vi.mock('../../../components/Navbar/Navbar', () => ({
  default: () => <header>Navbar</header>,
}));

vi.mock('../../../components/Footer/Footer', () => ({
  default: () => <footer>Footer</footer>,
}));

vi.mock('../../../services/empresaService', () => ({
  default: {
    getPerfilPublico: vi.fn(),
  },
}));

const renderPage = () =>
  render(
    <MemoryRouter
      initialEntries={['/empresas/manaus-tech-labs']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/empresas/:slug" element={<EmpresaPublicaPage />} />
      </Routes>
    </MemoryRouter>
  );

describe('EmpresaPublicaPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve exibir dados institucionais públicos da empresa', async () => {
    empresaService.getPerfilPublico.mockResolvedValue({
      empresa: {
        nome: 'Manaus Tech Labs',
        slug: 'manaus-tech-labs',
        bio: 'Criamos produtos digitais para empresas da região Norte.',
        site: 'https://manaustech.example',
        segmento: 'Tecnologia',
        localizacao: 'Manaus, AM',
        tamanhoEmpresa: '11-50 colaboradores',
        anoFundacao: 2018,
        missao: 'Conectar talentos locais a produtos digitais.',
        valores: ['Transparência', 'Aprendizado contínuo'],
        beneficios: ['Plano de saúde', 'Trabalho híbrido'],
      },
      vagas: [
        {
          _id: 'vaga-1',
          nome: 'Desenvolvedor Frontend',
          area: 'TI - Tecnologia da Informação',
        },
      ],
    });

    renderPage();

    await waitFor(() =>
      expect(empresaService.getPerfilPublico).toHaveBeenCalledWith('manaus-tech-labs')
    );

    expect(screen.getByRole('heading', { name: 'Manaus Tech Labs' })).toBeInTheDocument();
    expect(screen.getByText('Tecnologia')).toBeInTheDocument();
    expect(screen.getByText('Manaus, AM')).toBeInTheDocument();
    expect(screen.getByText('11-50 colaboradores')).toBeInTheDocument();
    expect(screen.getByText('Desde 2018')).toBeInTheDocument();
    expect(screen.getByText('Transparência')).toBeInTheDocument();
    expect(screen.getByText('Plano de saúde')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Desenvolvedor Frontend' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar para empresas/i })).toHaveAttribute(
      'href',
      '/empresas'
    );

    expect(screen.queryByText(/cnpj/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/contato@/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\(92\)/i)).not.toBeInTheDocument();
  });
});
