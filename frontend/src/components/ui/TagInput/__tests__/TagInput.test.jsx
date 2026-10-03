import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TagInput from '../TagInput';

const renderTagInput = (props = {}) =>
    render(
        <TagInput
            value=""
            onChange={vi.fn()}
            placeholder="Digite e pressione Enter"
            {...props}
        />
    );

describe('TagInput', () => {
    it('renderiza o placeholder quando não há tags', () => {
        renderTagInput();
        expect(screen.getByPlaceholderText('Digite e pressione Enter')).toBeInTheDocument();
    });

    it('exibe as tags existentes a partir do value em string', () => {
        renderTagInput({ value: 'React, Node.js, TypeScript' });
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Node.js')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('adiciona uma tag ao pressionar Enter e chama onChange com string separada por vírgula', async () => {
        const onChange = vi.fn();
        renderTagInput({ onChange });
        const input = screen.getByRole('textbox');

        await userEvent.type(input, 'JavaScript{Enter}');

        expect(onChange).toHaveBeenCalledWith('JavaScript');
    });

    it('acumula tags corretamente ao receber novo value', async () => {
        const onChange = vi.fn();
        const { rerender } = render(
            <TagInput value="React" onChange={onChange} placeholder="Digite" />
        );

        rerender(<TagInput value="React, Vue" onChange={onChange} placeholder="Digite" />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Vue')).toBeInTheDocument();
    });

    it('remove uma tag ao clicar no botão X e chama onChange sem ela', async () => {
        const onChange = vi.fn();
        renderTagInput({ value: 'React, Node.js', onChange });

        const removeReact = screen.getByRole('button', { name: 'Remover React' });
        await userEvent.click(removeReact);

        expect(onChange).toHaveBeenCalledWith('Node.js');
    });

    it('não adiciona tag duplicada', async () => {
        const onChange = vi.fn();
        renderTagInput({ value: 'React', onChange });
        const input = screen.getByRole('textbox');

        await userEvent.type(input, 'React{Enter}');

        expect(onChange).not.toHaveBeenCalled();
    });

    it('não adiciona tag vazia', async () => {
        const onChange = vi.fn();
        renderTagInput({ onChange });
        const input = screen.getByRole('textbox');

        await userEvent.type(input, '   {Enter}');

        expect(onChange).not.toHaveBeenCalled();
    });

    it('remove a última tag ao pressionar Backspace com input vazio', async () => {
        const onChange = vi.fn();
        renderTagInput({ value: 'React, Node.js', onChange });
        const input = screen.getByRole('textbox');

        await userEvent.click(input);
        await userEvent.keyboard('{Backspace}');

        expect(onChange).toHaveBeenCalledWith('React');
    });
});
