import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import CandidateCard from '../CandidateCard';

const candidato = {
  nome: 'Marina Souza',
  email: 'marina@teste.com',
  telefone: '(92) 99999-9999',
  educacao: 'Ensino Superior Completo',
  qualificacoes: 'UX Researcher',
  descricao: ['Pesquisa com usuários e melhoria de jornada.'],
  habilidadesTecnicas: ['Pesquisa', 'Figma', 'Entrevistas', 'Prototipação'],
  idiomas: ['Português', 'Inglês'],
  cursos: ['Design Thinking', 'Product Discovery'],
};

describe('CandidateCard', () => {
  it('deve renderizar resumo do candidato e abrir perfil completo', async () => {
    render(<CandidateCard candidato={candidato} />);

    expect(screen.getByText('Marina Souza')).toBeInTheDocument();
    expect(screen.getByText('UX Researcher')).toBeInTheDocument();
    expect(screen.getByText('Pesquisa')).toBeInTheDocument();
    expect(screen.getByText('Figma')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /ver perfil completo/i }));

    const modal = screen.getByRole('dialog', { name: /perfil do candidato/i });
    expect(within(modal).getByText('marina@teste.com')).toBeInTheDocument();
    expect(within(modal).getByText('(92) 99999-9999')).toBeInTheDocument();
    expect(within(modal).getByText('Pesquisa com usuários e melhoria de jornada.')).toBeInTheDocument();
    expect(within(modal).getByText('Product Discovery')).toBeInTheDocument();
  });

  it('deve mostrar estados vazios quando candidato não possui listas profissionais', () => {
    render(
      <CandidateCard
        candidato={{
          nome: 'Carlos Lima',
          email: 'carlos@teste.com',
          educacao: 'Ensino Médio Completo',
        }}
      />
    );

    expect(screen.getByText('Carlos Lima')).toBeInTheDocument();
    expect(screen.getByText('Profissional')).toBeInTheDocument();
    expect(screen.getByText('Sem habilidades listadas')).toBeInTheDocument();
  });
});
