import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import CategoryFilter from '../CategoryFilter';

describe('CategoryFilter', () => {
  it('deve renderizar áreas e disparar seleção de categoria', async () => {
    const onCategoryClick = vi.fn();
    const areas = ['Administrativa', 'Comercial/Vendas', 'TI - Tecnologia da Informação'];

    render(
      <CategoryFilter
        areas={areas}
        selectedCategory="Administrativa"
        onCategoryClick={onCategoryClick}
      />
    );

    areas.forEach((area) => {
      expect(screen.getByRole('button', { name: area })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Comercial/Vendas' }));

    expect(onCategoryClick).toHaveBeenCalledWith('Comercial/Vendas');
  });

  it('deve desabilitar a seta esquerda no estado inicial', () => {
    render(
      <CategoryFilter
        areas={['Administrativa']}
        selectedCategory={null}
        onCategoryClick={vi.fn()}
      />
    );

    const arrowButtons = screen.getAllByRole('button', { name: '' });
    expect(arrowButtons[0]).toBeDisabled();
  });
});
