import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import JobCard from '../JobCard';

describe('JobCard', () => {
  it('deve renderizar os dados da vaga e chamar ação de detalhes', async () => {
    const onViewDetails = vi.fn();
    const vaga = {
      nome: 'Desenvolvedor React',
      area: 'TI - Tecnologia da Informação',
      localizacao: 'Remoto',
      empresa: { nome: 'Tech Norte' },
    };

    render(<JobCard vaga={vaga} onViewDetails={onViewDetails} />);

    expect(screen.getByText('Desenvolvedor React')).toBeInTheDocument();
    expect(screen.getByText('Tech Norte')).toBeInTheDocument();
    expect(screen.getByText('TI - Tecnologia da Informação')).toBeInTheDocument();
    expect(screen.getByText('Remoto')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /ver vaga/i }));

    expect(onViewDetails).toHaveBeenCalledTimes(1);
  });

  it('deve exibir empresa confidencial e placeholder quando dados opcionais não existirem', () => {
    render(<JobCard vaga={{ nome: 'Auxiliar Administrativo' }} onViewDetails={vi.fn()} />);

    expect(screen.getByText('Auxiliar Administrativo')).toBeInTheDocument();
    expect(screen.getByText('Empresa confidencial')).toBeInTheDocument();
  });

  it('deve retornar null quando vaga não for informada', () => {
    const { container } = render(<JobCard vaga={null} onViewDetails={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });
});
